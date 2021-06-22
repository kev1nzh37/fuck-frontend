---
title: 类型判断
order: 3
toc: menu
group:
  title: Javascript
  order: 2
---

类型判断有好几种方式。

### **typeof**

原始类型中除了  `null`，其它类型都可以通过  `typeof`  来判断。

`typeof null`  的值为  `object`，这是因为一个久远的 Bug，没有细究的必要，了解即可。如果想具体判断  `null`  类型的话直接  `xxx === null`  即可。

对于对象类型来说，`typeof`  只能具体判断函数的类型为  `function`，其它均为  `object`。

![1](/images/javascript/type/1.webp)

### **instanceof**

`instanceof`  内部通过原型链的方式来判断是否为构建函数的实例，常用于判断具体的对象类型。

```javascript
[] instanceof Array;
```

都说  `instanceof`  只能判断对象类型，其实这个说法是不准确的，我们是可以通过 hake 的方式得以实现，虽然不会有人这样去玩吧。

```javascript
class CheckIsNumber {
  static [Symbol.hasInstance](number "Symbol.hasInstance") {
    return typeof number === 'number'
  }
}

// true
1 instanceof CheckIsNumber

```

另外其实我们还可以直接通过构建函数来判断类型：

```javascript
// true
[].constructor === Array;
```

### **Object.prototype.toString**

前几种方式或多或少都存在一些缺陷，`Object.prototype.toString`  综合来看是最佳选择，能判断的类型最完整。

![2](/images/javascript/type/2.webp)

上图是一部分类型判断，更多的就不列举了，`[object XXX]`  中的  `XXX`  就是判断出来的类型。

### **isXXX API**

同时还存在一些判断特定类型的 API，选了两个常见的：

![3](/images/javascript/type/3.webp)

### **常见考点**

- JS 类型如何判断，有哪几种方式可用
- `instanceof`  原理
- 手写  `instanceof`

> 有没有什么更好的办法判断类型？

```javascript
const checkType = obj => {
  const [typeEx, typeEn] = Object.prototype.toString.call(obj).split(' ');
  return typeEn.substring(0, typeEn.length - 1).toLowerCase();
};

checkType(1); // number
checkType([]); // array
checkType(new Date()); // date
```

> 能手写实现 instanceof 吗？

```javascript
const instanceOf = (left, right) => {
	const rpt = right.prototype
	white(true){
		if(left === null) return false
		if(left === rpt) return true

		left = left.__proto__
	}
}
instanceOf([], Object) // true
instanceOf([], String) // false
instanceOf('a', String) // true
```
