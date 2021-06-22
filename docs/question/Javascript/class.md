---
title: 继承
order: 11
toc: menu
group:
  title: Javascript
  order: 2
---

即使是 ES6 中的  `class`  也不是其他语言里的类，本质就是一个函数。

```javascript
class Person {}
Person instanceof Function; // true
```

其实在当下都用 ES6 的情况下，ES5 的继承写法已经没啥学习的必要了，但是因为面试还会被问到，所以复习一下还是需要的。

首先来说下 ES5 和 6 继承的区别：

1. ES6 继承的子类需要调用  `super()`  才能拿到子类，ES5 的话是通过  `apply`  这种绑定的方式
2. 类声明不会提升，和  `let`  这些一致

接下来就是回字的几种写法的名场面了，ES5 实现继承的方式有很多种，面试了解一种已经够用：

```javascript
function Super() {}
Super.prototype.getNumber = function() {
  return 1;
};

function Sub() {}
Sub.prototype = Object.create(Super.prototype, {
  constructor: {
    value: Sub,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});
let s = new Sub();
s.getNumber();
```
