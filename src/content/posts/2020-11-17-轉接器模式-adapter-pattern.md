---
title: "轉接器模式 Adapter Pattern"
published: 2020-11-17
category: "設計模式"
tags: ["Java", "物件導向"]
---

## 目的

將**類別的介面轉換成外界所預期的另一種介面**，讓原先囿於介面不相容的問題而無法協力合作的類別能夠兜在一起用。

## 適用

- 想利用現有的class，但它的介面卻與你所需要的不符。想做一個可再利用的class，且能與其他毫不相關、甚至尚未出現的class搭配使用，也就是說，想與介面未必相容的class合作無間。想用一些現有的sub-class，雖然介面不相容，但又不適合一個個再去衍生sub-class修改介面。Adapter可以幫忙轉換它們的super-class。

## 結構及成員

**Collaborations**: **Client呼叫Adapter物件**的操作，**Adapter**則會去呼叫Adaptee負責這類任務的操作。
![](/uploads/2021/08/adapter-participants.png)
- Target: like the Shape定義Client所用的「與應用領域(domain)相關」的介面。Client: like the DrawingEditor與符合Target介面的物件合作。Adaptee: like the TextView需要被轉換的既有介面。Adapter: like the TextShape將一個Adaptee轉換成Target介面。

比較

### Class Adapter

- 綁死在實體adaptee類別上。可以覆寫adaptee的某些行為。只引入一個物件個體。不能在Runtime時轉換adaptee的類別。可以透過覆寫向adaptee增加新功能。

### Object Adapter

- 不會綁死在adaptee類別上。可能會引入adaptee的子類別用以覆寫行為（但不是覆寫adaptee本身）。引入多個物件個體。可以在Runtime時轉換adaptee的類別。可以透過衍生sub-adaptee子類別向adaptee增加新功能。

## 影響結果

- Adaptee轉換了多少東西？同樣是將Adaptee轉換成Target，但也有強弱之別。從簡單的介面轉換（改名字）到複雜的整組方法完全不同都有可能。即插即用轉換器類別所附帶的介面越少，就越具有再利用潛力。若類別本身就有介面轉換機制，就能避免被看到不合的介面。用雙向轉換性提供通透性轉換器對Client不夠透明化，Adapter物件不再遵從Adaptee介面，所以原本能用Adaptee物件的地方卻不能改用新的Adapter。（多重繼承可解決）

## 實作

#### 即插即用轉換器

- 不論何種方法，都要先訂出想將Adaptee轉換成的Target窄介面。
- 用抽象操作：在TreeDisplay裡將窄介面定義成抽象操作，TreeDisplay的子類別負責讓這些操作能處理對應的Adaptee（如：FileSystemEntity）之操作。
![](/uploads/2021/08/adapter-impl-1.png)
- 用委託物件：TreeDisplay將存取層級結構的訊息轉傳給delegate物件處理，如果想讓TreeDisplay產生各種不同的介面轉換效果，只要委託給不同的delegate物件即可。
![](/uploads/2021/08/adapter-impl-2.png)

## Example: MediaPlayer

```java
// 被轉接者（Adaptee）
public interface AdvancedMediaPlayer {
	public void playVlc(String fileName);
	public void playMp4(String fileName);
}
```

```java
// 實體的被轉接者（Concrete Adaptee）
public class VlcPlayer implements AdvancedMediaPlayer {

	@Override
	public void playVlc(String fileName) {
		System.out.println("播放 vlc 檔案，檔名為："+ fileName);
	}

	@Override
	public void playMp4(String fileName) {
		// 此處留空不實作，意義為：假設該VlcPlayer只能播放Vlc，不能播放Mp4
	}
}
```

```java
// 實體的被轉接者（Concrete Adaptee）
public class Mp4Player implements AdvancedMediaPlayer {

	@Override
	public void playVlc(String fileName) {
		// 此處留空不實作，意義為：假設該Mp4Player只能播放Mp4，不能播放Vlc
	}

	@Override
	public void playMp4(String fileName) {
		 System.out.println("播放 mp4 檔案，檔名為："+ fileName);
	}
}
```

```java
// 欲轉接目標／抽象的播放器類（Target）
public interface MediaPlayer {
	public void play(String audioType, String fileName);
}
```

```java
// 轉接者／實體的欲轉接目標／實體的播放器類（Adapter）

// 其意義是將較特定格式的AdvancedMediaPlayer轉接至MediaPlayer
// 以供AudioPlayer使用
public class MediaAdapter implements MediaPlayer {

	AdvancedMediaPlayer advancedMusicPlayer; // 以此宣告為Object Adapter，保持彈性

	public MediaAdapter(String audioType) {
    // 在Adapter實例化實才決定Adaptee為何物（也可以直接傳入AdvancedMediaPlayer類物件）
		if (audioType.equalsIgnoreCase("vlc")) {
			advancedMusicPlayer = new VlcPlayer();
		} else if (audioType.equalsIgnoreCase("mp4")) {
			advancedMusicPlayer = new Mp4Player();
		}
	}

	@Override
	public void play(String audioType, String fileName) {
    // 依指定檔案格式進行播放
    // 也可視情況將audioType的判斷式改為AdvancedMediaPlayer實體類的判斷式
		if (audioType.equalsIgnoreCase("vlc")) {
			advancedMusicPlayer.playVlc(fileName);
		} else if (audioType.equalsIgnoreCase("mp4")) {
			advancedMusicPlayer.playMp4(fileName);
		}
	}
}
```

```java
// 實體的播放器類／也可視為是將MediaAdapter轉換為能相容AudioPlayer的Adapter類

// AudioPlayer與MediaPlayer的關係可視為一體的
// 其意義可以理解為其本身可以播放mp3檔案，但是遇到不能播放的也沒關係，可以把
// 工作代理給MediaAdapter做，而AudioPlayer本身不用知道MediaAdapter怎麼做的
public class AudioPlayer implements MediaPlayer {
	MediaAdapter mediaAdapter; // 以此宣告為Object Adapter，保持彈性

	@Override
	public void play(String audioType, String fileName) {
		// 內建支援*.mp3音檔
		if (audioType.equalsIgnoreCase("mp3")) {
			System.out.println("播放 mp3 檔案，檔名為：" + fileName);
		}
		// 但若非*.mp3，也能透過MediaAdapter解碼其他格式的檔案
		else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
			mediaAdapter = new MediaAdapter(audioType);  // 依檔案格式實例化MediaAdapter
			mediaAdapter.play(audioType, fileName);      // 依指定檔案格式播放影音檔
		}
		else {
			System.out.println("無效的檔案。不支援 " + audioType + " 格式的檔案");
		}
	}
}
```

```java
// Client
public class Main {
	public static void main(String[] args) {
		AudioPlayer audioPlayer = new AudioPlayer();
		audioPlayer.play("mp3", "beyond the horizon.mp3");
		audioPlayer.play("mp4", "alone.mp4");
		audioPlayer.play("vlc", "far far away.vlc");
		audioPlayer.play("avi", "mind me.avi");
	}
}
```

```
Result:

播放 mp3 檔案，檔名為：beyond the horizon.mp3
播放 mp4 檔案，檔名為：alone.mp4
播放 vlc 檔案，檔名為：far far away.vlc
無效的檔案。不支援 avi 格式的檔案
```

![](/uploads/2021/08/adapter-example-code-desc.png)
