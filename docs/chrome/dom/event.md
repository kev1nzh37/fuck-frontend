---
title: 创建自定义事件
order: 3
group:
  title: 浏览器和DOM
  order: 3
---

# 创建自定义事件

## [创建自定义事件](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#%E5%88%9B%E5%BB%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6)

Events 可以使用  `[Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)`  构造函数创建如下：

```javascript
var event = new Event('build');

// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

// Dispatch the event.
elem.dispatchEvent(event);
```

上述代码使用了  [EventTarget.dispatchEvent()](https://wiki.developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)  方法。

绝大多数现代浏览器中都会支持这个构造函数（Internet Explorer 例外）。 要了解更为复杂的方法，可参考下面的  [过时的方式](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#the_old-fashioned_way)  一节。

### [添加自定义数据 – CustomEvent()](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E6%95%B0%E6%8D%AE_%E2%80%93_customevent)

要向事件对象添加更多数据，可以使用  [CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)  接口，detail 属性可用于传递自定义数据。例如，event 可以创建如下：

```javascript
var event = new CustomEvent('build', { detail: elem.dataset.time });
```

下面的代码允许你在事件监听器中访问更多的数据：

```javascript
function eventHandler(e) {
  log('The time is: ' + e.detail);
}
```

### [过时的方式](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#%E8%BF%87%E6%97%B6%E7%9A%84%E6%96%B9%E5%BC%8F)

早期的创建事件的方法使用了受 Java 启发的 API。下面展示了一个示例：

```javascript
// Create the event.
var event = document.createEvent('Event');

// Define that the event name is 'build'.
event.initEvent('build', true, true);

// Listen for the event.
document.addEventListener(
  'build',
  function(e) {
    // e.target matches document from above
  },
  false,
);

// target can be any Element or other EventTarget.
document.dispatchEvent(event);
```

### [事件冒泡](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#%E4%BA%8B%E4%BB%B6%E5%86%92%E6%B3%A1)

通常需要从子元素触发事件，并让祖先捕获它：

```html
<form><textarea></textarea></form>
```

```javascript
const form = document.querySelector('form');
const textarea = document.querySelector('textarea');

// Create a new event, allow bubbling, and provide any data you want to pass to the "details" property
const eventAwesome = new CustomEvent('awesome', {
  bubbles: true,
  detail: { text: () => textarea.value },
});

// The form element listens for the custom "awesome" event and then consoles the output of the passed text() method
form.addEventListener('awesome', e => console.log(e.detail.text()));

// As the user types, the textarea inside the form dispatches/triggers the event to fire, and uses itself as the starting point
textarea.addEventListener('input', e => e.target.dispatchEvent(eventAwesome));
```

### [动态创建和派发事件](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#%E5%8A%A8%E6%80%81%E5%88%9B%E5%BB%BA%E5%92%8C%E6%B4%BE%E5%8F%91%E4%BA%8B%E4%BB%B6)

元素可以侦听尚未创建的事件：

```html
<form><textarea></textarea></form>
```

```javascript
const form = document.querySelector('form');
const textarea = document.querySelector('textarea');

form.addEventListener('awesome', e => console.log(e.detail.text()));

textarea.addEventListener('input', function() {
  // Create and dispatch/trigger an event on the fly
  // Note: Optionally, we've also leveraged the "function expression" (instead of the "arrow function expression") so "this" will represent the element
  this.dispatchEvent(
    new CustomEvent('awesome', {
      bubbles: true,
      detail: { text: () => textarea.value },
    }),
  );
});
```

## [触发内置事件](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/Guide/Events/Creating_and_triggering_events#%E8%A7%A6%E5%8F%91%E5%86%85%E7%BD%AE%E4%BA%8B%E4%BB%B6)

下面的例子演示了一个在复选框上点击（click）的模拟（就是说在程序里生成一个 click 事件），这个模拟点击使用了 DOM 方法。[参见这个动态示例](http://developer.mozilla.org/samples/domref/dispatchEvent.html)

```javascript
function simulateClick() {
  var event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  var cb = document.getElementById('checkbox');
  var cancelled = !cb.dispatchEvent(event);
  if (cancelled) {
    // A handler called preventDefault.
    alert('cancelled');
  } else {
    // None of the handlers called preventDefault.
    alert('not cancelled');
  }
}
```
