/*
 * 猜词 · 房间状态机（纯逻辑，不碰 DOM、不碰网络）
 *
 * 一份 state 由房主生成并广播；所有端渲染同一份数据。
 * 本文件同时支持浏览器 <script>（挂到 window.WGRoom）和 Node（module.exports），
 * 方便在本地跑单元测试。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WGRoom = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var MAX_PLAYERS = 4;      // 房间上限
  var MIN_PLAYERS = 2;      // 开局下限
  var OFFLINE_MS = 90000;   // 超过这么久没有心跳就算掉线，从名单里移除
  var MAX_WORD = 16;        // 单个词最长字符数
  var MAX_NAME = 8;         // 昵称最长字符数

  // ---------- 小工具 ----------

  function cleanName(name) {
    var s = String(name == null ? '' : name).replace(/\s+/g, ' ').trim();
    return s.slice(0, MAX_NAME) || '玩家';
  }

  // 去首尾空白、合并连续空白；空串表示无效
  function cleanWord(word) {
    return String(word == null ? '' : word).replace(/\s+/g, ' ').trim().slice(0, MAX_WORD);
  }

  function find(state, id) {
    for (var i = 0; i < state.players.length; i++) {
      if (state.players[i].id === id) return state.players[i];
    }
    return null;
  }

  function submitted(state, p) {
    return p.wordRound === state.round && !!p.word;
  }

  // ---------- 状态创建 ----------

  function createState(room, hostId, name, t) {
    t = t || Date.now();
    return {
      v: 1,
      room: room,
      hostId: hostId,
      seq: 1,
      createdAt: t,
      updatedAt: t,
      round: 1,
      phase: 'waiting',   // waiting | playing | done
      maxPlayers: MAX_PLAYERS,
      players: [{
        id: hostId,
        name: cleanName(name),
        joinedAt: t,
        lastSeen: t,
        word: null,
        wordRound: 0
      }],
      history: []
    };
  }

  // ---------- 玩家进出 ----------

  function addPlayer(state, id, name, t) {
    t = t || Date.now();
    var p = find(state, id);
    if (p) {
      p.lastSeen = t;
      if (name) p.name = cleanName(name);
      return { ok: true, player: p, rejoined: true };
    }
    if (state.players.length >= state.maxPlayers) {
      return { ok: false, reason: 'full' };
    }
    p = {
      id: id,
      name: cleanName(name || ('玩家' + (state.players.length + 1))),
      joinedAt: t,
      lastSeen: t,
      word: null,
      wordRound: 0
    };
    state.players.push(p);
    return { ok: true, player: p, rejoined: false };
  }

  function removePlayer(state, id) {
    if (id === state.hostId) return false;
    var before = state.players.length;
    state.players = state.players.filter(function (p) { return p.id !== id; });
    return state.players.length !== before;
  }

  function touch(state, id, t) {
    var p = find(state, id);
    if (p) p.lastSeen = t || Date.now();
    return p;
  }

  // 移除超时未心跳的人，返回被移除的昵称列表
  function prune(state, t) {
    t = t || Date.now();
    var removed = [];
    state.players = state.players.filter(function (p) {
      if (p.id === state.hostId) return true;
      if (t - p.lastSeen > OFFLINE_MS) {
        removed.push(p.name);
        return false;
      }
      return true;
    });
    if (removed.length && state.phase === 'playing') maybeComplete(state, t);
    return removed;
  }

  // ---------- 轮次 ----------

  function allSubmitted(state) {
    if (state.players.length < MIN_PLAYERS) return false;
    for (var i = 0; i < state.players.length; i++) {
      if (!submitted(state, state.players[i])) return false;
    }
    return true;
  }

  function submitCount(state) {
    var n = 0;
    for (var i = 0; i < state.players.length; i++) {
      if (submitted(state, state.players[i])) n++;
    }
    return n;
  }

  function submitWord(state, id, word, t) {
    t = t || Date.now();
    var p = find(state, id);
    if (!p) return { ok: false, reason: 'no-player' };
    if (state.phase !== 'playing') return { ok: false, reason: 'phase' };
    if (submitted(state, p)) return { ok: false, reason: 'already' };
    var w = cleanWord(word);
    if (!w) return { ok: false, reason: 'empty' };
    p.word = w;
    p.wordRound = state.round;
    p.lastSeen = t;
    maybeComplete(state, t);
    return { ok: true };
  }

  // 全员提交即结算：一致就结束；不一致立即进入下一轮（不设倒计时，结果落在 history 里）
  function maybeComplete(state, t) {
    if (state.phase !== 'playing') return false;
    if (!allSubmitted(state)) return false;
    var words = state.players.map(function (p) { return p.word; });
    var unanimous = words.every(function (w) { return w === words[0]; });
    state.history.push({
      round: state.round,
      entries: state.players.map(function (p) {
        return { id: p.id, name: p.name, word: p.word };
      }),
      unanimous: unanimous
    });
    if (unanimous) {
      state.phase = 'done';
    } else {
      state.round += 1;
      state.players.forEach(function (p) { p.word = null; p.wordRound = 0; });
      state.phase = state.players.length >= MIN_PLAYERS ? 'playing' : 'waiting';
    }
    state.updatedAt = t || Date.now();
    return true;
  }

  // 重开：保留在场玩家，清空历史
  function restart(state, t) {
    t = t || Date.now();
    state.round = 1;
    state.history = [];
    state.players.forEach(function (p) { p.word = null; p.wordRound = 0; });
    state.phase = state.players.length >= MIN_PLAYERS ? 'playing' : 'waiting';
    state.updatedAt = t;
    return { ok: true };
  }

  // 房主定时调用：清掉掉线的人，并让 phase 与人数保持一致
  function refresh(state, t) {
    t = t || Date.now();
    var host = find(state, state.hostId);
    if (host) host.lastSeen = t;
    var removed = prune(state, t);
    var before = state.phase;
    if (state.phase === 'waiting' && state.players.length >= MIN_PLAYERS) {
      state.phase = 'playing';
    } else if (state.phase === 'playing' && state.players.length < MIN_PLAYERS) {
      state.phase = 'waiting';
    }
    // 阶段变了必须让 seq/updatedAt 前进，否则客户端会把新状态当成旧的丢掉
    if (state.phase !== before) {
      state.seq += 1;
      state.updatedAt = t;
    }
    if (state.phase === 'playing') maybeComplete(state, t);
    if (removed.length) state.updatedAt = t;
    return removed;
  }

  function lastRecord(state) {
    return state.history.length ? state.history[state.history.length - 1] : null;
  }

  // ---------- 协议 ----------
  //
  // 所有消息都是 JSON：{ t, id, room, ... }，经同一个房间主题广播。
  // 房主独占“写”的权力：客户端只发 hello / ping / submit / next / restart / bye，
  // 房主收到后修改 state，再把整份 state 广播出去（带 retain，新人进来就能拿到）。

  function hostHandle(state, msg, t) {
    t = t || Date.now();
    var out = [];
    var changed = false;

    switch (msg.t) {
      case 'hello': {
        var r = addPlayer(state, msg.id, msg.name, t);
        if (r.ok) changed = true;
        else out.push({ t: 'full', to: msg.id });
        break;
      }
      case 'ping': {
        if (!touch(state, msg.id, t)) {
          // 没见过这个人（hello 丢了，或房主刚重启）：直接补进来
          var r2 = addPlayer(state, msg.id, msg.name, t);
          if (r2.ok) changed = true;
          else out.push({ t: 'full', to: msg.id });
        }
        break;
      }
      case 'submit':
        touch(state, msg.id, t);
        if (submitWord(state, msg.id, msg.word, t).ok) changed = true;
        break;
      case 'next':
        // 老页面可能还发这个；现在没有"揭示"阶段，直接忽略
        break;
      case 'restart':
        touch(state, msg.id, t);
        if (restart(state, t).ok) changed = true;
        break;
      case 'bye':
        if (removePlayer(state, msg.id)) changed = true;
        break;
      default:
        break;
    }

    if (changed) {
      state.seq += 1;
      state.updatedAt = t;
    }
    return { changed: changed, out: out };
  }

  // 客户端只接受“更新”的状态，防止旧消息/旧的 retained 消息把棋盘倒回去
  function isNewer(current, next) {
    if (!next || !next.room) return false;
    if (!current) return true;
    if (next.room !== current.room) return false;
    var a = next.updatedAt || 0;
    var b = current.updatedAt || 0;
    if (a !== b) return a > b;
    return (next.seq || 0) > (current.seq || 0);
  }

  return {
    MAX_PLAYERS: MAX_PLAYERS,
    MIN_PLAYERS: MIN_PLAYERS,
    OFFLINE_MS: OFFLINE_MS,
    MAX_WORD: MAX_WORD,
    MAX_NAME: MAX_NAME,
    cleanName: cleanName,
    cleanWord: cleanWord,
    find: find,
    createState: createState,
    addPlayer: addPlayer,
    removePlayer: removePlayer,
    touch: touch,
    prune: prune,
    submitWord: submitWord,
    submitCount: submitCount,
    allSubmitted: allSubmitted,
    maybeComplete: maybeComplete,
    restart: restart,
    refresh: refresh,
    lastRecord: lastRecord,
    hostHandle: hostHandle,
    isNewer: isNewer
  };
});
