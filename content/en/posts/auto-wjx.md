---
categories: ['Technology']
date: 2022-10-28T20:35:00+08:00
draft: false
dropCap: false
summary: Python helps you finish WJX quickly!
tags: ['Python','WJX']
title: "Seckill random options! Fill WJX using Python automatically V2.0"
---

## Disclaimer
This article is only used for a reference while learning Python. The author is not responsible for illegal activities carried out by readers through the same method.

## Introduction

There are all kinds of perfect auto WJX filling programmes on platforms such as GitHub. However, I found that most of the relevant articles meet the following conditions:
- Options that can only be chosen randomly
- The methods are too complicated
- The programmes can be used no more

But I decided to develop an auto-filling programme on my own to finish the WJX quickly, and WJX Solver V1 that was developed the earliest came out. The idea for this version was based on a keyboard experience, and it controls the keyboard to complete by invoking the third-party library [pynput](https://pypi.org/project/pynput/).

![V1 flow chart](/assets/auto-wjx/wjx-solver_V1_flowchart.svg)

Through practice, the programme of this version could submit a questionnaire with WJX dozens of tens of questions almost instantly (without Smart Captcha, not considering elapsed time before the programme runs).

However, the "Random Order of Options" feature broke the illusion of the past。

![The "Random Order of Options" Feature](/assets/auto-wjx/choose_random.png)

How can we solve the problem?

## Preperations
### Dowmload the browser

I suggest using Microsoft Edge of a newer version, Google Chrome (or Chromium), Firefox.

<small>If you use macOS High Sierra (or newer versions), you can also use Safari that is more convenient. If you use Linux, please do not use Microsoft Edge.</small>

### Check the version of the browser

<small>If you use macOS High Sierra (or newer versions) and Safari, please skip this section.</small>

If you use Microsoft Edge or Google Chrome (or Chromium), you can check the version by opening `edge://version/` or `chrome://version/`; if you use Firefox, please refer to *[Find What Version Firefox You Are Using](https://support.mozilla.org/en-US/kb/find-what-version-firefox-you-are-using/)*.

### Download the browser driver (WebDriver)

<small>If you use macOS High Sierra (or newer versions) and Safari, please skip this section.</small>

| Browser | Download Link |
| :----: | :----: |
| Microsoft Edge | https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/ |
| Google Chrome (or Chromium) | https://chromedriver.chromium.org/downloads/ |
| Firefox | https://github.com/mozilla/geckodriver/releases/ |
| Safari | N/A |

After downloading the browser driver, you need to add the folder where the browser driver is located to the `PATH` environment variable, or move the browser driver to the folder where the `PATH` environment variable is added (for example, in the folder where `python.exe` is located under Windows).
### Download the third-party library

You can download the third-party libraries pynput and selenium by using pip directly.

```powershell
$ pip install pynput
$ pip install selenium
```

## Get started

### (Optional) Create a questionnaire

Please creat a simple questionnaire to start the following tests. Here is an example.

![](/assets/auto-wjx/task_example.png)

### Open the questionnaire using Python
All you need to open a web page in a browser is its URL (Uniform Resource Locator), and the same is true in Python. We just need to tell Selenium which browser and URL to use to open the web page. Using Microsoft Edge as an example, the following code opens a sample questionnaire.

```python
from selenium import webdriver
URL = 'https://ks.wjx.top/vj/wFlPipW.aspx'
browser = webdriver.Edge()
browser.get(URL)
```

### Get the contents of the questionnaire

Although the results of questionnaires with random order of options are different each time they are opened, still you can get the orders of options by checking HTML codes. In Selenium, you can get the HTML code through `browser.page_source`.

After getting the HTML codes, it's not difficult to find out that after getting the HTML codes twice, only the order of the elements corresponding to the options changes, but the elements corresponding to each option always remain the same. In other words, each option also retains its initial number in the form of `label for=q{task_id}_{option_id}`. Therefore, everything is clear. What you only need to do is to read the option order after opening the questionnaire, and then follow up on the actual situation and fill out the questionnaire using Pynput. And you only need to use [regular expression operations re](https://docs.python.org/3/library/re.html#module-re).

### Match the option order

<small>This section is intended for readers who are not familiar with how to match regular expressions in Python. If you're familiar with the usage, you can skip this section.</small>

<small>The basics of regular expressions are described in detail on some websites, and the design of this programme basically does not require relevant knowledge, so it will not be detailed here.</small>

Based on the experience gained in the previous section, we can write a regular expression that matches the option numbers `label for=q(\d+)_(\d+)`. To match all the option numbers, we can use the function `re.findall(pattern,string,flags = 0)`. This function will return all non-overlapping matches of the regular expression `pattern` in the string `string` as a list of string tuples. Therefore, in the example, it'll return lists such as `[('2','2'),('2','1'),('2','3')]`.

Once you have the order of the options, you can iterate through the list to find where the answers are.

```python
from re import findall
findall_results = findall(r'label for="q(\d+)_(\d+)"',browser.page_source)

cnt = 0
for result in findall_results:
  if result[0] == str(t):
    cnt += 1
    if result[1] == str(ans[t]):
      choose_ans(cnt,sum[t])
```

### Pass the smart verification

Unluckily, while using this method, we will be identified by WJX. So we need to configure the browser in advance. The configuration method is as follows, but it is not expanded in detail.

```python
from selenium import webdriver
URL = 'https://ks.wjx.top/vj/wFlPipW.aspx'
op = webdriver.EdgeOptions()
op.add_experimental_option('excludeSwitches', ['enable-automation'])
op.add_experimental_option('useAutomationExtension', False)
global browser
browser = webdriver.Edge(options = op)
browser.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'})
browser.get(URL)
```

## Done

As a result, the WJX auto-filling procedure is completed.

```python
URL = 'https://ks.wjx.top/vj/wFlPipW.aspx' # The URL of the questionnaire
t_num = 2 # The total number of questions in the questionnaire
sum = [0,0,3] # sum[0] is used as a placeholde while the others indicate that the calling function posr(t) completes the t-question, and a positive number indicates that the t-question has a total of ans[t] options
ans = [0,0,1]  # ans[0] is used as a placeholde while the positive number indicates that the t-question selects the ANS[t] option

def choose_ans(a,s):
  '''
  Used for multiple-choice questions, which means to select item kth in a multiple-choice question with a choice, and will also be used for multiple-choice questions in the future
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
  Runs when sum[t] is 0 and is mainly used to perform non-multiple-choice and multiple-choice questions that have not been yet supported.
  '''
  if t == 1:
    import pynput
    ctr = pynput.keyboard.Controller()
    ctr.type('\tTesters')

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
ctr.type('\n') # Press the "Understand" button in Microsoft Edge
sleep(0.2)
ctr.type('\t') # Skip the QR code from WJX

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

## Future

As mentioned in many places above, in the future, the programme will support more question types such as multiple-choice questions.

In addition, in the future, the internal structure may be optimized, and the third-party library dependency may be reduced, and the programme running speed may be improved.

## References

- python监听、操作键盘鼠标库pynput详细教程 - 风吹云动 - 博客园.. https://www.cnblogs.com/tobe-goodlearner/p/tutorial-pynput.html
- Python selenium自动化刷问卷+绕过智能验证_Polaris_T的博客-CSDN博客_python selenium自动填写问卷.. https://blog.csdn.net/qq_45717425/article/details/119737648
- The Selenium Browser Automation Project | Selenium.. https://www.selenium.dev/documentation/

## Copyright

The text and theon-code images in this article are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). The code in this article is not copyrighted in any form and is in the [PD](https://en.wikipedia.org/wiki/Public_domain).