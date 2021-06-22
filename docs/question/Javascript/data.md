---
title: 数据类型
order: 2
toc: menu
group:
  title: Javascript
  order: 2
---

## 1. 数据类型的区分

原始类型： undefined, boolean, number, string, bigInt, symbol, null

对象类型：Object （Object, Array, Map, Set, WeakMap, WeakSet, Date......）

原始类型，它存储的是一个值。 而对象类型，是通过原生 Object 派生出来的，它存储的是一个位置(地址/指针)。

```javascript
// 对象类型可以调用方法
// list => [1,2,3,4,5] => Array() => Array().filter
const list = [1, 2, 3, 4, 5]; //对象类型
const filterItem = list.filter(i => i === 2); // [2]

//如果在原始类型上调用方法会怎么样？
const number = 1; //原始类型
number.toString(); // "1"

// 1. new Number(number) =>  1 (Number对象派生出来的数据)
// 2. 调用toString()   1 => Number() => Object() => Object().toString
// 3. return 结果， 销毁当前实例。
```

### 2. 类型判断

typeof：只用于检查原始类型，若检查对象类型的数据只会返回 object。

instanceof：运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

```javascript
//typeof
console.log(typeof 42); // number
console.log(typeof 'blubber'); // string
console.log(typeof true); //boolean
console.log(typeof []); //object  如果想要打印出array应该怎么做？

//instanceof
function a() {}
function b() {}
let c = new a();

console.log(c instanceof a); // true
console.log(c instanceof b); // false
```

### 需要注意的知识点：

1. undefined, 创建一个变量，但未被赋值，那就会有个默认值 ⇒ undefined。
2. Object，它是任何 constructed 对象实例的特殊非数据结构类型，几乎所有通过 new 创建出来的数据类型。
3. instanceof 原理和原型链

   首先确定两个点，第一点是所有对象都有**proto**属性，只有 Object.prototype.proto 为 null。第二点所有构造函数的 prototype 都指向它的原型对象，而构造函数的实例的**proto**也指向原型对象。

   ```jsx
   function a() {}
   const b = new a();

   console.log(b.__proto__ === a.prototype); // true  都指向构造函数a的原型对象
   console.log(b instanceof a); // true
   console.log(b instanceof Object); // true

   //nstanceof的原理就是比对prototype是否出现在原型链上。
   ```

### 例题

```

```
