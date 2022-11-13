---
categories: ['题解']
date: 2021-10-01T23:34:03+08:00
draft: false
dropCap: false
tags: ['洛谷主题库','洛谷博客']
title: "洛谷 P7885 「MCOI-06」Flight - 题解"
---

# 说明

本文迁移自[雨伞CKY的洛谷博客](https://yusancky.blog.luogu.org/)，本文中的文字采用[知识共享署名-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)进行许可。

# 题意简述

- 书虫需要把盾构机从 $(a,b)$ 移至 $(c,d)$。
- 书虫每步可向任何方向移动 $1$ 个单位长度，但相邻两步不能向同一方向。求移动最少步数。
- 包含多组数据。$1\leq T\leq 10^{5},\lvert a\rvert,\lvert b\rvert,\lvert c\rvert,\lvert d\rvert\leq 10^{18}$。

# 题目分析

## 说明

1. 由平移可知：从 $(a,b)$ 移动至 $(c,d)$ 的最少步数等于从 $(0,0)$ 移动至 $(c-a,d-b)$ 的最少步数。
2. 由对称可知：从 $(0,0)$ 移动至 $(c-a,d-b)$ 的最少步数等于从 $(0,0)$ 移动至 $(\lvert c-a\rvert ,\lvert d-b\rvert )$ 的最少步数。

## 两点在同一列（行）

当 $a=c$ 时，两点在同一列。经过枚举，把盾构机从 $(0,0)$ 移至 $(0,k_{2})$ 所需的最少步数与 $k_{2}$ 的关系的如下表所示。其中，$k_{2}$ 为正整数。

| $k_{2}=$ | 可以达到最少步数的方案 | 所需最少步数 |
| :----------: | :----------: | :----------: |
| $1$ | $(0,0)\rightarrow (0,1)$ | $1$ |
| $2$ | $(0,0)\rightarrow (1,0)\rightarrow (1,1)\rightarrow (0,1)\rightarrow (0,2)$ | $4$ |
| $3$ | $(0,0)\rightarrow (0,1)\rightarrow (1,1)\rightarrow (1,2)\rightarrow (0,2)\rightarrow (0,3)$ | $5$ |
| $4$ | $(0,0)\rightarrow (1,0)\rightarrow (1,1)\rightarrow (0,1)\rightarrow (0,2)\rightarrow (1,2)\rightarrow (1,3)\rightarrow (0,3)\rightarrow(0,4)$ | $8$ |
| $5$ | $(0,0)\rightarrow (0,1)\rightarrow (1,1)\rightarrow (1,2)\rightarrow (0,2)\rightarrow (0,3)\rightarrow (1,3)\rightarrow (1,4)\rightarrow (0,4)\rightarrow (0,5)$ | $9$ |
| $\dotsc$ | $\dotsc$ | $\dotsc$ |

不难发现：当 $k_{2}\equiv 0\pmod 2$ 时，所需最少步数为 $2k_{2}$；否则，所需最少步数为 $2k_{2}-1$。

同理可得：当 $b=d$（两点在同一行）时，此规则仍成立。

## 两点不在同一列（行）

如果两点不在同一列（行）时，我们可以把盾构机移动至目标点所在列（行）。我们要把盾构机从 $(0,0)$ 移至 $(k_{1},k_{1})$，其中 $k_{1}=\min (\lvert c-a\rvert ,\lvert d-b\rvert )$。完成此操作的所需步数为 $2k_{1}$。之后，盾构机的位置与目标位置在同一列（行）。

## 总结

如果盾构机 $(0,0)$ 与目标点 $(\lvert c-a\rvert ,\lvert d-b\rvert )$ 不在同一列（行）时，先将盾构机移动至目标点所在列（行）。操作后，盾构机所在位置为 $(k_{1},k_{1})$，移动 $2k_{1}$ 步，其中 $k_{1}=\min (\lvert c-a\rvert ,\lvert d-b\rvert )$。

接着，把盾构机从 $(k_{1},k_{1})$ 移动至目标点 $(\lvert c-a\rvert ,\lvert d-b\rvert )$。当 $k_{2}\equiv 0\pmod 2$ 时，所需最少步数为 $2k_{2}$；否则，所需最少步数为 $2k_{2}-1$。其中，$k_{2}=\lvert \lvert c-a\rvert -\lvert d-b\rvert \rvert$。即可完成移动。

## 计算公式

所以，需要移动的次数 $K$ 的表达式如下：

$$
K=
\begin{cases}
   \min (t_{1},t_{2})+2\lvert t_{1}-t_{2} \rvert & \text{if } t_{1}\equiv t_{2}\pmod 2 \\
   \min (t_{1},t_{2})+2\lvert t_{1}-t_{2} \rvert-1 & \text{if } t_{1}\not \equiv t_{2}\pmod 2
\end{cases}
$$

其中，$t_{1}=\lvert c-a\rvert ,t_{2}=\lvert d-b\rvert $。

化简得：

$$
K=
\begin{cases}
   2\max (t1,t2) & \text{if } t_{1}\equiv t_{2}\pmod 2 \\
   2\max (t1,t2)-1 & \text{if } t_{1}\not \equiv t_{2}\pmod 2
\end{cases}
$$

其中，
$t_{1}=\lvert c-a\rvert ,t_{2}=\lvert d-b\rvert $。

# 代码

```cpp
#include <iostream>
using namespace std;

int T;
long long int a,b,c,d,t1,t2;

int main(){
    cin >> T;
    for (int i = 1;i <= T;i++){
        cin >> a >> b >> c >> d;
        t1 = abs(a - c),t2 = abs(b - d);
        if (t1 > t2) swap(t1,t2);// 保证 t1 < t2
        if ((t2 - t1) % 2 == 0) cout << 2 * t2 << endl;
        else cout << 2 * t2 - 1 << endl;
    }
    return 0;
}
```