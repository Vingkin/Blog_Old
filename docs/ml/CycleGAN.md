---
title: CycleGAN
date: 2022-5-27
---

## 附录

Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks

ICCV 2017

**论文主页**：https://junyanz.github.io/CycleGAN/

**原始论文**：https://arxiv.org/pdf/1703.10593.pdf

**子豪兄精读论文视频**：https://www.bilibili.com/video/BV1Ya411a78P

**代码实战，CycleGAN照片转梵高莫奈油画**：https://www.bilibili.com/video/BV1wv4y1T71F



CycleGAN是Image Translation（图像转译）领域的经典深度学习算法，巧妙实现了两个非配对图像域的相互迁移，通过构造两个GAN网络和两个Cycle-consistency自监督损失函数，在图像迁移之后仍保留原始输入图像信息，在防止模式崩溃的同时，间接实现了图像配对。

CycleGAN在照片转莫奈油画、野马转斑马花纹、夏天转冬天景色、街景转语义分割标签等图像转译应用上表现出色。

![7991651743003_.pic_hd.jpg](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/l2st5cax0rcv.jpg)

### 趣味应用

见论文主页

人脸图像自动戴口罩：https://www.zhihu.com/zvideo/1284840958643646464

### 作者相关

作者Jun-Yan Zhu主页：https://www.cs.cmu.edu/~junyanz/

### 博客

李宏毅生成对抗网络公开课：https://www.bilibili.com/video/av24011528/

理解生成对抗网络：https://danieltakeshi.github.io/2017/03/05/understanding-generative-adversarial-networks/

GAN动物园：https://github.com/hindupuravinash/the-gan-zoo

### 代码复现

官方Github：https://github.com/junyanz/CycleGAN

OpenMMLab开源图像生成算法库MMGeneration：https://github.com/open-mmlab/mmgeneration