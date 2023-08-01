---
categories: ['题解']
date: 2021-08-28T14:59:26+08:00
draft: false
dropCap: false
tags: ['洛谷主题库','洛谷博客']
title: "洛谷 P5146 最大差值 - 题解"
---

# 说明

本文迁移自[雨伞CKY的洛谷博客](https://yusancky.blog.luogu.org/)。本文中的文字采用[知识共享署名-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)进行许可。

# 题目分析

不难想到枚举 $i,j$ 这一暴力做法，这种做法的伪代码如下。

$$
\begin{array}{ll}
1 & \textbf{for }i\gets 1\textbf{ to }n-1\\
2 & \qquad \textbf{for }j\gets i+1\textbf{ to }n\\
3 & \qquad\qquad\textbf{if }A[j]-A[i]\gt ans\\
4 & \qquad\qquad\qquad ans\gets A[j]-A[i]
\end{array}
$$

这种做法很容易编写，但它的时间复杂度为 $O(n^{2})$。在 $2\leq n\leq 10^{6}$ 范围内，这种做法会严重超时。

我们需要找一种更快的方法才能通过本题。实际上，你不需要进行如此多次计算。你只需要在读入第 $k$ 个数时，更新此时 $A_{j}-A_{i}$ 的最大值（$A_{j}-minn_{k-1}$）和前 $k$ 个数的最小值 $minn_{k}$ 和，最后输出 $A_{j}-A_{i}$ 的最大值即可。这种做法的伪代码如下。

$$
\begin{array}{ll}
1 & minn\gets A[1]\\
2 & \textbf{for }i\gets 2\textbf{ to }n\\
3 & \qquad\textbf{if }A[i]-minn\gt ans\\
4 & \qquad\qquad ans\gets A[i]-minn\\
5 & \qquad \textbf{if }A[i]\lt minn\\
6 & \qquad\qquad minn\gets A[i]
\end{array}
$$

# 代码

```cpp
#include <climits>
#include <iostream>
using namespace std;

int n;
long long int tmp,ans = LLONG_MIN,minn;

int main() {
    cin >> n >> minn;
    for (int i = 2;i <= n;i++){
        cin >> tmp;
        if (tmp - minn > ans) ans = tmp - minn;
        if (tmp < minn) minn = tmp;
    }
    cout << ans;
    return 0;
}
```