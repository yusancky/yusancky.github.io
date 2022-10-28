---
categories: ['技术']
date: 2022-10-28T20:35:00+08:00
draft: false
dropCap: false
summary: Python 帮你快快快速完成问卷星！
tags: ['Python','问卷星']
title: "秒杀随机选项！通过 Python 自动填写问卷星 V2.0"
---

## 免责声明

本文仅供 Python 学习时参考。读者通过同一方法进行非法活动，笔者概不负责。

## 引入

CSDN、GitHub 等平台上已有多种多样的、完善的问卷星自动填写程序，但笔者发现相关文章大多都符合以下情况：
- 只能选择随机的选项
- 程序方法复杂
- 程序已经不再能使用

而笔者为了快速方便完成要求的问卷星填写工作，笔者决定开始开发自动填写程序。笔者最早开发出的 wjx solver V1 从此诞生。这一版本的构思源于一次通过键盘完成问卷的经历，通过调用第三方库 [pynput](https://pypi.org/project/pynput/) 控制键盘完成。

![V1 流程图](/images/auto-wjx/wjx-solver_V1_flowchart.svg)

经实践，这一版本的程序能在几乎瞬间内提交一份有数十题的问卷（无智能验证码、不考虑程序运行前的损耗时间）。

但是，「选项顺序随机」功能打破了此前的美好幻想。

![「选项顺序随机」功能](/images/auto-wjx/choose_random.png)

我们应该怎么解决问题？

## 准备

### 安装浏览器

笔者推荐使用较新版本的 Microsoft Edge、Google Chrome（或 Chromium）、Firefox 浏览器。

<small>如果你使用 macOS High Sierra（或更新的版本），你也可以使用更方便的 Safari 浏览器。如果你使用 Linux，请不要使用 Microsoft Edge。</small>

### 查看浏览器版本

<small>如果你使用 macOS High Sierra（或更新的版本）和 Safari 浏览器，请跳过本节。</small>

如果你正在使用 Microsoft Edge 或 Google Chrome（或 Chromium），可以分别通过打开 `edge://version/` 或 `chrome://version/` 的方式查看版本号；如果你正在使用 Firefox 浏览器，请参考[《如何知道您的 Firefox 版本》](https://support.mozilla.org/zh-CN/kb/%E5%A6%82%E4%BD%95%E7%9F%A5%E9%81%93%E6%82%A8%E7%9A%84%20Firefox%20%E7%89%88%E6%9C%AC/)。

### 下载浏览器驱动（WebDriver）

<small>如果你使用 macOS High Sierra（或更新的版本）和 Safari 浏览器，请跳过本节。</small>

| 浏览器 | 下载链接 |
| :----: | :----: |
| Microsoft Edge | https://developer.microsoft.com/zh-cn/microsoft-edge/tools/webdriver/ |
| Google Chrome（或 Chromium） | https://chromedriver.chromium.org/downloads/ |
| Firefox | https://github.com/mozilla/geckodriver/releases/ |
| Safari | 内置（无需下载） |

下载浏览器驱动后，你需要将浏览器驱动所在文件夹加入 `PATH` 环境变量，或将浏览器驱动移动至已加入 `PATH` 环境变量的文件夹（如 Windows 下 `python.exe` 所在的文件夹）内。

### 安装第三方库

你可以直接使用 pip 安装第三方库 pynput 和 selenium。

![](/images/auto-wjx/pip.svg)

## 开始

### 【选做】创建一个问卷

请创建一个简单的问卷，以进行将来的测试。以下是我创建的示例问卷。

![](/images/auto-wjx/task_example.png)

### 用 Python 打开问卷

在浏览器中打开一个网页只需它的 URL（统一资源定位器），在 Python 中亦然。我们只需要告知 Selenium 需要使用的浏览器和 URL 即可打开网页。以 Microsoft Edge 为例，下面的代码可以打开示例问卷。

![](/images/auto-wjx/start.svg)

### 获取问卷内容

随机选项顺序的问卷虽然每次打开的结果不同，但打开问卷后，仍然可以通过查看 HTML 代码的方式获取选项顺序。Selenium 中，你可以通过 `browser.page_source` 获得 HTML 代码。

得到 HTML 代码后，不难发现：两次获得 HTML 后，仅有选项对应的元素的顺序改变，但每个选项对应的元素始终保持不变。换言之，每个选项还以 `label for=q{task_id}_{option_id}` 的形式保留最初的编号。因此，一切都明了了。只需要打开网页后读取选项顺序，再跟进实际情况使用 pynput 填写问卷即可。而读取选项顺序，只需要使用 [Python 内置的正则表达式操作模块 re](https://docs.python.org/zh-cn/3/library/re.html#module-re) 即可。

### 匹配选项顺序

<small>本节主要针对不熟悉如何在 Python 中匹配正则表达式的读者。如果你熟悉相关的用法，可以跳过本节。</small>

<small>正则表达式的基础在[菜鸟教程](https://www.runoob.com/regexp/)等网站上有详细介绍，且本程序的设计基本不需要相关知识，故此处不再详细介绍。</small>

根据上一节得到的经验，我们可以写出匹配选项编号的正则表达式——`label for=q(\d+)_(\d+)`。为了匹配所有选项编号，我们可以使用 `re.findall(pattern,string,flags = 0)` 函数。该函数将以字符串元组组成的列表的形式，返回正则表达式 `pattern` 在字符串 `string` 中的所有非重叠匹配。因此，在示例问卷中，它将返回如 `[('2','2'),('2','1'),('2','3')]` 之类的列表。

得到了选项顺序后，即可通过遍历列表的方法得出答案所在的位置。

![](/images/auto-wjx/regex.svg)

### 通过智能验证

不幸的是，在使用这一方法时，我们会被问卷星识别。为此，我们需要提前配置浏览器。配置方法如下，不详细展开。

![](/images/auto-wjx/browser_config.svg)

## 完成

由此，便完成了问卷星自动填写程序。

```python
URL = 'https://ks.wjx.top/vj/wFlPipW.aspx' # 问卷的 URL
t_num = 2 # 问卷的题目总数
sum = [0,0,3] # sum[0] 用于占位，其他的 0 表示调用函数 posr(t) 完成第 t 题，正数表示第 t 题共有 ans[t] 个选项
ans = [0,0,1]  # ans[0] 用于占位，正数表示第 t 题选择第 ans[t] 个选项

def choose_ans(a,s):
  '''
  用于单选题，表示在有 a 个选项的单选题中选择第 k 项，未来也将用于多选题
  '''
  import pynput
  ctr = pynput.keyboard.Controller()
  for _ in range(a):
    ctr.type('\t')
  ctr.type('\n')
  for _ in range(s - a):
    ctr.type('\t')

def posr(t):
  '''
  在 sum[t] 为 0 时运行，主要用于执行非选择题及未加入的多选题。
  '''
  if t == 1:
    import pynput
    ctr = pynput.keyboard.Controller()
    ctr.type('\t测试人员')

from selenium import webdriver
op = webdriver.EdgeOptions()
op.add_experimental_option('excludeSwitches', ['enable-automation'])
op.add_experimental_option('useAutomationExtension', False)
global browser
browser = webdriver.Edge(options = op)
browser.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'})
browser.get(URL)

from re import findall
findall_results = findall(r'label for="q(\d+)_(\d+)"',browser.page_source)

from time import sleep
import pynput
ctr = pynput.keyboard.Controller()
sleep(0.5)
ctr.type('\n') # 按下 Microsoft Edge 的“明白”
sleep(0.2)
ctr.type('\t') # 跳过问卷星的二维码

for t in range(1,t_num + 1):
  if sum[t] == 0:
    posr(t)
    continue
  cnt = 0
  for result in findall_results:
    if result[0] == str(t):
      cnt += 1
      if result[1] == str(ans[t]):
        choose_ans(cnt,sum[t])
```

## 未来

正如上文多处所说，未来程序将支持多选题等更多题型。

此外，未来也可能会优化内部结构，减少第三方库依赖，促进程序运行速度提升。

## 参考资料

- python监听、操作键盘鼠标库pynput详细教程 - 风吹云动 - 博客园.. https://www.cnblogs.com/tobe-goodlearner/p/tutorial-pynput.html
- Python selenium自动化刷问卷+绕过智能验证_Polaris_T的博客-CSDN博客_python selenium自动填写问卷.. https://blog.csdn.net/qq_45717425/article/details/119737648
- Selenium 浏览器自动化项目 | Selenium.. https://www.selenium.dev/zh-cn/documentation/

## 版权说明

本文中的文字、非代码的图片采用[知识共享署名-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)进行许可。本文中任何形式的代码均不具有版权，属于[公有领域](https://zh.wikipedia.org/wiki/%E5%85%AC%E6%9C%89%E9%A2%86%E5%9F%9F)。