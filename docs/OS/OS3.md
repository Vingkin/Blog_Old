---
title: 操作系统下
author: keyhx
date: 2022-6-28
---

## 1、初识文件管理

1. 文件内部的数据组织形式

   ![image-20220521220755154](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220521220755154.png)

2. 文件组织形式

   ![image-20220521220941143](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220521220941143.png)

3. 操作系统向上提供的功能

   ![image-20220521221245106](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220521221245106.png)

   可以使用几个基本操作完成更加复杂的操作，比如：复制文件：先创建一个新的空文件夹，再把源文件读入内存，再将内存中的数据写入到新文件中

4. 文件如何存放在外存？

   ![image-20220521221810990](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220521221810990.png)

5. 其他需要操作系统实现的文件管理功能

   文件共享：使多个用户可以共享使用一个文件

   文件保护：如何保证不同的用户对文件由不同的操作权限

## 2、文件的逻辑结构

文件逻辑结构：指在用户看来，文件内部的数据应该是如何组织起来的

文件的物理结构：在操作系统看来，文件的数据是如何存放在外存中的

![image-20220522125526046](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522125526046.png)

1. 无结构文件：文件内部的数据就是一系列二进制流或字符流组成。又称“**流式文件**”。比如：.txt文件

2. 有结构文件：由一组相似的记录组成，又称为“**记录式文件**”。每条记录又由若干个数据项组成。如

![image-20220522125936141](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522125936141.png)

* 根据各条记录的长度(占用的存储空间)是否相等，又可以分为**定长记录和可变长记录**

  * 定长记录

    ![image-20220522131645588](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522131645588.png)

  * 可变长记录

    ![image-20220522131805969](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522131805969.png)

3. 顺序文件

   * 文件中的记录一个接一个的顺序排列(逻辑上)，记录**可以是定长的或可变长的**。各个记录在物理上可以**顺序存储或链式存储**

     ![image-20220522132423543](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522132423543.png)

   * 已经知道文件的起始地址，能否找到第i个记录对应的地址即能否实现随机存储，能否根据关键字实现随机查找？

     ![image-20220522134405761](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522134405761.png)

4. 索引文件

   解决的问题：对于可变长记录文件，要找到第i个记录，必须先顺序查找第i - 1个记录。

   ![image-20220522135220091](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522135220091.png)

5. 索引顺序文件

   解决问题：每个记录对应一个索引表项，因此索引表可能会很大

   ![image-20220522141420657](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522141420657.png)

   * 文件检索效率

     ![image-20220522142220989](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522142220989.png)

   * 多级索引顺序文件

     ![image-20220522142404913](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522142404913.png)

![image-20220522142638847](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522142638847.png)

## 3、文件目录

![image-20220522143959739](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522143959739.png)

1. 文件控制块

   ![image-20220522144708324](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522144708324.png)

   ![image-20220522144900273](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522144900273.png)

   需要对目录进行哪些操作？

   **搜索**：当用户需要使用一个文件的时候，系统要根据文件名搜索目录，找到该文件对应的目录项

   **创建文件**：创建一个新文件时，需要在其所属的目录中增加一个目录项

   **删除文件**：当删除一个文件时，需要在目录中删除相应的目录项

   **显示目录**：用户可以请求显示目录的内容，如显示该目录中的所有文件及相应的属性

   **修改目录**：某些文件属性保存在目录中，因此这些属性变化时需要修改相应的目录项

2. 目录结构----单级目录结构

   整个系统只建立一张目录表，每个文件占一个目录项

   ![image-20220522202312578](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522202312578.png)

3. 目录结构---两级目录结构

   早期的多用户操作系统，采用两级目录结构。分为主文件目录(MFD)和用户文件目录(UFD)

   ![image-20220522203520109](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522203520109.png)

4. 目录结构---多级目录结构(又称树形目录结构)

   ![image-20220522203842838](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522203842838.png)

   ![image-20220522204512602](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522204512602.png)

5. 目录结构---无环图目录结构

   解决的问题：树形目录结构可以很方便的对文件进行分类，层次结构清晰，也能够更有效地进行文件的管理和保护。但是，树形结构不便于实现文件的共享。

   ![image-20220522213646590](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522213646590.png)

6. 索引结点(FCB的改进)

   ![image-20220522213950345](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522213950345.png)

   ![image-20220522214100918](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522214100918.png)

![image-20220522214148310](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220522214148310.png)

## 4、文件的物理结构

1. 类似内存分页，磁盘中的存储单元也会被分为一个个“块/磁盘块/物理块”，**磁盘块的大小与内存块、页面的大小相同**

2. 内存与磁盘之间的数据交换(即读/写操作、磁盘I/O)都是以块为单位进行的，即每次读入一块，或每次写出一块

3. ![image-20220524133535599](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220524133535599.png)

4. 文件分配方式----连续分配

   * 连续分配方式要求每个文件在磁盘上占有一组连续的块

   * 优点：支持顺序访问和直接访问(即随机访问)；连续分配的文件在顺序访问时速度最快

     ![image-20220524134337470](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220524134337470.png)

     ![image-20220524134541056](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220524134541056.png)

   * 缺点：不方便文件拓展；存储空间利用率低，会产生磁盘碎片

     ![image-20220524135042854](C:\Users\AIERXUAN\Desktop\picture\image-20220524135042854-16533715138903.png)

     ![image-20220524142132631](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220524142132631.png)

5. 文件分配方式---链接分配

   链接分配采取离散分配的方式，可以为文件分配离散的磁盘块。分为隐式链接和显式链接两种

   * 隐式链接

     ![image-20220529212115224](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529212115224.png)
     
     ![image-20220529212212817](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529212212817.png)
     
     隐式链接：除文件的最后一个盘块之外，每个盘块中都存有指向下一个盘块的指针。文件目录包括文件第一块的指针和最后一块指针
     
     优点：方便文件拓展，不会有碎片问题，外存利用率高
     
     缺点：只支持顺序访问，不支持随机访问，查找效率低，指向下一个盘块的指针也需要耗费少量的存储空间。
     
   * 显示链接
   
     ![image-20220529212901703](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529212901703.png)
   
     ![image-20220529213416885](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529213416885.png)
   
     显示链接---把用于链接文件各个物理块的指针显示的存放在一张表中，即文件分配表(FAT)。一个磁盘只会建立一张文件分配表，开机时文件分配表放入内存，并常驻内存。
   
     优点：方便文件拓展，不会有碎片问题，外存利用率高，并且支持随机访问，相比于隐式链接来说，地址转换时不需要访问磁盘，因此文件的访问效率更高
   
     缺点：文件分配表需要占用一定的内存
   
   * 索引分配
   
     ![image-20220529214611813](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529214611813.png)
   
     如何实现文件的逻辑块号到物理块号的转换？
   
     ![image-20220529215048681](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529215048681.png)
   
     若每个磁盘块1KB，一个索引表项4B，则一个磁盘块只能存放256个索引项，如果一个文件的大小超过了256块，那么一个磁盘块是装不下文件的整张索引表的，如何解决？
   
     ①链接方案
   
     ②多层索引
   
     ③混合索引
   
     * 链接方案
   
       ![image-20220529222421721](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220529222421721.png)
   
     * 多层索引
   
       ![image-20220530143548528](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530143548528.png)
       
       采用k层索引结构，且顶级索引表未调入内存，则访问一个数据块只需要k + 1次读磁盘操作
       
     * 混合索引
     
       ![image-20220530144020397](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530144020397.png)
     

## 5、文件存储空间管理

1. 存储空间的划分与初始化

   ![image-20220530144632343](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530144632343.png)

2. 存储空间管理---空闲表法

   适用于连续分配方式

   ![image-20220530145112083](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530145112083.png)

3. 存储空间管理---空闲链表法

   ![image-20220530145400964](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530145400964.png)

   * 空闲盘块链

     ![image-20220530145536142](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530145536142.png)

   * 空闲盘区链

     ![image-20220530145757007](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530145757007.png)

4. 存储空间管理---位视图法

   ![image-20220530193310886](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530193310886.png)

   ![image-20220530193511600](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530193511600.png)

   连续分配、离散分配都适用

5. 存储空间管理---成组链接法

   ![image-20220530193750402](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530193750402.png)

   ![image-20220530194728231](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530194728231.png)

   如何进行空闲块的分配？

   比如：需要100个空闲块

   ①检查第一个分组的块数是否足够。100 = 100，足够。

   ②分配第一个分组中的100个空闲块。但是由于300号块内存放了再下一组的信息，因此300号块的数据需要复制到超级块中

   ![image-20220530195251537](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530195251537.png)

   ![image-20220530195308743](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530195308743.png)

   如何回收？

   假设每个分组最多为100个空闲块，此时第一个分组已有100个块，还要再回收一块。需要将超级块中的数据复制到新回收的块中，并修改超级块的内容，让新回收的块成为第一个分组

   ![image-20220530195708965](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530195708965.png)

![image-20220530195918540](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530195918540.png)

## 6、文件的基本操作

1. 创建文件

   ![image-20220530201101036](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530201101036.png)

2. 删除文件

   ![image-20220530201342594](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530201342594.png)

3. 打开文件

   ![image-20220530201818071](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530201818071.png)

4. 打开文件

   ![image-20220530202619445](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530202619445.png)

5. 关闭文件

   ![image-20220530202718681](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530202718681.png)

6. 读文件

   ![image-20220530204655334](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530204655334.png)

7. 写文件

   ![image-20220530204953730](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530204953730.png)

![image-20220530205021424](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530205021424.png)

## 7、文件共享

文件共享是操作系统为用户提供文件共享功能，可以让多个用户共享的适用同一个文件，多个用户共享同一个文件，意味着系统中只有“一份”文件数据。并且只要某个用户修改了该文件数据，其他用户也可以看到文件数据的变化

1. 基于索引节点的共享方式(硬链接)

   ![image-20220530205956876](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530205956876.png)

2. 基于符号链的共享方式(软链接)

   ![image-20220530210148637](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530210148637.png)

   ![image-20220530210336394](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530210336394.png)

![image-20220530210456044](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530210456044.png)

## 8、文件保护

1. 口令保护

   ![image-20220530210706405](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530210706405.png)

2. 加密保护

   ![image-20220530210923203](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530210923203.png)

   每五位就与01001进行异或操作

   优点：保密性强，不需要再系统中存储“密码”

   缺点：编码/译码(加密/解密)要花费一定时间

3. 访问控制

   ![image-20220530212222775](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530212222775.png)

   精简的访问列表：以“组”为单位，标记各“组”用户可以对文件执行哪些操作。比如：分为 系统管理员、文件主、文件主的伙伴、其他用户 几个分组

   当用户想要访问文件时，系统会检查该用户所属的分组是否有相应的访问权限

   ![image-20220530212539209](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530212539209.png)

![image-20220530212817688](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530212817688.png)

## 9、文件系统的层次结构

![image-20220530213756966](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530213756966.png)

![image-20220530214006044](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530214006044.png)

## 10、磁盘的结构

1. 磁盘、磁道、扇区

   ![image-20220530214532180](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530214532180.png)

2. 如何在磁盘中读/写数据

   ![image-20220530214811906](C:\Users\AIERXUAN\Desktop\picture\image-20220530214811906-16539185445651.png)

3. 盘面/柱面

   ![image-20220530220243511](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530220243511.png)

   柱面：具有相同编号的磁道形成的圆柱

4. 磁盘的分类

   ![image-20220530220354717](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530220354717.png)

   ![image-20220530220421638](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530220421638.png)

![image-20220530220453740](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530220453740.png)

## 11、磁盘调度算法

1. 一次磁盘读/写操作需要的时间
   * 寻找时间(寻道时间)$T_s$ :在读/写数据前，将磁头移动到指定磁盘所花的时间
   
     1. 启动磁头臂时间为s
     2. 移动磁头时间，假设是匀速移动，每跨越一个磁道耗时为m，总共需要跨越n个磁道
   
     寻道时间 $T_s = s + m * n$ 
   
   * 延迟时间$T_R$ :通过旋转磁盘，使磁头定位到目标扇区所需要的时间。设磁盘转速为r，则平均所需的延迟时间$T_R = \frac{1}{2} * \frac{1}{r} = \frac{1}{2r} $ ($\frac{1}{r}$ 是转动一圈需要的时间，找到目标扇区平均需要转半圈，因此乘$\frac{1}{2}$)
   
   * 传输时间$T_s$ :从磁盘读出或向磁盘写入数据所经历的时间，假设磁盘转速为r，此次读/写的字节数为b，每个磁盘上的字节数为N。则
   
     传输时间$T_s = \frac{1}{r} * \frac{b}{N} = \frac{b}{rN}$ (每个磁道可存N字节的数据，因此b字节的数据需要b/N个磁道才能存储，而读/写一个磁道所需的时间刚好又是转一圈所需要的时间$\frac{1}{r}$ )
   
   总的平均存储时间$T_a = T_s + \frac{1}{2r} + \frac{b}{rN}$ 
   
   延迟时间和传输时间都与磁盘转速相关，且为线性相关。而转速是硬件固有的属性，因此操作系统也无法优化延迟时间和传输时间。
   
2. 磁盘调度算法

   * 先来先服务算法(FCFS)

     ![image-20220530224610670](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220530224610670.png)
     
   * 最短寻找时间优先(SSTF)
   
     ![image-20220531113725569](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531113725569.png)
   
   * 扫描算法(SCAN)
   
     ![image-20220531114050634](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531114050634.png)
   
   * LOOK调度算法
   
     ![image-20220531114605608](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531114605608.png)
   
   * 循环扫描算法(C-SCAN)
   
     ![image-20220531114848212](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531114848212.png)
   
   * C-LOOK调度算法
   
     ![image-20220531115047482](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531115047482.png)

![image-20220531115101881](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531115101881.png)

## 12、减少延迟时间的方法

![image-20220531200459574](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531200459574.png)

1. 减少延迟时间的方法：交替编号

   ![image-20220531201414435](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531201414435.png)

   ![image-20220531223117841](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531223117841.png)

   转两圈读完的原因：因为要一个隔着一个的读，所以需要两圈

   ![image-20220531223412094](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220531223412094.png)

2. 减少延迟时间的方法：错位命名

   ![image-20220607112210165](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220607112210165.png)
   
   * 0号盘面是在1号盘面上面的，扇区都一一对应，转两圈读取完0号盘面的数据以后，读取1号盘面的0扇区时无法立即开始读，增加了延迟时间
   
   ![image-20220607112458312](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220607112458312.png)

![image-20220607112703160](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220607112703160.png)

## 13、磁盘的管理

1. 磁盘初始化

   ![image-20220607113400305](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220607113400305.png)

2. 引导块

   * 计算机开机时需要进行一系列初始化工作，这些初始化工作是通过执行**初始化程序(自举程序)**完成的
   * 在ROM中存放了很小的"自举装入程序"，开机时计算机先运行"自举装入程序"，通过执行该程序就可以找到引导块，并将完整的自举程序读入内存，完成初始化
   * 完整的自举程序放在磁盘的启动块(即引导块/启动分区)上，启动块位于磁盘的固定位置，拥有启动分区的磁盘为启动磁盘或系统磁盘(C:盘)

3. 坏块管理

   坏块：无法正常使用的扇区，属于硬件故障，操作系统是无法修复的，应该将坏块标记出来，以免错误的使用到它
   
   ![image-20220608103307481](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608103307481.png)

![image-20220608103332891](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608103332891.png)

## 14、I/O设备的基本概念和分类

1. I/O设备介绍

   ![image-20220608104012756](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608104012756.png)

2. I/O设备的分类

   * 按照使用特性分类

     ![image-20220608104222135](C:\Users\AIERXUAN\Desktop\picture\image-20220608104222135-16546561790021.png)

   * 按照传输速率分类

     ![image-20220608104500993](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608104500993.png)

   * 按信息交换的单位分类

     ![image-20220608104632049](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608104632049.png)

![image-20220608104719687](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608104719687.png)

## 15、I/O控制器

1. I/O设备的机械部件

   ![](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608104921354.png)

2. I/O设备的电子部件(I/O控制器)

   ![image-20220608105259812](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608105259812.png)

3. I/O控制器的组成

   ![image-20220608105835197](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608105835197.png)

   注意：

   * 一个I/O控制器可能会对应多个设备
   * 数据寄存器、控制寄存器、状态寄存器可能也有多个，每个控制/状态寄存器对应一个具体的设备，且这些寄存器都要有相应的地址，才能方便CPU操作。有的计算机会让这些寄存器占用内存地址的一部分，称为**内存映像I/O**;另一些计算机则采用I/O专用地址，即**寄存器独立编址**

4. 内存映像I/O与寄存器独立编址

   ![image-20220608110542490](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608110542490.png)

![image-20220608110604462](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608110604462.png)

## 16、I/O控制方式

1. 程序直接控制方式

   1. 完成一次读/写操作的流程(轮询)

   ![image-20220608132930223](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608132930223.png)

   ![image-20220608133444265](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608133444265.png)

   2. CPU干预的频率

      很频繁，I/O操作开始之前、完成之后需要CPU介入，并且在等待I/O完成的过程中CPU需要不断的轮询检查

   3. 数据传送的单位

      每次读/写**一个字**

   4. 数据的流向

      读操作(数据输入)：I/O设备 ---> CPU --> 内存

      写操作(数据输出)：内存 ---> CPU ---> I/O设备

      每个字的读/写都需要CPU的帮助

   5. 优缺点

      优点：实现简单，在读/写指令之后，加上实现循环检查的一系列指令即可

      缺点：CPU和I/O设备只能串行工作，CPU需要一直轮询检查，长期处于“忙等”状态，CPU利用率低

2. 中断驱动方式

   1. 完成一次读/写操作的流程

      ![](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608134521785.png)

   2. CPU干预的频率

      每次I/O操作开始之前、完成之后需要CPU介入

      等待I/O完成的过程中CPU可以切换到别的进程执行

   3. 数据传送单位

      每次读/写**一个字**

   4. 数据的流向

      读操作(数据输入)：I/O设备 ---> CPU --> 内存

      写操作(数据输出)：内存 ---> CPU ---> I/O设备

   5. 优缺点

      优点：与程序直接控制方式相比，在中断驱动方式中，I/O控制器会通过中断信号主动报告I/O已完成，CPU不再需要不停的轮询。**CPU与I/O设备可并行工作**，CPU利用率得到明显的提升

      缺点：每个字在I/O设备与内存之间的传输，都需要经过CPU。而**频繁的中断处理会消耗较多的CPU时间**，每次中断只能传输一个字

3. DMA方式(直接存储器存取)

   完成一次读/写操作的流程

   ![image-20220608140442691](C:\Users\AIERXUAN\Desktop\picture\image-20220608140442691-16546685878863.png)

   1. DMA控制器

      ![image-20220608140914035](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608140914035.png)

   2. CPU干预的频率

      在传送一个或多个数据块的开始和结束时，才需要CPU的干预

   3. 数据传送的单位

      每次读/写一个或多个块(注意每次读写的只能是连续的多个块，且这些块读入内存后在)

   4. 数据的流向(不再需要经过CPU)

      读操作(数据输入)：I/O设备 ---> 内存

      写操作(数据输出)：内存 ---> I/O设备

   5. 优缺点

      优点：数据传输以"块"为单位，CPU介入频率进一步降低。数据的传输不再需要先经过CPU再写入内存，数据传输效率进一步增加。CPU和I/O设备的并行性得到提升

      缺点：CPU每发出一条I/O指令，只能读/写一个或多个连续的数据块。如果要读写多个离散存储的数据块，或者要将数据分别写到不同内存区域时，CPU要分别发出多条I/O指令，进行多次中断处理才能完成

4. 通道控制方式

   ![image-20220608144106793](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608144106793.png)

   ![image-20220608144250495](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608144250495.png)

![image-20220608144448647](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608144448647.png)

## 17、I/O软件层次结构

![](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608144740589-16546708755945.png)

1. 用户层系统

   ![image-20220608145040522](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608145040522.png)

2. 设备独立性软件

   设备独立性软件，又称设备无关性软件，与设备的硬件特性无关的功能都几乎在这一层实现。

   主要实现的功能：

   1. 向上层提供统一的调用接口(如read/write系统调用)

   2. 设备的保护：设备被看做是一种特殊的文件，不同用户对各个文件的访问权限是不一样的，同理，对设备的访问权限也不一样

   3. 差错处理：对一些设备的错误进行处理

   4. 设备的分配与回收

   5. 数据缓冲区管理：通过缓冲技术屏蔽设备之间数据交换单位大小和传输速度的差异

   6. 建立逻辑设备名到物理设备名的映射关系，根据设备类型选择调用相应的驱动程序

      ![image-20220608150454000](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608150454000.png)

      ![image-20220608150624784](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608150624784.png)

      ![image-20220608150637422](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608150637422.png)

3. 设备驱动程序

   负责对硬件设备的具体控制，将上层发出的一系列命令(如read/write)转化成特定设备能听得懂的一些列操作，包括设置设备寄存器，检查设备状态等。不同的I/O设备有不同的硬件特性，具体细节只有设备厂家才知道，因此厂家需要根据设备的硬件特性设计并提供相应的驱动程序

4. 中断处理程序

   ![image-20220608152211751](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608152211751.png)

![image-20220608153523239](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608153523239.png)

## 18、I/O核心子系统

I/O系统(I/O核心子系统)属于操作系统的内核部分，主要包括：设备独立性软件、设备驱动程序、中断处理程序

![image-20220608154426249](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220608154426249.png)

1. I/O调度：用某种算法确定一个好的顺序来处理各个I/O请求

   比如：磁盘调度 ，当多个磁盘I/O请求到来时，用某种调度算法来确定满足I/O请求的顺序

2. 设备保护：

   操作系统需要实现文件保护功能，不同的用户对各个文件有不同的访问权限(如：只读、读和写等)

   在UNIX系统中，设备被看做是一种特殊的文件，每个设备也会有对应的FCB。当用户请求访问某个设备时，系统根据FCB中记录的信息来判断该用户是否有相应的访问权限，以此实现设备保护功能

## 19、假脱机技术

1. 脱机技术简介 

   * 手工操作阶段：主机直接从I/O设备获得数据，由于设备速度慢，主机速度很快，人机速度矛盾明显，主机要浪费很多时间来等待设备

     ![image-20220609095039255](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609095039255.png)

   * 批处理阶段引入了脱机输入/输出技术(用磁带完成)：

     ![image-20220609095427515](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609095427515.png)

   * 假脱机技术，又称"SPOOLing技术"是用软件的方式模拟脱机技术。系统的组成如下：

     ![image-20220609095722677](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609095722677.png)

     输入井：模拟脱机输入时的磁带，用于收容I/O设备输入的数据

     输出井：模拟脱机输出时的磁带，用于收容用户进程输出的数据

     输入进程：模拟脱机输入时的外围控制机

     输出进程：模拟脱机输出时的外围控制机

     输入缓冲区：在输入进程的控制下，输入缓冲区用于暂存从输入设备输入的数据，之后在转存到输入井中

     输出缓冲区：在输出进程的控制下，用于暂存从输出井传来的数据，之后再传送到输出设备上

2. 共享打印机原理分析

   ![image-20220609100750640](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609100750640.png)

   ![image-20220609101627441](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609101627441.png)

   ![image-20220609101720564](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609101720564.png)

![image-20220609101958603](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609101958603.png)

## 20、设备的分配与回收

1. 设备分配时应考虑的因素

   1. 设备的固有属性：

      * 独占设备—一个时段只能分配一个进程
      * 共享设备—可同时分配给多个进程使用，各进程往往是宏观上同时共享使用设备，而在微观上交替使用
      * 虚拟设备—采用SPOOLing技术将独占设备改造成虚拟的共享设备，可同时分配给多个进程使用

   2. 设备的分配算法：

      先来先服务、优先级高者优先、短任务优先.....

   3. 设备分配中的安全性：

      ![image-20220609103338474](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609103338474.png)

2. 静态分配和动态分配

   * 静态分配：进程运行前为其分配全部所需资源，运行结束后归还资源，不会发生死锁
   * 动态分配：进程运行过程中动态申请设备资源

3. 设备分配管理中的数据结构

   ![image-20220609103645775](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609103645775.png)

   ![image-20220609103942129](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609103942129.png)

   ![image-20220609104134198](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609104134198.png)

   ![image-20220609104233122](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609104233122.png)

   ![image-20220609104330037](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609104330037.png)

4. 设备分配的步骤

   1. 根据进程请求的物理设备名查找SDT(物理设备名是进程请求分配时提供的参数)
   2. 根据SDT找到DCT，若设备忙碌则将进程PCB挂到设备等待队列中，不忙碌则将设备分配给进程
   3. 根据DCT找到COCT，若控制器忙碌则将进程PCB挂到控制器等待队列中，不忙碌则将控制器分配给进程 
   4. 根据COCT找到CHCT，若通道忙碌则将进程PCB挂到通道等待队列中，不忙碌则将通道分配个进程

   缺点：

   1. 用户编程时必须使用"物理设备名"，底层细节对用户不透明，不方便编程
   2. 若换了一个物理设备，则程序无法运行
   3. 若进程请求的物理设备正在忙碌，则即使系统中还有同类型的设备，进程也必须阻塞等待

   改进方法：建立逻辑设备名与物理设备名的映射机制，用户编程时只需提供逻辑设备名

5. 设备分配改进

   ![](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220609115836152-16547471320781.png)
   
   ![image-20220610212414867](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610212414867.png)

![image-20220610212527979](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610212527979.png)

## 21、缓冲区管理

1. 缓冲区介绍以及作用

   ![image-20220610212917960](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610212917960.png)

   ![image-20220610213119470](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610213119470.png)

2. 单缓冲

   ![image-20220610213442230](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610213442230.png)

   ![image-20220610213728733](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610213728733.png)

   ![image-20220610214210814](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610214210814.png)

   结论：采用单缓冲策略，处理一块数据平均耗时Max(C,T) + M

3. 双缓冲

   ![image-20220610214717158](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610214717158.png)

   ![image-20220610215055371](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610215055371.png)

   结论：采用双缓冲策略，处理一个数据块的平均耗时为Max(T,C+M)

4. 使用单/双缓冲在通信时的区别

   ![image-20220610215815431](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610215815431.png)

   ![image-20220610215848171](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610215848171.png)

   ![image-20220610220013207](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610220013207.png)

5. 循环缓冲区

   ![image-20220610220150678](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610220150678.png)

6. 缓冲池

   ![image-20220610221353573](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610221353573.png)

![image-20220610221431032](https://picture2-1310712259.cos.ap-nanjing.myqcloud.com/img/image-20220610221431032.png)
