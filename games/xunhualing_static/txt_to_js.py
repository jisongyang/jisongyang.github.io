#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将 poetry_filter_database.txt 转换为 poetry_data.js
保留原始格式，每行一首诗，不作任何筛选和解析
"""

def main():
    input_file = 'poetry_filter_database.txt'
    output_file = 'poetry_data.js'

    poems = []

    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n\r')
            if line.strip():
                # 保留原始行，不做任何处理
                poems.append(line)

    # 写入 JS 文件 - 简单的字符串数组
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('// 诗词数据 - 自动生成的文件\n')
        f.write(f'// 来源: poetry_filter_database.txt\n')
        f.write(f'// 总计: {len(poems)} 条原始数据\n')
        f.write(f'// 格式: 标题\\t诗句\\t作者\\t朝代\\t行数\\t字数\n\n')
        f.write('const POETRY_DATABASE = [\n')

        for i, poem_line in enumerate(poems):
            comma = ',' if i < len(poems) - 1 else ''
            # 转义引号
            escaped = poem_line.replace('\\', '\\\\').replace('"', '\\"')
            f.write(f'  "{escaped}"{comma}\n')

        f.write('];\n')

    print(f'转换完成!')
    print(f'  - 总计: {len(poems)} 条原始数据')
    print(f'  - 输出文件: {output_file}')

if __name__ == '__main__':
    main()
