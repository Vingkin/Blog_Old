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

## Redis Key没设置过期时间为什么被Redis主动删除了

Redis的内存淘汰机制使用了`allkeys-lru`或者`allkeys-random`或者`allkeys-lfu`

## Redis内存淘汰机制

当Redis已用内存超过`maxmemory`限定时，触动主动清理策略。

主动清理策略再Redis4.0 之前一共实现了6中内存淘汰机制，在4.0之后，又增加了2种策略，总共8种：

针对设置了过期时间的key做处理：

* **volatile-lru（least recently used）：** 从已设置过期时间的数据集(`server.db[i].expires`)中挑选最近最少使用的数据淘汰（最常用）
* **volatile-ttl：** 从已设置过期时间的数据集中挑选即将要过期的数据淘汰
* **volatile-random：** 从已设置过期时间的数据集中任意选择数据淘汰
* **volatile-lfu（least frequently used）：** 从已设置过期时间的数据集中挑选最不经常使用的数据淘汰（访问次数最少）

针对所有的key做处理：

* **allkeys-lru：（least recently used）：** 当内存不足以容纳新写入数据时，在键空间中，移出最近最少使用的key（最常用）
* **allkeys-random：** 从数据集中任意选择数据淘汰
* **allkeys-lfu（least frequently used）：** 当内存不足以容纳新写入的数据时，在键空间中移出最不经常使用的key

不处理：

* **no-eviction：** 禁止驱逐数据，也就是说当内存不足以容纳新写入数据时，新写入操作会报错。（基本没人使用）

> 绝大多数情况都是用LRU策略，当存在大量的热点缓存数据时，LFU可能更好点，以访问次数的多少作为参考点。

## 删除Key的命令会阻塞Redis吗

`DEL key [key ...]`

时间复杂度：

`O(N)`，其中N为被删除key的数量

删除单个字符串类型的key，时间复杂度为`O(1)`

删除单个列表、集合、有序集合或哈希表类型的key，时间复杂度为`O(M)`，其中M为以上数据类型种元素的数量。

**当删除的key是所占内存很大时，不管是string还是其他的数据类型，都有可能会阻塞Redis**

## Redis高可用方案

### 主从模式

不能保证高可用，当master节点挂掉后需要运维介入切换节点，一般不使用

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E4%B8%BB%E4%BB%8E%E6%A8%A1%E5%BC%8F.png)

### 哨兵模式

在redis 3.0以前的版本要实现集群一般时借助哨兵sentinel工具来监控master节点的状态，如果master节点异常，则会做出主从切换，将某一台slave作为master，哨兵的配置略微复杂，并且性能和高可用性等各方面表现一般，特别时主从切换的瞬间存在**访问瞬断**的情况，而且哨兵模式只有一个主节点对外提供服务，没法支持很高的并发（单节点理论支持最高并发量为10万），且单个主节点内存也不宜设的过大（一般为10G），否则会导致持久化文件过大，影响数据恢复或主从同步的效率。

sentinel，哨兵是redis集群中非常重要的一个组件，主要有以下功能：

* **集群监控**：负责监控redis master和slave进程是否正常工作
* **消息通知**：如果某个redis实例有故障，那么哨兵负责发送消息作为报警通知给管理员
* **故障转移**：如果master node挂掉了，会自动转移到slave node上。故障转移时，判断一个master node是否宕机了，需要大部分的哨兵都同意才行，涉及到了分布式选举。
* **配置中心**：如果故障转移发生了，通知client客户端新的master地址

哨兵用于实现redis集群的高可用，本身也是分布式的，作为一个哨兵集群去运行，互相协同工作。

* 即使部分哨兵节点挂掉了，哨兵集群还是能正常工作的
* 哨兵通常需要3个实例，来保证自己的健壮性
* 哨兵 + redis主从的部署架构，是不保证数据零丢失的，只能保证redis集群的高可用性

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E5%93%A8%E5%85%B5%E6%A8%A1%E5%BC%8F.png)

### 集群模式

Redis集群是由多个**主从节点群组成的分布式服务器群**，它具有**复制，高可用和分片**的特性。Redis集群不需要sentine哨兵也能完成节点移出和故障转移的功能。需要将每个节点设置成集群模式，这种集群模式没有中心节点，可水平扩展，据官方文档称可以线性扩展到上万个节点（官方推荐不超过1000个）。Redis集群的性能和高可用性均优于之前版本的哨兵模式，且集群配置非常简单。

* 通过hash的方式，将数据分片，每个节点均衡存储一定哈希槽（哈希值）区间的数据
* 每份数据分片会存储在多个互为主从的多节点上
* 数据先写入主节点，再同步到从节点（支持配置为阻塞同步）
* 同一分片多个节点间的数据不保持强一致性
* 读取数据时，当客户端操作的key没有分配在该节点上时，redis会返回转向指令，转向正确的节点
* 扩容时，需要把旧节点的数据迁移一部分到新节点

在redis cluster架构下，每个redis节点都要开放两个端口号，一个用于连接，一个用于节点间通信

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/%E9%AB%98%E5%8F%AF%E7%94%A8%E9%9B%86%E7%BE%A4%E6%A8%A1%E5%BC%8F.png)

## Reids集群模式下数据hash分片算法

Redis Cluster将所有数据划分为16384个槽位，每个节点负责其中一部分槽位。槽位的信息存储于每个节点中。

当Redis Cluster的客户端来连接集群时，它也会得到一份集群的槽位配置信息并将其缓存在客户端本地。这样当客户端要查找某个key时，可以根据槽位定位算法定位到目标节点。

**槽位定位算法**

Cluster默认会对key使用crc16算法进行hash得到一个整数值，然后用这个整数值对16384进行取模来得到具体槽位。

`HASH_SLOT = CRC16(key) % 16384`

再根据槽位值和Redis节点的对应关系就可以定位到key具体是落在哪个Redis节点上

## Redis执行命令出现死循环Bug

如果想随机查看Redis中的一个key，Redis里面有一个`RANDOMKEY`命令可以从Redis中随机取出一个key，这个命令可能导致Redis死循环阻塞。

**出现这个问题的原因主要还是在于Redis的过期数据删除策略**

`RANDOMKEY`随机拿出一个key后，首先会检查该key是否过期，如果过期，则会先删除这个key然后重新选取，直到找到一个未过期的key返回。如果Redis中有大量的key已经过期，但是没有被即使清理，那么这个循环会持续很久才结束。这个流程是发生在master节点中的。

如果发生在slave节点中，那么问题会更严重。slave是不会主动清理过期key的，当一个key过期时，master会先清理删除它，然后向slave发送一个DEL命令，告知slave也删除这个key，以此达到主从库的数据一致性。

**假设Redis中存在大量已过期但是未被清理的key，在slave中执行RANDOMKEY时，因为不会删除过期key，则有可能无限制的命中过期key，陷入死循环，导致Redis实例卡死。**

这其实是Redis 5.0之前的一个Bug，修复方案就是给`RANDOMKEY`增加最多执行次数，无论是否找到key，都返回。

## 主从切换导致缓存雪崩具体场景

> 为什么要保证主从节点机器时钟一致

我们假设，slave的机器时钟比master走得快很多

此时，Redis master里设置了过期时间的key，从slave角度来看，可能会有很多在master里没过期的数据其实已经过期了

如果此时操作主从切换，把slave提升为新的master

slave成为新的master后，就会开始大量清理过期key，此时就会导致以下结果：

1. master大量清理过期key，主线程可能会发生阻塞，无法及时处理客户端请求
2. Redis中数据大量过期，引发缓存雪崩甚至系统崩溃

当master和slave机器始终严重不一致时，对业务的影响非常大。**所以一定要保证主从节点的机器时钟一致性。**

