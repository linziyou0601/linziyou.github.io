---
title: "讓image最大化適應canvas的寬高"
published: 2020-02-01
category: "JavaScript"
---

取得canvas

```js
var canvas = ctx.canvas;
```

設定比例並繪圖

```js
var wRatio = canvas.width / img.width;                //寬度比
var hRatio = canvas.height / img.height;              //高度比
var ratio = Math.min(wRatio, hRatio);                 //min者，依寬高比小者為主，寬高比大者留白； max者，依寬高比大者為主，寬高比小者裁切
var shiftX = (canvas.width - img.width * ratio) / 2;  //若此值不為0，表示有留白或虛裁切，左右區域應同寬
var shiftY = (canvas.height - img.height * ratio) / 2;//若此值不為0，表示有留白或虛裁切，上下區域應同高
```

設定至canvas上

```js
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0,0, img.width, img.height, shiftX, shiftY,img.widthratio, img.heightratio);
```
