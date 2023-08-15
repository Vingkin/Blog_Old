---
title: 策略模式
author: Vingkin
date: 2023-8-15
---

> 可见《图解设计模式》Strategy模式篇

## 概述

使用Strategy模式可以整体地替换算法的实现部分。能够整体地替换算法，能让我们轻松地以不同的算法去解决同一个问题，这种模式就是Strategy模式。

通常在编程时算法会被写在具体的方法中。Strategy模式却特意将算法与其他部分分离开，只是定义了与算法相关的接口（API），然后再程序中以委托的方式来使用算法。**使用委托这种弱关联关系可以很方便地整体替换算法。**例如使用Strategy模式编写象棋程序时，可以方便地根据棋手的选择切换AI例程的水平。

## 结构

<img src="https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/img/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20230814170836.png" style="zoom:50%;" />

* **Strategy（策略）**

  Strategy角色负责决定实现策略所必需的接口（API）。

* **ConcreteStrategy（具体的策略）**

  ConcreteStrategy角色负责实现Strategy角色的接口（API），即负责实现具体的策略。

* **Context（上下文）**

  负责使用Strategy角色。Context角色保存了ConcreteStrategy角色的实例，并使用ConcreteStrategy角色去实现需求。

## 示例

| 名字            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| Hand            | 表示猜拳中的”手势“的类                                       |
| Strategy        | 表示猜拳游戏中的策略的类                                     |
| WinningStrategy | 表示“如果这局猜拳获胜，那么下一局也出一样的手势”这一策略的类 |
| ProbStrategy    | 表示“根据上一局的手势从概率上计算出下一局的手势从这前的猜拳结果计算下一局出各种拳的概率”这一策略的类 |
| Player          | 表示进行猜拳游戏的选手类                                     |

<img src="https://vingkin-1304361015.cos.ap-shanghai.myqcloud.com/img/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20230814171158.png" style="zoom:50%;" />

```java
public class Hand {
    public static final int HANDVALUE_GUU = 0;
    public static final int HANDVALUE_CHO = 1;
    public static final int HANDVALUE_PAA = 2;

    public static final Hand[] hand = {
            new Hand(HANDVALUE_GUU),
            new Hand(HANDVALUE_CHO),
            new Hand(HANDVALUE_PAA)
    };

    private static final String[] name = {
            "石头", "剪刀", "布"
    };

    // 表示猜拳中出的手势值
    private int handvalue;

    private Hand(int handvalue) {
        this.handvalue = handvalue;
    }

    public static Hand getHand(int handvalue) {
        return hand[handvalue];
    }

    // 如果this战胜了h返回true
    public boolean isStrongerThan(Hand h) {
        return fight(h) == 1;
    }

    // 如果this输给了h返回true
    public boolean isWeakerThan(Hand h) {
        return fight(h) == -1;
    }

    // 计分：平 0，胜 1，负-1
    private int fight(Hand h) {
        if (this == h) {
            return 0;
        } else if ((this.handvalue + 1) % 3 == h.handvalue) {
            return 1;
        } else {
            return -1;
        }
    }

    @Override
    public String toString() {
        return name[handvalue];
    }
}
```

```java
public interface Strategy {
    // 获取下一局要出的手势
    Hand nextHand();
	// 上一局的手势是否获胜
    void study(boolean win);
}

```

```java
public class WinningStrategy implements Strategy {
    private Random random;
    private boolean won = false;
    private Hand prevHand;
    public WinningStrategy(int seed) {
        random = new Random(seed);
    }
    
    @Override
    public Hand nextHand() {
        if (!won) {
            prevHand = Hand.getHand(random.nextInt(3));
        }
        return prevHand;
    }

    @Override
    public void study(boolean win) {
        won = win;
    }
}
```

```java
public class ProbStrategy implements Strategy {

    private Random random;
    private int preHandValue = 0;
    private int currentHandValue = 0;
    private int[][] history = {
            {1, 1, 1,},
            {1, 1, 1,},
            {1, 1, 1,}
    };
    public ProbStrategy(int seed) {
        random = new Random(seed);
    }

    @Override
    public Hand nextHand() {
        int bet = random.nextInt(getSum(currentHandValue));
        int handvalue = 0;
        if (bet < history[currentHandValue][0]) {
            handvalue = 0;
        } else if (bet < history[currentHandValue][0] + history[currentHandValue][1]) {
            handvalue = 1;
        } else {
            handvalue = 2;
        }
        preHandValue = currentHandValue;
        currentHandValue = handvalue;
        return Hand.getHand(handvalue);
    }

    private int getSum(int hv) {
        int sum = 0;
        for (int i = 0; i < 3; i++) {
            sum += history[hv][i];
        }
        return sum;
    }

    @Override
    public void study(boolean win) {
        if (win) {
            history[preHandValue][(currentHandValue + 1) % 3]++;
            history[preHandValue][(currentHandValue + 2) % 3]++;
        }
    }
}
```

```java
public class Player {
    private String name;
    private Strategy strategy;
    private int wincount;
    private int losecount;
    private int gamecount;

    public Player(String name, Strategy strategy) {
        this.name = name;
        this.strategy = strategy;
    }

    public Hand nextHand() {
        return strategy.nextHand();
    }

    public void win() {
        strategy.study(true);
        wincount++;
        gamecount++;
    }

    public void lose() {
        strategy.study(false);
        losecount++;
        gamecount++;
    }

    public void even() {
        gamecount++;
    }

    @Override
    public String toString() {
        return "[" + name + ":" + gamecount + " games, " + wincount + " win, " + losecount + " lose" + "]";
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        int seed1 = 314;
        int seed2 = 15;
        Player tara = new Player("Tara", new WinningStrategy(seed1));
        Player hana = new Player("Hana", new ProbStrategy(seed2));
        for (int i = 0; i < 10000; i++) {
            Hand nextHand1 = tara.nextHand();
            Hand nextHand2 = hana.nextHand();
            if (nextHand1.isStrongerThan(nextHand2)) {
                System.out.println("Winner:" + tara);
                tara.win();
                hana.lose();
            } else if (nextHand2.isStrongerThan(nextHand1)) {
                System.out.println("Winner:" + hana);
                tara.lose();
                hana.win();
            } else {
                System.out.println("Even...");
                tara.even();
                hana.even();
            }
            System.out.println("Total result:");
            System.out.println(tara);
            System.out.println(hana);
        }

    }
}
```

```
...
Winner:[Hana:9999 games, 3079 win, 3493 lose]
Total result:
[Tara:10000 games, 3493 win, 3080 lose]
[Hana:10000 games, 3080 win, 3493 lose]
```

