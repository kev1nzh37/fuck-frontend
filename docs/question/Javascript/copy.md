---
title: 深浅拷贝
order: 12
toc: menu
group:
  title: Javascript
  order: 2
---

### **浅拷贝**

两个对象第一层的引用不相同就是浅拷贝的含义。

我们可以通过  `assign` 、扩展运算符等方式来实现浅拷贝：

```javascript
let a = {
  age: 1,
};
let b = Object.assign({}, a);
a.age = 2;
console.log(b.age); // 1
b = { ...a };
a.age = 3;
console.log(b.age); // 2
```

### **深拷贝**

两个对象内部所有的引用都不相同就是深拷贝的含义。

最简单的深拷贝方式就是使用  `JSON.parse(JSON.stringify(object))`，但是该方法存在不少缺陷。

比如说只支持 JSON 支持的类型，JSON 是门通用的语言，并不支持 JS 中的所有类型。

同时还存在不能处理循环引用的问题：

如果想解决以上问题，我们可以通过递归的方式来实现代码：

```javascript
// 利用 WeakMap 解决循环引用
let map = new WeakMap();
function deepClone(obj) {
  if (obj instanceof Object) {
    if (map.has(obj)) {
      return map.get(obj);
    }
    let newObj;
    if (obj instanceof Array) {
      newObj = [];
    } else if (obj instanceof Function) {
      newObj = function() {
        return obj.apply(this, arguments);
      };
    } else if (obj instanceof RegExp) {
      // 拼接正则
      newobj = new RegExp(obj.source, obj.flags);
    } else if (obj instanceof Date) {
      newobj = new Date(obj);
    } else {
      newObj = {};
    }
    // 克隆一份对象出来
    let desc = Object.getOwnPropertyDescriptors(obj);
    let clone = Object.create(Object.getPrototypeOf(obj), desc);
    map.set(obj, clone);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepClone(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}
```

上述代码解决了常见的类型以及循环引用的问题，当然还是一部分缺陷的，但是面试时候能写出上面的代码已经足够了，剩下的能口述思路基本这道题就能拿到高分了。

比如说递归肯定会存在爆栈的问题，因为执行栈的大小是有限制的，到一定数量栈就会爆掉。

因此遇到这种问题，我们可以通过遍历的方式来改写递归。这个就是如何写层序遍历（BFS）的问题了，通过数组来模拟执行栈就能解决爆栈问题，有兴趣的读者可以咨询查阅。
