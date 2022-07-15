---
title: Spring
author: Vingkin
date: 2022-4-24
---

## 列举一些重要的Spring模块

下图对应的是 Spring4.x 版本。目前最新的 5.x 版本中 Web 模块的 Portlet 组件已经被废弃掉，同时增加了用于异步响应式处理的 WebFlux 组件。

![](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/interview/e0c60b4606711fc4a0b6faf03230247a.png)

1. Spring Core：核心模块，Spring其他功能基本都需要依赖于该类库，主要提供IOC依赖注入功能的支持
2. Spring Aspects：该模块为与AspectJ的集成提供支持
3. Spring AOP：提供了面向切面编程的实现
4. Spring Data Access / Integration
   1. spring-jdbc : 提供了对数据库访问的抽象 JDBC。不同的数据库都有自己独立的 API 用于操作数据库，而 Java 程序只需要和 JDBC API 交互，这样就屏蔽了数据库的影响。
   2. spring-tx : 提供对事务的支持。
   3. spring-orm : 提供对 Hibernate 等 ORM 框架的支持。
   4. spring-oxm ： 提供对 Castor 等 OXM 框架的支持。
   5. spring-jms : Java 消息服务。
5. Spring Web
   1. spring-web ：对 Web 功能的实现提供一些最基础的支持。
   2. spring-webmvc ： 提供对 Spring MVC 的实现。
   3. spring-websocket ： 提供了对 WebSocket 的支持，WebSocket 可以让客户端和服务端进行双向通信。
   4. spring-webflux ：提供对 WebFlux 的支持。WebFlux 是 Spring Framework 5.0 中引入的新的响应式框架。与 Spring MVC 不同，它不需要 Servlet API，是完全异步.
6. Spring test：Spring 团队提倡测试驱动开发（TDD）。有了控制反转 (IoC)的帮助，单元测试和集成测试变得更简单。

## 请你说说Spring的核心是什么？

Spring的核心是IoC和AOP

1. `IoC`叫反转控制，就是将对象的控制权交由Spring框架来管理。IOC可以帮助我们维护对象与对象之间的依赖关系，降低对象之间的耦合度。

   说到IoC就不得不说DI，IoC是通过DI来实现的。由于IoC这个词汇比较抽象而DI却更直观，所以很多时候我们就用DI来替代它，在很多时候我们简单地将IoC和DI划等号，这是一种习惯。而实现依赖注入的关键是IoC容器，它的本质就是一个工厂。

   DI主要有两种注入方式：

   1. 构造方法注入
   2. setter方法注入

2. `AOP`是面向切面编程的意思。将那些与业务无关却为业务模块共同调用的逻辑或责任（如事务处理、日志管理和权限管理等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，也有利于未来的可拓展性和可维护性。比如@Transactional注解就是通过AOP实现的。

   Spring AOP是基于动态代理的。如果代理对象实现了某个接口，那么Spring AOP会使用JDK Proxy通过接口去创建代理对象，对于没有实现接口的对象，Spring AOP会使用Cglib生成一个被代理对象的子类来作为代理。

   当然也可以使用AspectJ！

## 说一说对Spring容器的了解

Spring主要提供了两种类型的容器：BeanFactory和ApplicationContext

* `BeanFactory`：是基础类型的IoC容器，是IoC的顶层接口，提供完整的IoC服务支持。如果没有特殊指定，默认采用延迟初始化策略。只有当客户端对象需要访问容器中的某个对象时，该对象才会进行初始化以及依赖注入的操作。所以，相对来说，容器启动初期速度较快，所需要的资源有限。对于资源有限，并且功能要求不是很严格的场景，BeanFactory是比较合适的IoC容器选择。
* `ApplicationContext`：他是在BeanFactory的基础上构建的，是`BeanFactory`的子接口，拥有BeanFactory的所有支持。除此之外，还支持比如事件发布、国际化信息支持（继承了`MessageSource`）等。ApplicationContext所管理的对象，在该类型容器启动之后，默认全部初始化并进行依赖注入。所以，对于BeanFactory而言，ApplicationContext要求更多的系统资源。同时，因为在启动时就完成所有初始化，容器启动的时间较BeanFactory也会长一些。在那些系统资源充足，并且要求更多功能的场景中，ApplicationContext类型的容器是比较合适的选择。

## 说一说对BeanFactory的了解

其实就是说上面的，包括`ApplicationContext`

BeanFactory是一个类工厂，与传统类工厂不同的是，BeanFactory是类的通用工厂，可以创建并管理各种类的对象。这些被创建和管理的对象叫做Bean。

BeanFactory是Spring容器的顶层接口，Spring为BeanFactory提供了很多实现，比较常用的比如`AnnotationConfigApplicationContext`，常用的方法比如`getBean()`获取指定名称的Bean。

`BeanFactory`本身并不会自动解析像`@Bean`,`@Autowired`,`@Resources`这些注解的功能，如果想要通过`BeanFactory`实现这些功能，则需要向`BeanFactory`添加一些后置处理器来解析这些注解，从而将相关Bean加入到IoC容器中。

## Spring是如何管理Bean的

Spring通过IoC来管理Bean，我们可以通过XML配置或者注解来进行配置。

以下是管理Bean时常用的一些注解：

1. `@ComponentScan`：用于声明扫描策略。通过它的声明，Spring就知道要哪些包下带声明的类需要被扫描。
2. `@Component`，`@Repository`，`@Service`，`@Controller`用于类上声明Bean，他们的作用一样，只是语义不同。`@Component`用于声明通用的Bean，`@Repository`用于声明DAO层的Bean，`@Service`用于声明业务层的Bean，`@Controller`用于声明视图层的控制器Bean，被这些注解声明的类当被扫描到时就会创建对应的Bean
3. `@Autowired`，`@Qualifier`，`@Resource`，`@Value`用于注入Bean。`@Autowired`用于按类型注入，`@Qualifier`指定Bean名称注入需要与`@Autowired`一起使用，`@Resource`既可以按类型注入也可以指定Bean名称注入，@Value适用于注入基本类型。
4. `@Scope`用于声明Bean的作用域。
5. `@PostConstruct`，`@PreDestory`用于声明Bean的生命周期。其中被`@PostConstruct`修饰的发给发将在Bean实例化后被调用，`@PreDestory`修饰的方法将在容器销毁前调用。

## Bean的作用域

默认情况下，Bean在Spring容器中是单例的，可以通过@Scope注解修改Bean的作用域。

| 类型          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| singleton     | 单例Bean，默认                                               |
| prototype     | 每次请求都会创建一个新的bean实例                             |
| request       | 每一次HTTP请求都会产生一个新的Bean                           |
| session       | 同一个HTTP Session共享一个Bean，不同的HTTP Session使用不同的Bean |
| globalSession | 同一个全局的Session共享一个Bean，一般用于Portlet环境         |

## Bean的生命周期

![Bean的生命周期](https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/os/7EF8F66C3DFA7434E4CA11B47CF8F1F7.png)

1. 解析类得到`BeanDefinition`
2. 通过构造方法实例化得到一个对象（如果有多个构造方法，则要推断使用）
3. 对加了`@Autowired`或者相关注解对对象进行依赖注入
4. 回调`Aware`接口的方法，比如`BeanNameAware`中`setBeanName()`方法，`BeanFactoryAware`中`setBeanFactory()`方法。
5. 调用`BeanPostProcessor`的初始化前的方法
6. 调用初始化方法
7. 调用`BeanPostProcessor`的初始化后的方法，这会进行AOP
8. 如果当前创建的Bean是单例的则会放入单例池
9. 使用Bean
10. Spring容器关闭时调用`DisposableBean`中的`destory()`方法

**整个过程是Spring容器自动管理的，其中有两个环节我们可以进行干预**

1. 我们可以自定义初始化方法，并在该方法前增加`@PostConstruct`注解，Spring容器将在调用setBeanFactory()方法之后调用该方法
2. 我们可以自定义销毁方法，并在该方法前增加`@PreDestory`注解，Bean将在自身销毁前调用这个方法

## 单例Bean的线程安全问题了解吗

> 要是问Bean的线程安全问题需要考虑单例Bean还是多例Bean，多例Bean不存在线程安全问题

单例Bean存在线程安全问题，主要是因为当多个线程操作同一个对象的时候存在共享资源竞争的问题。

两种解决方法：

1. 在Bean中尽量避免定义可变的成员变量。
2. 在类中定义一个ThreadLocal成员变量，将需要的可变成员变量保存在ThreadLocal中

不过，大部分Bean实际都是无状态（没有实例变量）的（比如Dao、Service），这种情况下，Bean是线程安全的。

## @Component和@Bean的区别是什么？

1. `@Component`注解作用于类，通常是通过类路径扫描（`@ComponentScan`）自动侦测以及自动装配到Spring容器中。而@Bean注解作用于方法，将当前方法的返回值存入IOC容器。
2. `@Bean`注解比`@Component`注解的自定义性更强，而且很多地方我们只能通过`@Bean`注解来注册Bean。比如当我们引用第三方库中的类需要装配到Spring容器中时，只能通过`@Bean`来实现。

## Spring AOP和AspectJ AOP的区别？

1. Spring AOP输入运行时增强，而AspectJ是编译时增强。
2. Spring AOP基于代理，而AspectJ基于字节码操作。

## 说说AOP的应用场景

Spring AOP为IoC的使用提供了更多的便利。一方面，应用可以直接使用AOP的功能，设计应用的横切关注点，把跨应用的多个模块功能抽象出来，通过AOP编织到模块中，比如可以通过AOP实现应用程序中的日志功能。

另一方面，在Spring内部，事务处理也是通过AOP实现的。

## Spring AOP不能对哪些类进行增强

1. Spring AOP只能对IoC容器中的Bean进行增强，对于不受容器管理的对象不能增强。
2. 由于CGLib采用动态创建子类的方式生成代理对象，所以不能对final修饰的类进行代理。

## 既然没有接口都可以用CGLib，为什么Spring还要使用JDK动态代理

在性能方面，CGLib创建的代理对象比JDK动态代理创建的代理对象高很多。但是，CGLib在创建代理对象时所花费的时间比JDK动态代理多很多。所以，对于单例的对象无需频繁创建代理对象，采用CGLib比较合适。反之，对于多例的对象因为要频繁创建代理对象，则JDK动态代理更合适。

## Spring是如何管理事务的

1. **编程式事务**：Spring提供了`TransactionTemplate`和`TransactionManager`手动管理事务。这种方式相对麻烦，实际应用中很少使用。
2. **声明式事务**：在XML配置文件中配置或者直接基于注解（推荐使用），实际是通过AOP实现的（基于`@Transactional`的全注解方式使用最多）

## Spring中的事务传播行为

当我们调用一个业务方法时，它的内部可能会调用其他的业务方法，以完成一个完整的业务操作。这种业务方法嵌套调用的时候，如果这两个方法都是要保证事务的，那么就要通过Spring的事务传播机制控制当前事务如何传播到被嵌套调用的业务方法中。

Spring在`TransactionDefinition`接口中规定了其中类型的事务传播行为。

| 事务传播类型              | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_REQUIRED      | 如果当前没有事务，则新建一个事务；如果已存在一个事务，在加入到这个事务中。这时最常见的选择，也是`@Transactional`的默认选项。 |
| PROPAGATION_REQUIRED_NEW  | 创建一个新的事务，如果当前存在事务，则把当前事务挂起。也就是说不管外部方法是否开启事务，REQUIRES_NEW修饰的内部方法都会开启自己的新事务，且开启的事务互相独立，互不干扰。 |
| PROPAGATION_NESTED        | 如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行，如果当前没有事务，则等价于PROPAGATION_REQUIRED（nested：嵌套的） |
| PROPAGATION_MANDATORY     | 如果当前存在事务，则加入该事务；如果不存在则抛出异常。（mandatory：强制性） |
| PROPAGATION_SUPPORTS      | 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务方式继续运行 |
| PROPAGATION_NOT_SUPPORTED | 以非事务方式运行，如果当前存在事务，则把当前事务挂起         |
| PROPAGATION_NEVER         | 以非事务方式运行，如果当前存在事务，则抛出异常               |

> 若是错误的配置了以下三种事务传播行为，事务将不会发生回滚。

## Spring的事务如何配置，常用注解有那些？

事务的打开、回滚和提交是由**事务管理器**来完成的，我们使用不同的数据库访问框架，就要使用与之对应的**事务管理器**。在Spring Boot中，当你添加了数据库访问框架的起步依赖时，他就会进行自动配置，即自动实例化正确的事务管理器。

对于声明式事务，是使用`@Transactional`进行标注的。这个注解可以标注在类或者方法上。

* 当他标注在类上时，代表着各类所有公共（public）非静态方法（static）都将启用事务功能
* 当它标注在方法上时，代表这个方法将启用事务功能。

另外，在`@Transactional`注解上，我们可以使用`isolation`属性声明事物的隔离级别，使用`propagation`属性声明事物的传播行为。

## @Transactional(rollbackFor = Exception.class)注解了解吗

Exception分为运行时异常和非运行时异常。

在`@Transactional`注解中如果不配置`rollbackFor`属性，那么事务只会在遇到`RuntimeException`的时候才会回滚，加上`rollbackFor=Exception.class`，可以让事务在遇到非运行时异常时也会回滚。

## @Transactional失效场景

1. `@Transaction`应用再非public修饰的方法上
2. `@Transaction`注解属性`propagation`设置错误，上面写的传播行为后三个会使之失效
3. `@Transactional`注解属性`rollbackFor`设置错误
4. 数据库引擎不支持事务，只有InnoDB支持事务

## Spring是怎么解决循环依赖的

TODO