---
title: "命令模式 Command Pattern"
published: 2020-10-06
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

**將訊息（請求）封裝成物件**，可以參數化具有不同請求、佇列或日誌請求的Client，並且支援復原動作。

## 適用

- 想用「欲執行之動作」來參數化物件。（登記成Callback Function）。在不同時間、佇列、執行命令時。支援復原動作。支援日誌功能，系統Crash時能再重新執行。以基礎操作組出高階的系統（常見於支援交易功能的資訊系統中）。

## 結構及成員

**Collaborations**: 
**Client建立ConcreteCommand物件**並設定Receiver。
**Invoker物件會將ConcreteCommand存起來**。
Invoker呼叫所存Command之**Execute()**，若Command是可復原的，ConcreteCommand就會在**執行Execute()前先儲存狀態**。
ConcreteCommand物件呼叫所載Receiver之操作，以真正執行命令。
![](/uploads/2021/08/command-participants.png)
- Command:制訂執行命令之介面。ConcreteCommand: like the CopyCommand, PasteCommand將Receiver物件和對應的動作繫結起來。實作Execute()：呼叫Receiver的對應操作。Client: like the Application建立ConcreteCommand物件並設定它的Receiver。Client基本上會持有Invoker並使用setCommand設定ConcreteCommand。Invoker: like the MenuItem要求Command執行命令。Receiver: like the Document, Application, etc.知道如何根收到的訊息執行命令，任何類別都可以是Receiver。

## 影響結果

### 好處

- Command將「引發命令的物件」與「知道如何執行的物件」隔離開來。Command是一級物件（First-Class Object），可和一般物件一樣使用及擴充。容易新增新的Command類型，不必更改既有類別。

### 壞處

- 會導致大量瑣碎的命令子類別。

## 實作

#### Command該有多聰明？

一個極端是只定義訊息接收者和執行動作之間的繫結關係，**將任務全部委託給接收者**，另一個極端是**全都自己來**，不轉傳給接收者。
- 若想把Command與既有類別彼此獨立，或沒有合用的接收者存在，或Command自己知道接收者是誰（如：再產生一個視窗），那可以使用後者。在這兩個極端中間，Command必須具有足夠的知識動態尋得訊息接收者。

#### 支援復原與重做

**只要有辦法逆轉執行動作，Command就有復原及重做的能力**。故ConcreteCommand可能得存放以下這些狀態：
- Receiver物件，負責實際執行所要求的命令。餵給Receiver對應操作的參數。在執行操作後，所有可能有變動的Receiver原始內容。Receiver必須提供某些操作以供復原。

若想支援一層復原，則**必須儲存最後執行的Command**；若要多層，就要一個**Command History List**。

置入歷程列表前，若Command執行後狀態會變（如：DeleteCommand），就先複製一份，確保每次啟用的Command都是乾淨的。（i.e. Prototype Pattern）

#### 避免復原過程中不斷累積錯誤

在Command裡多存一點資訊，以確保物件能真的回復到最初狀態。可用Memento Pattern來存。

## Example: SimpleRemoteControl

```java
public class Light {

    public Light() {}

    public void on() {
        System.out.println("Light is on");
    }

    public void off() {
        System.out.println("Light is off");
    }

}
```

```java
public class GarageDoor {

    public GarageDoor() {}
    public void up() {
        System.out.println("Garage Door is Open");
    }

    public void down() {
        System.out.println("Garage Door is Closed");
    }

    public void stop() {
        System.out.println("Garage Door is Stopped");
    }

    public void lightOn() {
        System.out.println("Garage light is on");
    }

    public void lightOff() {
        System.out.println("Garage light is off");
    }
public void Off() {
        System.out.println("Garage Door is off");
    }
}
```

```java
public interface Command {
    public void execute();
}
```

```java
public class GarageDoorOpenCommand implements Command {
     //Have its suitable receiver
    GarageDoor garageDoor;
     //Specify the Constructor
    public GarageDoorOpenCommand (GarageDoor garageDoor) {
        this.garageDoor = garageDoor;
    }

    //Execute the garageDoor.up() function
    @Override
    public void execute() {
        // TODO Auto-generated method stub
        garageDoor.up();
    }

}
```

```java
//Then describe the LightOnCommand implements Command
public class LightOnCommand implements Command {

    Light light;

    public LightOnCommand (Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        // TODO Auto-generated method stub
        light.on();
    }

}
```

```java
public class SimpleRemoteControl {

    Command slot;

    public SimpleRemoteControl() {}

	//Describe the important function of the invoker
    public void setCommand(Command command) {
        this.slot = command;
    }

    public void buttonWasPressed() {
        slot.execute();
    }
}
```

```java
public class SimpleRemoteControlClient{

    public static void main(String[] args) {
        Light light = new Light();
        GarageDoor garageDoor = new GarageDoor();
        SimpleRemoteControl remoteControl = new SimpleRemoteControl();

        Command lightOnCommand = new LightOnCommand(light);
        remoteControl.setCommand(lightOnCommand);
        remoteControl.buttonWasPressed();

        Command garageDoorOpenCommand = new GarageDoorOpenCommand(garageDoor );
        remoteControl.setCommand(garageDoorOpenCommand );
        remoteControl.buttonWasPressed();
    }
}
```

```
Result:

Light is on
Garage Door is Open
```
