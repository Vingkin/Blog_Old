---
title: JDK8新特性
author: Vingkin
date: 2023-8-8
---

## Lambda

lambda针对函数式接口进行简化编程，相对还算比较容易。

在排序方面比较常用，示例如下：

```java
Collections.sort(employees, (e1, e2) -> {
            if (e1.getAge() == e2.getAge()) {
                return e2.getName().compareTo(e1.getName());
            }
            return Integer.compare(e1.getAge(), e2.getAge());
        });
```

我们还可以自己定义函数式接口完成相关操作，示例如下：

```java
/**
 * 1 声明函数式接口，接口中声明抽象方法，public String getValue(String str);
 * 2 声明类 Test，类中编写方法使用接口作为参数，将一个字符串转换成大写并作为方法的返回值。
 * 3 再将一个字符串的第 2个和第 4 个索引位置进行截取子串。
 **/
public class Test {

    public static String strHandler(String str, MyFunction t) {
        return t.getValue(str);
    }

    public static void main(String[] args) {
        String str = "abcdEfG";
        String s1 = strHandler(str, s -> s.toUpperCase());
        System.out.println(s1);
        String s2 = strHandler(str, s -> s.substring(2, 5));
        System.out.println(s2);
    }
}

@FunctionalInterface
interface MyFunction {
    String getValue(String str);
}
```

除此之外，Java拥有**四大内置函数式接口**，其区别在于参数和返回值有所区别：

```java
Consumer< T > : 消费型接口
void accept(T t);

// 产生指定个数整数并放入集合中
Supplier< T > : 供给型接口
T get();

// 处理字符串
Function< T, R > : 函数型接口
R apply(T t);

// 将满足条件的字符串添加到集合中去
Predicate< T > : 断言型接口
boolean test(T t);
```

## Stream

默认有如下数据：

```java
static List<Employee> employees = Arrays.asList(
    new Employee("张三", 33, 6666.66, StatusEnum.BUSY),
    new Employee("李四", 23, 5555.66, StatusEnum.BUSY),
    new Employee("王五", 33, 4444.66, StatusEnum.BUSY),
    new Employee("赵六", 43, 3333.66, StatusEnum.BUSY),
    new Employee("田七", 53, 2222.66, StatusEnum.BUSY),
    new Employee("田七", 53, 2222.66, StatusEnum.BUSY)
);
```

### 筛选与切片

* **filter--** 接收 Lambda，从流中排除某些元素。
* **limit--** 截断流，使其元素不超过给定数量。
* **skip(n)--** 跳过元素，返同一个扔了前n个元素的流。若流中元素不足n个，则返回一个空流。与与limit(n)互补
* **distinct--** 筛选，通过流所生成元素的hashCode()和equals()去除重复元素

```java
employees.stream()
    .filter(t -> t.getAge() > 30)
    .limit(2)
    .distinct()
    .forEach(System.out::println);
```

### 映射

* **map--** 接收Lambda，将元素转换成其他形式或提取信息。接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素
* **flatMap--** 接收一个的函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流

```java
public class Test2 {

    public static void main(String[] args) {

        List<String> list = Arrays.asList("aaa", "bbb", "ccc", "ddd");
        Stream<Stream<Character>> streamStream = list.stream()
                .map(Test2::filterCharacters); // {{a,a,a},{b,b,b}...}
        streamStream.forEach(str -> str.forEach(System.out::println));
        System.out.println("---------------------");

        Stream<Character> characterStream = list.stream()
                .flatMap(Test2::filterCharacters); // {a,a,a,b,b,b...}
        characterStream.forEach(System.out::println);

    }

    private static Stream<Character> filterCharacters(String str) {
        List<Character> list = new ArrayList<>();
        for (Character c : str.toCharArray()) {
            list.add(c);
        }
        return list.stream();
    }
}
```

### 排序

* **sorted()--** 自然排序
* **sorted(Comparator com)--** 定制排序

```java
employees.stream()
    .sorted(Comparator.comparingInt(Employee::getAge))
    .forEach(System.out::println);
```

### 查找与匹配

* **allMatch--** 检查是否匹配所有元素
* **anyMatch--** 检查是否至少匹配一个元素
* **noneMatch--** 检查是否没有匹配所有元素
* **findFirst--** 返回第一个元素
* **findAny--** 返回当前流中的任意元素
* **count--** 返回流中元泰的总个数
* **max--** 返回流中最大值
* **min--** 返回流中最小值

```java
boolean b = employees.stream()
    .noneMatch(s -> s.getStatus().equals(StatusEnum.VOCATION));
System.out.println(b);

Optional<Employee> first = employees.stream()
    .sorted(Comparator.comparingInt(Employee::getAge))
    .findFirst();

System.out.println(first.get());
```

### 规约

**reduce(T identity, BinaryOperator) / reduce(BinaryOperator)**：可以将流中元素反复结合起来，得到一个值。

```java
List<Integer> list = Arrays.asList(1, 3, 4, 5, 6, 7, 8, 9);

        // 累加
        Integer sum = list.stream()
                .reduce(0, Integer::sum);
        System.out.println(sum);

        // 工资总和
        Double allSalary = employees.stream()
                .map(Employee::getSalary)
                .reduce(0D, Double::sum);
        System.out.println(allSalary);

        DoubleSummaryStatistics dss = employees.stream()
                .collect(Collectors.summarizingDouble(Employee::getSalary));
        System.out.println(dss.getSum());
```

### 收集

**collect--** 将流转换为其他形式。接收一个**Collector**接口的实现，用于**Stream**中元素做汇总的方法。

```java
List<String> names = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.toList());
names.forEach(System.out::println);

System.out.println("--------------------------------");

HashSet<String> collect = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.toCollection(HashSet::new));

System.out.println("--------------------------------");

employees.stream()
    .collect(Collectors.toMap(Employee::getName, Function.identity()))
    .forEach((k, v) -> {
        System.out.println(k + " " + v);
    });

System.out.println("--------------------------------");

Employee employee = employees.stream()
    .max(Comparator.comparingDouble(Employee::getSalary))
    .get();
System.out.println(employee);

Double aDouble = employees.stream()
    .map(Employee::getSalary)
    .min(Double::compare)
    .get();
System.out.println(aDouble);

System.out.println("--------------------------------");

Map<StatusEnum,  List<Employee>> collect1 = employees.stream()
    .collect(Collectors.groupingBy(Employee::getStatus));
System.out.println(collect1);
```
