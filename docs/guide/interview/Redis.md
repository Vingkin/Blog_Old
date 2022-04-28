---
title: Redis
author: Vingkin
date: 2022-4-24
---

## Redis常见数据结构以及使用场景

**string**

介绍：虽然Reids是C语言编写的，但是其string底层并没有采用C的字符串，而是自己构建了一种简单动态字符串

常用命令：set，get，strlen，exists，decr，incr，setex。。。

应用场景：一般用于需要计数的场景，比如用户的访问次数，热点文章的点赞数和转发数等等

**list**

介绍：底层为双向链表

常用命令：rpush，lpush，rpop，lpop，lrange，llen。。。

应用场景：消息队列

**hash**

介绍：类似于JDK1.8之前的HashMap，内部实现也差不多是数组+链表。

常用命令：hset，hmset，hexists，hget，hgetall，hkeys，hvals。。。

应用场景：系统中对象数据的存储

**set**

介绍：类似于Java中的HashSet

常用命令：sadd，spop，smembers，sismember，scard，sinterstore，sunion等

应用场景：集合运算，比如集合的交集和并集

**sorted set**

介绍：和set相比增加了一个权重参数score，使得集合中的元素可以根据score进行有序排列。

常用命令：zadd，zcard，zscore，zrange，zrevrange，zrem。。。

应用场景：需要对数据根据某个权重进行排序的场景。比如直播间礼物排行榜。

## Redis到底是单线程还是多线程

Redis 6.0版本之前的**单线程指的是其网络I/O和键值对读写是有一个线程完成的**。也就是只有网络请求模块和数据操作模块是单线程的，而其他的持久化、集群数据同步等，其实是由额外的线程执行的

Redis 6.0引入的**多线程指的是网络I/O采用了多线程**，而键值对读写命令仍然是单线程处理的，所以Redis仍然是并发安全的

## Redis单线程为什么还快？

1. 命令执行基于内存操作
2. 命令执行是单线程操作，没有线程切换开销
3. 基于IO多路复用机制（epoll）提升Redis的I/O利用率
4. 搞笑的数据存储结构：全局hash表以及多种高效数据结构，比如：跳表，压缩列表，链表等等

## Redis底层数据是如何用跳表来存储的

将有序链表改造为支持类似“折半查找”的算法，可以让链表可以快速的插入、删除和查找。常用于`Sorted Set`的底层实现。

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E8%B7%B3%E8%A1%A8.png)

## Redis Key过期了为什么内存没释放

1. 设置了过期时间的key被没有设置过期时间的相同key覆盖了

   ```bash
   127.0.0.1:6379> set name vingkin ex 120
   OK
   127.0.0.1:6379> ttl name
   (integer) 119
   127.0.0.1:6379> set name vingkin
   OK
   127.0.0.1:6379> ttl name
   (integer) -1 # name被覆盖，永不过时
   ```

2. 与过期数据删除策略有关

## 过期数据删除策略

**惰性删除：** 在取出key的时候对数据进行过期检查。这样对CPU友好，但是会造成太多过期key没有被删除

**定期删除：** 每隔一段时间抽取一批key执行删除过期key操作。并且Redis底层会通过限制删除操作的时常和频率来减少删除操作对CPU的影响

定期删除对内存更加友好，惰性删除对CPU更加友好。所以Redis采用两者结合的方式进行过期数据删除



## Redis内存淘汰机制

* **volatile-lru（least recently used）：** 从已设置过期时间的数据集(`server.db[i].expires`)中挑选最近最少使用的数据淘汰
* **volatile-ttl：** 从已设置过期时间的数据集中挑选即将要过期的数据淘汰
* **volatile-random：** 从已设置过期时间的数据集中任意选择数据淘汰
* **allkeys-lru：（least recently used）：** 当内存不足以容纳新写入数据时，在键空间中，移出最近最少使用的key（最常用）
* **allkeys-random：** 从数据集中任意选择数据淘汰
* **no-eviction：** 禁止驱逐数据，也就是说当内存不足以容纳新写入数据时，新写入操作会报错。（基本没人使用）
* **volatile-lfu（least frequently used）：** 从已设置过期时间的数据集中挑选最不经常使用的数据淘汰
* **allkeys-lfu（least frequently used）：** 当内存不足以容纳新写入的数据时，在键空间中移出最不经常使用的key