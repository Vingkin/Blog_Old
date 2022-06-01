---
title: Java并发
author: Vingkin
date: 2022-04-24
---

## start()和run()

1. start()和run()都是Thread类的方法（如果用的是Runnable则执行的是Runnable中的run方法，注意Callable中的是call方法）
2. start是启动线程作用是将线程变为就绪状态，至于是否调用还是得看CPU的分配。run是一个线程的具体执行内容，线程启动后自动调用。
3. 如果在main线程中调用了t1线程的run方法，就相当于main线程运行了一个普通的run方法，并没能达到多线程的效果
4. strat只能调用一次，多次调用会抛`IllegalThreadStateException`异常

## sleep()与yield()

**sleep**

* 调用sleep会让当前线程从`Running`进入`Timed Waiting`（阻塞状态）状态
* 其他线程可以使用`interrupt`方法打断正在睡眠的线程，这时sleep方法会抛出`InterruptedException`
* 睡眠结束后的线程未必会立刻得到执行

**yield**

* 调用yield会让当前线程从`Running`进入`Runnalbe`（就绪状态）状态，然后调度执行其他同优先级的线程。如果这时没有同优先级的线程，那么不能保证让当前线程暂停的效果
* 具体的实现依赖于操作系统的任务调度器

**区别**

就绪状态有机会被任务调度器调用，阻塞状态不会。

sleep有休眠时间，yield没有时间参数

## interrupt()

> Thread中的方法

* 如果打断的是阻塞线程(`sleep`, `wait`, `join`)，则打断标记(`isInterrupted()`)会在打断后清为False
* 如果打断的是正常运行的线程，则不会清空打断状态

## 线程优先级

Java中优先级最大10，最小1，默认为5，仅仅是一个提示，调度器甚至可以忽略。

只有在cpu比较忙的时候，优先级较高的线程会获得更多的时间片，cpu空闲时，优先级几乎没什么用。

## 两阶段终止模式

在线程T1中如何优雅地终止另一个线程T2？这里的优雅指的是给T2一个处理其他事情的机会（如释放锁）

如果调用线程的`stop()`方法，如果此时线程锁住了共享资源，那么当它被杀死后就再也没有机会释放锁，其他线程永远无法获取锁。

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/889b421e38b1d734bb96cbf20feb4664.png)

```java
public class Test {
    public static void main(String[] args) throws InterruptedException {
        Monitor monitor = new Monitor();
        monitor.start();
        Thread.sleep(3500);
        monitor.stop();
    }
}

class Monitor {

    Thread monitor;

    /**
     * 启动监控器线程
     */
    public void start() {
        //设置线控器线程，用于监控线程状态
        monitor = new Thread() {
            @Override
            public void run() {
                //开始不停的监控
                while (true) {
                    //判断当前线程是否被打断了
                    if(Thread.currentThread().isInterrupted()) {
                        System.out.println("处理后续任务");
                        //终止线程执行
                        break;
                    }
                    System.out.println("监控器运行中...");
                    try {
                        //线程休眠
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                        //如果是在休眠的时候被打断，不会将打断标记设置为true，这时要重新设置打断标记
                        Thread.currentThread().interrupt();
                    }
                }
            }
        };
        monitor.start();
    }

    /**
     * 	用于停止监控器线程
     */
    public void stop() {
        //打断线程
        monitor.interrupt();
    }
}
```
## 守护线程

当Java进程中有多个线程执行时，只有当所有非守护线程执行完毕后，Java进程才会结束。但当非守护线程执行完毕后，守护线程无论是否执行完毕，都会一同结束。

> 垃圾回收器就是一个守护线程

## 线程状态

**五种状态**

> 操作系统层面

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/image-20220225202048787.png)

* 初始状态：仅在语言层面创建了线程对象，还未与操作系统线程关联
* 可运行状态（就绪状态）：指该线程已经被创建（与操作系统线程相关），可以由CPU调度使用
* 运行状态：指获取了CPU时间片运行中的状态
* 阻塞状态：
  * 如果调用了阻塞API，如读写文件，这时该线程实际不会用到CPU，会导致线程上下文切换，进入阻塞状态
  * 等读写完毕，会由操作系统唤醒阻塞的线程，转换至可运行状态
  * 与**可运行状态**的区别是，对阻塞状态的线程来说只要他们一直不唤醒，调度器就一直不会考虑调度他们。
* 终止状态：表示线程执行已经完毕，生命周期已经结束，不会再转换为其他状态

**六种状态**

> Java中Thread.State枚举描述的
>
> 下图RUNNABLE中的阻塞状态应该去除

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/image-20220225202815248.png)

**线程的状态转换**

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/image-20220303171324316.png)

* NEW：线程刚被创建，但是还没有调用start()方法
* RUNNABLE：当调用了start()方法之后的状态。涵盖了操作系统层面的【可运行状态】、【运行状态】和【阻塞状态】（在Java中无法区分运行状态和可运行状态）
* BLOCKED、WAITING、TIMED_WAITING：都是Java API层面对【阻塞状态】的细分
* TERMINATED：当前线程运行结束

![Java 线程的状态 ](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/Java%E7%BA%BF%E7%A8%8B%E7%9A%84%E7%8A%B6%E6%80%81.png)

## 变量的线程安全分析

**成员变量和静态变量的线程安全分析**

* 如果变量没有在线程间共享，那么变量是安全的
* 如果变量在线程中共享
  * 如果只有读操作，则线程安全
  * 如果有写操作，则该变量属于临界资源，需要考虑线程安全问题

**局部变量线程安全分析** 

* 局部变量被初始化为基本数据类型则是安全的
* 当局部变量是引用变量时则需要进行逃逸分析判断
  * 如果该对象没有逃离方法的作用范围，则线程安全
  * 如果该对象逃离了方法的作用范围，则线程不安全

## 对象头

Java对象头详细信息在JVM中有描述，简要来说包含`Mark Word`(32bit)和`Klass Word`(32bit)。如果是数组的话还会包含数组长度(32bit)。

下图描述的是不同锁状态下Mark Word的形式，其中后几位为001表示无锁，101表示偏向锁，00表示轻量级锁，10表示重量级锁，11表示标记GC

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/0ffaeb7ddf7d71801bfd3eeb00754162.png)

## Monitor原理

Monitor被翻译成**监视器**或**管程**

每个Java对象都可以关联一个Monitor对象，如果使用synchronized给对象上锁之后，该对象头的Mark Word中就被设置成指向Monitor对象的指针

Monitor的结构如下：

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/image-20220227152703623.png)

* 刚开始Monitor中的Owner为null
* 当Thread-2执行synchronized(obj)就会将Monitor的所有者Owner置为Thread-2，Monitor中只能有一个Owner
* 在Thread-2上锁的过程中，如果Thread-3，Thread-4，Thread-5也来执行synchronized(obj)，就会进入EntryList BLOCKED
* Thread-2执行完同步代码块的内容，然后唤醒EntryList中等待的线程来竞争锁，竞争的时候是非公平的
* 途中WaitSet中的Thread-0，Thread-1是之前获得过锁，但条件不满足进入WAITING状态的线程

注意：

* synchronized必须是进入同一个锁对象的monitor才有上述的效果（一个锁对象对应着一个monitor）
* 不加synchronized的对象不会关联监视器，不遵从上述规则

**字节码层面分析synchronized**

* monitorenter是进入synchronized语句
* monitorexit是退出synchronized语句
* 6 - 14行是synchronized中执行的部分，如果其中出现了错误也会释放锁，因为异常表中当在6 - 16行出现异常时，会跳到19行执行异常处理部分。

```java
static final Object lock = new Object();
static int counter = 0;
public static void main(String[] args) {
    synchronized (lock) {
        counter++;
    }
}
```
![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/20201219201521709.png)

## 自旋优化

> 优化重量级锁竞争

当发生**重量级锁竞争**的时候，还可以使用自旋来进行优化（不加入Monitor的阻塞队列EntryList中），如果当前线程自旋成功（即在自旋的时候持锁的线程释放了锁），那么当前线程就可以不用进行上下文切换（持锁线程执行完synchronized同步块后，释放锁，Owner为空，唤醒阻塞队列来竞争，胜出的线程获取cpu执行权的过程）就获得了锁

**成功演示：**

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/39ed180b2ab7eae1bc37ebba0a819c4c.png)

**失败演示：**

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/36162c78749df99fcd83560e3896aef0.png)

自旋会占用CPU时间，单核CPU自选就是浪费，多核CPU自旋才能发挥优势

## 轻量级锁

> 用于优化重量级锁
>
> https://blog.csdn.net/m0_37989980/article/details/111408759#t5

## 偏向锁

> 用于优化轻量级锁重入
>
> https://blog.csdn.net/m0_37989980/article/details/111408759#t8

## wait()和notify()

> Object类中的方法
>
> https://blog.csdn.net/m0_37989980/article/details/111412907#t0

## sleep()和wait()的区别

1. sleep是Thread方法，wait是Object方法
2. sleep不需要强制和synchronized配合使用，但wait需要和synchronized一起使用
3. **sleep不会释放锁对象，wait会释放锁对象**

他们的线程状态都是`TIMED_WAITING`

## 保护性暂停模式

> 用于一个线程等待另一个线程的执行结果
>
> join()内部采用的就是这个原理，不过join()中是一个线程等待另一个线程结束

* 有一个结果需要从一个线程传递到另一个线程，让他们关联同一个GuardedObject
* 如果有结果不断从一个线程到另一个线程，那么可以使用消息队列（生产者消费者模式）
* JDK中，join和future采用的就是该模式
* 因为一个线程需要等待另一个线程的执行结果，所以归结于同步模式

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/image-20220303155836268.png)

## 生产者消费者模式

* 与前面的保护性暂停中的GuardObjct不同，不需要产生结果和消费结果的线程一一对应
* 消费队列可以用来平衡生产和消费的线程资源
* 生产者仅负责产生结果数据，不关心数据该如何处理，而消费者专心处理结果数据
* 消息队列是有容量限制的，满时不会再加入数据，空时不会再消耗数据
* JDK中各种阻塞队列，采用的就是这种模式

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/image-20220303162257793.png)

## park()和unpark()

> https://blog.csdn.net/m0_37989980/article/details/111412907#t8

* park和unpark是LockSupport类中的方法，运行时会调用Unsafe类中的native方法
* 每个线程都会和一个park对象关联起来，由三部分组成`_counter`,`_cond`,`_mutex_`。核心部分是counter，可以理解为一个标记位。
* 当调用park时会查看counter是否为0，为0则进入cond阻塞。为1则继续运行并将counter置为0。
* 当调用unpark时，会将counter置为1，若之前的counter值为0，还会唤醒阻塞的线程。
* **如果先调用unpark再调用park不会阻塞线程。调用unpark后将counter置为1，再调用park线程发现counter为1继续运行并将counter置为0。**

**park()&unpark()与wait()&notify()对比**

1. wait，notify和notifyAll必须配合Object Monitor(synchronized)一起使用，而park和unpark不必
2. park，unpark是以线程为单位来【阻塞】和【唤醒】线程，而notify只能随机唤醒一个等待线程，notifyAll是唤醒所有等待线程，无法唤醒指定的线程。
3. ~~park，unpark可以先unpark，而wait，notify不能先notify~~

## 死锁，活锁，饥饿

### 死锁

代码演示：

```java
public static void main(String[] args) {
	final Object A = new Object();
	final Object B = new Object();
	
	new Thread(()->{
		synchronized (A) {
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			synchronized (B) {

			}
		}
	}).start();

	new Thread(()->{
		synchronized (B) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			synchronized (A) {

			}
		}
	}).start();
}
```

**发生死锁的必要条件：**

1. 互斥条件：在一段时间内，一种资源只能被一个线程所使用
2. 请求和保持条件：线程已经拥有了至少一种资                                                                                                                                                                                                      源，同时又去申请其他资源。因为其他资源被别的线程所使用。该线程进入阻塞状态同时不释放自己已有的资源。
3. 不可抢占条件：进程对已获得的资源在未使用完成前不能被抢占，之后能在线程使用完后自己释放。
4. 循环等待条件：发生死锁时，必然存在一个线程---资源的循环链

**定位死锁的方法：**

1. `jstack + 进程id`命令查看线程状态有Java层面死锁线程信息
2. `jconsole`有死锁检测功能

**避免死锁的方法：**

- 在线程使用锁对象时, 采用**固定加锁的顺序**, 可以使用Hash值的大小来确定加锁的先后
- 尽可能缩减加锁的范围, 等到操作共享变量的时候才加锁
- 使用可释放的定时锁 (一段时间申请不到锁的权限了, 直接释放掉)

### 活锁

- `活锁`出现在两个线程 **`互相改变对方的结束条件`**，谁也无法结束。

**避免活锁的方法：**

* 在线程执行时，中途给予不同的间隔时间, 让某个线程先结束即可。

**死锁与活锁的区别：**

* 死锁是因为线程互相持有对象想要的锁，并且都不释放，最后到时线程阻塞，停止运行的现象。
* 活锁是因为线程间修改了对方的结束条件，而导致代码一直在运行，却一直运行不完的现象。

### 饥饿

- 某些线程因为优先级太低，导致一直无法获得资源的现象。
- 在使用`顺序加锁`时，可能会出现`饥饿现象`

## 固定线程运行顺序

**wait()&notify()**

```java
public class Test {

    static final Object lock = new Object();
    static boolean t2runned = false;

    public static void main(String[] args) {

        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (lock) {
                    while (!t2runned) {
                        try {
                            lock.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    log.debug("1");
                }
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized(lock) {
                    log.debug("2");
                    t2runned = true;
                    lock.notify();
                }
            }
        }, "t2");

        t1.start();
        t2.start();

    }
}
```

**park()&unpark()**

```java
public class Test {

    public static void main(String[] args) {
        
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                LockSupport.park();
                log.debug("1");
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                log.debug("2");
                LockSupport.unpark(t1);
            }
        }, "t2");

        t1.start();
        t2.start();

    }
}
```

**await()&signal()**

```java
public class Test {

    private static ReentrantLock lock = new ReentrantLock();
    private static boolean t2runned = false;
    static Condition condition1 = lock.newCondition();

    public static void main(String[] args) {

        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                lock.lock();
                try {
                    while (!t2runned) {
                        try {
                            condition1.await();
                            log.debug("1");
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                } finally {
                    lock.unlock();
                }
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                lock.lock();
                try {
                    log.debug("2");
                    t2runned = true;
                    condition1.signal();
                } finally {
                    lock.unlock();
                }
            }
        }, "t2");

        t1.start();
        t2.start();

    }
}
```

## 线程交替输出

**wait()&notify()**

```java
public class Test {

    static boolean t1runned = false;
    static boolean t2runned = true;
    static final Object lock = new Object();

    public static void main(String[] args) {

        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    synchronized (lock) {
                        while (!t2runned) {
                            try {
                                lock.wait();
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                        log.debug("1");
                        t1runned = true;
                        t2runned = false;
                        lock.notify();
                    }
                }
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    synchronized (lock) {
                        while (!t1runned) {
                            try {
                                lock.wait();
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                        log.debug("2");
                        t1runned = false;
                        t2runned = true;
                        lock.notify();
                    }
                }
            }
        }, "t2");

        t1.start();
        t2.start();
    }
}
```

**park()&unpark()**

```java
public class Test {

    volatile static boolean t1runned = false;
    volatile static boolean t2runned = true;
    static final Object lock = new Object();
    static Thread t1;
    static Thread t2;

    public static void main(String[] args) {

        t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    if (!t2runned) {
                        LockSupport.park();
                    }
                    log.debug("1");
                    t2runned = false;
                    t1runned = true;
                    LockSupport.unpark(t2);
                }
            }
        }, "t1");

        t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    if  (!t1runned) {
                        LockSupport.park();
                    }
                    log.debug("2");
                    t2runned = true;
                    t1runned = false;
                    LockSupport.unpark(t1);
                }
            }
        }, "t2");

        t1.start();
        t2.start();
    }
}
```

**await()&signal()**

```java
public class Test {

    static boolean t1runned = false;
    static boolean t2runned = true;

    public static void main(String[] args) {

        ReentrantLock reentrantLock = new ReentrantLock();
        Condition condition = reentrantLock.newCondition();

        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    reentrantLock.lock();
                    try {
                        while (!t2runned) {
                            condition.await();
                        }
                        log.debug("1");
                        t1runned = true;
                        t2runned = false;
                        condition.signal();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } finally {
                        reentrantLock.unlock();
                    }
                }
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    reentrantLock.lock();
                    try {
                        while (!t1runned) {
                            condition.await();
                        }
                        log.debug("2");
                        t1runned = false;
                        t2runned = true;
                        condition.signal();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } finally {
                        reentrantLock.unlock();
                    }
                }
            }
        }, "t2");

        t1.start();
        t2.start();
    }
}
```

## 并发编程的三大特性

* **原子性**：保证指令不会受到线程上下文切换的影响。**程序的原子性是指整个程序中的所有操作，要么全部完成，要么全部失败，不可能滞留在中间某个环节；在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程所打断。**
* **可见性**：保证指令不会受cpu缓存的影响。**一个线程对共享变量值的修改，能够及时地被其他线程看到**
* **有序性**：保证指令不会受到cpu指令并行优化的影响

## volatile原理

`volatile`的底层实现原理是内存屏障

1. 保证可见性
   * 对`volatile`变量的写指令后会加入写屏障。写屏障保证该屏障之前的，对共享变量的改动都会同步到主存中。
   * 对`volatile`变量之间会加入读屏障。读屏障保证在该屏障之后，对共享变量的读取，加载的是主存中最新数据。
2. 保证有序性（禁止指令重排）
   * 写屏障会确保指令重排序时，不会将写屏障之前的代码排在写屏障之后
   * 读屏障会确保指令重排序时，不会将读屏障之后的代码排在读屏障之前

## volatile和synchronized

* 一个线程对`volatile`变量的修改对另一个线程可见，不能保证原子性，仅用在一个写线程，多个读线程的情况。（比如`volatile`修饰的i，两个线程一个i++一个i--，只能保证看到最新值，不能解决指令交错的问题。）
* `synchronized`语句块既能保证代码块的原子性，也同时能保证代码块内变量的可见性。但缺点是`synchronized`属于重量级锁，性能相对较低。
* `volatile`关键字只能修饰变量，`synchronized`还可以修饰方法，类以及代码块。
* `volatile`关键字主要用于解决变量在多个线程之间的可见性，而`synchronized`关键字解决的是多个线程之间访问资源的同步性。

## volatile和synchronized在有序性上的不同

* `synchronized`的有序性是持有相同锁的两个同步块只能串行的进入，即被加锁的内容要按照顺序被多个线程执行，但是其内部的同步代码还是会发生重排序。
* `volatile`的有序性是通过插入内存屏障来保证指令按照顺序执行。不会存在后面的指令跑到前面的指令之前来执行。是保证编译器优化的时候不会让指令乱序。
* **`synchronized`代码块内部是不能保证指令重排的。**

## i++是否线程安全

> 提到这个问题得区分i是成员变量/静态变量还是局部变量，如果是前者需要考虑，对于局部变量不管是基本类型还是包装类型都不需要考虑，包装类型比如Integer是不可变类，是线程安全的。
>
> 假设有1000个线程对i执行++操作，理论上ide结果应该是1000，实际并不是

```java
// i++ 的字节码指令，此时i是一个静态变量
getstatic    i // 获取静态变量i的值
iconst_1	   // 准备常量1
iadd		   // 自增
putstatic    i // 将修改后的值存入静态变量i
```

每个线程都有自己的工作内存，每个线程需要用共享变量时必须先把共享变量从主存load到自己的工作内存，等完成对共享变量的操作时再save到主内存。

问题就出在一个线程读取主存的值后运算完还未刷回主存就被其他线程从主存中读取到了，这时候其他线程读取的数据就是脏数据了。

这也是经典的内存不可见问题，把count加上volatile也不能解决这个问题。因为volatile只能保证可见性并不能保证原子性。多个线程同时读取这个共享变量的值，就算保证其他线程的可见性，也不能保证线程之间读取到同样的值然后互相覆盖对方值的情况。

**解决方案**

1. 对i++操作的方法加同步锁，同时只能由一个线程执行i++
2. 使用支持原子类型操作的类，比如AtomicInteger，内部使用的是CAS

## CAS的特点

结合CAS和volatile可以实现无锁并发，适用于线程数少、多核CPU的场景下。

* CAS是基于乐观锁的思想~~（实际上并不是锁）~~：最乐观的估计，不怕别的线程来修复共享变量，就算改了也没关系，重试即可

* synchronized是基于悲观锁的思想：最悲观的估计，得防着其他线程来修改共享变量，我上了锁你们都别想改，我改完了解开锁，你们才有机会

* CAS体现的是无锁并发，无阻塞并发

  * 因为没有使用synchronized，所以线程不会陷入阻塞，这是效率提升的因素之一
  * 但是如果竞争激烈，可以想到重试必然频繁发生，反而效率会受影响

## Atomic原子类

> [并发编程面试必备：JUC 中的 Atomic 原子类总结 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247484834&idx=1&sn=7d3835091af8125c13fc6db765f4c5bd&source=41#wechat_redirect)

1. 原子整数

   1. AtomicInteger
   2. AtomicLong
   3. AtomicBoolean

   ```java
   public static void main(String[] args) {
       AtomicInteger i = new AtomicInteger(0);
       
       // 获取并自增（i = 0, 结果 i = 1, 返回 0），类似于 i++
       System.out.println(i.getAndIncrement());
       
       // 自增并获取（i = 1, 结果 i = 2, 返回 2），类似于 ++i
       System.out.println(i.incrementAndGet());
       
       // 自减并获取（i = 2, 结果 i = 1, 返回 1），类似于 --i
       System.out.println(i.decrementAndGet());
       
       // 获取并自减（i = 1, 结果 i = 0, 返回 1），类似于 i--
       System.out.println(i.getAndDecrement());
       
       // 获取并加值（i = 0, 结果 i = 5, 返回 0）
       System.out.println(i.getAndAdd(5));
       
       // 加值并获取（i = 5, 结果 i = 0, 返回 0）
       System.out.println(i.addAndGet(-5));
       
       // 获取并更新（i = 0, p 为 i 的当前值, 结果 i = -2, 返回 0）
       // 函数式编程接口，其中函数中的操作能保证原子，但函数需要无副作用
       System.out.println(i.getAndUpdate(p -> p - 2));
       
       // 更新并获取（i = -2, p 为 i 的当前值, 结果 i = 0, 返回 0）
       // 函数式编程接口，其中函数中的操作能保证原子，但函数需要无副作用
       System.out.println(i.updateAndGet(p -> p + 2));
       
       // 获取并计算（i = 0, p 为 i 的当前值, x 为参数1, 结果 i = 10, 返回 0）
       // 函数式编程接口，其中函数中的操作能保证原子，但函数需要无副作用
       // getAndUpdate 如果在 lambda 中引用了外部的局部变量，要保证该局部变量是 final 的
       // getAndAccumulate 可以通过 参数1 来引用外部的局部变量，但因为其不在 lambda 中因此不必是 final
       System.out.println(i.getAndAccumulate(10, (p, x) -> p + x));
       
       // 计算并获取（i = 10, p 为 i 的当前值, x 为参数1值, 结果 i = 0, 返回 0）
       // 函数式编程接口，其中函数中的操作能保证原子，但函数需要无副作用
       System.out.println(i.accumulateAndGet(-10, (p, x) -> p + x));
   }
   ```

2. 原子引用

   > 原子引用的作用: **保证引用类型的共享变量是线程安全的(确保这个原子引用没有引用过别人)**

   1. AtomicReference
   2. AtomicStampedReference
   3. AtomicMarkableReference

3. 原子数组

   > 保证数组内元素的线程安全

   1. AtomicIntegerArray
   2. AtomicLongArray
   3. AtomicReferenceArray

4. 字段更新器

   > 保证`多线程`访问`同一个对象的成员变量`时, `成员变量的线程安全性`。

   1. AtomicIntegerFieldUpdater
   2. AtomicLongFieldUpdater
   3. AtomicReferenceFieldUpdater

5. 原子累加器

   1. LongAdder
   2. LongAccumulator
   3. DoubleAdder
   4. DoubleAccumulator

## 原子引用ABA问题

> 采用CAS主线程仅能判断出共享变量的值与初值A是否相同，不能感知到这种从A改为B又改回A的情况，如果主线程希望：
>
> 只要有其他线程【动过了】共享变量，那么自己的cas就算失败，这时仅比较值是不够的，还需要再加一个版本号

1. 通过AtomicStampedReference判断是否更改了版本号，传入的是整型变量
2. 通过AtomicMarkableReference判断是否被修改，传入的是布尔变量

## LongAdder原理

```java
// 累加单元数组，懒惰初始化
transient volatile Cell[] cells;
// 基础值，如果没有竞争，则用cas累加这个域
transient volatile long base;
// 在cells创建或扩容时，置为1，表示加锁
transient volatile int cellsBusy;
```

**性能提升的原因很简单，就是在有竞争时，设置多个`累加单元`(但不会超过cpu的核心数)，Therad-0 累加 Cell[0]，而 Thread-1 累加Cell[1]… 最后将结果汇总。这样它们在累加时操作的不同的 Cell 变量，`因此减少了 CAS 重试失败`，从而提高性能。**

**之前AtomicLong等都是在一个`共享资源变量`上进行竞争, `while(true)`循环进行CAS重试, 性能没有`LongAdder`高**

## Unsafe

> Unsafe并不是表示线程不安全，而是表示Unsafe类中的操作不安全，因为是对于底层的操作。
>
> Unsafe对象提供了非常底层的，操作系内存、线程的方法，Unsafe对象不能直接调用，只能通过反射获得

```java
Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
theUnsafe.setAccessible(true);
Unsafe unsafe = (Unsafe) theUnsafe.get(null);
System.out.println(unsafe);
```

## 不可变类

**final的使用**

* 属性用final修饰保证该属性是只读的，不能修改
* 类用final修饰保证了类不能被继承，该类中的方法不能被重写，防止子类无意间破坏不变性

**保护性拷贝**

使用字符串时，也有一些跟修改相关的方法啊，比如`substring、replace` 等，那么下面就看一看这些方法是 如何实现的，就以 substring 为例：

```java
public String substring(int beginIndex, int endIndex) {
    if (beginIndex < 0) {
        throw new StringIndexOutOfBoundsException(beginIndex);
    }
    if (endIndex > value.length) {
        throw new StringIndexOutOfBoundsException(endIndex);
    }
    int subLen = endIndex - beginIndex;
    if (subLen < 0) {
        throw new StringIndexOutOfBoundsException(subLen);
    }
    // 上面是一些校验，下面才是真正的创建新的String对象
    return ((beginIndex == 0) && (endIndex == value.length)) ? this
            : new String(value, beginIndex, subLen);
}
```

发现其方法最后是调用String 的构造方法创建了一个新字符串，再进入这个构造看看，是否对 `final char[] value` 做出了修改：结果发现也没有，构造新字符串对象时，会生成新的 `char[] value`，对内容进行复制。
这种通过创建副本对象来避免共享的手段称之为【保护性拷贝（defensive copy）】

## final原理

```java
public class TestFinal {
	final int a = 20; 
}
```

```java
0: aload_0
1: invokespecial #1 // Method java/lang/Object."<init>":()V
4: aload_0
5: bipush 20
7: putfield #2 // Field a:I
 <-- 写屏障
10: retu
```

发现 final 变量的赋值也会通过 **putfield** 指令来完成，同样在这条指令之后也会加入`写屏障`，**保证在其它线程读到它的值时不会出现为 0 的情况。**

* 写屏障保证该屏障之前的，对共享变量的改动都会同步到主存中。
* 写屏障会确保指令重排序时，不会将写屏障之前的代码排在写屏障之后

## 享元模式

享元模式简单理解就是重用数量有限的同一对象，比如字符串常量池，包装类常量池，线程池以及字符串连接池都运用了享元模式的思想。

## 线程池

### 线程池的好处

1. 降低资源消耗。通过重复利用已创建的线程来降低线程创建和销毁所带来的消耗。
2. 提高响应速度。当任务到达时，如果有空闲线程，任务可以不需要等到线程创建就直接运行。
3. 提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

### 线程池状态

- ThreadPoolExecutor 使用 int 的高 3 位来表示线程池状态，低 29 位表示线程数量。使用一个AtomicInteger来表示状态和数量，**可以通过一次CAS同时更改两个属性的值**。

|  状态名称  | 高3位的值 |                        描述                         |
| :--------: | :-------: | :-------------------------------------------------: |
|  RUNNING   |    111    |        接收新任务，同时处理任务队列中的任务         |
|  SHUTDOWN  |    000    |       不接受新任务，但是处理任务队列中的任务        |
|    STOP    |    001    |    中断正在执行的任务，同时抛弃阻塞队列中的任务     |
|  TIDYING   |    010    | 任务执行完毕，活动线程为0时，即将进入TERMINATED状态 |
| TERMINATED |    011    |                      终结状态                       |

### ThreadPoolExecutor参数

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)

```

* corePoolSize：核心线程数
* maximumPoolSize：最大线程数
  * maximumPoolSize - corePoolSize = 救急线程数
  * **救急线程在没有空闲核心线程和任务队列满了的情况下才会创建使用**
* keepAliveTime：救急线程空闲时的最大空闲时间
* unit：时间单位，针对救急线程
* workQueue：阻塞队列
  * 有界阻塞队列：ArrayBlockingQueue
  * 无界阻塞队列：LinkedBlockingQueue
  * 最多只有一个任务的阻塞队列：SynchronizedQueue
  * 优先队列：PriorityBlockingQueue
* ThreadFactory：线程工厂（给线程取名字）
* handler：拒绝策略（当活动线程数==最大线程数且阻塞队列满的情况下采取的策略）

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/20210202214622633.png)



### 拒绝策略

> 当活动线程数等于最大线程数且阻塞队列满的情况下采取的策略

JDK提供了四种实现

1. **AbortPolicy终止策略**：丢弃该任务并抛出RejectedExecutionException异常。**这是默认策略**
2. **DiscardPolicy丢弃策略**：丢弃任务，但是不抛出异常。如果任务队列已满，则后续提交的任务都会被丢弃，且是静默丢弃。
3. **DiscardOldestPolicy弃老策略**：丢弃队列最前面的任务，然后重新提交被拒绝的任务
4. **CallerRunsPolicy调用者运行策略**：由调用者线程自行处理该任务

### Executors创建的线程池

> 由`Executors类`提供的工厂方法来创建线程池！`Executors` 是Executor 框架的工具类
>
> 一般不适用，而是直接使用ThreadPoolExecutor构造方法



`newFixedThreadPool`

```java
public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>(),
                                  threadFactory);
}
```

**特点**

1. 核心线程数 == 最大线程数（没有救急线程被创建），因此也无需超时时间
2. `阻塞队列是无界的，可以放任意数量的任务`
3. **适用于任务量已知，相对耗时的任务**



`newCachedThreadPool`

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

特点

* 没有核心线程，最大线程数为Integer.MAX_VALUE，所有创建的线程都是救急线程 (可以无限创建)，空闲时生存时间为60秒
* 阻塞队列使用的是SynchronousQueue
  * SynchronousQueue是一种特殊的队列
    * 没有容量，没有线程来取是放不进去的
    * 只有当线程取任务时，才会将任务放入该阻塞队列中
* 整个线程池表现为线程数会根据任务量不断增长，没有上限，当任务执行完毕，空闲 1分钟后释放线程。 适合任务数比较密集，但每个任务执行时间较短的情况

`newSingleThreadExecutor`

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

使用场景：

1. 希望多个任务排队执行。线程数固定为 1，任务数多于 1 时，会放入无界队列排队。 任务执行完毕，这唯一的线程也不会被释放。
2. 区别：
   1. 和自己创建单线程执行任务的区别：自己创建一个单线程串行执行任务，如果任务执行失败而终止那么没有任何补救措施，而`newSingleThreadExecutor`线程池还会新建一个线程，保证池的正常工作
   2. `Executors.newSingleThreadExecutor()` 线程个数始终为1，不能修改
      1. FinalizableDelegatedExecutorService 应用的是装饰器模式，只对外暴露了 `ExecutorService `接口，因此不能调用 `ThreadPoolExecutor `中特有的方法
3. 和`Executors.newFixedThreadPool(1)` 初始时为1时的区别：`Executors.newFixedThreadPool(1)` 初始时为1，以后还可以修改，对外暴露的是 ThreadPoolExecutor 对象，可以强转后调用 setCorePoolSize 等方法进行修改

### 执行 execute()方法和 submit()方法的区别是什么呢？

> 就像runnable()和callable()的区别，submit()有返回值返回一个Future的对象。

### 线程池创建多少线程合适

> 下面两点只是纯理论说法，具体个数要是需要测试得到

1. CPU密集型

   通常采用 **`cpu 核数 + 1`** 能够实现最优的 CPU 利用率，+1 是保证当线程由于页缺失故障（操作系统）或其它原因导致暂停时，额外的这个线程就能顶上去，保证 CPU 时钟周期不被浪费

2. IO密集型

   CPU 不总是处于繁忙状态，例如，当你执行业务计算时，这时候会使用 CPU 资源，但当你执行 I/O 操作时、远程RPC 调用时，包括进行数据库操作时，这时候 CPU 就闲下来了，你可以利用多线程提高它的利用率。通过CPU的利用率计算得到。

## ThreadLocal

1. ThreadLocal是Java所提供的线程本地存储机制，可以利用该机制将数据**缓存在某个线程内部**，该线程可以在任何时刻，任意方法中获取缓存的数据
2. ThreadLocal底层是通过ThreadLocalMap来实现的，每个Thread对象（注意不是ThreadLocal对象）中都存在一个ThreadLocalMap，Map的key为ThreadLocal对象，Map的value为需要缓存的值
3. 如果在线程池中使用ThreadLocal会造成内存泄漏，因为当ThreadLocal对象使用完之后，应该要把设置的key，value也就是Entry对象进行回收，但线程池中的线程不会回收，而线程对象是通过强引用指向ThreadLocalMap，ThreadLocalMap也是通过强引用指向Entry对象，线程不被回收，Entry对象就不会被回收，从而出现内存泄漏，解决办法是，当使用了ThreadLocal对象之后，手动调用ThreadLocal的remove方法，手动清除Entry对象。



## CopyOnWriteArrayList

CopyOnWriteArrayList是java.util.concurrent包提供的方法，它实现了读操作无锁，写操作则通过操作操作底层数组的新副本来实现（将之前的ArrayList拷贝一份，写操作在该副本上进行，在完成写之前，需要对写加锁，写操作完成后，将有来的引用指向新副本），是一种读写分离的并发策略。

CopyOnWrite并发容器适用于对于绝大部分访问都是读，且只是偶尔写的并发场景。

**get弱一致性**

## ConcurrentHashMap

> 一下都是基于JDK 8

对于JDK 1.7而言，ConcurrentHashMap和HashMap都是基于数组和链表实现的。不同在于ConcurrentHashMap有大数组和小数组，大数组就是Segment数组，小数组是HashEntry数组。Segment继承了ReentranceLock，因此具有可重入锁的特性，这样的话就可以保证多线程同时访问的线程安全问题。ConcurrentHashMap的线程安全是基于Segment加锁的基础上。

对于JDK 1.8而言，CoucurrentHashMap和HashMap的实现方式都是一样的，都是基于Node数组+链表+红黑树。当链表长度大于8并且Node数组长度大于64的时候，链表就会转换为红黑树。它的线程安全是由CAS+volatile和synchronized来实现的。比如在put操作中，如果链表头节点为空，则通过CAS创建链表头节点，如果链表头节点不为空则通过synchronized来加锁遍历链表。这样加锁的好处是对于链表头节点加锁，相比于对Segment加锁，锁的粒度更小，并发性能大大提升。

**重要属性和内部类**

```java
// 默认为0
// 当初始化时，为-1
// 当扩容是，为-(1 + 扩容线程数)
// 当初始化或扩容完成后，为下一次扩容的阈值大小
private transient volatile in sizeCtl;

// 整个ConcurrentHashMap就是一个Node[]
static class Node<K, V> implements Map.Entry<K, V> {}

// hash表
transient volatile Node<K, V>[] table;

// 扩容时 新的 hash表
private transient volatile Node<K, V>[] nextTable;

// 扩容时如果某个bin迁移完毕，用FordwardingNode作为旧table bin的头节点
static final class ForwardingNode<K, V> extends Node<K, V> {}

// 用在compute以及computeIfAbsent时，用来占位，计算完成后替换为普通Node
static final class ReservationNode<K, V> extends Node<K, V> {}

// 作为treebin（红黑树）的头节点，存储root和first
static final class TreeBin<K, V> extends Node<K, V> {}

// 作为treebin的节点，存储parent，left，right
static final class TreeNode<K, V> extends Node<K, V> {}
```

> `ForwardingNode`的理解
>
> ForwardingNode出现在扩容时，下图是旧的hash表，从右向左迁移bin，该节点迁移完成后加入ForwardingNode作为当前节点的头节点。如果在扩容过程中其他线程来get，get到了ForwardingNode，那么这个线程就回到新的链表中get。如果扩容过程中，其他线程来put，put到了ForwardingNode，此时会帮忙扩容。
>
> ![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/20220421103901.png)

**构造器分析**

实现了懒惰初始化，在构造方法中仅仅计算了table的大小，以后在第一次使用时才会真正创建。

```java
public ConcurrentHashMap(int initialCapacity, float loadFactor, int concurrencyLevel) {
    if (!(loadFactor > 0.0f) || initialCapacity < 0 || concurrencyLevel <= 0)
        throw new IllegalArgumentException();
    if (initialCapacity < concurrencyLevel)   // Use at least as many bins
        initialCapacity = concurrencyLevel;   // as estimated threads
    long size = (long)(1.0 + (long)initialCapacity / loadFactor);
    // tableSizeFor是为了保证计算的大小是2^n
    int cap = (size >= (long)MAXIMUM_CAPACITY) ?
        MAXIMUM_CAPACITY : tableSizeFor((int)size);
    this.sizeCtl = cap;
}
```

**get流程**

> 全程没有加锁

```java
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    // spread方法能保证返回结果是正数
    int h = spread(key.hashCode());
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {
        // 如果头节点已经是要查找的key
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                return e.val;
        }
        // hash为负数表示该bin在扩容中或是treebin，这时调用find方法来查找
        else if (eh < 0)
            return (p = e.find(h, key)) != null ? p.val : null;
        // 正常遍历链表，用equals来比较
        while ((e = e.next) != null) {
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
    return null;
}
```

**put流程**

```java
public V put(K key, V value) {
    return putVal(key, value, false);
}

/** Implementation for put and putIfAbsent */
final V putVal(K key, V value, boolean onlyIfAbsent) {
    if (key == null || value == null) throw new NullPointerException();
    // spread方法会综合高位地位，具有更好的hash性
    int hash = spread(key.hashCode());
    int binCount = 0;
    for (Node<K,V>[] tab = table;;) {
        // f是链表头节点
        // fh是链表头结点的hash
        // i是链表在table中的下标
        Node<K,V> f; int n, i, fh;
        //要创建table
        if (tab == null || (n = tab.length) == 0)
            // 初始化table使用了cas，无需synchronized创建成功，进入下一轮循环
            tab = initTable();
        // 要创建链表头节点
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            // 添加链表头节点使用了cas，无需synchronized
            if (casTabAt(tab, i, null,
                         new Node<K,V>(hash, key, value, null)))
                break;                   // no lock when adding to empty bin
        }
        // 帮忙扩容
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        else {
            V oldVal = null;
            // 锁住链表头节点
            synchronized (f) {
                // 再次确认链表头节点没有被移动
                if (tabAt(tab, i) == f) {
                    // 链表
                    if (fh >= 0) {
                        binCount = 1;
                        // 遍历链表
                        for (Node<K,V> e = f;; ++binCount) {
                            K ek;
                            // 找到相同的key
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                // 更新
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            // 已经是最后的节点了，新增Node，追加至链表尾
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key,
                                                          value, null);
                                break;
                            }
                        }
                    }
                    // 红黑树
                    else if (f instanceof TreeBin) {
                        Node<K,V> p;
                        binCount = 2;
                        // putTreeVal会看key是否已经在树中，是，则返回对应的TreeNode
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                       value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)
                    // 如果链表长度大于等于阈值8，进行链表转为红黑树
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    // 增加size计数，其中用到的原理和LongAdder差不多使用了Cell[]，设置了多个累加单元
    addCount(1L, binCount);
    return null;
}
```

**size计算流程**

size计算实际发生在put，remove改变集合元素的操作之中

* 没有竞争发生，向baseCount累加计数
* 有竞争发生，新建counterCells，象棋中的一个cell累加计数
  * counterCells初始有两个cell
  * 如果技术竞争比较激烈，会创建新的cell来累加计数

## AQS

> 以下是面向面试
>
> 基于[死磕 java同步系列之AQS终篇](https://juejin.cn/post/6844903873329496077)改编

### AQS是什么

AQS的全称是`AbstractQueuedSynchronizer`，是一个抽象类。它为Java中大部分锁和同步器提供一个基础框架，其中运用了设计模式中的`模板方法`。像`ReentrantLock`，`ReentrantReadWriteLock`，`Semaphore`，`CountDownLatch`都继承了该抽象类。

### 状态变量state

AQS中定义了一个状态变量state，它有以下两种使用方法：

1. 互斥锁

   当AQS只实现为互斥锁的时候，只要成功地通过CAS操作将state的值从0变为1就获取了锁，可重入是通过不断通过CAS操作将state的值+1实现的。当可重入时，释放锁的时候也需要将state减为0。

2. 互斥锁+共享锁

   当AQS需要同时实现为互斥锁+共享锁的时候，低16为存储互斥锁状态，高16位存储共享锁的状态，主要用于实现读写锁，比如`ReentrantReadWriteLock`。

   互斥锁是一种独占锁，每次只允许一个线程独占，且当一个线程独占时，其他线程将无法再获取互斥锁及共享锁，但是它自己可以获取共享锁（意思是互斥锁可以降级为共享锁，比如`ReentrantReadWriteLock`中的写锁可以降级为读锁）。

   共享锁允许同时多个线程占有，只要有一个线程占有了共享锁，所有线程（包括自己）都将无法再获取互斥锁，但是可以获取共享锁

### AQS队列

AQS中维护了一个队列，获取锁失败的线程都将进入到这个队列中排队，等待所释放后唤醒下一个排队的线程。

在互斥模式下唤醒的是下一个线程，如果是互斥锁+共享锁的情况下，比如`ReentrantReadWriteLock`，**唤醒下一个线程后如果发现该线程占有的是共享锁，那么会在队列中再往后判断下一个节点的线程时候占有的是共享锁，如果是共享锁的话会将连着的占有共享锁的线程一同释放，达到一种并发读的效果**。

比如下图中t2和t3就占有共享锁，当t1释放锁t2被唤醒后，会连同t3一起唤醒。

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/20200719171513-717513.png)

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/20200719175534-17620.png)



### Condition队列

AQS中还有一个非常重要的内部类`ConditionObject`，它实现了Condition接口，主要用于实现条件锁。

`ConditionObject`中也维护了一个队列，这个队列主要用于等待条件的成立，当条件成立时，其他线程将signal这个队列中的元素，将其移动到AQS的队列中，等待占有锁的线程释放后被唤醒。

Condition典型的运用场景是在`BlockingQueue`中的实现，当队列为空时，获取元素的线程阻塞在notEmpty条件上，一旦队列中添加了一个元素，将通知notEmpty条件，将其队列中的元素移动到AQS队列中等待被唤醒。

### 模板方法

AQS这个抽象类把模板方法运用地炉火纯青，它里面定义了一系列的模板方法，比如下面这些：

```java
// 获取互斥锁
public final void acquire(int arg) {
    // tryAcquire(arg)需要子类实现
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
// 获取互斥锁可中断
public final void acquireInterruptibly(int arg)
        throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
    // tryAcquire(arg)需要子类实现
    if (!tryAcquire(arg))
        doAcquireInterruptibly(arg);
}    
// 获取共享锁
public final void acquireShared(int arg) {
    // tryAcquireShared(arg)需要子类实现
    if (tryAcquireShared(arg) < 0)
     doAcquireShared(arg);
}
// 获取共享锁可中断
public final void acquireSharedInterruptibly(int arg)
        throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
    // tryAcquireShared(arg)需要子类实现
    if (tryAcquireShared(arg) < 0)
        doAcquireSharedInterruptibly(arg);
}
// 释放互斥锁
public final boolean release(int arg) {
    // tryRelease(arg)需要子类实现
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
// 释放共享锁
public final boolean releaseShared(int arg) {
    // tryReleaseShared(arg)需要子类实现
    if (tryReleaseShared(arg)) {
        doReleaseShared();
        return true;
    }
    return false;
}
```

**需要子类实现的方法**

上面一起学习了AQS中几个重要的模板方法，下面我们再一起学习下几个需要子类实现的方法：

```java
// 互斥模式下使用：尝试获取锁
protected boolean tryAcquire(int arg) {
    throw new UnsupportedOperationException();
}
// 互斥模式下使用：尝试释放锁
protected boolean tryRelease(int arg) {
    throw new UnsupportedOperationException();
}
// 共享模式下使用：尝试获取锁
protected int tryAcquireShared(int arg) {
    throw new UnsupportedOperationException();
}
// 共享模式下使用：尝试释放锁
protected boolean tryReleaseShared(int arg) {
    throw new UnsupportedOperationException();
}
// 如果当前线程独占着锁，返回true
protected boolean isHeldExclusively() {
    throw new UnsupportedOperationException();
}
```

这几个方法为什么不直接定义成抽象方法呢？

**因为子类只要实现这几个方法中的一部分就可以实现一个同步器了，所以不需要定义成抽象方法。**

## ReentrantLock

`ReentrantLock`是基于Lock接口和AQS抽象类实现的可重入锁。

### ReentrantLock与Synchronized的区别

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/412d294ff5535bbcddc0d979b2a339e6102264.png)

### ReentrantLock的公平锁和非公平锁

> `ReentrantLock`的非公平体现在，当线程想要获取锁时，先通过两次CAS操作去争抢锁，如果没抢到，当前线程再加入到队列中等待唤醒。对于队列中的线程是公平的，因为AQS中队列满足FIFO的特性。

1. 非公平锁在调用`lock`方法后，首先会调用CAS进行一次抢锁，如果这个时候锁恰好没有被占用，那么就直接获取到锁返回了
2. 非公平锁在CAS失败后，和公平锁一样都会进入到`tryAcquire`方法，在`tryAcquire`方法中，如果发现锁这个时候被释放了`（state == 0）`，非公平锁会直接CAS抢锁，但是公平锁会判断队列中是否有线程处于等待状态，如果有则不去抢锁，主动加入到队列等待唤醒。

公平锁和非公平锁就这两点区别，如果两次CAS都不成功，那么后面公平锁和非公平锁是一样的，都要进入队列等待唤醒。

相对来说，非公平锁会有更好的性能，因为它的吞吐量比较大。当然，非公平锁让获得锁的时间变得更加不确定，可能导致队列中的线程长期处于饥饿状态。

## ReentrantReadWriteLock

`ReentrantReadWriteLock`是一种读写锁，用于实现并发读。

写锁可以降级为读锁，读锁不能升级为写锁。

## StampedLock

该类自JDK 8加入，是为了进一步优化读性能，它的特点是在使用读锁和写锁时都必须配合**【戳】**来使用

**加解读锁**

```java
long stamp = lock.readLock();
lock.unlockRead(stamp);
```

**加解写锁**

```java
long stamp = lock.writeLock();
lock.unlockWrite(stamp);
```

乐观读，`StampedLock`支持`tryOptimisticRead()`方法（乐观读），读取完毕后需要做一次**戳校验**，如果校验通过，表示这期间确实没有写操作，数据可以安全使用，如果检验没通过，需要重新获取读锁，保证数据安全。

```java
long stamp = lock.tryOptimisticRead();
// 验戳
if (!lock.validate(stamp)) {
    // 锁升级
}
```

代码模拟StampedLock读和写的过程

```java
// 写过程和普通锁没什么区别，都需要全程加锁
public void write(int new Data) {
    long stamp = lock.writeLock();
    try {
        // do something
        this.data = newData;
    } finally {
        lock.unlockWrite(stamp);
    }
}
```

```java
public void read(int readTime) {
    long stamp = lock.tryOptimisticRead();
    // do something
    if (lock.validate(stamp)) {
        return data;
    }
    // stamp别修改过了，需要进行加读锁
    try {
        stamp = lock.readLock();
        // do something
        return data;
    } finally {
        lock.unlockRead(stamp);
    }
}
```

StampedLock的缺点

> 为什么StampedLock可以提升并发度的性能，但是不能取代ReentrantLock

* 不支持条件变量
* 不支持可重入

## Semaphore

信号量，用来限制能同时访问共享资源的线程上限

Semaphore有一个构造函数，可以传入一个int型整数n，表示某段代码最多可以有n个线程同时访问。

**应用**：使用Semaphore限流，在访问高峰期，**限制请求线程数量**，让请求线程阻塞，高峰期过去再释放许可。

**Semaphore的构造函数**

```java
public Semaphore(int permits) {
    sync = new NonfairSync(permits);
}

NonfairSync(int permits) {
    super(permits);
}

Sync(int permits) {
    setState(permits);
}
```

由代码可以看出，Semaphore传入的参数permits最终设置为state的个数

**加锁解锁流程**

刚开始，permits(state)为3，并且同时5个线程来获取资源

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/Semaphore1.png)

假设Thread-1，Thread-2，Thread-4 cas 竞争成功，而Thread-0和Thread-3竞争失败，进入AQS队列park阻塞

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/Semaphore2.png)

这时Thread-4释放了锁，状态如下：

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/Semaphore3.png)

接下来Thread-0竞争成功，state再次设置为0，设置自己的head节点，断开原来的head节点，unpark接下来的Thread-3节点，但是由于state=0，因此Thread-3在尝试不成功后再次进入park状态

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/Semaphore4.png)

## CountdownLatch

用来进行线程同步协作，等待所有线程完成倒计时后再恢复运行。

和Semaphore类似，构造函数传入的count值最终都会赋值给state。

```java
public CountDownLatch(int count) {
    if (count < 0) throw new IllegalArgumentException("count < 0");
    this.sync = new Sync(count);
}
```

比如可以用于王者荣耀玩家加载，只有所有玩家都加载到100%才能开始游戏。

如果需要主线程汇总结果，`CountdownLatch`就不如`future`了，主线程通过get方法可以等待其他线程的运行结果，所有线程都运行完了进行汇总。

## Cyclicbarrier

循环栅栏，用来进行线程协作，等待线程满足某个计数。构造时设置**计数个数**，每个线程执行到某个需要**“同步”**的时刻调用await()方法进行等待，当等待的线程数满足**计数个数**时，继续执行。

和`CountdownLatch`和类似，区别就是在于`Cyclibarrier`计数变为0后下次再调用可以恢复到初始设定的值。`CountdownLatch`要想恢复设定值只能重新创建新的`CountdownLatch`对象。

```java
ExecutorService executorService = Executors.newFixedThreadPool(2);
CyclicBarrier bar = new CyclicBarrier(2, () -> {
    log.debug("task1 task2 finished");
});
for (int i = 0; i < 3; i++) {
    // 计数变为0后，下次循环计数重置
    executorService.submit(() -> {
        log.debug("task1 begin...");
        try {
            bar.await(); // 2 - 1
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    });
    executorService.submit(() -> {
        log.debug("task2 begin...");
        try {
            bar.await(); // 1 - 1
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    });
}
```

**注意线程池线程数和`CyclicBarrier`的计数要一样**

比如下面这种情况，task1会优先运行2次，这样就不会达到等待统计两个线程运行结束的预期了

```java
ExecutorService executorService = Executors.newFixedThreadPool(3);
CyclicBarrier bar = new CyclicBarrier(2, () -> {
    log.debug("task1 task2 finished");
});
for (int i = 0; i < 3; i++) {
    executorService.submit(() -> {
        log.debug("task1 begin...");
        try {
            bar.await(); // 2 - 1
            Thread.sleep(1000);
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    });
    executorService.submit(() -> {
        log.debug("task2 begin...");
        try {
            bar.await(); // 1 - 1
            Thread.sleep(3000);
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    });
}
```

