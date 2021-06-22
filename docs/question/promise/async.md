---
title: async, await
order: 4
toc: menu
group:
  title: 异步
  order: 3
---

### **async、await**

`await`  和  `promise`  一样，更多的是考笔试题，当然偶尔也会问到和  `promise`  的一些区别。

`await`  相比直接使用  `Promise`  来说，优势在于处理  `then`  的调用链，能够更清晰准确的写出代码。缺点在于滥用  `await`  可能会导致性能问题，因为  `await`  会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性，此时更应该使用  `Promise.all`。

下面来看一道很容易做错的笔试题。

```javascript
var a = 0;
var b = async () => {
  a = a + (await 10);
  console.log('2', a); // -> ？
};
b();
a++;
console.log('1', a); // -> ？
```

这道题目大部分读者肯定会想到  `await`  左边是异步代码，因此会先把同步代码执行完，此时  `a`  已经变成 1，所以答案应该是 11。

其实  `a`  为 0 是因为加法运算法，先算左边再算右边，所以会把 0 固定下来。如果我们把题目改成  `await 10 + a`  的话，答案就是 11 了。
