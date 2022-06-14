---
title: 适配器模式
author: Vingkin
date: 2022-6-14
---

> [程序媛教你一看就懂的适配器设计模式！](https://mp.weixin.qq.com/s/1w_epimqLBOiZdIhe6sUsw)

## 简介

一般客户端通过目标类的接口访问它所提供的服务。有时，现有类可以满足客户端类的需要，但所提供接口不一定是客户端所期望的，可能因为现有类中方法名与目标类中定义的方法名不一致。

这时，**现有接口需要转化为客户端的期望接口，保证复用现有类**。若不进行这样转化，客户端就不能利用现有类所提供功能，适配器模式就可以完成这样的转化。

在适配器模式中可以定义一个包装类，包装不兼容接口的对象

- 包装类 适配器(Adapter)
- 所包装的对象 适配者(Adaptee)，即被适配的类

适配器提供客户类需要的接口。适配器的实现就是把客户端的请求转化为对适配者的相应接口的调用。即当客户类调用适配器方法时，在适配器类的内部将调用适配者类的方法，而该过程对客户类透明，客户类并不直接访问适配者类。因此，适配器可以使由于接口不兼容而不能交互的类可以一起协作。

Sun公司在1996年公开了Java语言的数据库连接工具JDBC，JDBC使得Java语言程序能够与数据库连接，并使用SQL语言来查询和操作数据。JDBC给出一个客户端通用的抽象接口，每一个具体数据库引擎（如SQL Server、Oracle、MySQL等）的JDBC驱动软件都是一个介于JDBC接口和数据库引擎接口之间的适配器软件。抽象的JDBC接口和各个数据库引擎API之间都需要相应的适配器软件，这就是为各个不同数据库引擎准备的驱动程序。

### 定义

`Adapter Design Pattern`，将一个接口转换成客户端希望的另一个接口，使接口不兼容的那些类可以一起工作，其别名为包装器。既可以作为类结构型模式，也可以作为对象结构型模式。

就是用来做适配，将不兼容的接口转为可兼容，让原本由于接口不兼容而不能协作的类能协作。如各种手机线转接头充当适配器，把两种不兼容接口，通过转接便可协作。

### 角色

- Target：目标抽象类
- Adapter：适配器类
- Adaptee：适配者类
- Client：客户类

## 实现方式

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/640)

### 类适配器

![类适配器](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E7%B1%BB%E9%80%82%E9%85%8D%E5%99%A8.png)

基于继承。

```java
// 要转化成的接口定义
public interface ITarget {
  void f1();
  void f2();
  void fc();
}

// 一组不兼容ITarget接口定义的接口
public class Adaptee {
  public void fa() { //... }
  public void fb() { //... }
  public void fc() { //... }
}

// 将Adaptee转化成一组符合ITarget接口定义的接口 
public class Adaptor extends Adaptee implements ITarget {
  public void f1() {
    super.fa();
  }
  
  public void f2() {
    //...重新实现f2()...
  }
  
  // 这里fc()不需要实现，直接继承自Adaptee，这是跟对象适配器最大的不同点
}
```

### 对象适配器