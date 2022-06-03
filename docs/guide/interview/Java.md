---
title: Java基础
author: Vingkin
date: 2022-4-24
---

## 接口和抽象类有什么共同点和区别

共同点：

* 都不能被实例化
* 都可以包含抽象方法
* 都可以有默认的实现方法（Java 8可以用default关键字在接口中定义默认方法）

区别：

* 接口主要用于对类的行为进行约束，实现了某个接口就有了相应的行为。抽象类主要用于代码复用，强调的是所属关系
* 一个类只能继承一个抽象类，但是能实现多个接口
* 接口中的成员变量只能是public static final类型的，不能被修改且必须有初始值，而抽象类的成员变量默认default，可在子类中被重新定义，也可被重新赋值。

## equals和hashcode

>  equals和hashCode都是Object类中的方法。hashCode是为了获取对象的哈希码，这个哈希码的作用是确定对象在哈希表中的索引位置

举个HashSet插入对象的例子，HashSet首先会根据对象的hashcode值来判断对象加入的位置，同时也会与其他已经加入的对象的hashcode值进行比较，如果没有相符的hashcode，HashSet会假设对象没有重复出现。但是如果发现有相同hashcode值的对象，这时会调用equals方法来检查hashcode相等的对象是否真的相同。如果两者相同，HashSet就不会让其加入操作成功。如果不同的话，就会重新散列到其他位置。我们这样可以大大减少了equals的次数，相应就大大提高了执行速度。

## ==与equals的区别

* 对于基本类型来说，==比较的是值是否相等
* 对于引用类型来说，==比较的是两个引用是否指向同一个对象地址
* 对于引用类型来说，equals方法如果没有被重写，equals与==作用一样，如果重写了，比如String则比较的具体内容是否相等。

## 包装类型的常量池技术

Byte,Short,Integer,Long这四种包装类默认创建了数值[-128,127]的相应类型的缓存数据，Character创建了数值在[0,127]范围的缓存数据，Boolean直接返回True/False

## 自动装箱与自动拆箱

**装箱：** 将基本类型用他们的引用类型包装起来，调用包装类的`valueOf()`方法

**拆箱：** 将包装类型转换为基本数据类型，调用了`xxxValue()`方法

```java
Integer i = 10; // 自动装箱
int n = i; // 自动拆箱
```

## ArrayList和LinkedList的区别

1. 是否保证线程安全：ArrayList和LinkedList都是不同步的，也就是**都不保证线程安全**
2. ArrayList底层采用的是**Object数组**，LinkedList采用的是**双向链表**（JDK 1.6之前采用的是双向循环链表，JDK 1.7取消了循环）
3. 数组和链表在插入删除方面的区别（注意两种结构都需要考虑是在中间操作还是在两端操作）
4. 数组支持随机访问，链表不支持随机访问

## ArrayList的扩容机制

1. new的时候可以给ArrayList设置数组的长度值，也可以不设置，不设置的情况下，在第一次add时会默认赋值长度为10
2. 每次add操作都会对比add后的长度值与数组原有的长度值，判断是否要扩容
3. 如果需要扩容，默认1.5倍长度进行扩容，先会去创造一个新的长度的数组，再将原来数组赋值过去，完成扩容操作
4. 扩容的时候还是会将扩容后的数据长度与`Integer.MAX_VALUE`进行对比，以防越界
5. 工作时，我们尽可能给ArrayList一个初始长度，避免扩容操作

## List删除元素问题



## Comparable和Comparator的区别

> 两者都是用于自定义排序的接口

* Comparable接口出自java.lang，用compareTo(Object obj)方法来排序
* Comparator接口出自java.util，通过compare(Object obj1, Object obj2)来进行排序

## HashSet、LinkedHashSet和TreeSet三者的异同

1. HashSet、LinkedHashSet和TreeSet都是Set接口的实现类，都能保证数据的唯一性，并且都不是线程安全的
2. 三者的主要区别在于底层数据结构不同，HashSet底层采用的时哈希表（基于HashMap实现），LinkedHashSet底层采用的是链表和哈希表，TreeSet底层采用红黑树
3. 底层数据结构的不同导致应用场景也有所不同。HashSet用于不需要保证元素插入和取出顺序的场景，LinkedHashSet用于保证元素的插入和取出满足FIFO场景，TreeSet用于支持元素的自定义排序场景。

## HashMap的底层实现

> JDK 1.8之前链表采用头插法，1.8采用了尾插法

JDK 1.8之前HashMap底层采用的是**数组和链表**。HashMap通过key的hashcode经过**扰动函数**后得到hash值，然后通过`(n-1)&hash`判断当前元素的存放位置（这里n指的是数组的长度），如果当前位置存在元素的话，就判断该元素与要存入的hash以及key是否相同，如果相同的话直接覆盖，不相同就通过拉链表解决冲突。

所谓扰动函数指的就是HashMap中的hash方法。目的是为了防止一些实现比较差的hashcode方法，换句话说使用扰动函数之后可以减少碰撞

JDK 1.8之后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）（将链表转换成红黑树之前会判断，如果当前数组的长度小于64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间。

> (n-1)&hash的规则决定在扩容后需要对已有元素进行重新hash

## HashMap的扩容机制

> 针对JDK 1.8

* 容量（capacity）：hash表数组的大小，默认为16
* 初始化容量（initial capacity）：创建hash表时指定的初始容量
* 尺寸（size）：当前hash表中的元素数量
* 负载（load）：`load = size / capacity`。负载为0时，表示空的hash表。轻负载的hash表具有冲突少、适宜插入和查询的特点
* 负载因子（load factor）：决定hash表的最大填满程度（范围是0-1，默认为0.75）

当hash表的负载达到了指定的“负载因子”值时，hash表就会加倍扩容，将原有的对象**重新分配**，放入新的hash表中，这成为rehashing。rehashing过程很复杂，而且非常消耗性能，所以指定一个合适的“负载因子”值很重要。

## HashMap在JDK 1.7的死链问题

> [jdk1.7中 hashmap为什么会发生死链?](https://www.zhihu.com/question/394039290)
>
> 发生在多线程数组扩容的的情况下

## BIO，NIO，AIO

> [理解什么是BIO/NIO/AIO](https://segmentfault.com/a/1190000037714804)

### BIO

**BIO基本介绍**

* Java BIO就是传统的Java IO编程，其相关的类和接口在java.io包下
* BIO(Blocking I/O)：**同步阻塞**，服务器实现模式为一个连接一个线程，即客户端有连接请求时，服务器就会需要启动一个线程来进行处理。如果这个连接不做任何事情就会造成不必要的开销。可以通过线程池进行改善。

![BIO模型](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/BIO%E6%A8%A1%E5%9E%8B.webp)

**BIO问题分析**

1. 每个请求都需要创建独立的线程，与对应的客户端进行数据处理
2. 当并发数很大时，需要创建大量的线程来处理连接，系统资源占用较大
3. 连接建立后，如果当前线程暂时没有数据可读，则当前线程会一直阻塞在Read操作上。或者说连接后无事可做，这些都会造成线程资源的浪费

### NIO

**NIO基本介绍**

1. Java NIO全称Java non-blocking IO，指的是JDK提供的新的API。从JDK1.4开始，JAVA提供了一系列改进的I/O的新特性，被统称为NIO，是**同步非阻塞**的。
2. NIO相关类都放在了java.nio包下，并对原java.io包中很多类进行了改写
3. NIO有三大核心部分：**Channel（管道）、Buffer（缓冲区）、Selector（选择器）**
4. NIO是**面向缓冲区编程**的。数据读取到了一个它稍微处理的缓冲区，需要时可在缓冲区中前后移动，这就增加了处理过程中的灵活性，使用它可以提供非阻塞的高伸缩性网络。
5. Java NIO的非阻塞模式，使一个线程从某通道发送请求读取数据，但是它仅能得到当前可用数据，如果目前没有可用数据时，不会保持线程阻塞，直到数据变为可以读取之前，该线程可以做其他事情。非阻塞写入同理。

![BIO模型](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/NIO%E6%A8%A1%E5%9E%8B.webp)

**NIO三大核心组件**

1. 每个Channel对应一个Buffer
2. 一个线程对应一个Selector，一个Selector对应多个Channel
3. 上图反应了有三个Channel注册到了该Selector
4. 程序切换到哪个Channel是由**事件（event）**决定的
5. Selector会根据不同的事件，在各个通道上切换
6. Buffer就是一个内存块，底层是有一个数组
7. 数据的读取和写入是通过Buffer（双向的），但是需要flip()切换读写模式。而BIO是单向的，要么是输入流要么是输出流

![NIO三大核心组件](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/NIO%E4%B8%89%E5%A4%A7%E6%A0%B8%E5%BF%83%E7%BB%84%E4%BB%B6.webp)

**Buffer**

* 缓冲区本质上是一个可以读写数据的内存块，可以理解为是一个**容器对象（数组）**，该对象提供了一组方法，可以更轻松地使用内存块，缓冲区对象内置了一些机制，能够跟踪和记录了缓冲区的状态变化情况。
* Channel读取或者写入数据必须通过Buffer
* Buffer的子类中通过一个对应类型的数组用来存放数据
* Buffer常用子类：`ByteBuffer`,`ShortBuffer`,`CharBuffer`,`IntBuffer`,`LongBuffer`,`DoubleBuffer`,`FloatBuffer`

|   属性   |                             描述                             |
| :------: | :----------------------------------------------------------: |
| capacity | 容量，即可以容纳的最大数据量；在缓冲区被创建的时候就被指定，无法修改 |
|  limit   | 表示缓冲区的当前终点，不能对缓冲区超过limit的位置进行读写操作，但是limit是可以修改的 |
| position | 当前位置，下一个要被读或者写的索引，每次读写缓冲区数据都会改变该值，为下次读写做准备 |
|   mark   |         标记当前position位置，让reset后回到标记位置          |

**Channel**

NIO的通道类似于流，但是有如下区别：

1. 通道是双向的可以进行读写，但是流是单向的只能读或者写
2. 通道可以实现异步读写数据
3. 通道可以从缓冲区读取数据，也可以写入数据到缓冲区

常用的Channel有：`FileChannel`，`DatagramChannel`，`SocketChannel`，`SocketServerChannel`

**Selector**

1. Java的NIO使用了非阻塞的I/O方式。可以用一个线程处理若干个客户端连接，就会使用到Selector
2. Selector能够检测到多个注册通道上是否有事件发生（多个Channel以事件的形式注册到同一个Selector），如果有事件发生，便获取事件然后针对每个事件进行相应的处理
3. 只有在连接真正有读写事件发生时，才会进行读写，减少了系统开销，并且不必为每个连接都创建一个线程，不用维护多个线程。
4. 避免了多线程之间上下文切换导致的开销。

### AIO

JDK7引入了Asynchronous I/O，即AIO。在进行I/O编程时，通常用到两种模式：Reactor和Proactor。Java的NIO就是Reactor，当有事件触发时，服务器得到通知，进行相应的处理。

AIO叫做**异步非阻塞**IO，引入了异步通道的概念，采用了Proactor模式，简化了程序编写，有效的请求才会启动线程，特点就是先由操作系统完成后才通知服务端程序启动线程去处理，一般用于连接数较多且连接时长较长的应用。

**Reactor和Proactor**

* 两种IO多路复用方案：Reactor和Proactor
* Reactor模式是基于同步IO，Proactor模式是和异步IO相关的

### 总结

**BIO、NIO、AIO使用场景分析**

* BIO方式适用于**连接数较小且固定**的架构，这种方式对服务器资源要求比较高，并发局限于应用中，JDK1.4之前唯一的选择，程序较为简单容易实现
* NIO方式适用于**连接数目多且连接比较短**的架构，比如聊天服务器等等，JDK1.4开始支持
* AIO方式适用于**连接数目多且连接比较长**的架构，比如相册服务器，充分调用OS参与并发操作，JDK1.7开始支持

**NIO、BIO对比**

1. BIO是以流的形式处理数据，而NIO以块（Buffer）的方式处理数据，块IO的效率比流IO高很多
2. BIO是阻塞的，而NIO是非阻塞的
3. BIO基于字节流和字符流进行操作，而NIO基于Channel和Buffer进行操作，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。Selector用于监听多个通道事件，因此使用**单个线程可以监听多个客户端通道**

