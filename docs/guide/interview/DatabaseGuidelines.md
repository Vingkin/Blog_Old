---
title: 数据库开发规范
author: Vingkin
date: 2023-08-14
---

> 本文摘录自[阿里巴巴Java开发手册MySQL数据库篇](https://www.bookstack.cn/read/alibaba-java/MySQL%E6%95%B0%E6%8D%AE%E5%BA%93.md)，目的是为了加强记忆方便查询

## 建表规约

::: danger 【强制】

1. 表达是否概念的字段，必须使用`is_xxx`的方式命名，数据类型是`unsigned tinyint`（1表示是，0表示否）。

<span style="color: orange">说明</span>：任何字段如果为非负数，必须是`unsigned`。

<span style="color: green">正例</span>：表达逻辑删除的字段名`is_deleted`，1表示删除，0表示未删除。

:::

::: danger 【强制】

2. 表名、字段名必须使用小写字母或数字，禁止出现数字开头，禁止两个下划线中间只出现数字。数据库字段名的修改代价很大，因为无法进行预发布，所以字段名称需要慎重考虑。

<span style="color: orange">说明</span>：MySQL在Windows下不区分大小写，但在Linux下默认是区分大小写。因此，数据库名、表名、字段名，都不允许出现任何大写字母，避免节外生枝。

<span style="color: green">正例</span>：aliyun_admin, rdc_config, level3_name

<span style="color: red">反例</span>：AliyunAdmin, rdcConfig, level_3_name

:::

::: danger 【强制】

3. 表名不使用复数名词。

<span style="color: orange">说明</span>：表名应该仅仅表示表里面的实体内容，不应该表示实体数量，对应于DO类名也是单数形式，符合表达习惯。

:::

::: danger 【强制】

4. 禁用保留字，如`desc`、`range`、`match`、`delayed`等，请参考[MySQL官方保留字](https://dev.mysql.com/doc/refman/5.7/en/keywords.html)。

:::

::: danger 【强制】

5. 主键索引名为pk字段名；唯一索引名为uk字段名；普通索引名则为idx字段名。

<span style="color: orange">说明</span>：pk即primary key；uk即unique key；idx即index

:::

::: danger 【强制】

6. 小数类型为decimal，禁止使用float和double。

<span style="color: orange">说明</span>：float和double在存储的时候，存在精度损失问题，很可能在值比较时，得到不正确的结果。如果存储的数据范围查过decimal的范围，建议将数据拆成整数和小数分开存储。

:::

::: danger 【强制】

7. 如果存储的字符串长度几乎相等，使用char定长字符串类型。

:::

::: danger 【强制】

8. varchar是可变长字符串，不预先分配存储空间，长度不要超过5000，如果存储长度大于此值，定义字段类型为text，独立出来一张表，用主键来对应，避免影响其它索引效率。

:::

::: danger 【强制】

9. 表必备三字段：id, gmt_create, gmt_modified。

<span style="color: orange">说明</span>：其中id必为主键，类型为unsigned bigint、单表时自增、步长为1。（其实得根据主键类型进行动态判断）。gmt_create, gmt_modified的类型均为datetime类型，前者现在时表示主动创建，后者过去分词表示被动更新。

:::

::: warning 【推荐】

10. 表的命名最好是加上“业务名称_表的作用"。

<span style="color: green">正例</span>：alipay_task / force_project / trade_config

:::

::: warning 【推荐】

11. 库名与应用名称尽量一致。

:::

::: warning 【推荐】

12. 如果修改字段含义或对应字段表示的状态追加时，需要及时更新字段注释。

:::

::: warning 【推荐】

13. 字段允许适当冗余，以提高查询性能，但必须考虑数据一致。冗余字段应遵循：

    1）不是频繁修改的字段。

    2） 不是varchar超长字段，更不能是text字段。

<span style="color: green">正例</span>：商品类目名称使用频率高，字段长度短，名称基本一成不变，可在相关联的表中冗余存储类目名称，避免关联查询。

:::

::: warning 【推荐】

14. 单表行数超过500万行或者单表容量超过2GB，才推荐进行分库分表。

<span style="color: orange">说明</span>：如果预计三年后数据量根本达不到这个级别，请不要在创建表时就分库分表。

:::

::: tip 【参考】

15. 合适的字符存储长度，不但节约数据库表空间、节约索引存储，更重要的是提升检索速度。

<span style="color: green">正例</span>：如下表，其中无符号值可以避免误存负数，且扩大了表示范围。

| 对象     | 年龄区间  | 类型              | 字节 |
| -------- | --------- | ----------------- | ---- |
| 人       | 150岁之内 | unsigned tinyint  | 1    |
| 龟       | 数百岁    | unsigned smallint | 2    |
| 恐龙化石 | 数千万岁  | unsigned int      | 4    |
| 太阳     | 约50亿年  | unsigned bigint   | 8    |

:::



## 索引规约

::: danger 【强制】

1. 业务上具有唯一特性的字段，即使是多个字段的组合，也必须建成唯一索引。

<span style="color: orange">说明</span>：不要以为唯一索引影响了insert速度，这个速度损耗可以忽略，但提高查找速度是明显的；另外，即使在应用层做了非常完善的校验控制，只要没有唯一索引，根据墨菲定律，必然有脏数据产生。

:::

::: danger 【强制】

2. 超过三个表禁止join。需要join的字段，数据类型必须绝对一致；多表关联查询时，保证被关联的字段需要有索引。

<span style="color: orange">说明</span>：即使双表join也要注意表索引、SQL性能。

:::

::: danger 【强制】

3. 在varchar字段上建立索引时，必须指定索引长度，没必要对全字段建立索引，根据实际文本区分度决定索引长度即可。

<span style="color: orange">说明</span>：索引的长度与区分度是一对矛盾体，一般对字符串类型数据，长度为20的索引，区分度会高达90%以上，可以使用count(distinct left(列名, 索引长度))/count(*)的区分度来确定。

:::

::: danger 【强制】

4. 页面搜索严禁左模糊或者全模糊，如果需要请走搜索引擎来解决。

<span style="color: orange">说明</span>：索引文件具有B-Tree的最左前缀匹配特性，如果左边的值未确定，那么无法使用此索引。

:::

::: warning 【推荐】

5. 如果有order by的场景，请注意利用索引的有序性。order by 最后的字段是组合索引的一部分，并且放在索引组合顺序的最后，避免出现file_sort的情况，影响查询性能。

<span style="color: green">正例</span>：where a=? and b=? order by c; 索引：a_b_c

<span style="color: red">反例</span>：索引中有范围查找，那么索引有序性无法利用，如：WHERE a>10 ORDER BY b; 索引a_b无法排序。

:::

::: warning 【推荐】

6. 利用覆盖索引来进行查询操作，避免回表。

<span style="color: orange">说明</span>：如果一本书需要知道第11章是什么标题，会翻开第11章对应的那一页吗？目录浏览一下就好，这个目录就是起到覆盖索引的作用。

<span style="color: green">正例</span>：能够建立索引的种类分为主键索引、唯一索引、普通索引三种，而覆盖索引只是一种查询的一种效果，用explain的结果，extra列会出现：using index。

:::

::: warning 【推荐】

7. 利用延迟关联或者子查询优化超多分页场景。

<span style="color: orange">说明</span>：MySQL并不是跳过offset行，而是取offset+N行，然后返回放弃前offset行，返回N行，那当offset特别大的时候，效率就非常的低下，要么控制返回的总页数，要么对超过特定阈值的页数进行SQL改写。

<span style="color: green">正例</span>：先快速定位需要获取的id段，然后再关联：

```sql
SELECT a.* FROM 表1 a,
(select id from 表1 where 条件 LIMIT 100000,20 ) b 
where a.id=b.id 
```

:::

::: warning 【推荐】

8. SQL性能优化的目标：至少要达到 range 级别，要求是ref级别，如果可以是consts最好。

<span style="color: orange">说明</span>：

1）consts 单表中最多只有一个匹配行（主键或者唯一索引），在优化阶段即可读取到数据。\
2）ref 指的是使用普通的索引（normal index）。\
3）range 对索引进行范围检索。

<span style="color: red">反例</span>：explain表的结果，type=index，索引物理文件全扫描，速度非常慢，这个index级别比较range还低，与全表扫描是小巫见大巫。

:::

::: warning 【推荐】

9. 建组合索引的时候，区分度最高的在最左边。

<span style="color: green">正例</span>：如果where a=? and b=? ，a列的几乎接近于唯一值，那么只需要单建idx_a索引即可。

<span style="color: orange">说明</span>：存在非等号和等号混合判断条件时，在建索引时，请把等号条件的列前置。如：where a>? and b=? 那么即使a的区分度更高，也必须把b放在索引的最前列。

:::

::: warning 【推荐】

10. 防止因字段类型不同造成的隐式转换，导致索引失效。

:::

::: tip 【参考】

11. 创建索引时避免有如下极端误解： 1）宁滥勿缺。认为一个查询就需要建一个索引。 2）宁缺勿滥。认为索引会消耗空间、严重拖慢更新和新增速度。 3）抵制惟一索引。认为业务的惟一性一律需要在应用层通过“先查后插”方式解决。

:::

## SQL语句

::: danger 【强制】

1. 不要使用count(列名)或count(常量)来替代count(\*)，count(\*)是SQL92定义的标准统计行数的语法，跟数据库无关，跟NULL和非NULL无关。

<span style="color: orange">说明</span>：count(\*)会统计值为NULL的行，而count(列名)不会统计此列为NULL值的行。

:::

::: danger 【强制】

2. count(distinct col) 计算该列除NULL之外的不重复行数，注意 count(distinct col1, col2) 如果其中一列全为NULL，那么即使另一列有不同的值，也返回为0。

<span style="color: orange">说明</span>：count(\*)会统计值为NULL的行，而count(列名)不会统计此列为NULL值的行。

:::

::: danger 【强制】

3. 当某一列的值全是NULL时，count(col)的返回结果为0，但sum(col)的返回结果为NULL，因此使用sum()时需注意[NPE问题](https://www.cnblogs.com/jinyewuming/p/13177881.html)。

<span style="color: green">正例</span>：可以使用如下方式来避免sum的NPE问题：

```sql
SELECT IF(ISNULL(SUM(g)),0,SUM(g)) FROM table; 
```

:::

::: danger 【强制】

4. 使用`ISNULL()`来判断是否为NULL值。 说明：NULL与任何值的直接比较都为NULL。

1） `NULL<>NULL`的返回结果是NULL，而不是`false`。\
2） `NULL=NULL`的返回结果是NULL，而不是`true`。\
3） `NULL<>1`的返回结果是NULL，而不是`true`。

<span style="color: green">正例</span>：可以使用如下方式来避免sum的NPE问题：

```sql
SELECT IF(ISNULL(SUM(g)),0,SUM(g)) FROM table; 
```

:::

::: danger 【强制】

5. 在代码中写分页查询逻辑时，若count为0应直接返回，避免执行后面的分页语句。

:::

::: danger 【强制】

6. 不得使用外键与级联，一切外键概念必须在应用层解决。

<span style="color: orange">说明</span>：以学生和成绩的关系为例，学生表中的student_id是主键，那么成绩表中的student_id则为外键。如果更新学生表中的student_id，同时触发成绩表中的student_id更新，即为级联更新。外键与级联更新适用于单机低并发，不适合分布式、高并发集群；级联更新是强阻塞，存在数据库更新风暴的风险；外键影响数据库的插入速度。

:::

::: danger 【强制】

7. 禁止使用存储过程，存储过程难以调试和扩展，更没有移植性。

:::

::: danger 【强制】

8. 数据订正（特别是删除、修改记录操作）时，要先select，避免出现误删除，确认无误才能执行更新语句。

:::

::: warning 【推荐】

9. in操作能避免则避免，若实在避免不了，需要仔细评估in后边的集合元素数量，控制在1000个之内。

:::

::: tip 【参考】

10. 如果有全球化需要，所有的字符存储与表示，均以utf-8编码，注意字符统计函数的区别。

<span style="color: orange">说明</span>：

```sql
SELECT LENGTH(“轻松工作”)； 返回为12
SELECT CHARACTER_LENGTH(“轻松工作”)； 返回为4
```

:::

::: tip 【参考】

11. TRUNCATE TABLE 比 DELETE 速度快，且使用的系统和事务日志资源少，但TRUNCATE无事务且不触发trigger，有可能造成事故，故不建议在开发代码中使用此语句。

<span style="color: orange">说明</span>：TRUNCATE TABLE 在功能上与不带 WHERE 子句的 DELETE 语句相同。

:::

## ORM映射

::: danger 【强制】

1. 在表查询中，一律不要使用 \* 作为查询的字段列表，需要哪些字段必须明确写明。

<span style="color: orange">说明</span>：1）增加查询分析器解析成本。2）增减字段容易与resultMap配置不一致。

:::

::: danger 【强制】

2. POJO类的布尔属性不能加is，而数据库字段必须加is_，要求在resultMap中进行字段与属性之间的映射。

<span style="color: orange">说明</span>：参见[定义POJO类以及数据库字段定义规定第8条](https://www.bookstack.cn/read/alibaba-java/%E7%BC%96%E7%A8%8B%E8%A7%84%E7%BA%A6-%E5%91%BD%E5%90%8D%E9%A3%8E%E6%A0%BC.md)，在POJO类中增加映射，是必须的。在MyBatis Generator生成的代码中，需要进行对应的修改。

:::

::: danger 【强制】

3. 不要用resultClass当返回参数，即使所有类属性名与数据库字段一一对应，也需要定义；反过来，每一个表也必然有一个与之对应。

<span style="color: orange">说明</span>：配置映射关系，使字段与DO类解耦，方便维护。

:::

::: danger 【强制】

4. sql.xml配置参数使用：#{}，#param# 不要使用${} 此种方式容易出现SQL注入。

:::

::: danger 【强制】

5. iBATIS自带的queryForList(String statementName,int start,int size)不推荐使用。

<span style="color: orange">说明</span>：其实现方式是在数据库取到statementName对应的SQL语句的所有记录，再通过subList取start,size的子集合。

<span style="color: green">正例</span>：

```java
 Map<String, Object> map = new HashMap<String, Object>();    
 map.put("start", start);    
 map.put("size", size);
```

:::

::: danger 【强制】

6. 不允许直接拿HashMap与Hashtable作为查询结果集的输出。

<span style="color: orange">说明</span>：resultClass=”Hashtable”，会置入字段名和属性值，但是值的类型不可控。

:::

::: danger 【强制】

7. 更新数据表记录时，必须同时更新记录对应的gmt_modified字段值为当前时间。

<span style="color: orange">说明</span>：resultClass=”Hashtable”，会置入字段名和属性值，但是值的类型不可控。

:::

::: warning 【推荐】

8. 不要写一个大而全的数据更新接口。传入为POJO类，不管是不是自己的目标更新字段，都进行update table set c1=value1,c2=value2,c3=value3; 这是不对的。执行SQL时，不要更新无改动的字段，一是易出错；二是效率低；三是增加binlog存储。

<span style="color: orange">说明</span>：resultClass=”Hashtable”，会置入字段名和属性值，但是值的类型不可控。

:::

::: tip 【参考】

9. `@Transactional`事务不要滥用。事务会影响数据库的QPS，另外使用事务的地方需要考虑各方面的回滚方案，包括缓存回滚、搜索引擎回滚、消息补偿、统计修正等。

:::

::: tip 【参考】

10. `<isEqual>`中的compareValue是与属性值对比的常量，一般是数字，表示相等时带上此条件；`<isNotEmpty>`表示不为空且不为null时执行；`<isNotNull>`表示不为null值时执行。

:::
