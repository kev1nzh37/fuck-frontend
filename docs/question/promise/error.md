---
title: Promise.all 错误处理
order: 2
toc: menu
group:
  title: 异步
  order: 3
---

## Promise.all 错误请求时的处理

```javascript
function http(value, flag) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        // 设定一个成功或者失败的条件
        resolve(value);
        console.log(flag ? '重新请求成功' : '第一次请求成功', value);
      } else {
        console.log(flag ? '重新请求失败' : '第一次请求失败', value);
        resolve(http(value, true));
      }
    }, Math.random() * 2000);
  });
}
let A = http('A');
let B = http('B');
let C = http('C');
let D = http('D');

Promise.all([A, B, C, D]).then(res => {
  console.log('成功', res);
});
```

![1](/images/promise/error/1.png)
