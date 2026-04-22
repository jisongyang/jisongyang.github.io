# 寻花令 - 纯前端静态版本

这是一个纯前端、无后端的静态网页版诗词猜谜游戏。所有数据和逻辑都在单个 HTML 文件中，无需任何服务器即可运行。

## 项目结构

```
xunhualing_static/
├── index.html              # 主页面（包含CSS、JavaScript和诗词数据）
└── README.md               # 本说明文件
```

**注意**：诗词数据（636条）已内嵌到 `index.html` 中，无需额外的数据文件。

## 对比原版本

### 原版本（前后端分离）
- 需要运行 Python FastAPI 后端服务
- 后端负责随机抽取诗词和校验答案
- 通过 HTTP API 与前端通信

### 静态版本（纯前端）
- **无需后端服务器**
- **无需任何环境配置**
- 所有数据和逻辑集成在单个 HTML 文件中
- 双击即可在浏览器中打开运行

## 使用方法

### 方式一：直接打开（推荐 ✅）
直接用浏览器打开 `index.html` 文件即可开始游戏。无需服务器！

### 方式二：使用本地服务器
如果需要本地服务器（如配合其他开发工具）：

```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve .

# 然后访问 http://localhost:8080
```

### 方式三：部署到静态托管服务
可以将 `index.html` 部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages 等静态托管服务。

## 数据来源

从原始 `poetry_processed.json`（约7万条）中筛选出：
- **五言诗句**：325条（10字，两句各5字）
- **七言诗句**：311条（14字，两句各7字）
- **总计**：636条

数据筛选条件：
1. 必须是两个半句组成
2. 五言：每个半句恰好5个汉字
3. 七言：每个半句恰好7个汉字
4. 去除标点符号，只保留纯汉字

## 游戏玩法

1. 游戏随机选择一首五言或七言诗
2. 玩家输入猜测的完整诗句（10字或14字）
3. 系统反馈每个字的状态：
   - 🟩 **绿色（correct）**：字正确且位置正确
   - 🟨 **黄色（present）**：字在答案中但位置错误
   - ⬛ **灰色（absent）**：字不在答案中
4. 最多可尝试30次

## 技术说明

### 核心 JavaScript 函数

- `POETRY_DATA` - 内嵌的诗词数据对象
- `loadPoetryData()` - 加载内嵌数据
- `initGame()` - 随机选择诗词，初始化游戏
- `checkGuessLocal(guess)` - 本地校验答案，返回每个字的状态
- `submitGuess()` - 处理提交，更新UI

### 与原后端 API 的对比

| 功能 | 原后端 | 静态版本 |
|------|--------|----------|
| 获取随机诗词 | `GET /api/random` | JS `initGame()` 函数 |
| 获取五言 | `GET /api/random/wuyan` | `POETRY_DATA.wuyan` |
| 获取七言 | `GET /api/random/qiyan` | `POETRY_DATA.qiyan` |
| 校验答案 | `POST /api/check` | JS `checkGuessLocal()` |
| 数据加载 | JSON API | 内嵌 JS 变量 |

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 文件大小

- `index.html`: ~430KB（包含CSS、JS、诗词数据）
- 无需额外文件

## 自定义数据

如需添加更多诗词，需要：

1. 编辑 `index.html` 中的 `POETRY_DATA` 变量
2. 按以下格式添加：

```javascript
const POETRY_DATA = {
  "wuyan": [
    {
      "id": "标题_诗句",
      "type": "wuyan",
      "title": "诗歌标题",
      "author": "作者",
      "dynasty": "朝代",
      "sentence": "完整句子，含标点",
      "answer": "纯汉字诗句（10字）",
      "length": 10,
      "halves": ["前半句", "后半句"]
    }
  ],
  "qiyan": [
    {
      // 七言格式，length 为 14
    }
  ],
  "all": [...]  // 所有诗句合并
};
```

或使用 Python 预处理脚本生成新的数据：

```python
# 预处理脚本示例
import json

# 从完整数据中提取
with open('poetry_processed.json', 'r', encoding='utf-8') as f:
    poems = json.load(f)

# 筛选五言和七言...
# 然后更新到 HTML 中
```

## 许可证

与原项目相同
