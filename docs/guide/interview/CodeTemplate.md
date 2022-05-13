---
title: 代码模板
author: Vingkin
date: 2022-4-24
---

## 快排

```java
public class Main {
    
    public static void quick_sort(int[] q, int l, int r) {
        if (l >= r) return;
        int i = l - 1, j = r + 1, x = q[l + r >> 1];
        while (i < j) {
            do i++; while (q[i] < x);
            do j--; while (q[j] > x);
            if (i < j) {
                int tmp = q[i];
                q[i] = q[j];
                q[j] = tmp;
            }
        }
        quick_sort(q, l, j);
        quick_sort(q, j + 1, r);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] q = new int [100005];
        for (int i = 0; i < n; i++) {
            q[i] = sc.nextInt();
        }
        quick_sort(q, 0, n - 1);
        for (int i = 0; i < n; i++) {
            System.out.println(q[i] + " ");
        }
    }
}
```

## 二叉树构建

```cpp
#include<bits/stdc++.h>
using namespace std;
struct TreeNode {
	int val;
	TreeNode *left;
	TreeNode *right;
	TreeNode(int x) {
		val = x;
		left = NULL;
		right = NULL;
	}
};

TreeNode* createTree(vector<int>& vec) {
	vector<TreeNode*> vecNode;
	TreeNode* root = NULL;
	for (int i = 0; i < vec.size(); i++) {
		TreeNode* node = new TreeNode(vec[i]);
		if (vec[i] != -1) vecNode.push_back(node);
		else vecNode.push_back(NULL);
		if (i == 0) root = node;
	}
	for (int i = 0; i * 2 + 2 < vecNode.size(); i++) {
		if (vecNode[i] != NULL) {
			vecNode[i] -> left = vecNode[2 * i + 1];
			vecNode[i] -> right = vecNode[2 * i + 2];
		}
	}
	return root;
}

void preOrder(TreeNode *root) {
	if (!root) return;
	cout << root -> val << ' ';
	preOrder(root -> left);
	preOrder(root -> right);
}

void l(TreeNode *root) {
	if (!root) return;
	queue<TreeNode*> q;
	q.push(root);
	while (!q.empty()) {
		int len = q.size();
		for (int i = 0; i < len; i++) {
			TreeNode* node = q.front();
			q.pop();
			cout << node -> val << ' ';
			if (node -> left) {
				q.push(node -> left);
			} 
			if (node -> right) {
				q.push(node -> right);
			}
		}
	}
}

int main () {
	vector<int> vec;
	int n;
	cin >> n;
	for (int i = 0; i < n; i++) {
		int a;
		cin >> a;
		vec.push_back(a);
	}
	TreeNode* root = createTree(vec);
	preOrder(root);
	cout << endl;
	print(root);
	return 0;
}
```

## 图的构建



## 埃氏筛

```cpp
#include<bits/stdc++.h>
using namespace std;

const int MAXN = 5e6+5;
int isPrime[MAXN];

void getPrime() {
	memset(isPrime, -1, sizeof isPrime);
	isPrime[1] = 0;
	for (int i = 2; i * i <= MAXN; i++) {
		if (isPrime[i]) {
			for (int j = i * i; j <= MAXN; j += i) {
				isPrime[j] = 0; 
			}
		}
	}
}

int main () {
	getPrime();
	for (int i = 2; i <= 100; i++) {
		if (isPrime[i]) {
			cout << i << endl;
		}
	}
	return 0;
}
```

## 并查集

```java
class UnionFind {
    private Map<Integer,Integer> father;
    
    public UnionFind() {
        father = new HashMap<>();
    }
    
    public void add(int x) {
        if (!father.containsKey(x)) {
            father.put(x, null);
        }
    }
    
    public void merge(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX != rootY){
            father.put(rootX,rootY);
        }
    }
    
    public int find(int x) {
        int root = x;
        
        while(father.get(root) != null){
            root = father.get(root);
        }
        
        while(x != root){
            int original_father = father.get(x);
            father.put(x,root);
            x = original_father;
        }
        
        return root;
    }
    
    public boolean isConnected(int x, int y) {
        return find(x) == find(y);
    }
} 
```

## 树状数组

> [聊聊树状数组 Binary Indexed Tree (halfrost.com)](https://halfrost.com/binary_indexed_tree/)

```java
// 序列下标从1开始
class NumArray {
    private int[] tree;
    private int[] nums;

    public NumArray(int[] nums) {
        this.tree = new int[nums.length + 1];
        this.nums = nums;
        for (int i = 0; i < nums.length; i++) {
            add(i + 1, nums[i]);
        }
    }

    public void update(int index, int val) {
        add(index + 1, val - nums[index]);
        nums[index] = val;
    }

    public int sumRange(int left, int right) {
        return prefixSum(right + 1) - prefixSum(left);
    }

    private int lowBit(int x) {
        return x & -x;
    }

    // 单点修改 index位置增加val
    private void add(int index, int val) {
        while (index < tree.length) {
            tree[index] += val;
            index += lowBit(index);
        }
    }

    // 区间查询 查询前index位置的前缀和
    private int prefixSum(int index) {
        int sum = 0;
        while (index > 0) {
            sum += tree[index];
            index -= lowBit(index);
        }
        return sum;
    }
}
```

## 背包

### 01背包

> [【动态规划/背包问题】那就从 0-1 背包问题开始讲起吧 ... (qq.com)](https://mp.weixin.qq.com/s/xmgK7SrTnFIM3Owpk-emmg)

```java
import java.util.Scanner;

/**
 * @author Vingkin
 * @since 2022/5/8 20:33
 */
public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(); // 物品个数
        int V = sc.nextInt(); // 背包体积
        int[] v = new int[N]; // 体积
        int[] w = new int[N]; // 价值
        for (int i = 0; i < N; i++) {
            v[i] = sc.nextInt();
            w[i] = sc.nextInt();
        }
        int[][] f = new int[N][V + 1];
        // 先处理「考虑第一件物品」的情况
        for (int i = 0; i <= V; i++) {
            f[0][i] = i >= v[0] ? w[0] : 0;
        }
        // 再处理「考虑其余物品」的情况
        for (int i = 1; i < N; i++) {
            for (int j = 0; j <= V; j++) {
                if (j >= v[i]) {
                    // f[i - 1][j]表示不选第i个物品，f[i - 1][j - v[i]] + w[i]表示选择第i个物品
                    f[i][j] = Math.max(f[i - 1][j], f[i - 1][j - v[i]] + w[i]);
                } else {
                    f[i][j] = f[i - 1][j];
                }
            }
        }
        System.out.println(f[N - 1][V]);
    }

}
```

**空间优化**

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/640.png)

求第 $i$ 行第 $c$ 个格子的值时，只依赖于第 $i-1$ 行的第 $c$ 个格子和 $c-v[i]$ 个格子。

问题来自于上一行 $c$ 以及前面的区域，我们必须让 $c$ 以**递减**的形式更新，以保证能够取到上一行的前面的值（因为 $c$ 递减更新的话前面是旧值，我们恰恰需要上一行的旧值）

```java
import java.util.Scanner;

/**
 * @author Vingkin
 * @since 2022/5/8 20:33
 */
public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        int V = sc.nextInt();
        int[] v = new int[N]; // 体积
        int[] w = new int[N]; // 价值
        for (int i = 0; i < N; i++) {
            v[i] = sc.nextInt();
            w[i] = sc.nextInt();
        }
        int[] f = new int[V + 1];
        for (int i = 0; i < N; i++) {
            for (int j = V; j >= v[i]; j--) {
                f[j] = Math.max(f[j], f[j - v[i]] + w[i]);
            }
        }
        System.out.println(f[V]);
    }

}
```

### 完全背包

> 完全背包和01背包相比就是每件物品数量无限
>
> [【动态规划/背包问题】从数学角度推导「完全背包」与「01 背包」之间的遍历顺序关系 (qq.com)](https://mp.weixin.qq.com/s?__biz=MzU4NDE3MTEyMA==&mid=2247486107&idx=1&sn=e5fa523008fc5588737b7ed801caf4c3)

状态转移方程：$dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - k * v[i]] + k * w[i])$

```java
class Solution {
    public int maxValue(int N, int C, int[] v, int[] w) {
        int[][] dp = new int[N][C + 1];
        
        // 先预处理第一件物品
        for (int j = 0; j <= C; j++) {
            // 显然当只有一件物品的时候，在容量允许的情况下，能选多少件就选多少件
            int maxK = j / v[0];
            dp[0][j] = maxK * w[0];
        }
        
        // 处理剩余物品
        for (int i = 1; i < N; i++) {
            for (int j = 0; j <= C; j++) {
                // 不考虑第 i 件物品的情况（选择 0 件物品 i）
                int n = dp[i - 1][j];
                // 考虑第 i 件物品的情况
                int y = 0;
                for (int k = 1 ;; k++) {
                    if (j < v[i] * k) {
                        break;
                    }
                    y = Math.max(y, dp[i - 1][j - k * v[i]] + k * w[i]);
                }
                dp[i][j] = Math.max(n, y);
            }
        }
        return dp[N - 1][C];
    }
}
```

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/完全背包解释.png)

  把推理写一遍！！！！！！！！！！！！！
