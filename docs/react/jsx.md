---
title: JSX
order: 2
menu: toc
---

## JSX

JSX 是 JavaScript 的一种语法扩展，它和模板语言很接近，但是它充分具备 JavaScript 的能力。

### JSX 语法是如何在 JavaScript 中生效的：认识 Babel

> JSX 会被编译为 React.createElement()， React.createElement() 将返回一个叫作“React Element”的 JS 对象。

“编译”这个动作，是由 Babel 来完成的。

![1](https://s0.lgstatic.com/i/image/M00/5C/73/CgqCHl-BegWAbxNEAAH9HxafvWE988.png)

可以看到，所有的 JSX 标签都被转化成了 React.createElement 调用，这也就意味着，我们写的 JSX 其实写的就是 React.createElement，虽然它看起来有点像 HTML，但也只是“看起来像”而已。JSX 的本质是 React.createElement 这个 JavaScript 调用的语法糖，这也就完美地呼应上了 React 官方给出的“JSX 充分具备 JavaScript 的能力”这句话。

### React 选用 JSX 语法的动机

JSX 语法糖允许前端开发者使用我们最为熟悉的类 HTML 标签语法来创建虚拟 DOM，在降低学习成本的同时，也提升了研发效率与研发体验。

读到这里，相信你已经充分理解了“JSX 是 JavaScript 的一种语法扩展，它和模板语言很接近，但是它充分具备 JavaScript 的能力。 ”这一定义背后的深意。那么我们文中反复提及的 React.createElement 又是何方神圣呢？下面我们就深入相关源码来一窥究竟。

### JSX 是如何映射为 DOM 的：起底 createElement 源码

#### 创造一个元素需要知道哪些信息

```javascript
export function createElement(type, config, children)
```

createElement 有 3 个入参，这 3 个入参囊括了 React 创建一个元素所需要知道的全部信息。

- type：用于标识节点的类型。它可以是类似“h1”“div”这样的标准 HTML 标签字符串，也可以是 React 组件类型或 React fragment 类型。

- config：以对象形式传入，组件所有的属性都会以键值对的形式存储在 config 对象中。

- children：以对象形式传入，它记录的是组件标签之间嵌套的内容，也就是所谓的“子节点”“子元素”。

```javascript
React.createElement(
  'ul',
  {
    // 传入属性键值对
    className: 'list',
    // 从第三个入参开始往后，传入的参数都是 children
  },
  React.createElement(
    'li',
    {
      key: '1',
    },
    '1',
  ),
  React.createElement(
    'li',
    {
      key: '2',
    },
    '2',
  ),
);
```

这个调用对应的 DOM 结构如下：

```html
<ul className="list">
  <li key="1">1</li>

  <li key="2">2</li>
</ul>
```

#### createElement 函数体拆解

这里我想和你探讨的是 createElement**在逻辑层面的任务流转**。针对这个过程，我为你总结了下面这张流程图：

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BeuGAepNsAACqreYXrj0410.png" width="600">

这个流程图，或许会打破不少同学对 createElement 的幻想。在实际的面试场景下，许多候选人由于缺乏对源码的了解，谈及 createElement 时总会倾向于去夸大它的“工作量”。但其实，相信你也已经发现了，createElement 中并没有十分复杂的涉及算法或真实 DOM 的逻辑，它的每一个步骤几乎都是在格式化数据。

说得更直白点，createElement 就像是开发者和 ReactElement 调用之间的一个“**转换器**”、一个数据处理层。它可以从开发者处接受相对简单的参数，然后将这些参数按照 ReactElement 的预期做一层格式化，最终通过调用 ReactElement 来实现元素的创建。整个过程如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BevGANuu4AACN5mBDMlg569.png" width="600">

#### 初识虚拟 DOM

上面已经分析过，createElement 执行到最后会 return 一个针对 ReactElement 的调用。这里关于 ReactElement，我依然先给出源码 + 注释形式的解析：

```javascript
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };
  //
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }
  return element;
};
```

ReactElement 的代码出乎意料的简短，从逻辑上我们可以看出，ReactElement 其实只做了一件事情，那就是“创建”，说得更精确一点，是“组装”：ReactElement 把传入的参数按照一定的规范，“组装”进了 element 对象里，并把它返回给了 React.createElement，最终 React.createElement 又把它交回到了开发者手中。整个过程如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/5C/74/CgqCHl-Bex6AM5rhAACJMrix5bk913.png" width="600">

如果你想要验证这一点，可以尝试输出我们示例中 App 组件的 JSX 部分：

```javascript
const AppJSX = (
  <div className="App">
    <h1 className="title">I am the title</h1>

    <p className="content">I am the content</p>
  </div>
);

console.log(AppJSX);
```

你会发现它确实是一个标准的 ReactElement 对象实例，如下图（生产环境下的输出结果）所示：

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BezKAW4rXAAIUYQW6Lk0911.png" width="600">

这个 ReactElement 对象实例，本质上是以 **JavaScript 对象形式存在的对 DOM** 的描述，也就是老生常谈的“虚拟 DOM”（准确地说，**是虚拟 DOM 中的一个节点**。关于虚拟 DOM， 我们将在专栏的“模块二：核心原理”中花大量的篇幅来研究它，此处你只需要能够结合源码，形成初步认知即可）。

既然是“虚拟 DOM”，那就意味着和渲染到页面上的真实 DOM 之间还有一些距离，这个“距离”，就是由大家喜闻乐见的 ReactDOM.render 方法来填补的。

在每一个 React 项目的入口文件中，都少不了对 React.render 函数的调用。下面我简单介绍下 ReactDOM.render 方法的入参规则：

```javascript
ReactDOM.render(
  // 需要渲染的元素（ReactElement）
  element,
  // 元素挂载的目标容器（一个真实DOM）
  container,
  // 回调函数，可选参数，可以用来处理渲染结束后的逻辑
  [callback],
);
```

ReactDOM.render 方法可以接收 3 个参数，其中第二个参数就是一个真实的 DOM 节点，这个真实的 DOM 节点充当“容器”的角色，React 元素最终会被渲染到这个“容器”里面去。比如，示例中的 App 组件，它对应的 render 调用是这样的：

```javascript
const rootElement = document.getElementById('root');

ReactDOM.render(<App />, rootElement);
```

注意，这个真实 DOM 一定是确实存在的。比如，在 App 组件对应的 index.html 中，已经提前预置 了 id 为 root 的根节点：

```html
<body>
  <div id="root"></div>
</body>
```
