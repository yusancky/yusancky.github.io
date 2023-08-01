---
categories: ['技术']
date: 2021-08-18T13:50:23+08:00
draft: false
dropCap: false
summary: 快试试用 Python 的 csv 库读写表格。
tags: ['Python','洛谷博客']
title: "用 Python 轻松读写表格"
---

# 说明

本文迁移自[雨伞CKY的洛谷博客](https://yusancky.blog.luogu.org/)。本文中的文字采用[知识共享署名-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)进行许可。

# 关于 CSV

CSV，即逗号分隔的值（Comma-Separated Values），是一种以纯文本形式存储、以 `,` 分隔内容的文件格式。你可以直接使用 Excel、Numbers 表格等软件，把表格导出为 CSV 文件。当然，你也可以使用上述软件，把 CSV 文件导出为表格格式文件。

Python 中的 csv 库实现了 CSV 格式表单数据的读写。csv 库是 Python 标准库中，无需安装即可导入使用。

# 读取 CSV 文件

## `csv.reader` 的使用

我们创建了一个存储了文娱活动得分情况的 CSV 文件 `scores.csv`。接着，我们可以直接执行如下程序输出这个 CSV 文件。

```python
import csv

with open('scores.csv',newline = '') as csvfile:
    spamreader = csv.reader(csvfile,delimiter = ',',quotechar = '')
    for row in spamreader:
        print(row)
```

程序第 $3$ 行打开了文件 `scores.csv`，并定义了换行符。接着，第 $4$ 行调用 `csv.reader`，并把结果赋给 `spamreader`。第 $5,6$ 行的循环遍历 `spamreader`，输出每一行。

输出结果：

```python
['student_number','score1','score2','score3']
['1','97','94','99']
['2','89','98','96']
['3','96','92','98']
['4','94','88','95']
['5','87','91','98']
```

如果你只想输出某个或某些元素，那么你可以修改输出的内容。例如，如果你只想输出 `score2`（索引为 $2$），可以将 `print(row)` 修改为 `print(row[2])`。

## `csv.DictReader` 的使用

除了 `csv.reader`，`csv.DictReader` 也是一种不错的读取方式。它能以字典的形式读取 CSV 文件。

```python
import csv

with open('scores.csv',newline = '') as csvfile:
    spamreader = csv.DictReader(csvfile)
    for row in spamreader:
        print(row)
```

这时，程序将会以字典形式输出 CSV 文件。

如果你只想输出一些特定的内容，可以修改输出的内容。例如，如果你只想输出 `student_number` 和 `score2`，可以将 `print(row)` 修改为如下代码。

```python
print(f'{row['student_number']} {row['score2']}')
```

# 写入 CSV 文件

## `csv.writer` 的使用

如果你需要添加学生的得分，你可以使用 `csv.writer` 的 `writerow()` 在 CSV 文件末尾添加行。

```python
import csv

with open('scores.csv','w',newline = '') as csvfile:
    spamwriter = csv.writer(csvfile,delimiter = ',',quotechar = '',quoting = csv.QUOTE_MINIMAL)
    spamwriter.writerow(['6','94','98','92'])
    spamwriter.writerow(['7','96','93','97'])
```

程序第 $4$ 行调用 `csv.writer`，并把结果赋给 `spamwriter`。接着，第 $5,6$ 行分别插入学号为 $6,7$ 的学生的成绩。

如果你需要插入更多学生的成绩，`csv.writer` 的 `writerows()` 可能是更好的选择。

```python
import csv

with open('scores.csv','w',newline = '') as csvfile:
    rows = [('8','94','97','89'),('9','88','95','97'),('10','96','91','90')]
    spamwriter = csv.writer(csvfile,delimiter = ',',quotechar = '',quoting = csv.QUOTE_MINIMAL)
    spamwriter.writerows(rows)
```

`writerows()` 将能迭代出多个 `row` 对象的迭代器中的所有元素写入 CSV 文件，并根据当前设置的变种进行格式化。

## `csv.DictWriter` 的使用

`csv.DictWriter` 与 `csv.writer` 相似，使用 `writerow()` 和 `writerows()`，但其参数为字典。

# 变种与格式参数

CSV 文件存在多种不同的格式。例如，`,` 并不是唯一的分隔符，`\t`、`:`、`;` 都是较为多用的制表符。为了更容易指定输入和输出记录的格式，`csv` 模块可以自定义变种与格式参数。
- `Dialect.delimiter` 为用于分隔字段的单字符，默认为 `','`。
- `Dialect.doublequote` 控制出现在字段中的引号字符本身应如何被引出。当该属性为 `True` 时，双写引号字符。如果该属性为 `False`，则在 引号字符 的前面放置 转义符。默认值为 `True`。
- `Dialect.escapechar` 是用于 `csv.writer` 的单字符，用来在 `quoting` 设置为 `QUOTE_NONE` 时转义定界符，在 `doublequote` 设置为 `False` 时转义引号字符。在读取时，`escapechar` 去除了其后所跟字符的任何特殊含义。该属性默认为 `None`，表示禁用转义。
- `Dialect.lineterminator` 是放在 `csv.writer` 产生的行的结尾，默认为 `'\r\n'`。
- `Dialect.quotechar` 是单字符，用于包住含有特殊字符的字段，特殊字符如定界符或引号字符或换行符。默认为 `'"'`。
- `Dialect.quoting` 控制 `csv.writer` 何时生成引号，以及 `csv.reader` 何时识别引号。默认值为 `QUOTE_MINIMAL`。
- `Dialect.skipinitialspace` 如果为 `True`，则忽略定界符之后的空格。默认值为 `False`。
- `Dialect.strict` 如果为 `True`，则在输入错误的 CSV 时抛出 `Error` 异常。默认值为 `False`。

# 写入中文后文件乱码

这一问题是文件编码方式不当导致的。你可以在使用 Python 打开文件时设置编码方式。

```python
with open(filename,'w',newline="",encoding="utf-8") as csvfile:
    spamwriter = csv.writer(csvfile,delimiter = ',',quotechar = '',quoting = csv.QUOTE_MINIMAL)
    spamwriter.writerow(['6','94','98','92'])
    spamwriter.writerow(['7','96','93','97'])
```