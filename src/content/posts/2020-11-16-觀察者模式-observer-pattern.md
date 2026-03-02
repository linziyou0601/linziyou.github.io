---
title: "觀察者模式 Observer Pattern"
published: 2020-11-16
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

定義**一對多**的物件依存關係，讓**物件狀態一有變動**，**就自動通知**其他相依物件做該做的更新動作。

## 適用

- 當一個抽象觀念有兩個層面，且其中一方會依賴另一方時。可將它們分別置於兩種物件上，以便於個別改變及再利用。某一物件有變化時，其他物件也得跟著改變，但事先又不知道後者到底有多少時。當物件必須能夠通知其他物件，但又不能假設後者（其他物件）是誰；換句話說，不希望這些物件之間連結得過於緊密時。

## 結構及成員

**Collaborations**: 
當**ConcreteSubject**產生足以**讓Observer的狀態不再一致**時，就會**主動通知**所有該通知的**Observer**。
當**ConcreteObserver收到通知後**，可向Subject洽詢資訊，利用取回的資訊**同步化自己的狀態**。

※如下方Sequence Diagram所示，**ConcreteObserver物件會將自我更新的動作延後到aConcreteSubject通知後才執行**。且**Notify()不一定得由Observer發動**，也可以由Subject或其他物件發動。
![](/uploads/2021/08/observer-sequence.png)
![](/uploads/2021/08/observer-participants.png)
- Subject: like the JComponent認得Observer。任何數量的Observer物件均可訂閱此Subject。提供增刪Observer物件的介面。Observer: like the ActionListener制訂自我更新的介面。在Subject有變時藉以通知自己該隨之改變。ConcreteSubject: like the JButton儲存ConcreteSubject物件感興趣的狀態。狀態有變時會通知它的Observer。ConcreteObserver: like the ButtonActionListener持有一個ConcreteSubject。儲存應該要和Subject保持一致的狀態。實作出Observer的自我更新介面，確保與Subject的狀態維持同步。

## 影響結果

### 好處

- Subject與Observer之間屬於抽象耦合。因為Subject只知道有一堆Observer物件，但不知道他們的具體類別是誰。支援廣播功能。

### 壞處

- 不預期的更新。由於Observer們互不知道彼此存在，所以可能改變到Subject會有連鎖反應，所以要妥善制訂或維護相依關係。

## 實作

#### 將Subject對應到Observer

- Observer們儲存在Subject裡，耗空間，速度快。Observer們儲存在雜湊表裡，省空間，速度慢。

#### 訂閱一個以上的Subject

擴充Update()介面，**讓Observer知道究竟是哪一個Subject送來訊息，也可以讓Subject把自己當參數傳給Update()**。

#### 誰負責觸發更新程序？

- 由Subject的狀態設定方法，在改變Subject狀態後呼叫Notify()。優點：Client不用自己呼叫Notify()。缺點：如果有一連串的狀態設定動作，會引發一連串的Notify()，沒有效率。由Client在適當時間呼叫Notify()。優點：一連串狀態都改變好再呼叫Notify()。缺點：容易出錯。

#### 仍指涉至已刪除的Subject

當Subject刪除後，應主動通知Observer刪除Subject的Reference。

#### 確保Subject的狀態在知會他人之前就已經是完好無缺的

- 因為更新過程中，Observer會跑來洽詢Subject的目前狀態。如：子類別呼叫父類別的方法時，很容易違反這項規定。可以用template method提供子類別覆寫Subject所提供的基礎操作，並在最後一個步驟才呼叫Notify()。

#### 避免與特定Observer相關的更新協定：Push及Pull模型

- 實作時，通常會讓Subject多廣播一些客外的資訊，資訊多寡有很大的彈性。Push Model（推播模型）：不管Observer要不要，Subject都會送出最詳盡的資訊。（Subject或多或少知道Observer的個別需求）Pull Model（拉力模型）：Subject只送出最少量的資訊，不夠的話，Observer再自己跟Subject取得細節。（Subject不知道Observer的個別需求）

#### 明確指定感興趣的變動

- 擴充Subject的登記介面，讓Observer只登記感興趣的事件。有事件發生時，只通知有關的Observer們。

#### 封裝起複雜的更新語意

- 若Subject和Observer之間的依存關係過於繁雜，最好另設一個ChangeManager物件來管理。（Mediator Pattern）例如：某個操作會動到數個Subject，可能要確保直到所有Subject都已更改完成之後才去通知Observer，以避免重複通知好幾次。ChangeManager的任務： 將Subject對應到Observer，提供管理這種對應關係的介面，減輕Subject和Observer的負擔。定義特殊的更新策略。受Subject之託，更新所有相依的Observer。

## Example: Archiver

```java
Interface: Subject

package archiver;

public interface Subject {

	public void registerObserver(Observer o);
	public void removeObserver(Observer o);
	public void notifyObserver();

}
```

```java
Class: Database

package archiver;
import java.util.*;

public class Database implements Subject{

	private Vector observers;
	private String operation;
	private String record;

	public Database() {

		observers = new Vector();
	}

	@Override
	public void registerObserver(Observer o) {

		observers.add(o);
	}

	@Override
	public void removeObserver(Observer o) {

		observers.remove(o);

	}

	public void editRecord(String operation, String record) {
		this.operation = operation;
		this.record = record;
		notifyObserver();

	}
	public void notifyObserver() {

		for (int loopIndex = 0; loopIndex < observers.size(); loopIndex++) {
			Observer observer = (Observer)observers.get(loopIndex);
			observer.update(operation, record);
		}
	}
}
```

```java
Interface: Observer

package archiver;

public interface Observer {

	public void update(String operation, String record);

}
```

```java
Class: Archiver

package archiver;

public class Archiver implements Observer{

	public Archiver() {

	}

	public void update(String operation, String record) {

		System.out.println("This archiver says a " + operation +
				" operation was performed on " + record);


	}

}
```

```java
Class: Client

package archiver;
public class Client implements Observer {

		public Client() {

		}

		public void update(String operation, String record) {

			System.out.println("This client says a " + operation
					+ " operation was performed on " + record);

		}

}
```

```java
Class: Boss

package archiver;

public class Boss implements Observer {

public Boss() {

		}

		public void update(String operation, String record) {

			System.out.println("This Boss says a " + operation +
					" operation was performed on " + record);


		}
}
```

```java
Class: TestObserver

package archiver;

public class TestObserver {

	public static void main(String[] args) {

		Database database = new Database();
		Archiver archiver = new Archiver();
		Client client = new Client();
		Boss boss = new Boss();

		database.registerObserver(archiver);
		database.registerObserver(client);
		database.registerObserver(boss);
		database.editRecord("delete", "record 1");
	}

}
```

```
Result:

This archiver says a delete operation was performed on record 1
This client says a delete operation was performed on record 1
This Boss says a delete operation was performed on record 1
```
