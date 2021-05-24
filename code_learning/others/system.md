<div id="navifation" class='headbar'>
    <iframe id='head' align="center" width="100%" height="160" src="others_show.html"  frameborder="no" border="0" marginwidth="0" marginheight="px" scrolling="no" ></iframe>
</div>
<style>
    .headbar{text-align:center}
    .iframe{margin:0 auto;}
</style>
<script>
    var oDiv = document.getElementById('head');
    oDiv.style.position = 'fixed'; oDiv.style.top = '0px'; oDiv.style.left = '0px';
    document.title="others/git";
</script>
<br><br>
<!-- ___________________________________________ -->
<!-- ___________________________________________ -->

# System

### linux command

* 查看CUDA版本
``` linux
    cat  /usr/local/cuda/version.txt 
```

* 复制，剪切
``` shell
    cp -rf path1 path2  # 复制path1到path2
    mv -rf path1 path2  # 剪切path1到path2
    mv -rf file1 file2  # 重命名file1为file2
    rm -rf path         # 删除path下的所有文件
```

* 之前的操作命令
``` shell
    history n           # 显示最近n条命令
    ctrl+r              # 输入关键字搜索最近的命令
                        # 如果当前显示的不是需要的再按ctrl+r继续搜索该关键字
                        # 如果是需要的按键盘上左键或右键确定到输入状态
```

* 查看文件信息
``` shell
    df -h               # 查看系统一级文件信息
    du -sh *            # 查看当前文件夹下各文件大小
    ls -lrt             # -l use a long listing format 以长列表方式显示（详细信息方式）
                        # -t sort by modification time 按修改时间排序（最新的在最前面）
                        # -r reverse order while sorting （反序）
```

### conda command
* conda虚拟环境
``` shell
    conda info -e                       # 查看已有虚拟环境
    conda create -n name python=3.8     # 创建虚拟环境
    source activate name                # 激活虚拟环境
    source deactivate                   # 退出当前环境
```

### cmd

* 管理员已阻止mmc.exe，依次执行下面的命令
``` shell
    dism /online /cleanup-image /restorehealth
    sfc /scannow
```

### windows
* 更新host
``` sh
    路径：  C:\Windows\System32\drivers\etc
    追加：  github.com 192.30.255.113
```