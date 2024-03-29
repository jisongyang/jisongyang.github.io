<iframe id='head' align="center" width="100%" height="100" src="others_show.html"  frameborder="no" border="0" marginwidth="0" marginheight="px" scrolling="no" ></iframe>

<style>
    .iframe{margin:0 auto;}
</style>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script>
    var oDiv = document.getElementById('head');
    oDiv.style.position = 'fixed'; oDiv.style.top = '0px'; oDiv.style.left = '0px'; oDiv.style.backgroundColor = 'rgba(255,255,255,0)';
    document.querySelector("body > div > h1 > a").innerHTML=''
    document.title="others/latex";
</script>
<br><br>
<!-- ___________________________________________ -->
<!-- ___________________________________________ -->

# latex

#### latex command

* 用户名: Cracker TeCHiScy  注册码：1130140925535334280

* 设置指定高度的空行
    ```latex
        % 先设置新命令，之后的正文中直接调用 \setspace
	    \newcommand{\setspace}{\vspace{4ex}}
    ```  

* 公式换行，加左大括号，等号对齐
    ```latex
        \begin{equation}
            \left\{
                \begin{split}
                p_t & =\frac{s}{S} \\
                u_t &=\frac{df_t-s}{N-S}
                \end{split}
            \right.
            \label{2}
        \end{equation}\par
    ```  

* 排列数 ``\tbinom{m}{n} ``
* 取消首行缩进 ``\noindent``

* 文本任意字符对齐,文字和公式混合对齐
    ```latex
        \begin{tabular}{rl}
            特征方程:&$\gamma-4=0$ \\
            特征解:&$\gamma=4$ \\
        \end{tabular}
    ```  

* 表格行距，表格列距，跨页表格
    ```latex
        \renewcommand\tabcolsep{4.0ex}
        \renewcommand\arraystretch{1.5}

        \usepackage{longtable}
        \begin{longtable}
        \end{longtable}
    ```  

* 在字符的正上方添加字符，注音
    ```latex
        \usepackage{ruby}
        \ruby{流}{なが}
    ```  

* 矩阵算式
    ```latex
        \begin{equation}
            \left(                 %左括号
                \begin{array}{cc}  
                    a11 & a12\\  
                    a21 & a22\\ 
                \end{array}
            \right)                 %右括号
                =
            \left(                 %左括号
                \begin{array}{cc}   
                    a11 & a12\\  
                    a21 & a22\\  
                \end{array}
            \right)                 %右括号
        \end{equation}
    ```  

* 求和符号的上下标位置
    ```latex
        \sum\nolimits_{j=1}^{M}     % 上下标位于求和符号的水平右端，
        \sum\limits_{j=1}^{M}       % 上下标位于求和符号的上下处，
        \sum_{j=1}^{M}              % 对上下标位置没有设定，会随公式所处环境自动调整
    ```  

* 数学公式插入中文 ``$ a= \mbox{汪汪汪} $``

* 清除页眉的横线
    ```latex
        \renewcommand\headrulewidth{0pt}  
    ``` 

* 设置标题的编号
    ```latex
        \setcounter{secnumdepth}{0}  
    ``` 
#### latex error
 * 乱入一个word的操作——[Word论文插入带有方括号序号的参考文献——尾注+交叉引用](https://blog.csdn.net/weixin_41683971/article/details/105413208)