---
categories: ['题解']
date: 2021-07-10T20:26:06+08:00
draft: false
dropCap: false
tags: ['AtCoder','ABC','洛谷博客']
title: "AtCoder ABC114 D 756 - 题解"
---

# 说明

本文迁移自[雨伞CKY的洛谷博客](https://yusancky.blog.luogu.org/)。本文中的文字采用[知识共享署名-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)进行许可。

# 符号约定

1. 在数学中，我们用 $\prod$ 表示求积运算，例如，可以使用 $\prod \limits ^{n}_{k=1}a_{k}$ 表示 $a_{1}\cdot a_{2}\cdot a_{3}\dotsm a_{n}$。
2. 为行文方便，$S_{i}$ 表示质因数出现次数大于等于 $i$ 的质因数的个数。

# 题目分析

我们可以通过分解质因数和排列组合推理出一个数因数个数的求法。对于任何一个大于 $1$ 的自然数 $M$，如果 $M$ 不为质数，那么 $M$ 可以唯一分解成有限个质数 $P_{1},P_{2},P_{3},\dotsc ,P_{n}$ 的乘积：$M=\prod \limits ^{n}_{k=1}P^{a_{k}}_{k}$，这样的分解称为 $M$ 的标准分解式。

所以，$M$ 的任意一个因数都可以表示为 $\prod \limits ^{n}_{k=1}P^{b_{k}}_{k}(0\leq b_{1}\leq a_{1},0\leq b_{2}\leq a_{2},0\leq b_{3}\leq a_{3},\dotsc ,0\leq b_{n} \leq a_{n})$。所以，$M$ 有 $\prod \limits ^{n}_{k=1}(a_{k}+1)$ 个因数。

因此，**当且仅当一个数能用三个不同的质数 $p,q,r$ 表示为 $p^{74}$，$p^{14}\cdot q^{4}$，$p^{24}\cdot q^{2}$ 或 $p^{4}\cdot q^{4}\cdot r^{2}$ 表示时，这个数恰有 $75$ 个因数**。我们的程序可以先对 $N!$ 分解质因数，并记录分解后各个质因数的表示为幂的形式时的次数，再遍历查询质因数超过对应次数的质因数并计算。

对于计算，实际也是排列组合:
- 能表示为 $p^{74}$ 的数的个数，就是出现次数大于等于 $74$ 的质因数的个数，即 $S_{74}$。
- 能表示为 $p^{14}\cdot q^{4}$ 的数的个数，是出现次数大于等于 $14$ 的质因数的个数和可选的出现次数大于等于 $4$ 的质因数的个数之积。而出现次数大于等于 $14$ 的质因数也包括在出现次数大于等于 $4$ 的质因数内，所以需要舍去两个质因数相同的情况，即有 $S_{14}\cdot (S_{4}-1)$ 个数能表示为 $p^{14}\cdot q^{4}$。
- 同理，能表示为 $p^{24}\cdot q^{2}$ 的数有 $S_{24}\cdot (S_{2}-1)$ 个。
- 同理，去除重复的情况后，能表示为 $p^{4}\cdot q^{4} \cdot r^{2}$ 的数有 $\frac{S_{4}\cdot (S_{4}-1)\cdot (S_{2}-2)}{2}$ 个。

根据算数基本定理（唯一分解定理），上述的枚举不存在重复现象或遗漏现象。

# 代码

```cpp
#include <iostream>
using namespace std;

int N,A[110];
//A[i] 表示 i 作为质因数出现的次数

void decompose(int num){
    //对 num 分解质因数，并存储在数组 A 中
    for (int i = 2;;i++){
        while (num % i == 0){
            A[i]++;
            num /= i;
        }
        if (num == 1) return ;
    }
}

int S(int num){
    //遍历查询质因数出现次数大于等于 num 次的质因数的个数
    int cnt = 0;
    for (int i = 2;i <= N;i++){
        if (A[i] >= num) cnt++;
    }
    return cnt;
}

int main(){
    cin >> N;
    for (int i = 2;i <= N;i++) decompose(i);
    cout << S(74) + S(24) * (S(2) - 1) + S(14) * (S(4) - 1) + S(4) * (S(4) - 1) * (S(2) - 2) / 2;
}
```