---
title: YOLOv3
date: 2022-5-17

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

## 附录

### 官方
**YOLOV3目标检测Demo视频**：https://www.youtube.com/watch?v=MPU2HistivI

https://pjreddie.com/darknet/yolo/

https://github.com/pjreddie/darknet

**论文地址**：https://arxiv.org/abs/1804.02767

### 博客
**江大白**：https://zhuanlan.zhihu.com/p/143747206

**郭冠华**：https://zhuanlan.zhihu.com/p/40332004

**Netron可视化YOLOV3网络结构**：https://blog.csdn.net/nan355655600/article/details/106246355

**木盏**：https://blog.csdn.net/leviopku/article/details/82660381

**太阳花的小绿豆**：https://blog.csdn.net/qq_37541097/article/details/81214953

**B站工程师Algernon鉴黄YOLO**：https://github.com/thisiszhou/SexyYolo

**B站工程师Algernon博客**：https://zhuanlan.zhihu.com/p/76802514

**损失函数**：https://blog.csdn.net/qq_34795071/article/details/92803741

### 代码复现
**Ultralytics公司**：https://github.com/ultralytics/yolov3

https://github.com/qqwweee/keras-yolo3

https://github.com/bubbliiiing/yolo3-pytorch

**cvpods**：https://github.com/Megvii-BaseDetection/cvpods/blob/master/cvpods/modeling/meta_arch/yolov3.py

### MS COCO目标检测数据集80个类别
**交通**：人、自行车、汽车、摩托车、飞机、公交车、火车、卡车、船

**市政**：红绿灯、消防栓、STOP标志、停车收费米表、长椅

**动物**：鸟、猫、狗、马、绵羊、奶牛、大象、熊、斑马、长颈鹿

**随身物品**：双肩背包、雨伞、手提包、领带、行李箱

**运动**：飞盘、雪橇、滑雪板、篮球、风筝、棒球棒、棒球手套、滑板、冲浪板、网球拍

**器皿餐具**：瓶子、玻璃酒杯、茶杯、叉子、餐刀、勺子、碗

**食物**：香蕉、苹果、三明治、橘子、西兰花、胡萝卜、热狗、匹萨、甜甜圈、蛋糕

**家具**：椅子、沙发、盆栽、床、餐桌、厕所、电视、笔记本电脑、鼠标、遥控器、键盘、手机、微波炉、烤箱、烤吐司炉、洗碗槽、冰箱、书、钟表、花瓶、剪刀、泰迪熊、电吹风、牙刷
