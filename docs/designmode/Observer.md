---
title: 观察者模式 / 发布-订阅模式 / 生产-消费模式
author: Vingkin
date: 2023-8-9
---

> 可见《图解设计模式》Observer模式篇

## 概述

在Observer模式中，当观察对象的状态发生变化时，会通知给观察者。Observer模式适用于根据对象状态进行相应处理的场景。Observer本来的意思是“观察者”，但实际上Observer角色并非主动地去观察，而是被动地接受来自Subject角色的通知。因此，Observer模式也被称为**Publish-Subscribe（发布-订阅）** 模式。

## 结构

<img src="https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/img/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20230810094722.png" style="zoom:50%;" />

* **Subject（观察对象）**

  Subject角色表示观察对象。Subject角色定义了注册观察者和删除观察者的方法。此外，它还声明了“获取现在状态”的方法。

* **ConcreteSubject（具体的观察对象）**

  ConcreteSubject角色表示具体的被观察对象。当自身状态发生变化后，它会通知所有已经注册的Observer角色。

* **Observer（观察者）**

  Observer角色负责接收来自Subject角色的状态变化的通知。为此，它声明了update方法。

* **ConcreteObserver（具体的观察者）**

  ConcreteObserver角色表示具体的Observer。当它的update方法被调用后，会去获取要观察的对象的最新状态。

## 示例

**类和接口一览表：**

| 名字                  | 说明                                               |
| --------------------- | -------------------------------------------------- |
| Observer              | 表示观察者的接口（Observer）                       |
| NunberGenerator       | 表示生成数值的对象的抽象类（Subject）              |
| RandomNumberGenerator | 生成随机数的类（ConcreteSubject）                  |
| DigitObserver         | 表示以数字形式显示数值的类（ConcreteObserver）     |
| GraphObserver         | 表示以简单图示形式显示熟知的类（ConcreteObserver） |

<img src="https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/img/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20230810094917.png" style="zoom:50%;" />

```java
public interface Observer {
    void update(NumberGenerator generator);
}
```

```java
public abstract class NumberGenerator {
    
    private final List<Observer> observers = new ArrayList<>();

    public void addObserver(Observer o) {
        observers.add(o);
    }

    public void deleteObserver(Observer o) {
        observers.remove(o);
    }

    public void notifyObservers() {
        observers.forEach(o -> o.update(this));
    }

    public abstract int getNumber();

    public abstract void execute();
}
```

```java
public class RandomNumberGenerator extends NumberGenerator {

    private Random random = new Random();
    private int number;

    @Override
    public int getNumber() {
        return number;
    }

    @Override
    public void execute() {
        for (int i = 0; i < 20; i++) {
            number = random.nextInt(50);
            notifyObservers();
        }
    }
}
```

```java
public class DigitObserver implements Observer {
    @Override
    public void update(NumberGenerator generator) {
        System.out.println("DigitObserver:" + generator.getNumber());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

```java
public class GraphObserver implements Observer {
    @Override
    public void update(NumberGenerator generator) {
        System.out.print("GraphObserver:");
        int count = generator.getNumber();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) {
            System.out.print("*");
        }
        System.out.println();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        NumberGenerator generator = new RandomNumberGenerator();
        Observer observer1 = new DigitObserver();
        Observer observer2 = new GraphObserver();
        generator.addObserver(observer1);
        generator.addObserver(observer2);
        generator.execute();
    }
}
```

```
DigitObserver:38
GraphObserver:**************************************
DigitObserver:17
GraphObserver:*****************
DigitObserver:39
GraphObserver:***************************************
...
```

