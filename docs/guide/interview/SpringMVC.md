---
title: SpringMVC
author: Vingkin
date: 2022-4-24
---

## 0x00. 什么是MVC

MVC是一种设计模式，在这种模式下软件被分为三层，及**Model（模型）、View（视图）、Controller（控制器）**。Model代表的是数据，View代表的是用户界面，Controller代表的是数据的处理逻辑，它是Model和View这两层的桥梁。将软件分层的好处是，可以将对象之间的耦合度降低，便于代码的维护。

## 0x01. DAO层是做什么的

DAO层是Data Access Object的缩写，即数据访问对象，在项目中它通常作为独立的一层，专门用于访问数据库。

## 0x02. 介绍一下Spring MVC的执行流程

1. 整个过程开始于客户端发出一个HTTP请求，Web应用服务器接受到这个请求。如果匹配`DispatcherServlet`的请求路径，则Web容器将该请求转交给`DispatcherServlet`处理。
2. `DispatcherServlet`接收到这个请求后，将根据请求的信息（包括URL、HTTP方法、请求报文头、请求参数、Cookie等）及`HandlerMapping`的配置找到处理请求的处理器（`Handler`）。可将`HandlerMapping`看作路由控制器，将`Handler`看作目标主机。
3. 当`DispatcherServlet`根据`HandlerMapping`得到对应请求的`Handler`后，通过`HandlerAdapter`对`Handler`进行封装，再以统一的适配器接口调用`Handler`。`HandlerAdapter`是Spring MVC框架的接口，顾名思义，`HandlerAdapter`是一个适配器，它用统一的接口对各种Handler方法进行调用。
4. 处理器完成业务逻辑的处理后，将返回一个`ModelAndView`给`DispatcherServlet`，`ModelAndView`包含了视图逻辑名和模型数据信息。
5. `ModelAndView`中包含的是“逻辑视图名”而非真正的视图对象，`DispatcherServlet`借由`ViewResolver`完成逻辑视图名到真实视图对象的解析工作。
6. 当得到真实的视图对象View后，`DispatcherServlet`就用这个View对象对`ModelAndView`中的模型数据进行视图渲染。
7. 最终客户端得到的响应消息可能是有一个普通的HTML页面，也可能是一个XML或JSON串，甚至是一张图片或一个PDF文档等不同的媒体形式。

**简略版本：**

1. 用户发送请求至前端控制器`DispatcherServlet`
2. `DispatcherServlet`收到请求调用`HandllerMapping`处理器映射器
3. 处理器映射器找到具体的处理器（`Handler`）（可以根据xml配置，注解进行查找），生成处理器对象以及处理器拦截器（如果有拦截器则生成）一并返回给`DispatcherServlet`
4. `DispatcherServlet`调用`HandlerAdapter`处理器适配器
5. `HandlerAdapter`经过适配调用具体的处理器（`Controller`，也叫后端控制器）
6. `Controller`执行完成后返回`ModelAndView`
7. `HandlerAdapter`将`Controller`执行结果`ModelAndView`返回给`DispatcherServlet`
8. `DispatcherServlet`将`ModelAndView`传给`ViewReslover`视图解析器
9. `ViewReslover`解析后返回具体`View`
10. `DispatcherServlet`根据`View`进行渲染视图。（最终客户端得到的响应消息可能是有一个普通的HTML页面，也可能是一个XML或JSON串，甚至是一张图片或一个PDF文档等不同的媒体形式。）

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/SpringMVC%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png)

## 0x03. 说一说你知道的Spring MVC注解

**@RequestMapping**

该注解的作用就是用来处理请求地址映射的，也就是说将其中的处理器方法映射到url路径上

属性：

* mothod：请求类型，比如get和post
* value：请求地址

**@RequestParam**

是将请求参数绑定到控制器的方法参数上，是Spring MVC中的接收普通参数的注解

**@RequestBody**

用于读取Request请求的body部分，并且`Content-Type`为`application/json`格式的数据，接收到数据之后会自动将数据绑定到Java对象上去。系统会使用`HttpMessageConverter`或者自定义的`HttpMessageConverter`将请求的body中的json字符串转换成java对象。

```java
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody UserRegisterRequest userRegisterRequest) {
    testService.save(userRegisterRequest);
    return ResponseEntity.ok(userRegisterRequest);
}
```

**@PathVariable**

该注解适用于绑定url中的占位符。是Spring MVC支持rest风格的一个重要标志。

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getKlassRelatedTeachers(
         @PathVariable("klassId") Long klassId,
         @RequestParam(value = "type", required = false) String type ) {
}
```

## 0x04. 介绍一下Sprig MVC的拦截器

> 可以拓展一下SSO单点登录来讲项目
>
> [Session的工作原理和使用经验 - Ken的杂谈](https://ken.io/note/session-principle-skill)
>
> [SSO 单点登录 | JavaGuide](https://javaguide.cn/system-design/security/sso-intro.html)
>
> [SpringBoot实现登录拦截器（实战版） - 掘金 (juejin.cn)](https://juejin.cn/post/6975413007715139621)

拦截器会对处理器进行拦截，这样通过拦截器就可以增强处理器的功能。Spring MVC中，所有的拦截器都需要实现HandlerInterceptor接口，该接口中包含如下三个方法：`preHandle()`,`postHandle()`,`afterCompletion()`。

这些方法的执行流程如下图：

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/31C010B3F63CB1CC1ADC5481E9E77BDB.png)

通过上图可以看出，Spring MVC拦截器的执行流程如下：

* 执行`preHandle`方法，它会返回一个布尔值。如果为false，则结束所有流程，如果为true，则执行下一步。
* 执行处理器逻辑，它包含控制器的功能
* 执行`postHandler`方法
* 执行视图解析和视图渲染
* 执行`afterCompletion`方法

Spring MVC拦截器的开发步骤如下：

1. **开发拦截器**：实现`HandlerInterceptor`接口，从三个方法中选择合适的方法，实现拦截时需要执行的具体业务逻辑，一般使用`preHandle`方法。
2. **注册拦截器**：定义配置类，并让它实现`WebMvcConfigurer`接口，在接口的`addInterceptors`方法中，注册拦截器，并定义该拦截器匹配那些请求路径。

