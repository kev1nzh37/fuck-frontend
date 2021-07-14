---
title: Redux
order: 4
---

# Redux

> Redux 是 JavaScript 状态容器，它提供可预测的状态管理。

我们一起品品这句话背后的深意：

- Redux 是为 JavaScript 应用而生的，也就是说它不是 React 的专利，React 可以用，Vue 可以用，原生 JavaScript 也可以用；

- Redux 是一个状态容器，什么是状态容器？这里我举个例子。

### Redux 是如何帮助 React 管理数据的

Redux 主要由三部分组成：store、reducer 和 action。我们先来看看它们各自代表什么：

- store 就好比组件群里的“群文件”，它是一个单一的数据源，而且是只读的；

- action 人如其名，是“动作”的意思，它是对变化的描述。

- reducer 是一个函数，它负责对变化进行分发和处理， 最终将新的数据返回给 store。

举个例子，下面这个对象就是一个 `action`：

```javascript
const action = {
  type: 'ADD_ITEM',
  payload: '<li>text</li>',
};
```

store、action 和 reducer 三者紧密配合，便形成了 Redux 独树一帜的工作流：

<img src="https://s0.lgstatic.com/i/image/M00/62/97/CgqCHl-Sm-yADE6PAACSEywFSaA197.png" width="600" />

从上图中，我们首先读出的是数据的流向规律：**在 Redux 的整个工作过程中，数据流是严格单向的**。这一点一定一定要背下来，面试的时候也一定一定要记得说——不管面试官问的是 Redux 的设计思想还是工作流还是别的什么概念性的知识，开局先放这句话，准没错。

接下来仍然是围绕上图，我们来一起看看 Redux 是如何帮助 React 管理数据流的。对于一个 React 应用来说，视图（View）层面的所有数据（state）都来自 store（再一次诠释了单一数据源的原则）。

如果你想对数据进行修改，只有一种途径：派发 action。action 会被 reducer 读取，进而根据 action 内容的不同对数据进行修改、生成新的 state（状态），这个新的 state 会更新到 store 对象里，进而驱动视图层面做出对应的改变。

对于组件来说，任何组件都可以通过约定的方式从 store 读取到全局的状态，任何组件也都可以通过合理地派发 action 来修改全局的状态。**Redux 通过提供一个统一的状态容器，使得数据能够自由而有序地在任意组件之间穿梭**，这就是 Redux 实现组件间通信的思路。

### 从编码的角度理解 Redux 工作流

到这里，你已经了解了 Redux 的设计思想和要素关系。接下来我们将站在编码的角度，探讨 Redux 的工作流，将上文中所提及的各个要素和流程具象化。

#### 1. 使用 createStore 来完成 store 对象的创建

```javascript
// 引入 redux
import { createStore } from 'redux'

// 创建 store
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)
);
```

createStore 方法是一切的开始，它接收三个入参：

- reducer；

- 初始状态内容；

- 指定中间件（这个你先不用管）。

这其中一般来说，只有 reducer 是你不得不传的。下面我们就看看 reducer 的编码形态是什么样的。

#### 2. reducer 的作用是将新的 state 返回给 store

一个 reducer 一定是一个纯函数，它可以有各种各样的内在逻辑，但它最终一定要返回一个 state：

```javascript
const reducer = (state, action) => {
  // 此处是各种样的 state处理逻辑
  return new_state;
};
```

当我们基于某个 reducer 去创建 store 的时候，其实就是给这个 store 指定了一套更新规则：

```javascript
// 更新规则全都写在 reducer 里
const store = createStore(reducer);
```

#### 3. action 的作用是通知 reducer “让改变发生”

如何在浩如烟海的 store 状态库中，准确地命中某个我们希望它发生改变的 state 呢？reducer 内部的逻辑虽然不尽相同，但其本质工作都是“将 action 与和它对应的更新动作对应起来，并处理这个更新”。**所以说要想让 state 发生改变，就必须用正确的 action 来驱动这个改变**。

前面我们已经介绍过 action 的形态，这里再提点一下。首先，action 是一个大致长这样的对象：

```javascript
const action = {
  type: 'ADD_ITEM',
  payload: '<li>text</li>',
};
```

action 对象中允许传入的属性有多个，**但只有 type 是必传的**。type 是 action 的唯一标识，reducer 正是通过不同的 type 来识别出需要更新的不同的 state，由此才能够实现精准的“定向更新”。

#### 4. 派发 action，靠的是 dispatch

action 本身只是一个对象，要想让 reducer 感知到 action，还需要“派发 action”这个动作，这个动作是由 store.dispatch 完成的。这里我简单地示范一下：

```javascript
import { createStore } from 'redux';
// 创建 reducer
const reducer = (state, action) => {
  // 此处是各种样的 state处理逻辑
  return new_state;
};
// 基于 reducer 创建 state
const store = createStore(reducer);
// 创建一个 action，这个 action 用 “ADD_ITEM” 来标识
const action = {
  type: 'ADD_ITEM',
  payload: '<li>text</li>',
};
// 使用 dispatch 派发 action，action 会进入到 reducer 里触发对应的更新
store.dispatch(action);
```

以上这段代码，是从编码角度对 Redux 主要工作流的概括，这里我同样为你总结了一张对应的流程图：

<img src="https://s0.lgstatic.com/i/image/M00/81/9F/CgqCHl_Rii2AVvUbAADn4s_6rB8369.png" width="600" />
