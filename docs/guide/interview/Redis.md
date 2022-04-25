---
title: Redis
author: Vingkin
date: 2022-4-24
---

## 0x01 Redis常见数据结构以及使用场景

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

## 0x02 Redis单线程多线程方面

**Redis单线程为什么还快？**

1. 单线程编程更容易实现并且更容易维护
2. Redis的瓶颈不在CPU，而是在于内存和网络
3. 多线程会存在死锁以及线程上下文切换问题，会影响性能
4. I/O多路复用技术让Redis不需要创建额外的线程来监听大量客户端的连接，降低了资源消耗

## 0x03 过期数据删除策略

**惰性删除：** 在取出key的时候对数据进行过期检查。这样对CPU友好，但是会造成太多过期key没有被删除

**定期删除：** 每隔一段时间抽取一批key执行删除过期key操作。并且Redis底层会通过限制删除操作的时常和频率来减少删除操作对CPU的影响

定期删除对内存更加友好，惰性删除对CPU更加友好。所以Redis采用两者结合的方式进行过期数据删除

## 0x04 Redis内存淘汰机制

* **volatile-lru（least recently used）：** 从已设置过期时间的数据集(`server.db[i].expires`)中挑选最近最少使用的数据淘汰
* **volatile-ttl：** 从已设置过期时间的数据集中挑选即将要过期的数据淘汰
* **volatile-random：** 从已设置过期时间的数据集中任意选择数据淘汰
* **allkeys-lru：（least recently used）：** 当内存不足以容纳新写入数据时，在键空间中，移出最近最少使用的key（最常用）
* **allkeys-random：** 从数据集中任意选择数据淘汰
* **no-eviction：** 禁止驱逐数据，也就是说当内存不足以容纳新写入数据时，新写入操作会报错。（基本没人使用）
* **volatile-lfu（least frequently used）：** 从已设置过期时间的数据集中挑选最不经常使用的数据淘汰
* **allkeys-lfu（least frequently used）：** 当内存不足以容纳新写入的数据时，在键空间中移出最不经常使用的key