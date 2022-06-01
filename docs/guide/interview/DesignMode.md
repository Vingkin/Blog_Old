---
title: 设计模式
author: Vingkin
date: 2022-4-24
---

## 单例模式

**懒汉式线程不安全**

```java
public class Singleton1 {
    private static Singleton1 instance;
    private Singleton1() {
    }
    public static Singleton1 getInstance() {
        if (instance == null) {
            instance = new Singleton1();
        }
        return instance;
    }
}
```

**懒汉式线程安全**

```java
public class Singleton2 {
    public static Singleton2 instance;
    public Singleton2() {
    }
    public static synchronized Singleton2 getInstance() {
        if (instance == null) {
            instance = new Singleton2();
        }
        return instance;
    }
}
```

**饿汉式**

```java
public class Singleton3 {
    private static Singleton3 instance = new Singleton3();
    private Singleton3() {
    }
    public static Singleton3 getInstance() {
        return instance;
    }
}
```

**懒汉式双重锁校验**

```java
public class Singleton4 {
    private volatile static Singleton4 instance;
    private Singleton4() {}
    public static Singleton4 getInstance() {
        // instanceb
        if (instance == null) {
            // 首次创建会同步
            synchronized (Singleton4.class) {
                if (instance == null) {
                    instance = new Singleton4();
                }
            }
        }
        return instance;
    }
}
```

![image-20220531140801296](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/image-20220531140801296.png)

## 工厂模式

**意图：** 定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。

**主要解决：** 主要解决接口选择的问题。

**何时使用：** 我们明确地计划不同条件下创建不同实例时。

**如何解决：** 让其子类实现工厂接口，返回的也是一个抽象的产品。

**优点：** 1、一个调用者想创建一个对象，只要知道其名称就可以了。 2、扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。 3、屏蔽产品的具体实现，调用者只关心产品的接口。

**缺点：** 每次增加一个产品时，都需要增加一个具体类和对象实现工厂，使得系统中类的个数成倍增加，在一定程度上增加了系统的复杂度，同时也增加了系统具体类的依赖。这并不是什么好事。

`Shape.java`

```java
public interface Shape {
   void draw();
}
```

`Rectangle.java`

```java
public class Rectangle implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Rectangle::draw() method.");
   }
}
```

`Square.java`

```java
public class Square implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Square::draw() method.");
   }
}
```

`Circle.java`

```java
public class Circle implements Shape {
   @Override
   public void draw() {
      System.out.println("Inside Circle::draw() method.");
   }
}
```

`ShapeFactory.java`

```java
public class ShapeFactory {
   //使用 getShape 方法获取形状类型的对象
   public Shape getShape(String shapeType){
      if(shapeType == null){
         return null;
      }        
      if(shapeType.equalsIgnoreCase("CIRCLE")){
         return new Circle();
      } else if(shapeType.equalsIgnoreCase("RECTANGLE")){
         return new Rectangle();
      } else if(shapeType.equalsIgnoreCase("SQUARE")){
         return new Square();
      }
      return null;
   }
}
```

