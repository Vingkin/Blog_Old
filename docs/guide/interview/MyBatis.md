---
title: MyBatis
author: Vingkin
date: 2022-4-24
---

## 0x00. MyBatis中\$和\#有什么区别

使用\#设置参数时，MyBatis会创建预编译的SQL语句，然后再执行SQL时MyBatis会为预编译SQL中的占位符(?)赋值。预编译的SQL执行效率高，并且可以防止SQL注入。

使用\$设置参数时，MyBatis只是创建普通的SQL语句，然后在执行SQL语句时MyBatis将参数直接拼接到SQL里。这种方式在效率、安全性上均不入前者。

## 0x01. 既然\$不好，为什么还需要

它可以解决一些特殊情况下的问题。例如，在一些动态表格（根据不同的条件产生不同的动态列）中，我们要传递SQL的列名，根据某些列进行排序，或者传递列名给SQL都是比较常见的场景，这就无法使用预编译的方式了。

动态传入需要查询的列名：

```xml
<select id="getUserByDynamicColumnName" resultType="User">
    select ${columnName} from t_user
</select>
```

```java
@Test
public void testGetUserByDynamicColumnName(){
    // List<User> t_user = userService.getUserByDynamicColumnName("username");
    List<User> t_user = userService.getUserByDynamicColumnName("username, password");
    System.out.println(t_user);
}
```





