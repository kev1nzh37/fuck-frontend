---
title: Webpack Tree shaking
order: 8
group:
  title: Webpack
  order: 4
---

# Webpack Tree shaking

## Tree shaking 的目的

App 往往有一个入口文件，相当于一棵树的主干，入口文件有很多依赖的模块，相当于树枝。实际情况中，虽然依赖了某个模块，但其实只使用其中的某些功能。通过 Tree shaking，将没有使用的模块摇掉，这样来达到删除无用代码的目的。

## 模块

CommonJS 的模块`require` `modules.exports`,`exports`

```javascript
var my_lib;
if (Math.random()) {
  my_lib = require('foo');
} else {
  my_lib = require('bar');
}

module.exports = xx;
```

ES2015(ES6)的模块`import`,`export`

```javascript
// lib.js
export function foo() {}
export function bar() {}

// main.js
import { foo } from './lib.js';
foo();
```

## Tree shaking 的原理

关于 Tree shaking 的原理，在[Tree Shaking 性能优化实践 - 原理篇](https://juejin.im/post/6844903544756109319)已经说的比较清楚，简单来说。

```javascript
Tree shaking的本质是消除无用的JavaScript代码。
因为ES6模块的出现，ES6模块依赖关系是确定的，`和运行时的状态无关`，可以进行可靠的静态分析，
这就是Tree shaking的基础。

```

## 支持 Tree-shaking 的工具

- Webpack/UglifyJS
- rollup
- Google closure compiler

今天，我们来看一下 Webpack 的 Tree shaking 做了什么

## Webpack Tree shaking

Tree shaking 到底能做哪些事情??

### 1.Webpack Tree shaking 从 ES6 顶层模块开始分析，可以清除未使用的模块

从[官网的例子](https://webpack.js.org/guides/tree-shaking/#add-a-utility)来看
[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step1/test)：

```javascript
//App.js
import { cube } from './utils.js';
cube(2);

//utils.js
export function square(x) {
  console.log('square');
  return x * x;
}

export function cube(x) {
  console.log('cube');
  return x * x * x;
}
```

result: [square 的代码被移除](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step1/build/bundle.js#L36)

```javascript
function(e, t, r) {
  "use strict";
  r.r(t), console.log("cube")
}

```

### 2.Webpack Tree shaking 会对多层调用的模块进行重构，提取其中的代码，简化函数的调用结构

[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step2/test)

```javascript
//App.js
import { getEntry } from './utils';
console.log(getEntry());

//utils.js
import entry1 from './entry.js';
export function getEntry() {
  return entry1();
}

//entry.js
export default function entry1() {
  return 'entry1';
}
```

result: [简化后的代码如下](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step2/build/bundle.js#L36)

```javascript
//摘录核心代码
function(e, t, r) {
  "use strict";
  r.r(t), console.log("entry1")
}

```

### 3.Webpack Tree shaking 不会清除 IIFE(立即调用函数表达式)

IIFE 是什么？？
[IIFE in MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F)

[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step3/test)

```javascript
//App.js
import { cube } from './utils.js';
console.log(cube(2));

//utils.js
var square = (function(x) {
  console.log('square');
})();

export function cube(x) {
  console.log('cube');
  return x * x * x;
}
```

result: [square 和 cude 都存在](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step3/build/bundle.js#L37)

```javascript
function(e, t, n) {
  "use strict";
  n.r(t);
  console.log("square");
  console.log(function(e) {
    return console.log("cube"), e * e * e
  }(2))
}

```

这里的问题会是为什么不会清除 IIFE？在[你的 Tree-Shaking 并没什么卵用](https://juejin.im/post/6844903549290151949)中有过分析，里面有一个例子比较好，见下文

原因很简单:`因为IIFE比较特殊，它在被翻译时(JS并非编译型的语言)就会被执行，Webpack不做程序流分析，它不知道IIFE会做什么特别的事情，所以不会删除这部分代码`
比如：

```javascript
var V8Engine = (function() {
  function V8Engine() {}
  V8Engine.prototype.toString = function() {
    return 'V8';
  };
  return V8Engine;
})();

var V6Engine = (function() {
  function V6Engine() {}
  V6Engine.prototype = V8Engine.prototype; // <---- side effect
  V6Engine.prototype.toString = function() {
    return 'V6';
  };
  return V6Engine;
})();

console.log(new V8Engine().toString());
```

result:

```javascript
输出V6, 而并不是V8;
```

如果 V6 这个 IIFE 里面再搞一些全局变量的声明，那就当然不能删除了。

### 4.Webpack Tree shaking 对于 IIFE 的返回函数，如果未使用会被清除

当然 Webpack 也没有那么的傻，如果发现 IIFE 的返回函数没有地方调用的话，依旧是可以被删除的

[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step4/test)

```javascript
//App.js
import { cube } from './utils.js';
console.log(cube(2));

//utils.js
var square = (function(x) {
  console.log('square');
  return x * x;
})();

function getSquare() {
  console.log('getSquare');
  square();
}

export function cube(x) {
  console.log('cube');
  return x * x * x;
}
```

result: [结果如下](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step4/build/bundle.js#L37)

```javascript
function(e, t, n) {
  "use strict";
  n.r(t);
  console.log("square");   <= square这个IIFE内部的代码还在
  console.log(function(e) {
    return console.log("cube"), e * e * e  <= square这个IIFEreturn的方法因为getSquare未被调用而被删除
  }(2))
}

```

### 5.Webpack Tree shaking 结合第三方包使用

[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step5/test)

```javascript
//App.js
import { getLast } from './utils.js';
console.log(getLast('abcdefg'));

//utils.js
import _ from 'lodash';   <=这里的引用方式不同，会造成bundle的不同结果

export function getLast(string) {
  console.log('getLast');
  return _.last(string);
}

```

result: [结果如下](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step5/README.md)

```javascript
import _ from 'lodash';
    Asset      Size
bundle.js  70.5 KiB

import { last } from 'lodash';
    Asset      Size
bundle.js  70.5 KiB

import last from 'lodash/last';   <=这种引用方式明显降低了打包后的大小
    Asset      Size
bundle.js  1.14 KiB

```

### Webpack Tree shaking 做不到的事情

在[体积减少 80%！释放 webpack tree-shaking 的真正潜力](https://juejin.im/post/6844903669100445710)一文中提到了，Webpack Tree shaking 虽然很强大，但是依旧存在缺陷

[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step6/test)

```javascript
//App.js
import { Add } from './utils';
Add(1 + 2);

//utils.js
import { isArray } from 'lodash-es';

export function array(array) {
  console.log('isArray');
  return isArray(array);
}

export function Add(a, b) {
  console.log('Add');
  return a + b;
}
```

result: [不该导入的代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step6/build/bundle.js#L37)

```javascript
这个`array`函数未被使用，但是lodash-es这个包的部分代码还是会被build到bundle.js中

```

可以使用这个插件[webpack-deep-scope-analysis-plugin](https://github.com/vincentdchan/webpack-deep-scope-analysis-plugin)解决

## 小结

如果要`更好`的使用 Webpack Tree shaking,请满足：

- 使用 ES2015(ES6)的模块
- 避免使用 IIFE
- 如果使用第三方的模块，可以尝试直接从文件路径引用的方式使用（这并不是最佳的方式）

```javascript
import { fn } from 'module';
=>
import fn from 'module/XX';

```

## Babel 带来的问题 1-语法转换(Babel6)

`以上的所有示例都没有使用Babel进行处理`，但是我们明白在真实的项目中，Babel 对于我们还是必要的。那么如果使用了 Babel 会带来什么问题呢？(以下讨论建立在`Babel6`的基础上)

我们看[代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/tree/master/src/Step7/test)：

```javascript
//App.js
import { Apple } from './components'

const appleModel = new Apple({   <==仅调用了Apple
  model: 'IphoneX'
}).getModel()

console.log(appleModel)

//components.js
export class Person {
  constructor ({ name, age, sex }) {
    this.className = 'Person'
    this.name = name
    this.age = age
    this.sex = sex
  }
  getName () {
    return this.name
  }
}

export class Apple {
  constructor ({ model }) {
    this.className = 'Apple'
    this.model = model
  }
  getModel () {
    return this.model
  }
}

//webpack.config.js
const path = require('path');
module.exports = {
  entry: [
    './App.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  module: {},
  mode: 'production'
};

```

result: [结果如下](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step7/build/bundle.js#L37)

```javascript
function(e, t, n) {
  "use strict";
  n.r(t);
  const r = new class {
    constructor({ model: e }) {
      this.className = "Apple", this.model = e
    }
    getModel() {
      return this.model
    }
  }({ model: "IphoneX" }).getModel();
  console.log(r)
}

//仅有Apple的类，没有Person的类(Tree shaking成功)
//class还是class，并没有经过语法转换(没有经过Babel的处理)

```

但是如果加上 Babel(babel-loader)的处理呢？

```javascript
//App.js和component.js保持不变
//webpack.config.js
const path = require('path');
module.exports = {
  entry: ['./App.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './buildBabel'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  mode: 'production',
};
```

result：[结果如下](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step7/buildBabel/bundle.js#L40)

```javascript
function(e, n, t) {
  "use strict";
  Object.defineProperty(n, "__esModule", { value: !0 });
  var r = function() {
    function e(e, n) {
      for(var t = 0; t < n.length; t++) {
        var r = n[t];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
      }
    }
    return function(n, t, r) {
      return t && e(n.prototype, t), r && e(n, r), n
    }
  }();
  function o(e, n) {
    if(!(e instanceof n)) throw new TypeError("Cannot call a class as a function")
  }
  n.Person = function() {
    function e(n) {
      var t = n.name, r = n.age, u = n.sex;
      o(this, e), this.className = "Person", this.name = t, this.age = r, this.sex = u
    }
    return r(e, [{
      key: "getName", value: function() {
        return this.name
      }
    }]), e
  }(), n.Apple = function() {
    function e(n) {
      var t = n.model;
      o(this, e), this.className = "Apple", this.model = t
    }
    return r(e, [{
      key: "getModel", value: function() {
        return this.model
      }
    }]), e
  }()
}

//这次不仅Apple类在，Person类也存在(Tree shaking失败了)
//class已经被babel处理转换了

```

> 结论：Webpack 的 Tree Shaking 有能力除去导出但没有使用的代码块，但是结合 Babel(6)使用之后就会出现问题

那么我们看看 Babel 到底干了什么, [这是被 Babel6 处理的代码](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/lib/Step7/test/components.js)

```javascript
'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});

//_createClass本质上也是一个IIFE
var _createClass = function() {
  function defineProperties(target, props) {
    for(var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if(protoProps) defineProperties(Constructor.prototype, protoProps);
    if(staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if(!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

//Person本质上也是一个IIFE
var Person = exports.Person = function () {
  function Person(_ref) {
    var name = _ref.name,
        age = _ref.age,
        sex = _ref.sex;
    _classCallCheck(this, Person);
    this.className = 'Person';
    this.name = name;
    this.age = age;
    this.sex = sex;
  }
  _createClass(Person, [{    <==这里调用了另一个IIFE
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }]);
  return Person;
}();

```

从最开始，我们就清楚 Webpack Tree shaking 是不处理 IIFE 的，所以这里即使没有调用 Person 类在 bundle 中也存在了 Person 类的代码。

我们可以设定使用`loose: true`来使得 Babel 在转化时使用宽松的模式，但是这样也仅仅只能去除`_createClass`，Person 本身依旧存在

```javascript
//webpack.config.js
{
  loader: 'babel-loader',
  options: {
    presets: [["env", { loose: true }]]
  }
}

```

result: [结果如下](https://github.com/sialvsic/tree-shaking-babel-6-demo/blob/master/src/Step7/buildBabelLoose/bundle.js#L46)

```javascript
function(e, t, n) {
  "use strict";
  function r(e, t) {
    if(!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
  }
  t.__esModule = !0;
  t.Person = function() {
    function e(t) {
      var n = t.name, o = t.age, u = t.sex;
      r(this, e), this.className = "Person", this.name = n, this.age = o, this.sex = u
    }
    return e.prototype.getName = function() {
      return this.name
    }, e
  }(), t.Apple = function() {
    function e(t) {
      var n = t.model;
      r(this, e), this.className = "Apple", this.model = n
    }
    return e.prototype.getModel = function() {
      return this.model
    }, e
  }()
}

```

## Babel6 的讨论

`Class declaration in IIFE considered as side effect` 详见：[github.com/mishoo/Ugli…](https://github.com/mishoo/UglifyJS2/issues/1261)

总结：

- Uglify doesn't perform program flow analysis. but rollup did(Uglify 不做程序流的分析，但是 rollup 做了)
- Variable assignment could cause an side effect(变量的赋值可能会引起副作用)
- Add some `/*#__PURE__*/` annotation could help with it(可以尝试添加注释`/*#__PURE__*/`的方式来声明一个无副作用的函数，使得 Webpack 在分析处理时可以过滤掉这部分代码)

关于第三点：添加`/*#__PURE__*/`，这也是 Babel`7`的执行行为, [这是被 Babel7 处理的代码](https://github.com/sialvsic/tree-shaking-babel-7-demo/blob/master/lib/Step/test/components.js#L15)

```javascript
var Person =
  /*#__PURE__*/               <=这里添加了注释
  function() {
    function Person(_ref) {
      var name = _ref.name,
        age = _ref.age,
        sex = _ref.sex;
      _classCallCheck(this, Person);
      this.className = 'Person';
      this.name = name;
      this.age = age;
      this.sex = sex;
    }
    _createClass(Person, [{
      key: "getName",
      value: function getName() {
        return this.name;
      }
    }]);
    return Person;
  }();
exports.Person = Person;

```

所以，在 Babel7 的运行环境下，经过 Webpack 的处理是可以过滤掉这个未使用的 Person 类的。

## Babel 带来的问题 2-模块转换(Babel6/7)

我们已经清楚，CommonJS 模块和 ES6 的模块是不一样的，Babel 在处理时默认将所有的模块转换成为了`exports`结合`require`的形式，我们也清楚 Webpack 是基于 ES6 的模块才能做到最大程度的 Tree shaking 的，所以我们在使用 Babel 时，应该将 Babel 的这一行为关闭，方式如下：

```javascript
//babel.rc
presets: [['env', { module: false }]];
```

但这里存在一个问题：什么情况下我们该关闭这个转化？

如果我们都在一个 App 中，这个 module 的关闭是没有意义的，因为如果关闭了，那么打包出来的 bundle 是没有办法在浏览器里面运行的(不支持 import)。所以这里我们应该在 App 依赖的某个功能库打包时去设置。
比如：像`lodash/lodash-es`,`redux`,`react-redux`,`styled-component`这类库都同时存在 ES5 和 ES6 的版本

```javascript
- redux
  - dist
  - es
  - lib
  - src
  ...

```

同时在 packages.json 中设置入口配置，就可以让 Webpack 优先读取 ES6 的文件
eg: [Redux ES 入口](https://github.com/reduxjs/redux/blob/master/package.json#L28)

```javascript
//package.json
"main": "lib/redux.js",
"unpkg": "dist/redux.js",
"module": "es/redux.js",
"typings": "./index.d.ts",

```

## Webpack Tree shaking - Side Effect

在官方文档中提到了一个[sideEffects](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)的标记，但是关于这个标记的作用，文档详述甚少，甚至运行[官方给了例子](https://github.com/webpack/webpack/tree/master/examples/side-effects)，在最新的版本的 Webpack 中也无法得到它解释的结果，因此对这个标记的用法存在更多的疑惑。读完[Webpack 中的 sideEffects 到底该怎么用?](https://juejin.im/post/6844903640533041159) 这篇大致会对做了什么？怎么用？ 有了基本的认知，我们可以接着深挖

### Tree shaking 到底做了什么

Demo1：

```javascript
//App.js
import { a } from 'tree-shaking-npm-module-demo';
console.log(a);

//index.js
export { a } from './a';
export { b } from './b';
export { c } from './c';

//a.js
export var a = 'a';

//b.js
export var b = 'b';

//c.js
export var c = 'c';
```

result: 仅仅留下了 a 的代码

```javascript
function(e, t, r) {
  "use strict";
  r.r(t);
  console.log("a")
}

```

Demo2：

```javascript
//App.js
import { a } from 'tree-shaking-npm-module-demo';
console.log(a);

//index.js
export { a } from './a';
export { b } from './b';
export { c } from './c';

//a.js
export var a = 'a';

//b.js
(function fun() {
  console.log('fun');
})();
window.name = 'name';
export var b = 'b';

//c.js
export var c = 'c';
```

result: 留下了 a 的代码，同时还存在 b 中的代码

```javascript
function(e, n, t) {
  "use strict";
  t.r(n);
  console.log("fun"), window.name = "name";
  console.log("a")
}

```

Demo3： 添加 sideEffects 标记

```javascript
//package.json
{
  "sideEffects": false,
}

```

result: 仅留下了 a 的代码，b 模块中的所有的副作用的代码被删除了

```javascript
function(e, t, r) {
  "use strict";
  r.r(t);
  console.log("a")
}

```

综上：参考[What Does Webpack 4 Expect From A Package With sideEffects: false](https://stackoverflow.com/questions/49160752/what-does-webpack-4-expect-from-a-package-with-sideeffects-false)中`@asdfasdfads(那个目前只有三个赞)`的回答

实际上：

```javascript
The consensus is that "has no sideEffects" phrase can be decyphered as "doesn't talk to things external to the module at the top level".
译为:
"没有副作用"这个短语可以被解释为"不与顶层模块以外的东西进行交互"。

```

在 Demo3 中，我们添加了`"sideEffects": false`也就意味着：

> 1.在 b 模块中虽然有一些副作用的代码(IIFE 和更改全局变量/属性的操作)，但是我们不认为删除它是有风险的

> 2.模块被引用过(被其他的模块 import 过或重新 export 过)

```javascript
情况A
//b.js
(function fun() {
  console.log('fun');
})()
window.name = 'name'
export var b = "b";

//index.js
import { b } from "./b";
分析：
b模块一旦被import，那么其中的代码会在翻译时执行

情况B
//b.js
(function fun() {
  console.log('fun');
})()
window.name = 'name'
export var b = "b";

//index.js
export { b } from "./b";
分析：
According to the ECMA Module Spec, whenever a module reexports all exports (regardless if used or unused) need to be evaluated and executed in the case that one of those exports created a side-effect with another.
b模块一旦被重新re-export，根据ECMA模块规范，每当模块重新导出所有导出(无论使用或未使用)时，都需要对其中一个导出与另一个导出产生副作用的情况进行评估和执行

情况C
//b.js
(function fun() {
  console.log('fun');
})()
window.name = 'name'
export var b = "b";

//index.js
//没有import也没有export
分析：
没用的当然没有什么影响

```

只要满足以上两点：我们就可以根据情况安全的添加这个标记来通知 Webpack 可以安全的删除这些无用的代码。
当然如果你的代码确实有一些副作用，那么可以改为提供一个数组：

```javascript
"sideEffects": [
    "./src/some-side-effectful-file.js"
]

```

## 总结：

如果想利用好 Webpack 的 Tree shaking，需要对自己的项目进行一些改动。
建议：

1.对第三方的库：

- 团队的维护的：视情况加上`sideEffects`标记，同时更改 Babel 配置来导出`ES6模块`
- 第三方的：尽量使用提供 ES 模块的版本

  2.工具：

- 升级 Webpack 到 4.x
- 升级 Babel 到 7.x
