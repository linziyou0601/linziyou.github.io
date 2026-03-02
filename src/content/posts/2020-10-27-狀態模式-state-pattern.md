---
title: "狀態模式 State Pattern"
published: 2020-10-27
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

讓物件的**外顯行為隨內部狀態的改變而改變**，彷彿連類別也變了似的。

## 適用

- 當物件的行為取決於它的狀態，連執行期行為也得隨狀態而改變時。如果某些操作裡面，依據物件狀態而做的條件判斷式太過龐大時。狀態通常會以enum表示，許多操作裡面也常會有相同的條件判斷結構。State Pattern將每一個條件分支抽取成獨立的類別，以便將物件狀態也視為另一個獨立的物件，可獨立改變。

## 結構及成員

**Collaborations**: 
**Context將與狀態有關的訊息委託給目前持有的ConcreteState去處理**。
Context可能把自己當作傳參傳給State。
Context是主要的對外窗口。**Client可用State物件來設定Context的組態，設好之後便不再直接插手State物件**。
可令Context或**ConcreteState的子類別決定在什麼情況下該切換成什麼狀態**。
![](/uploads/2021/08/state-participants.png)
- Context: like the CruiseControl, TCPConnection制定外界感興趣的介面。持有一個ConcreteState。State:此介面負責封裝當Context處於特定狀態時所該展現的行為。ConcreteState: like the CruisingCanceled, TCPEstablished, TCPClosed, TCPListen, etc.每一個子類別都針對某一種Context狀態實作出該展現的行為。

## 影響結果

### 好處

- 集中處理與狀態相依的行為並予以切割。只要定義新的State子類別，即可輕易增加新的狀態及狀態轉移邏輯。替每一種狀態設一個State物件，能突顯狀態轉移邏輯，也能避免Context不一致的內部狀態。（以Context來看，狀態轉移是個不可再細分的atomic動作）狀態物件可共用。若State物件不含實例變數，則Context可以共用State物件，此時State物件相當於沒有內在狀態、只有行為的Flyweight物件。

### 壞處

- 需要額外新增類別。

## 實作

#### 誰來定義狀態轉移邏輯？

- 若條件是固定的，可以全寫在Context裡；而彈性更好的做法，是讓State的子類別決定自己的下一個State是誰、何時才做轉移。Context需增加一個讓State物件可以設定Context的State的方法。只要定義新的State子類別，就能修改或擴充狀態轉移邏輯。但缺點是State子類別需要知道至少一個其他的State子類別，增加子類別之間的實作相依性。

#### State物件的生與死？

- 取捨：有需要時才產生State物件，用完即砍。事先件立好，事後絕不殺掉。若在Run-time時不知道處於哪些狀態，且Context不常改變狀態時，第一種做法較好。若State物件含有大量資訊，且狀態常常改變，就會想避免一再刪除State物件，就該用第二種做法。

#### 使用動態繼承

若能在Run-time動態改變物件所隸屬的類別，就能**針對特定訊息改變自身行為**。

## Example: Cruise Control System

```java
public abstract class State {
	State[] states;

	abstract void leverDown(CruiseControl c);
	abstract void leverUpAndHold(CruiseControl c);
	abstract void leverDownAndHold(CruiseControl c);
	abstract void leverReleased(CruiseControl c);
	abstract void leverPulled(CruiseControl c);
	abstract void brakeApplied(CruiseControl c);
	abstract void leverUp(CruiseControl c);
	abstract void onOffButtonPressed(CruiseControl c);

	void setDesiredSpeed(CruiseControl c) {
		System.out.println("setDesiredSpeed");
	}
}
```

```java
public class CruiseDeactivated extends State {
	@Override
	void onOffButtonPressed(CruiseControl c) {
		// TODO Auto-generated method stub
		System.out.println("CruiseDeactivated change to CruiseActivated");
		System.out.println("CruiseDeactivated change to CruisingCancelled");
		c.setState(new CruisingCancelled());
	}
	@Override
	void leverDown(CruiseControl c) {}
	@Override
	void leverUp(CruiseControl c) {}
	@Override
	void brakeApplied(CruiseControl c) {}
	@Override
	void leverDownAndHold(CruiseControl c) {}
	@Override
	void leverUpAndHold(CruiseControl c) {}
	@Override
	void leverPulled(CruiseControl c) {}
	@Override
	void leverReleased(CruiseControl c) {}
	@Override
	void setDesiredSpeed(CruiseControl c) {}
}
```

```java
public class CruiseActivated extends State {

	@Override
	void onOffButtonPressed(CruiseControl c) {
		// TODO Auto-generated method stub
		System.out.println("CruiseActivated change to CruiseDeactivated");
		c.setState(new CruiseDeactivated());
	}
	@Override
	void leverDown(CruiseControl c) {}
	@Override
	void leverUp(CruiseControl c) {}
	@Override
	void brakeApplied(CruiseControl c) {}
	@Override
	void leverDownAndHold(CruiseControl c) {}
	@Override
	void leverUpAndHold(CruiseControl c) {}
	@Override
	void leverPulled(CruiseControl c) {}
	@Override
	void leverReleased(CruiseControl c) {}
}
```

```java
public class Cruising extends CruiseActivated {
	@Override
	void leverDown(CruiseControl c) {
		System.out.println("Cruising change to Cruising");
		setDesiredSpeed(c);
		c.setState(new Cruising());
	}
	@Override
	void brakeApplied(CruiseControl c) {
		System.out.println("Cruising change to CruisingCancelled");
		c.setState(new CruisingCancelled());
	}
	@Override
	void leverDownAndHold(CruiseControl c) {
		System.out.println("Cruising change to DecreasingSpeed");
		c.setState(new DecreasingSpeed());
	}

	@Override
	void leverUpAndHold(CruiseControl c) {
		System.out.println("Cruising change to IncreasingSpeed");
		c.setState(new IncreasingSpeed());
	}

	@Override
	void leverPulled(CruiseControl c) {
		System.out.println("Cruising change to CruisingCancelled");
		c.setState(new CruisingCancelled());
	}
}
```

```java
public class CruisingCancelled extends CruiseActivated {
	@Override
	void leverDown(CruiseControl c) {
		System.out.println("CruisingCancelled change to Cruising");
		setDesiredSpeed(c);
		c.setState(new Cruising());
	}
	@Override
	void leverUp(CruiseControl c) {
		System.out.println("CruisingCancelled change to Cruising");
		c.setState(new Cruising());
	}
	@Override
	void leverDownAndHold(CruiseControl c) {
	System.out.println("CruisingCancelled change to DecreasingSpeed");
		c.setState(new DecreasingSpeed());
	}
	@Override
	void leverUpAndHold(CruiseControl c) {
	System.out.println("CruisingCancelled change to IncreasingSpeed");
		c.setState(new IncreasingSpeed());
	}
}
```

```java
public class DecreasingSpeed extends CruiseActivated{
    @Override
	void leverReleased(CruiseControl c){
		System.out.println("DecreasingSpeed change to Cruising");
		setDesiredSpeed(c);
		c.setState(new Cruising());
	}
}

public class IncreasingSpeed extends CruiseActivated{
	void leverReleased(CruiseControl c){
		System.out.println("IncreasingSpeed change to Cruising");
		c.setState(new Cruising());
	}
}
```

```java
public class CruiseControl {
	State state;
	public CruiseControl() {
		// TODO Auto-generated constructor stub
		this.state = new CruiseDeactivated();
	}
	public State getState() {
		return state;
	}
	public void setState(State state) {
		this.state = state;
	}
	void onOffButtonPressed() {
		state.onOffButtonPressed(this);
	}
	void leverDown() {
		state.leverDown(this);
	}
	void leverUp() {
		state.leverUp(this);
	}
	void brakeApplied() {
		state.brakeApplied(this);
	}
	void leverDownAndHold() {
		state.leverDownAndHold(this);
	}
	void leverUpAndHold() {
		state.leverUpAndHold(this);
	}
	void leverPulled() {
		state.leverPulled(this);
	}
	void leverReleased() {
		state.leverReleased(this);
	}
}
```

```java
public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		CruiseControl cruiseControl = new CruiseControl();
		cruiseControl.onOffButtonPressed();
		cruiseControl.leverDown();
		cruiseControl.onOffButtonPressed();
	}

}
```

```
Result:

CruiseDeactivated change to CruiseActivated
CruiseDeactivated change to CruisingCancelled
CruisingCancelled change to Cruising
setDesiredSpeed
CruiseActivated change to CruiseDeactivated
```
