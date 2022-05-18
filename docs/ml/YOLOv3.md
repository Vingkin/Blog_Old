---
title: YOLOv3
date: 2022-5-27
---

<img src="https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/sayit.jpg" style="zoom: 200%;" />

> 整理自同济子豪兄

## 网络结构

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220518135951221.png)

![image-20220518142711194](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220518142711194.png)

## Backbone（Darknet-53）

对于输入为$256*256$的图像，其Backbone如下图所示：

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220518135554800.png)

## Neck

neck部分就是多尺度特征融合的过程。其中`concat`就是在上采样之后，将相同尺度的特征沿通道方向摞起来。就像将相同大小的作业本摞起来。

## Head

YOLOv3的head部分，受到了特征金字塔的启发，使用了多尺度特征。

对于输入是$416*416$的图像，产生$13*13,26*26,52*52$三个尺度的特征。其中小尺度特征（比如$13*13$）负责预测大物体，大尺度特征负责预测小物体。因为小尺度每个`grid ceil`对应更大的感受野。

三个尺度的特征，每个特征的`grid ceil`都会生成$3$个`anchor`，一共$9$个`anchor`。其中在$9$个`anchor`中，与`ground truth`的`IOU`最大的`anchor`负责预测这个`ground truth`。

## 正负样本

假设`IOU`阈值为0.5，其中与`ground truth`的`IOU`小于阈值的`anchor`为**负样本**。超过阈值，且与`ground truth`的`IOU`最大的`anchor`为**正样本**。查过阈值，但是与`ground truth`的`IOU`不是最大的`anchor`**既不是正样本也不是负样本**。

## 损失函数

```latex
$$
\begin{equation} \lambda_{coord}\sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{i,j}^{obj}\cdot[(b_x-\hat{b_x})^2 + (b_y-\hat{b_y})^2 + (b_w-\hat{b_w})^2 +(b_h-\hat{b_h})^2] \\ \\ \\ + \quad \sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{i,j}^{obj}\cdot[-log(p_c)+\sum_{i=1}^{n}{BCE(\hat{c_i},c_i)}] \\ \\ \\ + \quad \lambda_{noobj}\sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{i,j}^{noobj}\cdot[-log(1-p_c)] \end{equation}
$$
```

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220518143441409.png)

## 训练过程

![image-20220518144159747](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220518144159747.png) 

## 测试过程

![image-20220518144241994](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220518144241994.png)
