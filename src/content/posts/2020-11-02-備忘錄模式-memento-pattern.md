---
title: "備忘錄模式 Memento Pattern"
published: 2020-11-02
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

在不違反封裝性的前提下，**捕捉物件的內部狀態並存在外面**，**以便日後回復**至此一狀態。

## 適用

- 當物件的部分狀態必須先存起來（快照），以備事後能回復至此一狀態時。直接取得狀態的介面會暴露內部實作細節，因而違反物件封裝性時。

## 結構及成員

**Collaborations**: Caretaker向Originator索取一個Memento物件，持有一陣子之後再送回給Originator。
![](/uploads/2021/08/memento-participants-1.png)
![](/uploads/2021/08/memento-participants-2.png)
- Memento: like the SolverState存放Originator物件的內部狀態。存放資訊的多寡，要視Originator的狀況而定。避免Originator以外的人存取它。基本上Memento具有兩種介面：Caretacker只看得到窄介面——只能將Memento整個遞給其他物件Originator就能看到寬介面——可存取所有資料，以便回復至前一狀態。理論上，只有產生這個Memento物件的那個Originator才有權存取內部狀態。Originator: like the ConstraintSolver根據自己的現行狀態建立Memento物件。利用Memento回復自己的內部狀態。Caretaker:負責Memento物件的安全。絕不會操作或檢視Memento的內容。

## 影響結果

### 好處

- 維持封裝界線。Memento避免將只有Originator才能看到（但又不能置放在Originator裡面）的資訊讓第三者知道，又能讓第三者持有Memento物件。可簡化Originator。原本Originator要記錄外界可能需要用到的所有內部狀態版本，會背負過重責任。

### 壞處

- Memento可能很耗資源。如果Originator必須將一大堆資訊拷貝到Memento裡面，或者當Caretaker頻頻將Mementor拿來拿去時，就會很耗資源。定義寬介面和窄介面。未必所有程式語言都容易確保只有Originator才能存取Mementor狀態。管理Memento的潛在代價。Caretaker要負責刪除所持有的Memento，但他並不知道Memento裡面到底擺了多少狀態。狀似輕巧的Caretaker可能會花昂貴的代價儲存Memento物件。

## 實作

#### 儲存異動之處

如果Memento的建立及傳遞流程**完全合乎預期**的話，那麼Memento就**可以只儲存與Originator的內部狀態有異動之處**（Incremental Change）。

## Example: Memento

```java
Class: Originator

package memento;

class Originator {
	private String state;

	public void set(String state) {
		System.out.println("Originator: Setting state to " + state);
		this.state = state;
	}

	public Memento saveToMemento() {
		System.out.println("Originator: Saving to Memento.");
		return new Memento(state);
	}

	public void restoreFromMemento(Memento m) {
		state = m.getSavedState();
		System.out.println("Originator: State after restoring from Memento: " + state);
	}
}
```

```java
Class: Memento

package memento;

import java.util.*;

class Memento {
	private String state;

	public Memento(String stateToSave) {
		state = stateToSave;
	}

	public String getSavedState() {
		return state;
	}
}
```

```java
Class: CareTaker

package memento;

import java.util.ArrayList;

class Caretaker {
	private ArrayList savedStates = new ArrayList();

	public void addMemento(Memento m) {
		savedStates.add(m);
	}

	public Memento getMemento(int index) {
		return savedStates.get(index);
	}
}
```

```java
Class: MementoExample

package memento2;

class MementoExample {
	public static void main(String[] args) {
		Originator originator = new Originator();
		Caretaker caretaker = new Caretaker();

		originator.set("State1");
		originator.set("State2");
		caretaker.addMemento(originator.saveToMemento());
		originator.set("State3");
		caretaker.addMemento(originator.saveToMemento());
		originator.set("State4");

		originator.restoreFromMemento(caretaker.getMemento(1));
	}
}
```

```
Result:

Originator: Setting state to State1
Originator: Setting state to State2
Originator: Saving to Memento.
Originator: Setting state to State3
Originator: Saving to Memento.
Originator: Setting state to State4
Originator: State after restoring from Memento: State3
```
