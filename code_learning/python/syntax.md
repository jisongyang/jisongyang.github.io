
<iframe id='head' align="center" width="100%" height="100" src="python_show.html"  frameborder="no" border="0" marginwidth="0" marginheight="px" scrolling="no" ></iframe>

<style>
    .iframe{margin:0 auto;}
</style>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script>
    var oDiv = document.getElementById('head');
    oDiv.style.position = 'fixed'; oDiv.style.top = '0px'; oDiv.style.left = '0px'; oDiv.style.backgroundColor = 'rgba(255,255,255,0)';
    document.querySelector("body > div > h1 > a").innerHTML=''
    document.title="python/syntax";

</script>

<br><br>
<!-- ___________________________________________ -->
<!-- ___________________________________________ -->


# python syntax

* 让字典的每个value有初始值，第一次添加key自动生成value
```python
    import collections
    d = collections.defaultdict(int)            # 初始值为整数型，默认为0
    d = collections.defaultdict(list)           # 初始值为列表，默认为空
    d = collections.defaultdict(lambda :10)     # 初始值设为10
```

* 字典排序
```python
    # 根据key排序，返回list
    order_list = sorted(the_dict.items(), key=lambda d: d[0], reverse=False)
    # 根据value排序，返回list
    order_list = sorted(the_dict.items(), key=lambda d: d[0], reverse=False)
    
    import operator
    # 根据key排序，返回dict
    order_dict = dict(sorted(the_dict.items(), key=operator.itemgetter(0)))
    # 根据value排序，返回dict
    order_dict = dict(sorted(the_dict.items(), key=operator.itemgetter(1)))
```

* 变量类型定义
```python
    from typing import List
    def permute(self, nums: List[int]) -> List[List[int]]:
```

* reduce函数
```python
    # 函数将一个数据集合（链表，元组等）中的所有数据进行下列操作：
    # 用传给 reduce 中的函数 function（有且只有两个参数）先对集合中的第 1、2 个元素进行操作，得到的结果
    # 这个结果再与第三个数据用 function 函数运算，持续这个过程直至集合中数据遍历一遍。
    
    from functools import reduce

    def add(x, y) :           
        return x + y
    sum1 = reduce(add, [1,2,3,4,5])                 # 计算列表和：1+2+3+4+5
    sum2 = reduce(lambda x, y: x+y, [1,2,3,4,5])    # 使用 lambda 匿名函数
```




* pipenv虚拟环境
```shell
    pip install pipenv                  # 安装pipenv
    pipenv install --python 3.7         # 创建虚拟环境（选择一个文件夹，在当前文件夹下）
    pipenv shell                        # 激活虚拟环境
    pipenv install pyinstaller          # 安装需要的包
    pip list                            # 查看当前环境已安装的包
```

* pyinstaller
```shell
    # -F 生成单个exe
    # -D 生成多个文件，包括依赖文件
    # -w 不调用控制台窗口（调用可以看到运行失败的报错信息） 
    # -p 导入其他相关文件
    # -i 设置生成exe的图标
    pyinstaller -F -w -i show.icon test.py
```

* format
```python
    # 固定宽度
    print('{:20}'.format('www'))
```
* multiprocessing在多个进程中贡献变量
```python
    manager=multiprocessing.Manager()
    failed_cnt=manager.list()
    failed_cnt.append(0)
```

# leetcode onenote

 <a href="https://onedrive.live.com/view.aspx?resid=BC45C406A7EBE536%212244&id=documents&wd=target%28%E6%97%A5%E5%B8%B8%E5%88%B7%E9%A2%98.one%7C52F0C452-BEC8-4DA7-801F-9BEC63928BD3%2F%29
onenote:https://d.docs.live.net/bc45c406a7ebe536/文档/leetcode/日常刷题.one#section-id={52F0C452-BEC8-4DA7-801F-9BEC63928BD3}&end" target="_blank">日常刷题</a> 