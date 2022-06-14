---
title: CycleGAN
author: Vingkin
date: 2022-5-27
---

## 附录

图像转译和生成对抗网络GAN必读论文 pix2pix

Image-to-Image Translation with Conditional Adversarial Nets

CVPR 2017

使用条件式生成对抗网络，提出图像转译的通用框架。生成器采用U-Net网络结构，融合底层细粒度特征和高层抽象语义特征。判别器采用patchGAN网络结构，在图块尺度提取纹理等高频信息。

pix2pix在语义标签图转真实照片、简笔画转真图、黑白图像上色、卫星航拍图转地图等图像转译任务上表现优秀。


### 主页
论文主页：https://phillipi.github.io/pix2pix/

子豪兄论文精读视频：https://www.bilibili.com/video/BV1wY4y1k7Tc/

论文：https://arxiv.org/abs/1611.07004

代码：https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix

交互式趣味Demo：https://affinelayer.com/pixsrv/

### 趣味案例
床单充电线作画Gommy Sunday：https://vimeo.com/260612034

调色板生成：http://colormind.io/blog/

人脸简笔画转肖像画：https://twitter.com/quasimondo/status/826065030944870400

### 代码
https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/generative/pix2pix.ipynb

https://github.com/TommyZihao/MMGeneration_Tutorials/blob/main/%E3%80%90E%E3%80%91%E5%9B%BE%E5%83%8F%E8%BD%AC%E8%AF%91-pix2pix.ipynb
