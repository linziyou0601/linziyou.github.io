---
title: "樣板方法模式 Template Method Pattern"
published: 2020-12-01
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

對於方法，**只先定義好演算法的骨架，某些步驟則留給子類別去填埔**，以便在**不改變演算法整體構造**的情況下讓子類別去精鍊某些步驟。

## 適用

- 希望演算法不變之處只寫一次，可變之處則留給子類別去實作時。如果許多子類別都會有共同的行為，就應該抽取出來集中至另一個共同的類別，避免重複。希望能控制子類別的擴充範圍（掛鉤）時。

## 結構及成員

**Collaborations**: ConcreteClass仰賴AbstractClass製作出演算法的不變之處。
![](/uploads/2021/08/template-method-pattern.png)
- AbstractClass: like the Application將完整演算法裡的某些基礎步驟訂為PrimitiveOperation抽象方法，細節留給實體子類別實作。具體實作出TemplateMethod，定義出演算法的整體輪廓。它會呼叫PrimitiveOperation，也會呼叫AbstractClass或其他物件所提供的方法。ConcreteClass: like the MyApplication具體實作出PrimitiveOperation，以實施子類別該有的步驟。

## 影響結果

- 常用於類別庫，因為它們本來就是想將程式庫裡的共同行為萃取出來。造成一種顛倒的控制結構，有時戲稱：「Hollywood Principle」：「Don't call us, we will call you!」。TemplateMethod會呼叫以下幾種方法：實體方法（ConcreteClass的或外界的）AbstractClass的實體方法（即：對一般子類有用的方法）抽象方法（PrimitiveOperation）FactoryMethod（即：把實體化相關程序推遲給子類別去實作）掛鉤方法（hook operation）Template Method有必要明定哪些方法是掛鉤（可被覆寫）、哪些是抽象方法（必須覆寫）。由父類掌握子類可能有的擴充方法，由Template Method會去呼叫掛鉤，讓子類挑選想覆寫的掛鉤，子類比較不會忘記呼叫繼承來的父類方法。

## 實作

#### 減少PrimitiveOperation的數目。愈多要覆寫的方法，別人就得做更多的瑣事

#### 命名慣例：可替應覆寫的方法名稱加上固定的前綴字眼，如「doMethodXXX()」等等。

## Example: Template with Hook

```java
Abstract Class: RobotHookTemplate

package hook.robot;
public abstract class RobotHookTemplate
{
  public final void go()
  {
    start();
    getParts();
    assemble();
    if (testOK()){
      test();
    }
    stop();
  }

  public void start()
  {
    System.out.println("Starting....");
  }

  public void getParts()
  {
    System.out.println("Getting parts....");
  }

  public void assemble()
  {
    System.out.println("Assembling....");
  }

  public void test()
  {
    System.out.println("Testing....");
  }

  public void stop()
  {
    System.out.println("Stopping....");
  }

  public boolean testOK()
  {
    return true;
  }
}
```

```java
Class: CookieHookRobot


package hook.robot;
public class CookieHookRobot extends RobotHookTemplate
{
  private String name;

  public CookieHookRobot(String n)
  {
     name = n;
  }

  public void getParts()
  {
    System.out.println("Getting a flour and sugar....");
  }

  public void assemble()
  {
    System.out.println("Baking a cookie....");
  }

  public String getName()
  {
    return name;
  }

  public boolean testOK()
  {
    return false;
  }

}
```

```java
Class: TestHookTemplate

package hook.robot;
public class TestHookTemplate
{
  public static void main(String args[])
  {
    CookieHookRobot cookieHookRobot =
      new CookieHookRobot("Cookie Robot");

    System.out.println(cookieHookRobot.getName() + ":");
    cookieHookRobot.go();
  }
}
```

```
Result:

Cookie Robot:
Starting....
Getting a flour and sugar....
Baking a cookie....
Stopping....
```
