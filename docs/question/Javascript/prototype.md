---
title: 原型链
order: 10
toc: menu
group:
  title: Javascript
  order: 2
---

## 一：原型、原型链相等关系理解

`首先我们要清楚明白两个概念：`

1. js 分为**函数对**象和**普通对象**，每个对象都有**proto**属性，但是只有函数对象才有 prototype 属性
2. Object、Function 都是 js 内置的**函数**, 类似的还有我们常用到的 Array、RegExp、Date、Boolean、Number、String

**这两个概念大家跟我一起读三遍并记住，后面会用到**

`那么__proto__和prototype到底是什么，两个概念理解它们`

1. 属性**proto**是一个对象，它有两个属性，constructor 和**proto**；
2. 原型对象 prototype 有一个默认的 constructor 属性，用于记录实例是由哪个构造函数创建；

**这两个概念大家跟我一起读三遍并记住，后面会用到**

> 有以下构造函数 Person，他的原型上有所属国属性 motherland='china'

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.motherland = 'china';
```

> 通过 new Person()创建的 person01 实例

```javascript
let person01 = new Person('小明', 18);
```

`js之父在设计js原型、原型链的时候遵从以下两个准则`

```javascript
1. Person.prototype.constructor == Person // **准则1：原型对象（即Person.prototype）的constructor指向构造函数本身**
2. person01.__proto__ == Person.prototype // **准则2：实例（即person01）的__proto__和原型对象指向同一个地方**

```

**这两个准则大家跟我一起读三遍并记住，后面会用到**

记住以上**四个概念两个准则**，任何原型链相等判断都能判断正确；

大家可以对照上图，看看自己概念准则是否弄清楚了，一定要对照上图哦

```javascript
// 从上方 function Foo() 开始分析这一张经典之图
function Foo()
let f1 = new Foo();
let f2 = new Foo();

f1.__proto__ = Foo.prototype; // 准则2
f2.__proto__ = Foo.prototype; // 准则2
Foo.prototype.__proto__ = Object.protitype; // 准则2 (Foo.prototype本质也是普通对象，可适用准则2)
Object.prototype.__proto__ = null; // 原型链到此停止
Foo.prototype.constructor = Foo; // 准则1
Foo.__proto__ = Function.prototype; // 准则2
Function.prototype.__proto__  = Object.protitype; //  准则2 (Function.prototype本质也是普通对象，可适用准则2)
Object.prototype.__proto__ = null; // 原型链到此停止
// **此处注意Foo 和 Function的区别， Foo是 Function的实例**

// 从中间 Function Object()开始分析这一张经典之图
Function Object()
let o1 = new  Object();
let o2 = new  Object();

o1.__proto__ = Object.prototype; // 准则2
o2.__proto__ = Object.prototype; // 准则2
Object.prototype.__proto__ = null; // 原型链到此停止
Object.prototype.constructor = Object; // 准则1
Object.__proto__ = Function.prototype // 准则2 (Object本质也是函数)；
// 此处有点绕，Object本质是函数，Function本质是对象
Function.prototype.__proto__ =  Object.prototype; // 准则2 (Function.prototype本质也是普通对象，可适用准则2)
Object.prototype.__proto__ = null; // 原型链到此停止

// 从下方 Function Function()开始分析这一张经典之图
Function Function()
Function.__proto__ = Function.prototype // 准则2
Function.prototype.constructor = Function; // 准则1


```

由此可以得出结论：
除了 Object 的原型对象（Object.prototype）的**proto**指向 null，其他内置函数对象的原型对象（例如：Array.prototype）和自定义构造函数的
**proto**都指向 Object.prototype, 因为原型对象本身是普通对象。
即：

```javascript
Object.prototype.__proto__ = null;
Array.prototype.__proto__ = Object.prototype;
Foo.prototype.__proto__ = Object.prototype;
```

## 二：原型、原型链的意思何在

> 理解了这些相等关系之后，我们思考，原型、原型链的意思何在？原型对象的作用，是用来存放实例中共有的那部份属性、方法，可以大大减少内存消耗。
> 用我们文章开始的 Person 构造函数和 person01 实例举例说：

```javascript
console.log(person01);
```

打印 person01， 他有自己属性 name = '小明'，age = 18; 同时通过原型链关系，他有属性 motherland = 'china'；

我们再创建 person2 实例

```javascript
let person02 = new Person('小花', 20);
console.log(person02);
```

打印 person02， 他有自己属性 name = '小花'，age = 20; 同时通过原型链关系，他有属性 motherland = 'china'；
看出来了没有，原型对象存放了 person01、person02 共有的属性所属国 motherland = 'china'. 我们不用在每个实例上添加 motherland 属性，而是将这一属性存在他们的构造函数原型对象上，对于人类 Person 这样的构造函数。相同的属性、方法还有很多很多，比如我们是黑头发，我们都有吃，睡这样一个方法，当相同的属性、方法越多，原型、原型链的意义越大。
那我们可以这样操作

```javascript
Person.prototype.hairColor = 'black';
Person.prototype.eat = function() {
  console.log('We usually eat three meals a day.');
};
console.log(person01);
console.log(person02);
```

此时我们再打印 person01、person02，我们惊喜的发现，他们有了属性 hairColor 和 eat 方法；实例们动态的获得了 Person 构造函数之后添加的属性、方法，这是就是原型、原型链的意义所在！可以动态获取，可以节省内存。

> 另外我们还要注意：如果 person01 将头发染成了黄色，那么 hairColor 会是什么呢？

```javascript
person01,hairColor = 'yellow'；
console.log(person01)
console.log(person02)

```

可以看到，person01 的 hairColor = 'yellow'， 而 person02 的 hairColor = 'black'；
实例对象重写原型上继承的属相、方法，相当于“属性覆盖、属性屏蔽”，这一操作不会改变原型上的属性、方法，自然也不会改变由统一构造函数创建的其他实例，只有修改原型对象上的属性、方法，才能改变其他实例通过原型链获得的属性、方法。
