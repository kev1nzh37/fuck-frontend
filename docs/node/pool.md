---
title: js实现请求池
order: 2
toc: menu
---

# **JavaScript 中如何实现并发控制？**

### 一、并发控制简介

在日常开发过程中，你可能会遇到并发控制的场景，比如控制请求并发数。那么在 JavaScript 中如何实现并发控制呢？在回答这个问题之前，我们来简单介绍一下并发控制。

假设有 6 个待办任务要执行，而我们希望限制同时执行的任务个数，即最多只有 2 个任务能同时执行。当  **正在执行任务列表**  中的任何 1 个任务完成后，程序会自动从  **待办任务列表**  中获取新的待办任务并把该任务添加到  **正在执行任务列表**  中。为了让大家能够更直观地理解上述的过程，阿宝哥特意画了以下 3 张图：

### 1.1 阶段一

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0375eb9d15849e08df0b8c39ed45490~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0375eb9d15849e08df0b8c39ed45490~tplv-k3u1fbpfcp-zoom-1.image)

### 1.2 阶段二

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33ebdd25cd5e48d0b0970af7599a5e90~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33ebdd25cd5e48d0b0970af7599a5e90~tplv-k3u1fbpfcp-zoom-1.image)

### 1.3 阶段三

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab850a9e11564452b1d507c8b2efc311~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab850a9e11564452b1d507c8b2efc311~tplv-k3u1fbpfcp-zoom-1.image)

好的，介绍完并发控制之后，阿宝哥将以 Github 上  [async-pool](https://github.com/rxaviers/async-pool)  这个库来介绍一下异步任务并发控制的具体实现。

> async-pool：github.com/rxaviers/as…Run multiple promise-returning & async functions with limited concurrency using native ES6/ES7。

针对  [async-pool](https://github.com/rxaviers/async-pool)  这个库的具体应用，阿宝哥写了  [JavaScript 中如何实现大文件并发下载？](https://mp.weixin.qq.com/s/E4SdYEkEzurfrnJrBu3bjA)  和  [JavaScript 中如何实现大文件并发上传？](https://mp.weixin.qq.com/s/-iSpCMaLruerHv7717P0Wg)  两篇文章，感兴趣的小伙伴可以了解一下。

### 二、并发控制的实现

[async-pool](https://github.com/rxaviers/async-pool)  这个库提供了 ES7 和 ES6 两种不同版本的实现，在分析其具体实现之前，我们来看一下它如何使用。

### 2.1 asyncPool 的使用

```
const timeout = i =>new Promise(resolve => setTimeout(() => resolve(i), i));
await asyncPool(2, [1000, 5000, 3000, 2000], timeout);

```

在以上代码中，我们使用  [async-pool](https://github.com/rxaviers/async-pool)  这个库提供的  `asyncPool`  函数来实现异步任务的并发控制。 `asyncPool`  函数的签名如下所示：

```javascript
functionasyncPool(poolLimit, array, iteratorFn){ ... }
```

该函数接收 3 个参数：

- `poolLimit`（数字类型）：表示限制的并发数；
- `array`（数组类型）：表示任务数组；
- `iteratorFn`（函数类型）：表示迭代函数，用于实现对每个任务项进行处理，该函数会返回一个 Promise 对象或异步函数。

对于以上示例来说，在使用了  `asyncPool`  函数之后，对应的执行过程如下所示：

```javascript
const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
await asyncPool(2, [1000, 5000, 3000, 2000], timeout);
// Call iterator (i = 1000)// Call iterator (i = 5000)// Pool limit of 2 reached, wait for the quicker one to complete...// 1000 finishes// Call iterator (i = 3000)// Pool limit of 2 reached, wait for the quicker one to complete...// 3000 finishes// Call iterator (i = 2000)// Itaration is complete, wait until running ones complete...// 5000 finishes// 2000 finishes// Resolves, results are passed in given array order `[1000, 5000, 3000, 2000]`.
```

通过观察以上的注释信息，我们可以大致地了解  `asyncPool`  函数内部的控制流程。下面我们先来分析  `asyncPool`  函数的 ES7 实现。

> 关注「全栈修仙之路」阅读阿宝哥原创的 4 本免费电子书（累计下载 3 万+）及 50 几篇 TS 系列教程。

### 2.2 asyncPool ES7 实现

```javascript
asyncfunctionasyncPool(poolLimit, array, iteratorFn) {
const ret = [];// 存储所有的异步任务const executing = [];// 存储正在执行的异步任务for (const itemof array) {
// 调用iteratorFn函数创建异步任务const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);// 保存新的异步任务// 当poolLimit值小于或等于总任务个数时，进行并发控制if (poolLimit <= array.length) {
// 当任务完成后，从正在执行的任务数组中移除已完成的任务const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);// 保存正在执行的异步任务if (executing.length >= poolLimit) {
await Promise.race(executing);// 等待较快的任务执行完成
      }
    }
  }
return Promise.all(ret);
}

```

在以上代码中，充分利用了  `Promise.all`  和  `Promise.race`  函数特点，再结合 ES7 中提供的  `async await`  特性，最终实现了并发控制的功能。利用  `await Promise.race(executing);`  这行语句，我们会等待  **正在执行任务列表**  中较快的任务执行完成之后，才会继续执行下一次循环。

asyncPool ES7 实现相对比较简单，接下来我们来看一下不使用  `async await`  特性要如何实现同样的功能。

### 2.3 asyncPool ES6 实现

```javascript
functionasyncPool(poolLimit, array, iteratorFn) {
let i = 0;
const ret = [];// 存储所有的异步任务const executing = [];// 存储正在执行的异步任务const enqueue =function () {
if (i === array.length) {
return Promise.resolve();
    }
const item = array[i++];// 获取新的任务项const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

let r = Promise.resolve();

// 当poolLimit值小于或等于总任务个数时，进行并发控制if (poolLimit <= array.length) {
// 当任务完成后，从正在执行的任务数组中移除已完成的任务const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
if (executing.length >= poolLimit) {
        r = Promise.race(executing);
      }
    }

// 正在执行任务列表 中较快的任务执行完成之后，才会从array数组中获取新的待办任务return r.then(() => enqueue());
  };
return enqueue().then(() => Promise.all(ret));
}

```

在 ES6 的实现版本中，通过内部封装的  `enqueue`  函数来实现核心的控制逻辑。当  `Promise.race(executing)`  返回的  `Promise`  对象变成已完成状态时，才会调用  `enqueue`  函数，从  `array`  数组中获取新的待办任务。

### 三、阿宝哥有话说

在  `asyncPool`  这个库的 ES7 和 ES6 的具体实现中，我们都使用到了  `Promise.all`  和  `Promise.race`  函数。其中手写  `Promise.all`  是一道常见的面试题。刚好趁着这个机会，阿宝哥跟大家一起来手写简易版的  `Promise.all`  和  `Promise.race`  函数。

### 3.1 手写 Promise.all

**`Promise.all(iterable)`**  方法会返回一个 promise 对象，当输入的所有 promise 对象的状态都变成  `resolved`  时，返回的 promise 对象就会以数组的形式，返回每个 promise 对象 resolve 后的结果。当输入的任何一个 promise 对象状态变成  `rejected`  时，则返回的 promise 对象会 reject 对应的错误信息。

```javascript
Promise.all =function (iterators) {
returnnew Promise((resolve, reject) => {
if (!iterators || iterators.length === 0) {
      resolve([]);
    }else {
let count = 0;// 计数器，用于判断所有任务是否执行完成let result = [];// 结果数组for (let i = 0; i < iterators.length; i++) {
// 考虑到iterators[i]可能是普通对象，则统一包装为Promise对象Promise.resolve(iterators[i]).then(
          (data) => {
            result[i] = data;// 按顺序保存对应的结果// 当所有任务都执行完成后，再统一返回结果if (++count === iterators.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);// 任何一个Promise对象执行失败，则调用reject()方法return;
          }
        );
      }
    }
  });
};

```

需要注意的是对于  `Promise.all`  的标准实现来说，它的参数是一个可迭代对象，比如 Array、String 或 Set 等。

### 3.2 手写 Promise.race

**`Promise.race(iterable)`**  方法会返回一个 promise 对象，一旦迭代器中的某个 promise 对象  **resolved**  或  **rejected**，返回的 promise 对象就会 resolve 或 reject 相应的值。

```javascript
Promise.race =function (iterators) {
returnnew Promise((resolve, reject) => {
for (const iterof iterators) {
      Promise.resolve(iter)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

```

本文阿宝哥带大家详细分析了  [async-pool](https://github.com/rxaviers/async-pool)  异步任务并发控制的具体实现，同时为了让大家能够更好地理解  [async-pool](https://github.com/rxaviers/async-pool)  的核心代码。最后阿宝哥还带大家一起手写简易版的  `Promise.all`  和  `Promise.race`  函数。其实除了  `Promise.all`  函数之外，还存在另一个函数 —— `Promise.allSettled`，该函数用于解决  `Promise.all`  存在的问题，感兴趣的小伙伴可以自行研究一下。
