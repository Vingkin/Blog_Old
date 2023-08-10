---
title: 响应式流
author: Vingkin
date: 2023-8-10
---

## 概念

`Reactive Streams`为我们提供了Java中的Reactive Programming的通用API。传统异步编程的写法，不同任务分别在不同的线程中执行，协调这些线程执行的先后顺序、线程间的依赖顺序是一件非常麻烦的事情，而`Reactive Streams`就是为了解决该问题。`Reactive Streams API`中仅仅包含了如下**四个接口：**

```java
//发布者
public  interface  Publisher < T > {
	public  void  subscribe（Subscriber <？super  T >  s）;
}

//订阅者
public  interface  Subscriber < T > {
	public  void  onSubscribe（Subscription  s）;
	public  void  onNext（T  t）;
	public  void  onError（Throwable  t）;
	public  void  onComplete（）;
}

//表示Subscriber消费Publisher发布的一个消息的生命周期
public interface Subscription {
	public void request(long n);
	public void cancel();
}

//处理器，表示一个处理阶段，它既是订阅者也是发布者，并且遵守两者的契约
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {
	
}
```

## 示例1

> 通过Publisher，Subscriber和Subscription完成一个发布-订阅模式

```java
public class ReactiveStreamDemo {
    public static void main(String[] args) throws InterruptedException {

        // 1、定义发布者，发布的数据类型是Integer
        SubmissionPublisher<Integer> publisher = new SubmissionPublisher<>();

        // 2、定义订阅者
        Subscriber<Integer> subscriber = new Subscriber<>() {

            private Subscription subscription;

            @Override
            public void onSubscribe(Subscription subscription) {
                // 保存订阅关系，需要用它来给发布者响应
                this.subscription = subscription;
                // 请求一个数据
                this.subscription.request(1);
            }

            @Override
            public void onNext(Integer item) {
                // 接收到一个数据，处理
                System.out.println("接收到数据：" + item);
                // 处理完调用request再请求一个数据
                this.subscription.request(1);
                // 或者已经达到目标，调用cancel告诉发布者不在调用数据
                // this.subscription.cancel();
            }

            @Override
            public void onError(Throwable throwable) {
                // 出现了异常
                throwable.printStackTrace();
                // 告诉发布者后面不接受数据了
                this.subscription.cancel();
            }

            @Override
            public void onComplete() {
                // 全部数据处理完成（发布者关闭了）
                System.out.println("处理完了");
            }
        };

        // 3、发布者订阅者之间建立订阅关系
        publisher.subscribe(subscriber);

        // 4、生产数据并发布
        Stream.of(1, 2, 3, 4, 5, 6, 7, 8)
                .forEach(i -> {
                    publisher.submit(i);
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                });

        // 5、结束后 关闭发布者
        // 正式环境应放在finally或者try-resource中确保关闭
        publisher.close();

        Thread.currentThread().join(1000);

    }
}
```

## 示例2

> 在示例1的基础上，添加了processor进行中间处理

```java
public class MyProcessor extends SubmissionPublisher<String>
        implements Processor<Integer, String> {
    private static final String[] NUMBER_TO_CHINESE = {"零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"};

    private Subscription subscription;

    @Override
    public void onSubscribe(Subscription subscription) {
        // 保存订阅关系，需要用它来发布响应
        this.subscription = subscription;
        // 请求一个数据
        this.subscription.request(1);
    }

    @Override
    public void onNext(Integer item) {
        // 接收到一个数据，进行处理
        System.out.println("处理器接收到的数据：" + item);
        // 过滤掉小于0的，发布出去
        if (item >= 0) {
            this.submit(NUMBER_TO_CHINESE[item]);
        }
        // 处理完调用request再请求一个数据
        this.subscription.request(1);
        // 或者已经达到目标，调用cancel告诉发布者不在调用数据
        // this.subscription.cancel();
    }

    @Override
    public void onError(Throwable throwable) {
        // 出现了异常
        throwable.printStackTrace();
        // 告诉发布者后面不接受数据了
        this.subscription.cancel();
    }

    @Override
    public void onComplete() {
        // 全部数据处理完成（发布者关闭了）
        System.out.println("处理器处理完了");
    }
}
```

```java
public class ReactiveStreamDemo2 {
    public static void main(String[] args) throws InterruptedException {
        // 1、定义发布者，发布的数据类型是Integer
        SubmissionPublisher<Integer> publisher = new SubmissionPublisher<>();

        // 2、定义处理器，对数据进行过滤，并转换成String类型
        MyProcessor processor = new MyProcessor();

        // 3、发布者和处理器之间建立订阅关系
        publisher.subscribe(processor);

        // 4、定义最终订阅者，消费String类型数据
        Subscriber<String> subscriber = new Subscriber<>() {
            private Subscription subscription;

            @Override
            public void onSubscribe(Subscription subscription) {
                this.subscription = subscription;
                this.subscription.request(1);
            }

            @Override
            public void onNext(String item) {
                System.out.println("接收到处理后的数据：" + item);
                this.subscription.request(1);
            }

            @Override
            public void onError(Throwable throwable) {
                // 出现了异常
                throwable.printStackTrace();
                // 告诉发布者后面不接受数据了
                this.subscription.cancel();
            }

            @Override
            public void onComplete() {
                // 全部数据处理完成（发布者关闭了）
                System.out.println("订阅者处理完了");
            }
        };

        // 5、处理器和最终订阅者建立订阅关系
        processor.subscribe(subscriber);

        // 6、生产数据并发布
        // submit是一个阻塞式方法
        Stream.of(-3, -2, -1, 0, 1, 2, 3, 4, 5)
                .forEach(i -> {
                    publisher.submit(i);
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                });

        // 7、结束后 关闭发布者
        // 正式环境应放在finally或者try-resource中确保关闭
        publisher.close();

        Thread.currentThread().join(1000);
    }
}
```

## 背压

背压可以理解为订阅者能和发布者交互（通过代码里面的调用request和cancel方法交互），可以调节发布者发布数据的速率，解决把订阅者压垮的问题。关键在于上面例子里面的订阅关系`Subscription`这个接口，他有request和cancel 2个方法，用于通知发布者需要数据和通知发布者不再接受数据。

在JDK9zhong**发布者Publisher的实现类SubmissionPublisher的submit方法是block方法**。订阅者会有一个缓冲池，默认为`Flow.defaultBufferSize() = 256`。当订阅者的缓冲池满了之后，发布者调用submit方法发布数据就会被阻塞，发布者就会停（慢）下来；订阅者消费了数据之后（调用Subscription.request方法），缓冲池有位置了，submit方法就会继续执行下去，就是通过这样的机制，实现了调节发布者发布数据的速率，消费得快，生成就快，消费得慢，发布者就会被阻塞，当然就会慢下来了。