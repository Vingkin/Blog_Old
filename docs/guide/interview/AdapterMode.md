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

![适配器模式实现方式](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F.png)

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

使用组合关系来实现。

![对象适配器](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E5%AF%B9%E8%B1%A1%E9%80%82%E9%85%8D%E5%99%A8.png)

```java
// 对象适配器：基于组合
public interface ITarget {
  void f1();
  void f2();
  void fc();
}

public class Adaptee {
  public void fa() { //... }
  public void fb() { //... }
  public void fc() { //... }
}

public class Adaptor implements ITarget {
  private Adaptee adaptee;
  
  public Adaptor(Adaptee adaptee) {
    this.adaptee = adaptee;
  }
  
  public void f1() {
    adaptee.fa(); //委托给Adaptee
  }
  
  public void f2() {
    //...重新实现f2()...
  }
  
  public void fc() {
    adaptee.fc();
  }
}
```

如何选型？判断标准：

- Adaptee接口不多，则两种皆可
- Adaptee接口很多并且Adaptee和ITarget接口定义大部分相同，推荐类适配器，因为Adaptor复用父类Adaptee接口，比起对象适配器，Adaptor代码量更少
- Adaptee接口很多并且且Adaptee和ITarget接口定义大不相同，推荐对象适配器，因为组合相比继承更灵活

## 使用场景

适配器模式可看作一种“补偿模式”，补救设计缺陷。应用这种模式算是“无奈之举”。设计初期就规避接口不兼容问题的话，那这种模式就无需存在了。

适配器模式的应用场景是“接口不兼容”，那么问题就是何时接口会不兼容？

### 封装缺陷接口

假设依赖的外部系统在接口设计方面有缺陷（如包含大量static方法），引入后会影响自身代码的可测试性。为隔离设计缺陷，对外部系统提供的接口进行二次封装。

```java
// 该类来自外部SDK，无权修改其代码
public class CD {
  // ...
  public static void staticFunction1() { //... }
  
  public void uglyNamingFunction2() { //... }

  public void tooManyParamsFunction3(int paramA, int paramB, ...) { 
    //... 
  }
  
   public void lowPerformanceFunction4() { //... }
}

// 适配器模式重构
public class ITarget {
  
  void function1();
  
  void function2();
  
  void fucntion3(ParamsWrapperDefinition paramsWrapper);
  
  void function4();
  //...
}
// 适配器类的命名不一定非带Adaptor
public class CDAdaptor extends CD implements ITarget {
  //...
  public void function1() {
     super.staticFunction1();
  }
  
  public void function2() {
    super.uglyNamingFucntion2();
  }
  
  public void function3(ParamsWrapperDefinition paramsWrapper) {
     super.tooManyParamsFunction3(paramsWrapper.getParamA(), ...);
  }
  
  public void function4() {
    //...reimplement it...
  }
}
```

### 统一多个类的接口设计

某功能的实现依赖多个外部系统（或类）。通过该模式，将它们的接口适配为统一的接口定义，然后就能使用多态复用代码。

假如系统要对用户输入的文本内容做敏感词过滤，为提高过滤的召回率，引入第三方敏感词过滤系统，依次对用户输入内容过滤。但每个系统提供的过滤接口都不同，即无法使用统一逻辑调用各系统。这时就能使用适配器模式，将所有系统的接口适配为统一接口定义：

```java
public class ASensitiveWordsFilter { // A敏感词过滤系统提供的接口
  //text是原始文本，函数输出用***替换敏感词之后的文本
  public String filterSexyWords(String text) {
    // ...
  }
  
  public String filterPoliticalWords(String text) {
    // ...
  } 
}

public class BSensitiveWordsFilter  { // B敏感词过滤系统提供的接口
  public String filter(String text) {
    //...
  }
}

public class CSensitiveWordsFilter { // C敏感词过滤系统提供的接口
  public String filter(String text, String mask) {
    //...
  }
}

// 未使用适配器模式之前的代码：代码的可测试性、扩展性不好
public class RiskManagement {
  private ASensitiveWordsFilter aFilter = new ASensitiveWordsFilter();
  private BSensitiveWordsFilter bFilter = new BSensitiveWordsFilter();
  private CSensitiveWordsFilter cFilter = new CSensitiveWordsFilter();
  
  public String filterSensitiveWords(String text) {
    String maskedText = aFilter.filterSexyWords(text);
    maskedText = aFilter.filterPoliticalWords(maskedText);
    maskedText = bFilter.filter(maskedText);
    maskedText = cFilter.filter(maskedText, "***");
    return maskedText;
  }
}

// 使用适配器模式进行改造
public interface ISensitiveWordsFilter { // 统一接口定义
  String filter(String text);
}

public class ASensitiveWordsFilterAdaptor implements ISensitiveWordsFilter {
  private ASensitiveWordsFilter aFilter;
  public String filter(String text) {
    String maskedText = aFilter.filterSexyWords(text);
    maskedText = aFilter.filterPoliticalWords(maskedText);
    return maskedText;
  }
}
//...省略BSensitiveWordsFilterAdaptor、CSensitiveWordsFilterAdaptor...

// 扩展性更好，更加符合开闭原则，如果添加一个新的敏感词过滤系统，
// 这个类完全不需要改动；而且基于接口而非实现编程，代码的可测试性更好。
public class RiskManagement { 
  private List<ISensitiveWordsFilter> filters = new ArrayList<>();
 
  public void addSensitiveWordsFilter(ISensitiveWordsFilter filter) {
    filters.add(filter);
  }
  
  public String filterSensitiveWords(String text) {
    String maskedText = text;
    for (ISensitiveWordsFilter filter : filters) {
      maskedText = filter.filter(maskedText);
    }
    return maskedText;
  }
}
```

### 替换依赖的外部系统

把项目中依赖的一个外部系统替换为另一个外部系统时。可减少对代码改动。

```java
// 外部系统A
public interface IA {
  //...
  void fa();
}
public class A implements IA {
  //...
  public void fa() { //... }
}
// 在我们的项目中，外部系统A的使用示例
public class Demo {
  private IA a;
  public Demo(IA a) {
    this.a = a;
  }
  //...
}
Demo d = new Demo(new A());

// 将外部系统A替换成外部系统B
public class BAdaptor implemnts IA {
  private B b;
  public BAdaptor(B b) {
    this.b= b;
  }
  public void fa() {
    //...
    b.fb();
  }
}
// 借助BAdaptor，Demo的代码中，调用IA接口的地方都无需改动，
// 只需要将BAdaptor如下注入到Demo即可。
Demo d = new Demo(new BAdaptor(new B()));
```

### 兼容老版本接口

在做版本升级的时候，对于一些要废弃的接口，我们不直接将其删除，而是暂时保留，并且标注为deprecated，并将内部实现逻辑委托为新的接口实现。这样做的好处是，让使用它的项目有个过渡期，而不是强制进行代码修改。这也可以粗略地看作适配器模式的一个应用场景。同样，我还是通过一个例子，来进一步解释一下。

JDK1.0中包含一个遍历集合容器的类Enumeration。JDK2.0对这个类进行了重构，将它改名为Iterator类，并且对它的代码实现做了优化。但是考虑到如果将Enumeration直接从JDK2.0中删除，那使用JDK1.0的项目如果切换到JDK2.0，代码就会编译不通过。为了避免这种情况的发生，我们必须把项目中所有使用到Enumeration的地方，都修改为使用Iterator才行。

单独一个项目做Enumeration到Iterator的替换，勉强还能接受。但是，使用Java开发的项目太多了，一次JDK的升级，导致所有的项目不做代码修改就会编译报错，这显然是不合理的。这就是我们经常所说的不兼容升级。为了做到兼容使用低版本JDK的老代码，我们可以暂时保留Enumeration类，并将其实现替换为直接调用Itertor。代码示例如下所示：

```java
public class Collections {
  public static Emueration emumeration(final Collection c) {
    return new Enumeration() {
      Iterator i = c.iterator();
      
      public boolean hasMoreElments() {
        return i.hashNext();
      }
      
      public Object nextElement() {
        return i.next():
      }
    }
  }
}
```

### 适配不同格式的数据

前面我们讲到，适配器模式主要用于接口的适配，实际上，它还可以用在不同格式的数据之间的适配。比如，把从不同征信系统拉取的不同格式的征信数据，统一为相同的格式，以方便存储和使用。再比如，Java中的`Arrays.asList()`也可以看作一种数据适配器，将数组类型的数据转化为集合容器类型。

```java
List<String> stooges = Arrays.asList("Larry", "Moe", "Curly");
```

## Java日志设计

Java日志框架常用的log4j、logback及JDK的JUL(java.util.logging)和Apache的JCL(Jakarta Commons Logging)。

它们提供了相似功能，按级别（debug、info、warn、error……）打印日志，但未实现统一接口。

若项目中用到某组件使用log4j，而项目本身使用logback。将组件引入到项目后，项目就相当于有两套日志框架。每种日志框架都有自己特有配置方式。所以，要针对每种日志框架编写不同配置文件（如日志存储的文件地址、打印日志格式）。若引入多个组件，每个组件使用的日志框架都不一样，那日志本身的管理工作就变得非常复杂。为此，必须统一日志打印框架。

Slf4j，类似JDBC规范，打印日志的统一接口规范。只定义接口，未提供实现，需配合具体日志框架（log4j、logback等）。Slf4j晚于JUL、JCL、log4j等日志框架，所以，这些日志框架也不可能牺牲版本兼容性，将接口改造成符合Slf4j接口规范。所以Slf4j不仅提供统一接口定义，还提供针对不同日志框架的适配器。对不同日志框架的接口进行二次封装，适配成统一接口定义。

slf4j统一接口定义：

![日志设计](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E6%97%A5%E5%BF%97%E8%AE%BE%E8%AE%A1.png)

```java
// log4j日志框架的适配器
// LocationAwareLogger继承自Logger接口，
// 即Log4jLoggerAdapter实现Logger接口。
package org.slf4j.impl;
public final class Log4jLoggerAdapter extends MarkerIgnoringBase
  implements LocationAwareLogger, Serializable {
  final transient org.apache.log4j.Logger logger; // log4j
 
  public boolean isDebugEnabled() {
    return logger.isDebugEnabled();
  }
 
  public void debug(String msg) {
    logger.log(FQCN, Level.DEBUG, msg, null);
  }
 
  public void debug(String format, Object arg) {
    if (logger.isDebugEnabled()) {
      FormattingTuple ft = MessageFormatter.format(format, arg);
      logger.log(FQCN, Level.DEBUG, ft.getMessage(), ft.getThrowable());
    }
  }
 
  public void debug(String format, Object arg1, Object arg2) {
    if (logger.isDebugEnabled()) {
      FormattingTuple ft = MessageFormatter.format(format, arg1, arg2);
      logger.log(FQCN, Level.DEBUG, ft.getMessage(), ft.getThrowable());
    }
  }
 
  public void debug(String format, Object[] argArray) {
    if (logger.isDebugEnabled()) {
      FormattingTuple ft = MessageFormatter.arrayFormat(format, argArray);
      logger.log(FQCN, Level.DEBUG, ft.getMessage(), ft.getThrowable());
    }
  }
 
  public void debug(String msg, Throwable t) {
    logger.log(FQCN, Level.DEBUG, msg, t);
  }
}
```

统一使用Slf4j提供的接口来编写打印日志的代码，而具体使用哪种日志框架实现（log4j、logback……），可动态指定（使用Java SPI），将相应SDK导入项目即可。

若老项目无Slf4j，而直接使用JCL，若还想替换成其他日志框架如log4j，咋办？Slf4j不仅提供了从其他日志框架到Slf4j的适配器，还提供了反向适配器，即从Slf4j到其他日志框架适配。于是，可先将JCL切换为Slf4j，再将Slf4j切换为log4j。经过两次适配器转换，就能将log4j切换为logback。

## 代理 V.S 桥接 V.S 装饰器 V.S 适配器

都可称为Wrapper模式，即通过Wrapper类二次封装原始类。代码结构相似，但要解决的问题、应用场景不同。

- • 代理模式不改变原始类接口的条件下，为原始类定义一个代理类，主要为控制访问，而非加强功能，这是和装饰器模式的最大不同
- • 桥接模式将接口部分和实现部分分离，让它们更容易、也相对独立地改变
- • 装饰器模式不改变原始类接口的情况下，对原始类功能进行增强，并且支持多个装饰器的嵌套使用
- • 适配器模式适配器模式是一种事后的补救策略。适配器提供跟原始类不同的接口，而代理模式、装饰器模式提供的都是跟原始类相同的接口。

## 案例

- *MediaPlayer* 接口
- 实现 *MediaPlayer* 接口的实体类 *AudioPlayer*

默认情况下，*AudioPlayer* 可以播放 mp3

- 接口 *AdvancedMediaPlayer*
- 实现了 *AdvancedMediaPlayer* 接口的实体类。该类可以播放 vlc 和 mp4 格式的文件。

我们想要让 *AudioPlayer* 播放其他格式的音频文件。为了实现这个功能，我们需要创建

- 一个实现了 *MediaPlayer* 接口的适配器类 *MediaAdapter*

使用

- *AdvancedMediaPlayer* 对象来播放所需的格式。

*AudioPlayer* 使用适配器类 *MediaAdapter* 传递所需的音频类型，不需要知道能播放所需格式音频的实际类。*AdapterPatternDemo*，我们的演示类使用 *AudioPlayer* 类来播放各种格式。

![案例UML图](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E6%A1%88%E4%BE%8BUML%E5%9B%BE.png)

创建接口。

