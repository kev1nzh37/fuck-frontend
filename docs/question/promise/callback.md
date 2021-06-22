---
title: JS运行原理
order: 6
toc: menu
group:
  title: 异步
  order: 3
---

## 前言

从开始做前端到目前为止，陆续看了很多帖子讲 JS 运行机制，看过不久就忘了，还是自己理一遍好些

通过码字使自己对 JS 运行机制相关内容更加深刻(自己用心写过的贴子，内容也会牢记于心)

顺道给大家看看(我太难了，深夜码字，反复修改，说这么多就是想请你点个赞在看)

参考了很多资料(帖子)，取其精华，去其糟糠，都在文末，可自行了解

是时候搞一波我大 js 了

从零到一百再到一，从多方面了解 JS 的运行机制，体会更深刻，请认真读下去

本文大致分为以下这样的步骤来帮助我们由广入深更加清晰的了解 JS 运行机制

- 首先我们要了解进程和线程的概念
- 其次我们要知道浏览器的进程线程常识
- 再然后通过 Event Loop、宏任务(macrotask)微任务(microtask)来看浏览器的几个线程间是怎样配合的
- 再然后通过例子来印证我们的猜想
- 最后提下 NodeJS 的运行机制

## 灵魂一问

JS 运行机制在平常前端面试时不管是笔试题还是面试题命中率都极高

说到 JS 运行机制，你知道多少

看到这大家可能回说：JS 运行机制嘛，很简单，事件循环、宏微任务那点东西

是的，作为一名前端我们都了解，但是如果这真的面试问到了这个地方，你真的可以答好吗(灵魂一问 🤔️)

**不管你对 JS 了解多少，到这里大家不防先停止一下阅读，假设你目前在面试，面试官让你阐述下 JS 运行机制，思考下你的答案，用 20 秒的时间(面试时 20s 已经很长了)，然后带着答案再接着往下看，有人曾经说过：`没有思考的阅读纯粹是消磨时间罢了`，这话很好(因为是我说的，皮一下 😄)**

也有很多刚开始接触 JS 的同学会被`任务队列 执行栈 微任务 宏任务`这些高大上点的名次搞的很懵

接下来，我们来细致的梳理一遍你就可以清晰的了解它们了

## 进程与线程

### 什么是进程

我们都知道，`CPU`是计算机的核心，承担所有的计算任务

官网说法，`进程`是`CPU`资源分配的最小单位

字面意思就是进行中的程序，我将它理解为一个可以独立运行且拥有自己的资源空间的任务程序

`进程`包括运行中的程序和程序所使用到的内存和系统资源

`CPU`可以有很多进程，我们的电脑每打开一个软件就会产生一个或多个`进程`，为什么电脑运行的软件多就会卡，是因为`CPU`给每个`进程`分配资源空间，但是一个`CPU`一共就那么多资源，分出去越多，越卡，每个`进程`之间是相互独立的，`CPU`在运行一个`进程`时，其他的进程处于非运行状态，`CPU`使用 时间片轮转调度算法 来实现同时运行多个`进程`

### 什么是线程

`线程`是`CPU`调度的最小单位

`线程`是建立在`进程`的基础上的一次程序运行单位，通俗点解释`线程`就是程序中的一个执行流，一个`进程`可以有多个`线程`

一个`进程`中只有一个执行流称作`单线程`，即程序执行时，所走的程序路径按照连续顺序排下来，前面的必须处理好，后面的才会执行

一个`进程`中有多个执行流称作`多线程`，即在一个程序中可以同时运行多个不同的`线程`来执行不同的任务，
也就是说允许单个程序创建多个并行执行的`线程`来完成各自的任务

### 进程和线程的区别

进程是操作系统分配资源的最小单位，线程是程序执行的最小单位

一个进程由一个或多个线程组成，线程可以理解为是一个进程中代码的不同执行路线

进程之间相互独立，但同一进程下的各个线程间共享程序的内存空间(包括代码段、数据集、堆等)及一些进程级的资源(如打开文件和信号)

调度和切换：线程上下文切换比进程上下文切换要快得多

### 多进程和多线程

多进程：多进程指的是在同一个时间里，同一个计算机系统中如果允许两个或两个以上的进程处于运行状态。多进程带来的好处是明显的，比如大家可以在网易云听歌的同时打开编辑器敲代码，编辑器和网易云的进程之间不会相互干扰

多线程：多线程是指程序中包含多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务，也就是说允许单个程序创建多个并行执行的线程来完成各自的任务

## JS 为什么是单线程

JS 的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

还有人说 js 还有 Worker 线程，对的，为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程是完 全受主线程控制的，而且不得操作 DOM

所以，这个标准并没有改变 JavaScript 是单线程的本质

了解了进程和线程之后，接下来看看浏览器解析，浏览器之间也是有些许差距的，不过大致是差不多的，下文我们皆用市场占有比例最大的 Chrome 为例

## 浏览器

### 浏览器是多进程的

作为前端，免不了和浏览器打交道，浏览器是多进程的，拿 Chrome 来说，我们每打开一个 Tab 页就会产生一个进程，我们使用 Chrome 打开很多标签页不关，电脑会越来越卡，不说其他，首先就很耗 CPU

### 浏览器包含哪些进程

- Browser 进程
  - 浏览器的主进程(负责协调、主控)，该进程只有一个
  - 负责浏览器界面显示，与用户交互。如前进，后退等
  - 负责各个页面的管理，创建和销毁其他进程
  - 将渲染(Renderer)进程得到的内存中的 Bitmap(位图)，绘制到用户界面上
  - 网络资源的管理，下载等
- 第三方插件进程
  - 每种类型的插件对应一个进程，当使用该插件时才创建
- GPU 进程
  - 该进程也只有一个，用于 3D 绘制等等
- 渲染进程(重)
  - 即通常所说的浏览器内核(Renderer 进程，内部是多线程)
  - 每个 Tab 页面都有一个渲染进程，互不影响
  - 主要作用为页面渲染，脚本执行，事件处理等

### 为什么浏览器要多进程

我们假设浏览器是单进程，那么某个 Tab 页崩溃了，就影响了整个浏览器，体验有多差

同理如果插件崩溃了也会影响整个浏览器

当然多进程还有其它的诸多优势，不过多阐述

浏览器进程有很多，每个进程又有很多线程，都会占用内存

这也意味着内存等资源消耗会很大，有点拿空间换时间的意思

到此可不只是为了让我们理解为何 Chrome 运行时间长了电脑会卡，哈哈，第一个重点来了

### 简述渲染进程 Renderer(重)

页面的渲染，JS 的执行，事件的循环，都在渲染进程内执行，所以我们要重点了解渲染进程

渲染进程是多线程的，我们来看渲染进程的一些常用较为主要的线程

### 渲染进程 Renderer 的主要线程

### GUI 渲染线程

- 负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等
  - 解析 html 代码(HTML 代码本质是字符串)转化为浏览器认识的节点，生成 DOM 树，也就是 DOM Tree
  - 解析 css，生成 CSSOM(CSS 规则树)
  - 把 DOM Tree 和 CSSOM 结合，生成 Rendering Tree(渲染树)
- 当我们修改了一些元素的颜色或者背景色，页面就会重绘(Repaint)
- 当我们修改元素的尺寸，页面就会回流(Reflow)
- 当页面需要 Repaing 和 Reflow 时 GUI 线程执行，绘制页面
- 回流(Reflow)比重绘(Repaint)的成本要高，我们要尽量避免 Reflow 和 Repaint
- GUI 渲染线程与 JS 引擎线程是互斥的
  - 当 JS 引擎执行时 GUI 线程会被挂起(相当于被冻结了)
  - GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行

### JS 引擎线程

- JS 引擎线程就是 JS 内核，负责处理 Javascript 脚本程序(例如 V8 引擎)
- JS 引擎线程负责解析 Javascript 脚本，运行代码
- JS 引擎一直等待着任务队列中任务的到来，然后加以处理
  - 浏览器同时只能有一个 JS 引擎线程在运行 JS 程序，所以 js 是单线程运行的
  - 一个 Tab 页(renderer 进程)中无论什么时候都只有一个 JS 线程在运行 JS 程序
- GUI 渲染线程与 JS 引擎线程是互斥的，js 引擎线程会阻塞 GUI 渲染线程
  - 就是我们常遇到的 JS 执行时间过长，造成页面的渲染不连贯，导致页面渲染加载阻塞(就是加载慢)
  - 例如浏览器渲染的时候遇到`<script>`标签，就会停止 GUI 的渲染，然后 js 引擎线程开始工作，执行里面的 js 代码，等 js 执行完毕，js 引擎线程停止工作，GUI 继续渲染下面的内容。所以如果 js 执行时间太长就会造成页面卡顿的情况

### 事件触发线程

- 属于浏览器而不是 JS 引擎，用来控制事件循环，并且管理着一个事件队列(task queue)
- 当 js 执行碰到事件绑定和一些异步操作(如 setTimeOut，也可来自浏览器内核的其他线程，如鼠标点击、AJAX 异步请求等)，会走事件触发线程将对应的事件添加到对应的线程中(比如定时器操作，便把定时器事件添加到定时器线程)，等异步事件有了结果，便把他们的回调操作添加到事件队列，等待 js 引擎线程空闲时来处理。
- 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理
- 因为 JS 是单线程，所以这些待处理队列中的事件都得排队等待 JS 引擎处理

### 定时触发器线程

- `setInterval`与`setTimeout`所在线程
- 浏览器定时计数器并不是由 JavaScript 引擎计数的(因为 JavaScript 引擎是单线程的，如果处于阻塞线程状态就会影响记计时的准确)
- 通过单独线程来计时并触发定时(计时完毕后，添加到事件触发线程的事件队列中，等待 JS 引擎空闲后执行)，这个线程就是定时触发器线程，也叫定时器线程
- W3C 在 HTML 标准中规定，规定要求`setTimeout`中低于 4ms 的时间间隔算为 4ms

### 异步 http 请求线程

- 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求
- 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中再由 JavaScript 引擎执行
- 简单说就是当执行到一个 http 异步请求时，就把异步请求事件添加到异步请求线程，等收到响应(准确来说应该是 http 状态变化)，再把回调函数添加到事件队列，等待 js 引擎线程来执行

了解了上面这些基础后，接下来我们开始进入今天的正题

## 事件循环(Event Loop)初探

首先要知道，JS 分为同步任务和异步任务

同步任务都在主线程(这里的主线程就是 JS 引擎线程)上执行，会形成一个`执行栈`

主线程之外，事件触发线程管理着一个`任务队列`，只要异步任务有了运行结果，就在`任务队列`之中放一个事件回调

一旦`执行栈`中的所有同步任务执行完毕(也就是 JS 引擎线程空闲了)，系统就会读取`任务队列`，将可运行的异步任务(任务队列中的事件回调，只要任务队列中有事件回调，就说明可以执行)添加到执行栈中，开始执行

我们来看一段简单的代码

```javascript
let setTimeoutCallBack = function() {
  console.log('我是定时器回调');
};
let httpCallback = function() {
  console.log('我是http请求回调');
};

// 同步任务
console.log('我是同步任务1');

// 异步定时任务
setTimeout(setTimeoutCallBack, 1000);

// 异步http请求任务
ajax.get('/info', httpCallback);

// 同步任务
console.log('我是同步任务2');
```

上述代码执行过程

JS 是按照顺序从上往下依次执行的，可以先理解为这段代码时的执行环境就是主线程，也就是也就是当前执行栈

首先，执行`console.log('我是同步任务1')`

接着，执行到`setTimeout`时，会移交给`定时器线程`，通知`定时器线程` 1s 后将 `setTimeoutCallBack` 这个回调交给`事件触发线程`处理，在 1s 后`事件触发线程`会收到 `setTimeoutCallBack` 这个回调并把它加入到`事件触发线程`所管理的事件队列中等待执行

接着，执行 http 请求，会移交给`异步http请求线程`发送网络请求，请求成功后将 `httpCallback` 这个回调交由事件触发线程处理，`事件触发线程`收到 `httpCallback` 这个回调后把它加入到`事件触发线程`所管理的事件队列中等待执行

再接着执行`console.log('我是同步任务2')`

至此主线程执行栈中执行完毕，`JS引擎线程`已经空闲，开始向`事件触发线程`发起询问，询问`事件触发线程`的事件队列中是否有需要执行的回调函数，如果有将事件队列中的回调事件加入执行栈中，开始执行回调，如果事件队列中没有回调，`JS引擎线程`会一直发起询问，直到有为止

到了这里我们发现，浏览器上的所有线程的工作都很单一且独立，非常符合单一原则

定时触发线程只管理定时器且只关注定时不关心结果，定时结束就把回调扔给事件触发线程

异步 http 请求线程只管理 http 请求同样不关心结果，请求结束把回调扔给事件触发线程

事件触发线程只关心异步回调入事件队列

而我们 JS 引擎线程只会执行执行栈中的事件，执行栈中的代码执行完毕，就会读取事件队列中的事件并添加到执行栈中继续执行，这样反反复复就是我们所谓的**事件循环(Event Loop)**

**图解**

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7acab03b35fa?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/1/18/16fb7acab03b35fa?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

首先，执行栈开始顺序执行

判断是否为同步，异步则进入异步线程，最终事件回调给事件触发线程的任务队列等待执行，同步继续执行

执行栈空，询问任务队列中是否有事件回调

任务队列中有事件回调则把回调加入执行栈末尾继续从第一步开始执行

任务队列中没有事件回调则不停发起询问

## 宏任务(macrotask) & 微任务(microtask)

### 宏任务(macrotask)

在 ECMAScript 中，`macrotask`也被称为`task`

我们可以将每次执行栈执行的代码当做是一个宏任务(包括每次从事件队列中获取一个事件回调并放到执行栈中执行)， 每一个宏任务会从头到尾执行完毕，不会执行其他

由于`JS引擎线程`和`GUI渲染线程`是互斥的关系，浏览器为了能够使`宏任务`和`DOM任务`有序的进行，会在一个`宏任务`执行结果后，在下一个`宏任务`执行前，`GUI渲染线程`开始工作，对页面进行渲染

```javascript
宏任务 -> GUI渲染 -> 宏任务 -> ...

```

常见的宏任务

- 主代码块
- setTimeout
- setInterval
- setImmediate ()-Node
- requestAnimationFrame ()-浏览器

### 微任务(microtask)

ES6 新引入了 Promise 标准，同时浏览器实现上多了一个`microtask`微任务概念，在 ECMAScript 中，`microtask`也被称为`jobs`

我们已经知道`宏任务`结束后，会执行渲染，然后执行下一个`宏任务`， 而微任务可以理解成在当前`宏任务`执行后立即执行的任务

当一个`宏任务`执行完，会在渲染前，将执行期间所产生的所有`微任务`都执行完

```javascript
宏任务 -> 微任务 -> GUI渲染 -> 宏任务 -> ...

```

常见微任务

- process.nextTick ()-Node
- Promise.then()
- catch
- finally
- Object.observe
- MutationObserver

### 简单区分宏任务与微任务

看了上述宏任务微任务的解释你可能还不太清楚，没关系，往下看，先记住那些常见的宏微任务即可

我们通过几个例子来看，这几个例子思路来自掘金`云中君`的文章参考链接【14】，通过渲染背景颜色来区分宏任务和微任务，很直观，我觉得很有意思，所以这里也用这种例子

找一个空白的页面，在 console 中输入以下代码

```javascript
document.body.style = 'background:black';
document.body.style = 'background:red';
document.body.style = 'background:blue';
document.body.style = 'background:pink';
```

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7c7576f1e3b1?imageslim](https://user-gold-cdn.xitu.io/2020/1/18/16fb7c7576f1e3b1?imageslim)

我们看到上面动图背景直接渲染了粉红色，根据上文里讲浏览器会先执行完一个宏任务，再执行当前执行栈的所有微任务，然后移交 GUI 渲染，上面四行代码均属于同一次宏任务，全部执行完才会执行渲染，渲染时`GUI线程`会将所有 UI 改动优化合并，所以视觉上，只会看到页面变成粉红色

再接着看

```javascript
document.body.style = 'background:blue';
setTimeout(() => {
  document.body.style = 'background:black';
}, 200);
```

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7c81efff6db0?imageslim](https://user-gold-cdn.xitu.io/2020/1/18/16fb7c81efff6db0?imageslim)

上述代码中，页面会先卡一下蓝色，再变成黑色背景，页面上写的是 200 毫秒，大家可以把它当成 0 毫秒，因为 0 毫秒的话由于浏览器渲染太快，录屏不好捕捉，我又没啥录屏慢放的工具，大家可以自行测试的，结果也是一样，最安全的方法是写一个`index.html`文件，在这个文件中插入上面的 js 脚本，然后浏览器打开，谷歌下使用控制台中`performance`功能查看一帧一帧的加载最为恰当，不过这样录屏不好录所以。。。

回归正题，之所以会卡一下蓝色，是因为以上代码属于两次`宏任务`，第一次`宏任务`执行的代码是将背景变成蓝色，然后触发渲染，将页面变成蓝色，再触发第二次宏任务将背景变成黑色

再来看

```javascript
document.body.style = 'background:blue';
console.log(1);
Promise.resolve().then(() => {
  console.log(2);
  document.body.style = 'background:pink';
});
console.log(3);
```

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7c909570edd9?imageslim](https://user-gold-cdn.xitu.io/2020/1/18/16fb7c909570edd9?imageslim)

控制台输出 1 3 2 , 是因为 promise 对象的 then 方法的回调函数是异步执行，所以 2 最后输出

页面的背景色直接变成粉色，没有经过蓝色的阶段，是因为，我们在宏任务中将背景设置为蓝色，但在进行渲染前执行了微任务， 在微任务中将背景变成了粉色，然后才执行的渲染

### 微任务宏任务注意点

- 浏览器会先执行一个宏任务，紧接着执行当前执行栈产生的微任务，再进行渲染，然后再执行下一个宏任务
- 微任务和宏任务不在一个任务队列，不在一个任务队列
  - 例如`setTimeout`是一个宏任务，它的事件回调在宏任务队列，`Promise.then()`是一个微任务，它的事件回调在微任务队列，二者并不是一个任务队列
  - 以 Chrome 为例，有关渲染的都是在渲染进程中执行，渲染进程中的任务（DOM 树构建，js 解析…等等）需要主线程执行的任务都会在主线程中执行，而浏览器维护了一套事件循环机制，主线程上的任务都会放到消息队列中执行，主线程会循环消息队列，并从头部取出任务进行执行，如果执行过程中产生其他任务需要主线程执行的，渲染进程中的其他线程会把该任务塞入到消息队列的尾部，消息队列中的任务都是宏任务
  - 微任务是如何产生的呢？当执行到 script 脚本的时候，js 引擎会为全局创建一个执行上下文，在该执行上下文中维护了一个微任务队列，当遇到微任务，就会把微任务回调放在微队列中，当所有的 js 代码执行完毕，在退出全局上下文之前引擎会去检查该队列，有回调就执行，没有就退出执行上下文，这也就是为什么微任务要早于宏任务，也是大家常说的，每个宏任务都有一个微任务队列（由于定时器是浏览器的 API，所以定时器是宏任务，在 js 中遇到定时器会也是放入到浏览器的队列中）

此时，你可能还很迷惑，没关系，请接着往下看

### 图解宏任务和微任务

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7adf5afc036d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/1/18/16fb7adf5afc036d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

首先执行一个宏任务，执行结束后判断是否存在微任务

有微任务先执行所有的微任务，再渲染，没有微任务则直接渲染

然后再接着执行下一个宏任务

## 图解完整的 Event Loop

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7ae3b678f1ea?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/1/18/16fb7ae3b678f1ea?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

首先，整体的 script(作为第一个宏任务)开始执行的时候，会把所有代码分为`同步任务`、`异步任务`两部分

同步任务会直接进入主线程依次执行

异步任务会再分为宏任务和微任务

宏任务进入到 Event Table 中，并在里面注册回调函数，每当指定的事件完成时，Event Table 会将这个函数移到 Event Queue 中

微任务也会进入到另一个 Event Table 中，并在里面注册回调函数，每当指定的事件完成时，Event Table 会将这个函数移到 Event Queue 中

当主线程内的任务执行完毕，主线程为空时，会检查微任务的 Event Queue，如果有任务，就全部执行，如果没有就执行下一个宏任务

上述过程会不断重复，这就是 Event Loop，比较完整的事件循环

## 关于 Promise

`new Promise(() => {}).then()` ，我们来看这样一个 Promise 代码

前面的 `new Promise()` 这一部分是一个构造函数，这是一个同步任务

后面的 `.then()` 才是一个异步微任务，这一点是非常重要的

```javascript
new Promise(resolve => {
  console.log(1);
  resolve();
}).then(() => {
  console.log(2);
});
console.log(3);
```

上面代码输出`1 3 2`

## 关于 async/await 函数

async/await 本质上还是基于 Promise 的一些封装，而 Promise 是属于微任务的一种

所以在使用 await 关键字与 Promise.then 效果类似

```javascript
setTimeout(() => console.log(4));

async function test() {
  console.log(1);
  await Promise.resolve();
  console.log(3);
}

test();

console.log(2);
```

上述代码输出`1 2 3 4`

可以理解为，`await` 以前的代码，相当于与 `new Promise` 的同步代码，`await` 以后的代码相当于 `Promise.then`的异步

## 举栗印证

首先给大家来一个比较直观的动图

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7d0f356a33a4?imageslim](https://user-gold-cdn.xitu.io/2020/1/18/16fb7d0f356a33a4?imageslim)

之所以放这个动图，就是为了向大家推荐这篇好文，动图录屏自参考链接【1】

极力推荐大家看看这篇帖子，非常 nice，分步动画生动且直观，有时间的话可以自己去体验下

不过在看这个帖子之前你要先了解下运行机制会更好读懂些

接下来这个来自网上随意找的一个比较简单的面试题，求输出结果

```javascript
function test() {
  console.log(1);
  setTimeout(function() {
    // timer1
    console.log(2);
  }, 1000);
}

test();

setTimeout(function() {
  // timer2
  console.log(3);
});

new Promise(function(resolve) {
  console.log(4);
  setTimeout(function() {
    // timer3
    console.log(5);
  }, 100);
  resolve();
}).then(function() {
  setTimeout(function() {
    // timer4
    console.log(6);
  }, 0);
  console.log(7);
});

console.log(8);
```

结合我们上述的 JS 运行机制再来看这道题就简单明了的多了

JS 是顺序从上而下执行

执行到 test()，test 方法为同步，直接执行，`console.log(1)`打印 1

test 方法中 setTimeout 为异步宏任务，回调我们把它记做 timer1 放入宏任务队列

接着执行，test 方法下面有一个 setTimeout 为异步宏任务，回调我们把它记做 timer2 放入宏任务队列

接着执行 promise，new Promise 是同步任务，直接执行，打印 4

new Promise 里面的 setTimeout 是异步宏任务，回调我们记做 timer3 放到宏任务队列

Promise.then 是微任务，放到微任务队列

console.log(8)是同步任务，直接执行，打印 8

主线程任务执行完毕，检查微任务队列中有 Promise.then

开始执行微任务，发现有 setTimeout 是异步宏任务，记做 timer4 放到宏任务队列

微任务队列中的 console.log(7)是同步任务，直接执行，打印 7

微任务执行完毕，第一次循环结束

检查宏任务队列，里面有 timer1、timer2、timer3、timer4，四个定时器宏任务，按照定时器延迟时间得到可以执行的顺序，即 Event Queue：timer2、timer4、timer3、timer1，依次拿出放入执行栈末尾执行 **(插播一条：浏览器 event loop 的 Macrotask queue，就是宏任务队列在每次循环中只会读取一个任务)**

执行 timer2，console.log(3)为同步任务，直接执行，打印 3

检查没有微任务，第二次 Event Loop 结束

执行 timer4，console.log(6)为同步任务，直接执行，打印 6

检查没有微任务，第三次 Event Loop 结束

执行 timer3，console.log(5)同步任务，直接执行，打印 5

检查没有微任务，第四次 Event Loop 结束

执行 timer1，console.log(2)同步任务，直接执行，打印 2

检查没有微任务，也没有宏任务，第五次 Event Loop 结束

结果：1，4，8，7，3，6，5，2

## 提一下 NodeJS 中的运行机制

上面的一切都是针对于浏览器的 EventLoop

虽然 NodeJS 中的 JavaScript 运行环境也是 V8，也是单线程，但是，还是有一些与浏览器中的表现是不一样的

其实 nodejs 与浏览器的区别，就是 nodejs 的宏任务分好几种类型，而这好几种又有不同的任务队列，而不同的任务队列又有顺序区别，而微任务是穿插在每一种宏任务之间的

在 node 环境下，process.nextTick 的优先级高于 Promise，可以简单理解为在宏任务结束后会先执行微任务队列中的 nextTickQueue 部分，然后才会执行微任务中的 Promise 部分

[https://user-gold-cdn.xitu.io/2020/1/18/16fb7aed8db21b8d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/1/18/16fb7aed8db21b8d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

上图来自 NodeJS 官网

如上图所示，nodejs 的宏任务分好几种类型，我们只简单介绍大体内容了解，不详细解释，不然又是啰哩啰嗦一大篇

NodeJS 的 Event Loop 相对比较麻烦

```javascript
Node会先执行所有类型为 timers 的 MacroTask，然后执行所有的 MicroTask(NextTick例外)

进入 poll 阶段，执行几乎所有 MacroTask，然后执行所有的 MicroTask

再执行所有类型为 check 的 MacroTask，然后执行所有的 MicroTask

再执行所有类型为 close callbacks 的 MacroTask，然后执行所有的 MicroTask

至此，完成一个 Tick，回到 timers 阶段

……

如此反复，无穷无尽……

```

反观浏览器中 Event Loop 就比较容易理解

```javascript
先执行一个 MacroTask，然后执行所有的 MicroTask

再执行一个 MacroTask，然后执行所有的 MicroTask

……

如此反复，无穷无尽……

```

好了，关于 Node 中各个类型阶段的解析，这里就不过多说明了，自己查阅资料吧，这里就是简单提一下，NodeJS 的 Event Loop 解释起来比浏览器这繁杂，这里就只做个对比

##