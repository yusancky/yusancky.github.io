---
categories: ['OI']
date: 2021-09-28T14:10:19+08:00
draft: false
dropCap: false
tags: ['洛谷']
title: "洛谷 P7873 「SWTR-07」Scores（easy version） - 题解"
---

# 题意简述

给定正整数 $n$ 和 $m$，试试构造一个 $n\times m$ 的矩阵 $s$，满足所有元素为 $[0,100]$ 之间的整数，且对于任意 $i,j(i\neq j)$ 存在整数 $k$ 使得 $s_{i,k}\gt s_{j,k}$。

# 题目分析

- 当 $m=1,n\geq 2$ 时，显然无法构造满足题意的矩阵 $s$。
- 否则，始终能构造满足题意的矩阵 $s$，如下所示。

$$
\begin{matrix}
   1 & 1 & \dotsc & 1 & 99\\
   2 & 2 & \dotsc & 2 & 98\\
   3 & 3 & \dotsc & 3 & 97\\
   \vdots & \vdots & \ddots & \vdots & \vdots\\
   n & n & \dotsc & n & 100-n
\end{matrix}
$$

# 代码

```cpp
#include <iostream>
using namespace std;

void construct(int n,int m){
    for (int i = 1;i <= n;i++){
        for (int j = 1;j < m;j++) cout << i << ' ';
        cout << 100 - i << endl;
    }
    return ;
}

int T,t,n,m;

int main(){
    cin >> T >> t;
    for (int i = 1;i <= t;i++){
        cin >> n >> m;
        if (m == 1 && n >= 2){
            cout << "NO\n";
        }
        else{
            cout << "YES\n";
            construct(n,m);
        }
    }
    return 0;
}
```