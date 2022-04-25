---
title: SpringBoot
author: Vingkin
date: 2022-4-24
---

## 0x00. 说说你对Spring Boot的理解

从本质上来说，Spring Boot就是Spring。Spring Boot使用“约定大于配置”的理念让你的项目快速的运行起来，使用Spring Boot很容易创建一个能独立运行、准生产级别、基于Spring框架的项目，使用Spring Boot你可以不用或者只需要很少的Spring配置。

简而言之，Spring Boot本身并不提供Spring的核心功能，而是作为Spring的脚手架框架，以达到快速构建项目。Spring Boot有如下优点：

* 可以快速构建项目
* 可以对主流开发框架的无配置集成
* 项目可独立运行，无需外部依赖Servlet容器
* 提供运行时的应用监控
* 可以极大地提高开发、部署效率
* 可以与云计算天然集成

## 0x01. Spring Boot Starter有什么用

Spring Boot提供众多起步依赖（Starter）降低项目依赖的复杂度。起步依赖本质上是一个Maven项目对象模型（Project Object Model，POM），定义了对其他库的传递依赖，这些东西加在一起即支持某项功能。很多起步依赖的命名都暗示了它们提供的某种或某类功能。

举例来说，你打算做个Web应用程序。与其向项目的构建文件里添加一堆单独的库依赖，还不如声明这是一个Web应用程序来的简单。你只要添加Spring Boot的Web起步依赖就好了。

## 0x02. 介绍Spring Boot的启动流程

首先，Spring Boot项目创建完成会默认生成一个名为\*Application的入口类，我们是通过该类的main方法启动Spring Boot项目的。在main方法中，通过run方法进行\*Application类的初始化和启动。

\*Application调用run方法的大致流程如下图：

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/4ECC3AECD1D8D2B62421E2D3453DC465.jpg)

其中，\*Application在run方法中重点做了以下操作：

* 获取监听器的参数配置
* 打印Banner信息
* 创建并初始化容器
* 监听器发送通知

当然，除了上述核心操作，run方法运行过程中还涉及启动时长统计、异常报告、启动日志、异常处理等辅助操作。

## 0x03. Spring Boot项目是如何导入包的

通过Spring Boot Starter导入包。其他详见[0x01](#0x01. Spring Boot Starter有什么用).

## 0x04. Spring Boot自动装配过程

使用Spring Boot时，我们只需引入对应的Starter，Spring Boot启动时便会自动加载相关依赖，配置相应的初始化参数，以最快捷、简单的形式对第三方软件进行集成，这便是Spring Boot的自动配置功能。

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/4C6D51AEA1E10E3717A8BE4AE88B6F79.jpg)

整个自动配置的过程是：Spring Boot通过@EnableAutoConfiguration注解开启自动配置，加载spring.factories中的各种AutoConfiguration类，当某个AutoConfiguration类满足其注解@Conditional指定的生效条件（Starters提供的依赖、配置或Spring容器中是否存在某个Bean等）时，实例化该AutoConfiguration类中定义的Bean，并注入Spring容器，就可以完成依赖框架的自动配置。

## 0x05. 说说你对Spring Boot的注解的了解

**@SpringBootApplication**

这个注解时Spring Boot项目的基石，创建Spring Boot项目之后会默认在主类加上。

我们可以把`@SpringBootApplication`看作是`@SpringBootConfiguration`、`@EnableAutoConfiguration`、`@ComponentScan`注解的集合。

* `@EnableAutoConfiguration`：启用Spring Boot的自动装配机制
* `@ComponentScan`：包路径扫描，扫描被@Component注解修饰的Bean
* `@SpringBootConfiguration`：就是`@Configuration`的不同语义的版本，允许在该类中使用`@Bean`实修方法注册额外的Bean或导入其他配置类

**@Import**

`@EnableAutoConfiguration`的关键功能就是通过`@Import`注解导入的`ImportSelector`来完成的。从源码得知`@Import({AutoConfigurationImportSelector.class})`是`@EnableAutoConfiguration`注解的组成部分，也是自动配置功能的核心实现者。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```

**@Conditional**

`@Conditional`注解是由Spring 4.0版本引入的新特性，可根据是否满足指定的条件来决定是否进行Bean的实例化及装配，比如，设定当类路径下包含某个jar包才会对注解的类进行实例化操作。总之，就是根据一些特定条件来控制实例化的行为。

**@Conditional衍生注解**

* `@ConditionalOnBean`：在容器中有指定Bean的时候才会加载
* `@ConditiaonOnMissingBean`：在容器中没有指定Bean的时候才会加载
* 等等

**@RestController**

`@RestController`是`@Controller`和`@ResponseBody`的合集，表示这是个控制器Bean，并且是将函数的返回值直接填入HTTP响应体中，返回JSON或XML形式数据，是REST风格的控制器。

**@Configuration**

一般用来声明配置类，可以用`@Component`注解替代，不过使用`@Configuration`注解声明配置类更加语义化。

**@PathVariable和@RequestParam**

* `@PathVariable`：用于获取路径参数
* `@RequestParam`：用于获取查询参数

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getKlassRelatedTeachers(
         @PathVariable("klassId") Long klassId,
         @RequestParam(value = "type", required = false) String type ) {
...
}
```

如果我们请求的url是：`/klasses/123456/teachers?type=web`

那么我们服务获取到的数据就是：`klassId=123456,type=web`

**@RequestBody**

用于读取Request请求的body部分，并且`Content-Type`为`application/json`格式的数据，接收到数据之后会自动将数据绑定到Java对象上去。系统会使用`HttpMessageConverter`或者自定义的`HttpMessageConverter`将请求的body中的json字符串转换成java对象。

我们有个注册的接口：

```java
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
  userService.save(userRegisterRequest);
  return ResponseEntity.ok().build();
}
```

**UserRegisterRequest对象**

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {
    @NotBlank
    private String userName;
    @NotBlank
    private String password;
    @NotBlank
    private String fullName;
}
```

我们发送post请求到这个接口，并且body携带JSON数据。这样我们的后端就可以直接把JSON格式的数据映射到我们的`UserRegisterRequest`类上。

```json
{"userName":"coder","fullName":"shuangkou","password":"123456"}
```

需要注意的是：**一个请求方法只可以有一个`@RequestBody`，但是可以有多个`@RequestParam`和`@PathVariable`**。 如果你的方法必须要用两个 `@RequestBody`来接受数据的话，大概率是你的数据库设计或者系统设计出问题了！

**@Value和@ConfigurationProperties**

```yaml
wuhan2020: 2020年初武汉爆发了新型冠状病毒，疫情严重，但是，我相信一切都会过去！武汉加油！中国加油！

my-profile:
  name: Guide哥
  email: koushuangbwcx@163.com

library:
  location: 湖北武汉加油中国加油
  books:
    - name: 天才基本法
      description: 二十二岁的林朝夕在父亲确诊阿尔茨海默病这天，得知自己暗恋多年的校园男神裴之即将出国深造的消息——对方考取的学校，恰是父亲当年为她放弃的那所。
    - name: 时间的秩序
      description: 为什么我们记得过去，而非未来？时间“流逝”意味着什么？是我们存在于时间之内，还是时间存在于我们之中？卡洛·罗韦利用诗意的文字，邀请我们思考这一亘古难题——时间的本质。
    - name: 了不起的我
      description: 如何养成一个新习惯？如何让心智变得更成熟？如何拥有高质量的关系？ 如何走出人生的艰难时刻？
```

使用`@Value("${property}")`读取比较简单的配置信息

```java
@Value("${wuhan2020}")
String wuhan2020;
```

通过`@ConfigurationProperties`读取配置信息并于Bean绑定，就可以像使用普通的Bean一样，将其注入到类中使用

```java
@Component
@ConfigurationProperties(prefix = "library")
@Data
@ToString
public class LibraryProperties {

    private String location;
    private List<Book> books;

    @Setter
    @Getter
    @ToString
    static class Book {
        String name;
        String description;
    }
}
```

```java
@Autowired
private LibraryProperties libraryProperties;
```

## 0x06. Spring Boot全局异常处理器

`@ControllerAdvice`开启全局异常处理，使用该注解表示开启了全局异常的捕获，我们只需再自定义一个方法使用`@ExceptionHandler`注解，然后自定义捕获异常类型即可对这些捕获的异常进行统一处理。

```java
// 全局异常处理器
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public String globalExceptionHandler(Exception e) {
        System.out.println("全局异常捕获>>>:" + e);
        return "全局异常捕获,错误原因>>>" + e.getMessage();
    }

}
```

```java
// controller中进行测试
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody UserRegisterRequest userRegisterRequest) {
    testService.save(userRegisterRequest);
    int i = 1 / 0;
    return ResponseEntity.ok(userRegisterRequest);
}
```

结果：

```java
全局异常捕获,错误原因>>>/ by zero
```
