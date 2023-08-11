---
title: MyBatis / MyBatis-Plus
author: Vingkin
date: 2023-8-7
---

## Mybatis

### @Param / @RequestBody

1. 发现在dao层方法接口的参数中不用`@Param`指定参数名称，在xml中也是可以直接用`#{}`来对参数进行引用，查了很多资料解释是idea进行了预处理，所以即使不报错，也需要在dao层参数名称位置指定具体名称，以免其他开发环境下出现bug。
2. @RequestBody是对json格式的入参进行处理，**将json格式数据封装成具体的vo或者po实体类**，目前现在都是前后端分离的项目，前端传过来的参数都是json格式的，所以在controller层实体类型的参数前需要加上@RequestBody注解。

### $和#

1. `#{}`相当于占位符，编译时会进行预处理用`?`替换原来的位置。而`${}`相当于字符串拼接，不到万不得已不要使用，因为有sql注入的风险。

   **两种必须要使用`${}`的情况：**

    * 采用in来进行批量删除时只能采用`${}`进行字符串拼接

      ```java
      String ids = "1,2,3";
      ```

      ```sql
      delete from user where id in (${ids}) # 正确写法
      
      # delete from user where id in (#{ids})会被解析成
      # delete from user where id in ('1,2,3')，虽然spring执行不报错，但是并不能正确删除
      ```

    * 动态设置表名的问题

      ```sql
      select * from #{tableName} # 错误的，表名不能有单引号
      # 只能使用${}
      select * from ${tableName} # 正确写法
      ```

2. **模糊查询**时如果使用了#进行sql编写，例如`select * from user where name = '%#{name}%'`，这种情况占位符`?`会被当成字符串来处理，sql会变成`select * from user where name = '%?%'`，因此出现错误。

   **解决方案：**

    - ~~采用`${}`来拼接sql~~

    - 采用mysql自带的concat函数进行拼接

      ```sql
      select * from user where name like concat('%', #{name}, '%')
      ```

    - **采用双引号进行拼接（最常使用）**

      ```sql
      select * from user where name like "%"#{name}"%"
      ```

3. 如果dao层查询出来的数据没有一个实体类对象与之一一对应，则ResultType可以设置成map，最终将结果相应给前端。

    * **通过association解决多对一映射关系**

      > 一般都可以使用分布查询来解决，先通过user_id查询出User完整信息以及role_id，之后通过role_id查询出Role的完整信息，只需要在service中将查询出来的Role封装到User实体类中即可。

      假设有如下两张表：

      ```
       user表   |    Role表
      ------------------------
      user_id   |  role_id
      user_name |  role_name
      role_id   |
      ```

      但是User实体类中具有Role实体类：

      ```java
      public class User {
          private Long userId;
          private String userName;
          private Role role;
      }
      ```

      通过级联查询将结果直接映射在User实体类中，则需要ResultMap来手动指定映射关系

      ```xml
      <ResultMap id="test" type="User">
          <id properties="userId" column="user_id"></id>
          <id properties="userName" column="user_name"></id>
          <association property="role" javaType="Role">
              <id properties="roleId" column="role_id"></id>
              <id properties="roleName" column="role_name"></id>
          </association>
      </ResultMap>
      
      <select id="getUserAndRole" resultMap="test">
          select * from user left join role on user.role_id = role.role_id where user.user_id = #{id}
      </select>
      ```

    * **通过分步查询解决多对一映射关系**

      > 优点是可以开启**延迟加载**
      >
      > 通过在配置文件中指定`mybatis.configuration.lazy-loading-enabled=true`来手动开启，如果mybatis版本低于3.4.1还需要手动设置`mybatis.configuration.aggressiveLazyLoading=false`。
      >
      > 当延迟加载开启后，当我们只查询user信息时，调用`<select id="getUserAndRole">`则只会执行`select * from user where user_id = #{id}`的部分，否则级联部分sql语句也会执行。
      >
      > 延迟加载配置是全局开启的，如果想要细粒度控制则需要设置association的fetchType="eager"，表明该association不开启延迟加载

      其中`association`中的`select`对应RoleMapper.java的全类名加上对应的方法名，`column`是分步查询的条件

      ```xml
      <!-- RoleMapper.xml -->
      <select id="getRole" resultType="Role">
          select * from role where role_id = #{id}
      </select>
      
      <!-- UserMapper.xml -->
      <ResultMap id="test" type="User">
          <id properties="userId" column="user_id"></id>
          <id properties="userName" column="user_name"></id>
          <association 
                       property="role" 
                       select="com.vingkin.role.dao.RoleMapper.getRole" 
                       column="role_id">
          </association>
      </ResultMap>
      <select id="getUserAndRole" resultMap="test">
          select * from user where user_id = #{id}
      </select>
      ```

      **通过collection解决一对多映射关系**和**通过分步查询解决一对多映射关系**如上述代码相差不大，故不细加阐述。

### Mybatis分页操作

Mybatis+PageHelper插件即可实现分页操作

### Mybatis动态表模式实现

> 关键点在于如下拦截器的编写，需要先在业务层中向线程变量存入province属性，然后在拦截其中进行拦截处理。对拦截器代码进行了相关优化，可以自定义属性。比如下面代码，线程变量中如果有province字段，则会与原表名`t_user`进行拼接，以`t_user_province`格式回调，以达到动态表名的效果，province字段需要从前端传过来。如果未来业务有其他拼接字段，也都可以进行简单修改即可使用。

```java
@Configuration
@MapperScan("com.vingkin.dynamictable.mapper")
public class MybatisPlusConfig {
    /**
     * 添加动态表名插件
     * @return
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        DynamicTableNameInnerInterceptor dynamicTableNameInnerInterceptor = new DynamicTableNameInnerInterceptor();
        dynamicTableNameInnerInterceptor.setTableNameHandler((sql, tableName) -> {
            // 获取参数方法
            Map<String, Object> paramMap = RequestDataHelper.getRequestData();
            if (CollectionUtils.isNotEmpty(paramMap)) {
                // 获取传递的参数
                StringBuilder tableNameSuffix = new StringBuilder();
                if (ObjectUtils.isNotEmpty(paramMap.get("province"))) {
                    tableNameSuffix.append("_").append((String) paramMap.get("province"));
                }
                // 组装动态表名
                return tableName + tableNameSuffix;
            }
            return tableName;
        });
        interceptor.addInnerInterceptor(dynamicTableNameInnerInterceptor);
        return interceptor;
    }
}
```

## Mybatis Plus

### 前端传来不定条件Mybatis-Plus的解决方案

> 其wrapper方法中第一个参数为condition，返回true即拼接否则不拼接。

```java
/**
  * String name;
  * Integer age;
  */
public void radomCondition(User user) {
    QueryWrapper<User> wrapper = new QueryWrapper<>();
    // Mybatis-Plus包中的StringUtils
    wrapper.like(StringUtils.isNotBlank(name), "name", user.getName())
           .eq(age != null, "age", user.getAge());
    List<User> users = userMapper.selectList(wrapper);
}
```

### 函数式SQL

使用`LambdaQueryWrapper`和`LambdaUpdateWrapper`替代`QueryWrapper`和`UpdateWrapper`。

> 前两者采用函数式方法获取列名，避免列名出错的情况

```java
// 使用QueryWrapper的情况
QueryWrapper<User> wrapper = new QueryWrapper<>();
queryWrapper.like(StringUtils.isNotBlank(name), "name", user.getName())
        .ge(age != null, "age", user.getAge());
// 使用LambdaQueryWrapper的情况
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
queryWrapper.like(StringUtils.isNotBlank(name), User::getName, user.getName())
        .ge(age != null, User::getAge, user.getAge());
```

### Mybatis-Plus多数据源

> 引入依赖

```xml
<mybatisplus.version>3.5.1</mybatisplus.version>
<!-- mybatis-plus -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>${mybatisplus.version}</version>
</dependency>
<!-- mybatis-plus多数据源 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
    <version>${mybatisplus.version}</version>
</dependency>
```

> 在配置文件中进行配置

```yaml
spring:
  # 配置数据源信息
  datasource:
    dynamic:
      # 设置默认的数据源或者数据源组,datasource1
      primary: datasource-mysql
      # 严格匹配数据源,默认false.true未匹配到指定数据源时抛异常,false使用默认数据源
      strict: false
      datasource:
        datasource-mysql:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://localhost:3306/t_user?serverTimeZone=GMT%2B8&characterEncoding=utf-8&useSSL=false
          username: root
          password: 123456
        datasource-pgsql:
          driver-class-name: org.postgresql.Driver
          url: jdbc:postgresql://localhost:58063/test
          username: postgres
          password: 123456
```

> 在业务层实现类方法的类名或方法名上通过`@DS("datasource")`指定访问数据源。

```java
@Service
@DS("datasource-mysql") // 在类名上指定使用数据源
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{

}
```

### 通过MybatisX插件自动生成代码

> [MybatisX](https://baomidou.com/pages/ba5b24/)
