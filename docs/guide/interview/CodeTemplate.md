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

```c++
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

```c++
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

