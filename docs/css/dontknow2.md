---
title: 2021年你可能不知道的 CSS 特性（下篇）
order: 4
toc: menu
---

# 2021 年你可能不知道的 CSS 特性（下篇）

在这个话题中主要整理了有关于 CSS 方面的特性，并且尽可能的整理了一些大家现在能用或过不了多久就能用的属性。另外，虽然标题是“新特性”，但其中有蛮多特性并不是“新”，可能已经出现在你的项目中，或者你已经看过，只是不了解而以。接下来，就和大家一起来简单地回顾一下这些性，希望大家能喜欢，也希望对大家平时工作有所帮助。

> CSS 等比缩放

CSS 等比缩放一般指的是 “容器高度按比例根据宽度改变”，很多时候也称为宽高比或纵宽比。 众所周知，我们开发 Web 页面要面对的终端更复杂的了，而这些终端的宽高比都不一样。常见的比例有：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b4b9f82d52b4b3cb46850ac0e29e24b~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b4b9f82d52b4b3cb46850ac0e29e24b~tplv-k3u1fbpfcp-zoom-1.image)

特别是在做媒体相关开发的同学，比如视频、图像等，这方面的需求会更多，比如 Facebook 上的图片，视频展示：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af2fd1a26e7e4d77a9df108c725b05b1~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af2fd1a26e7e4d77a9df108c725b05b1~tplv-k3u1fbpfcp-zoom-1.image)

CSS 在还没有 `_aspect-ratio_` 之前，常使用一些 Hacck 手段来实现实类似的效果，即使用 `padding-top` 或 `padding-bottom` 来实现：

```html
<aspectratio-container>
  <aspectratio-content></aspectratio-content>
</aspectratio-container>

<style>
  .aspectratio-container {
    width: 50vmin; /* 用户根据自己需要设置相应的值 */

    /* 布局方案可以调整 */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 用来撑开aspectratio-container高度 */
  .aspectratio-container::after {
    content: '';
    width: 1px;
    padding-bottom: 56.25%;

    /*元素的宽高比*/
    margin: -1px;
    z-index: -1;
  }
</style>
```

有了 CSS 自定义属性之后，可以结合 `calc()` 函数来实现容器等比缩放的效果：

```css
.container {
  --ratio: 16/9;
  height: calc(var(--width) * 1 / (var(--ratio)));
  width: 100%;
}
```

虽然比`padding-top` 这样的 Hack 手段简单，但相比原生的`aspect-ratio`还是要复杂的多。即:

```css
.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

下面这个示例演示了这三种不同方案实现宽比的效果：

> Demo: codepen.io/airen/full/…

还可以通过 `@media` 让元素在不同的终端上按不同的比例进行缩放：

```css
.transition-it {
  aspect-ratio: 1/1;
  transition: aspect-ratio 0.5s ease;

  @media (orientation: landscape) {
    & {
      aspect-ratio: 16/9;
    }
  }
}
```

## CSS 滚动捕捉

在 Web 布局中，时常会碰到内容溢出容器的现状，如果 `overflow` 设置为 `auto` 或 `scroll` 时容器会出现水平或垂直滚动条：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/252bca72f43a4d3eb71bc453c5bcabb9~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/252bca72f43a4d3eb71bc453c5bcabb9~tplv-k3u1fbpfcp-zoom-1.image)

为了给用户提供更好的滚动体验，CSS 提供了一些优化滚动体验的 CSS 特性，其中滚动捕捉就是其中之一。CSS 的滚动捕捉有点类似于 Flexbox 和 Grid 布局的特性，分类可用于滚动容器的属性和滚动项目的属性：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81428188792b45458a176ee69f6609e8~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81428188792b45458a176ee69f6609e8~tplv-k3u1fbpfcp-zoom-1.image)

有了滚动捕捉特性，我们要实现类似下图的效果就可以不需要依赖任何 JavaScript 库或脚本：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc89fce86aef4efaafbb8fb4862c179e~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc89fce86aef4efaafbb8fb4862c179e~tplv-k3u1fbpfcp-zoom-1.image)

就是每次滚动时，图片的中心位置和容器中心位置对齐（想象一下 Swiper 的效果）。关键代码就下面这几行：

```css
.container {
  scroll-behavior: smooth;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-padding: 20px;
}

img {
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
```

> Demo: codepen.io/airen/full/…

利用该特性，还可以实现类似 iOS 的一些原生交互效果：

> Demo: codepen.io/airen/full/…

要是再利用一点点 JavaScript 脚本，还可以实现沉浸式讲故事的交互效果：

> Demo: codepen.io/airen/full/…

## CSS Gap（沟槽）

CSS 的 `gap` 属性的出现，帮助我们解决了以前一直比较麻烦的布局效果：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/295e2852c22d48bbadd3584764f73681~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/295e2852c22d48bbadd3584764f73681~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，设计师期望的一个效果是，紧邻容器边缘没有任何间距，但相邻项目之间（水平或垂直方向）都有一定的间距。在没有 `gap` 属性之前使用 `margin` 是很烦人的，特别是多行多列的时候更麻烦。有了 `gap` 仅需要一行代码即可。

CSS 的 `gap` 属性是一个简写属性，分为 `row-gap` 和 `column-gap` ：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba289b4eb54845cf986cb4474c31d1f3~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba289b4eb54845cf986cb4474c31d1f3~tplv-k3u1fbpfcp-zoom-1.image)

该属性 `gap` 到目前为止只能运用于多列布局，Flexbox 布局和网格布局的容器上：

```css
// 多列布局
.multi__column {
  gap: 5ch;
}

// Flexbox布局
.flexbox {
  display: flex;
  gap: 20px;
}

// Grid布局
.grid {
  display: grid;
  gap: 10vh 20%;
}
```

`gap` 属性可以是一个值，也可以是两个值：

```css
.gap {
  gap: 10px;
}
// 等同于
.gap {
  row-gap: 10px;
  column-gap: 10px;
}

.gap {
  gap: 20px 30px;
}
// 等同于
.gap {
  row-gap: 20px;
  column-gap: 30px;
}
```

如果 `gap` 仅有一个值时，表示 `row-gap` 和 `column-gap` 相同。

## CSS 逻辑属性

国内大多数 Web 开发者面对的场景相对来说比较单一，这里所说的场景指的是书写模式或排版的阅读模式。一般都是 `LTR` (Left To Right)。但有开发过国际业务的，比如阿拉伯国家的业务，就会碰到 `RTL` (Right To Left) 的场景。比如你打开 Facebook ，查看中文和阿拉伯文两种语言下的 UI 效果：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cca27d740f914d08ba635882f55d754d~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cca27d740f914d08ba635882f55d754d~tplv-k3u1fbpfcp-zoom-1.image)

在没见有逻辑属性之前，一般都会在 `<html>` 或 `<body>` 上设置 `dir` 属性，中文是 `ltr` ，阿拉伯语是 `rtl` ，然后针对不同的场景运用不同的 CSS 样式：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b397d344f0974e3da696b8f639293ee2~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b397d344f0974e3da696b8f639293ee2~tplv-k3u1fbpfcp-zoom-1.image)

其实，阅读方式除了水平方向（`ltr` 或 `trl`）之外，还会有垂直方向的阅读方式：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1cbffd75fae476f8127687d68be7ce7~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1cbffd75fae476f8127687d68be7ce7~tplv-k3u1fbpfcp-zoom-1.image)

为了让 Web 开发者能更好的针对不同的阅读模式提供不同的排版效果，在 CSS 新增逻辑属性。有了逻辑属性之后，以前很多概念都有所变化了。比如我们以前熟悉的坐标轴，`x` 轴和 `y` 轴就变成了 `inline` 轴 和 `block` 轴，而且这两个轴也会随着书写模式做出调整：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0109edbe56c9439da28f5fe7df1448cd~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0109edbe56c9439da28f5fe7df1448cd~tplv-k3u1fbpfcp-zoom-1.image)

除此之外，我们熟悉的 CSS 盒模型也分物理盒模型和逻辑盒模型：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85d563bc5ffa44e5bd950201b6b04ca5~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85d563bc5ffa44e5bd950201b6b04ca5~tplv-k3u1fbpfcp-zoom-1.image)

你可能感知到了，只要是以前带有 `top`、`right` 、`bottom` 和 `left` 方向的物理属性都有了相应的 `inline-start` 、 `inline-end` 、`block-start` 和 `block-end` 的逻辑属性：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa2c5673f41744d0ab764151b89e0dfe~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa2c5673f41744d0ab764151b89e0dfe~tplv-k3u1fbpfcp-zoom-1.image)

我根据 W3C 规范，把物理属性和逻辑属性映射关系整了一份更详细的表：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f27e7d446c284c8daa9500d93996c9d9~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f27e7d446c284c8daa9500d93996c9d9~tplv-k3u1fbpfcp-zoom-1.image)

回到实际生产中来：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c238712bcfec482aa0ce7c04db7b73e6~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c238712bcfec482aa0ce7c04db7b73e6~tplv-k3u1fbpfcp-zoom-1.image)

如果不使用逻辑属性的话，要实现类似上图这样的效果，我们需要这样来编写 CSS：

```css
.avatar {
  margin-right: 1rem;
}

html[dir='rtl'] .avatar {
  margin-right: 0;
  margin-left: 1rem;
}
```

有了 CSS 逻辑属性之后，仅一行 CSS 代码即可实现：

```css
.avatar {
  margin-inline-end: 1rem;
}
```

简单多了吧，特别是有国际化需求的开发者，简直就是一种福音。

## CSS 媒体查询

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43a2b6b721254fa8b12b434ec359d655~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43a2b6b721254fa8b12b434ec359d655~tplv-k3u1fbpfcp-zoom-1.image)

CSS 媒体查询 `@media` 又称为 CSS 条件查询。在 **[Level 5 版本中提供了一些新的媒体查询特性，](https://drafts.csswg.org/mediaqueries-5/#at-ruledef-custom-media)**可以查询到用户在设备上的喜好设置：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8fc954fa41d42788ddbefc5edd39b5e~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8fc954fa41d42788ddbefc5edd39b5e~tplv-k3u1fbpfcp-zoom-1.image)

比如：

- `prefers-reduced-motion`
- `prefers-contrast`
- `prefers-reduced-transparency`
- `prefers-color-scheme`
- `inverted-colors`

使用的方式和以往我们熟悉的 `@media` 是相似。比如 `prefers-color-scheme` 实现暗黑查式的皮肤切换效果：

```css
// 代码源于： https://codepen.io/airen/full/ProgLL
// dark & light mode
:root {
  /* Light theme */
  --c-text: #333;
  --c-background: #fff;
}

body {
  color: var(--c-text);
  background-color: var(--c-background);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme */
    --c-text: #fff;
    --c-background: #333;
  }
}
```

还可以根据网格数据设置来控制资源的加载：

```css
@media (prefers-reduced-data: reduce) {
  header {
    background-image: url(/grunge.avif);
  }
}

@media (prefers-reduced-data: no-preference) {
  @font-face {
    font-family: 'Radness';
    src: url(megafile.woff2);
  }
}
```

其他的使用方式和效果就不一一演示了。不过在未来，CSS 的 `@media` 在编写方式上会变得更简单：

```css
@media (width <= 320px) {
  body {
    padding-block: var(--sm-space);
  }
}

@custom-media --motionOK (prefers-reduced-motion: no-preference);

@media (--motionOK) {
  .card {
    transition: transform 0.2s ease;
  }
}

.card {
  @media (--motionOK) {
    & {
      transition: transform 0.2s ease;
    }
  }
}

@media (1024px >= width >= 320px) {
  body {
    padding-block: 1rem;
  }
}
```

> 特别声明，该示例代码来自于 @argyleink 的 PPT 。

自从折叠屏设备的出现，给 Web 开发者带来新的挑战：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e448a628972a4efa87d048480bc074ad~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e448a628972a4efa87d048480bc074ad~tplv-k3u1fbpfcp-zoom-1.image)

值得庆幸的是，微软和三星的团队就针对折叠屏幕设备提供了不同的 媒体查询判断。

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1b4087407164f2eb899c0bd8370e743~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1b4087407164f2eb899c0bd8370e743~tplv-k3u1fbpfcp-zoom-1.image)

上图是带有物理分隔线的双屏幕设备：

```css
main {
  display: grid;
  gap: env(fold-width);
  grid-template-columns: env(fold-left) 1fr;
}

@media (spanning: single-fold-vertical) {
  aside {
    flex: 1 1 env(fold-left);
  }
}
```

无缝的折叠设备：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/484887cb5084438fbec87f511e572894~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/484887cb5084438fbec87f511e572894~tplv-k3u1fbpfcp-zoom-1.image)

```css
@media (screen-fold-posture: laptop) {
  body {
    display: flex;
    flex-flow: column nowrap;
  }
  .videocall-area,
  .videocall-controls {
    flex: 1 1 env(fold-bottom);
  }
}
```

## CSS 比较函数

CSS 的比较函数是指 `min()` 、`max()` 和 `clamp()` ，我们可以给这几个函数传入值（多个）或表达式，它们会对传入的值进行比较，然后返回最合适的值。另外，这几个和我们熟悉的 `calc()` 类似，也可以帮助我们在 CSS 中做动态计算。

### min() 和 max()

先看 `min()` 和 `max()` ，它们之间的差异只是返回值的不同：

- `min()` 函数会从多个参数（或表达式）中返回一个最小值作为 CSS 属性的值，即 使用 `min()` 设置最大值，等同于 `max-width`
- `max()` 函数会从多个参数（或表达式）中返回一个最大值作为 CSS 属性的值，即 使用`max()`设置最小值，等同于 `min-width`

下图展示了 `min(50vw, 500px)` 在浏览器视窗宽度改变时，返回的值的变化：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/615c76f68fdf4b8ca59a09152bf450e3~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/615c76f68fdf4b8ca59a09152bf450e3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

把上面的示例的 `min()` 换成 `max()` 函数，即 `max(50vw, 500px)`，它的返回值是：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2a71241801941cd82b8590ef5093528~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2a71241801941cd82b8590ef5093528~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

### clamp()

`clamp()` 和 `min()` 以及 `max()`略有不同，它将返回一个区间值，即 在定义的最小值和最大值之间的数值范围内的一个中间值。该函数接受三个参数：

- 最小值（`MIN`）
- 中间值（`VAL`），也称首选值
- 最大值（`MAX`）

`clamp(MIN, VAL, MAX)`，这三个值之间的关系（或者说取值的方式）：

- 如果 `VAL` 在 `MIN` 和 `MAX` 之间，则使用 `VAL` 作为函数的返回值
- 如果 `VAL` 大于 `MAX` ，则使用 `MAX` 作为函数的返回值
- 如果 `VAL` 小于 `MIN` ，则使用 `MIN` 作为函数的返回值

比如下面这个示例：

```css
.element {
  /**
    * MIN = 100px
    * VAL = 50vw ➜ 根据视窗的宽度计算
    * MAX = 500px
    **/
  width: clamp(100px, 50vw, 500px);
}
```

就这个示例而言，`clamp()` 函数的计算会经历以下几个步骤：

```css
.element {
    width: clamp(100px, 50vw, 500px);

    /* 50vw相当于视窗宽度的一半，如果视窗宽度是760px的话，那么50vw相当等于380px*/
    width: clamp(100px, 380px, 500px);

    /* 用min()和max()描述*/
    width: max(100px, min(380px, 500px))

    /*min(380px, 500px)返回的值是380px*/
    width: max(100px, 380px)

    /*max(100px, 380px)返回的值是380px*/
    width: 380px;
}


```

示例效果如下：

> Demo: codepen.io/airen/full/…

简单地说，`clamp()` 、`min()` 和 `max()` 函数都可以随着浏览器视窗宽度的缩放对值进行调整，但它们的计算的值取决于上下文。

我们来看一个比较函数中 `clamp()` 的典型案例。假设我们需要在不同的屏幕（或者说终端场景）运用不同大小的 `font-size` ：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/321e512f1d9d426c953248b18d3640c3~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/321e512f1d9d426c953248b18d3640c3~tplv-k3u1fbpfcp-zoom-1.image)

在还没有 CSS 比较函数之前，使用了一个叫 CSS 锁（CSS Locks）的概念来实现类似的效果：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e0b9225240a4851b5f9151b47dcc7fc~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e0b9225240a4851b5f9151b47dcc7fc~tplv-k3u1fbpfcp-zoom-1.image)

需要做一些数学计算：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23ac0cda0664442f91c3252bf83d8954~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23ac0cda0664442f91c3252bf83d8954~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

使用 `clamp()` 之后，只需要一行代码就可以实现：

```css
/** minf: 20px (min font-size)
 * maxf: 40px (max font-size)
 * current vw: 100vw
 * minw: 320px (min viewport's width)
 * maxw: 960px (max viewport's width)
*/
h1 {
  font-size: clamp(20px, 1rem + 3vw, 40px);
}
```

使用这方面的技术，我们就可以轻易实现类似下图这样的效果：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98dee56cdee943979857aba98c11065d~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98dee56cdee943979857aba98c11065d~tplv-k3u1fbpfcp-zoom-1.image)

> 注，上图来自《Use CSS Clamp to create a more flexible wrapper utility》一文。

## CSS 内容可见性

CSS 内容可见性，说要是指 `content-visibilit` 和 `contain-intrinsic-size` 两个属性，目前隶属于 **[W3C 的 CSS Containment Module Level 2 模块](https://www.w3.org/TR/css-contain-2/#content-visibility)**，主要功能是可以用来提高页面的渲染性能。

一般来说，大多数 Web 应用都有复杂的 UI 元素，而且有的内容会在设备可视区域之外（内容超出了用户浏览器可视区域），比如下图中红色区域就在手机设备屏幕可视区域之外：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5e21388a75d4883b85333aaf3bed073~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5e21388a75d4883b85333aaf3bed073~tplv-k3u1fbpfcp-zoom-1.image)

在这种场合下，我们可以使用 CSS 的 `content-visibility` 来跳过屏幕外的内容渲染。也就是说，如果你有大量的离屏内容（Off-screen Content），这将会大幅减少页面渲染时间。

Google Chrome 团队有工程师对 `content-visibility` 做过相关的测试：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e3a1204efc0496487cc02321d32257d~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e3a1204efc0496487cc02321d32257d~tplv-k3u1fbpfcp-zoom-1.image)

使用了 CSS 的 `content-visibility` 属性，浏览器的渲染过程就变得更加容易。本质上，这个属性 改变了一个元素的可见性，并管理其渲染状态。

而 `contain-intrinsic-size` 属性控制由 `content-visibility` 指定的元素的自然尺寸。它的意思是，`content-visibility` 会将分配给它的元素的高度（`height`）视为 `0`，浏览器在渲染之前会将这个元素的高度变为 `0`，从而使我们的页面高度和滚动变得混乱。但如果已经为元素或其子元素显式设置了高度，那这种行为就会被覆盖。如果你的元素中没显式设置高度，并且因为显式设置 `height`可能会带来一定的副作用而没设置，那么我们可以使用`contain-intrinsic-size`来确保元素的正确渲染，同时也保留延迟渲染的好处。

换句话说，`contain-intrinsic-size` 和 `content-visibility` 是一般是形影不离的出现：

```css
section {
  content-visibility: auto;
  contain-intrinsic-size: 1000px;
}
```

## CSS 内在尺寸

如果你使用浏览器开发者工具审查代码时，将鼠标放到一个 `<img>` 标签上，你会看到类似下图这样的：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/420d329e63e44c34beef33069cf48f3e~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/420d329e63e44c34beef33069cf48f3e~tplv-k3u1fbpfcp-zoom-1.image)

`<img>` 的 `src` 路径上浮出来的图片底下有一行对图像的尺寸的描述，即`252 x 158 px (intrinsic: 800 x 533 px)` ，其实现这表述图片尺寸中两个重要信息：

- 外在尺寸： `252 x 158 px` ，开发者给 `img` 设置的尺寸
- 内在尺寸： `800 x 533 px` ，图片原始尺寸

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa4aa275a0843aab1b0565fec2d1def~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa4aa275a0843aab1b0565fec2d1def~tplv-k3u1fbpfcp-zoom-1.image)

其实在 CSS 中给一个元素框设置大小时，有的是根据**元素框内在的内容来决定，有的是根据上下文来决定的**。根据该特性，CSS 的尺寸也分为内部(内在)尺寸和外部（外在）尺寸。

- 内部尺寸：指的是元素根据自身的内容（包括其后代元素）决定大小，而不需要考虑其上下文；而其中 `min-content` 、 `max-content` 和 `fit-content` 能根据元素内容来决定元素大小，因此它们统称为内部尺寸。
- 外部尺寸：指的是元素不会考虑自身的内容，而是根据上下文来决定大小。最为典型的案例，就是 `width` 、`min-width` 、`max-width` 等属性使用了 `%` 单位的值。

通地一个简单的示例来向大家演示 CSS 内在尺寸的特性，即 `min-content` 、`max-content` 和 `fit-content` 的特性。

```html
<h1>CSS is Awesome</h1>

<style>
  h1 {
    width: auto;
  }
</style>
```

先来看 `h1` 的 `width` 取值为 `auto` 和 `min-content` 的差异：

```css
// 外在尺寸
h1 {
  width: auto; // 根据容器变化
}

// 内在尺寸
h1 {
  width: min-content; // 根据内容变化
}
```

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca291c48ded846ea8935c0ac985f23df~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca291c48ded846ea8935c0ac985f23df~tplv-k3u1fbpfcp-zoom-1.image)

> Demo： codepen.io/airen/full/…

从上图中不难发现，`width` 取值为 `min-content` 时，`h1` 的宽度始终是单词“Awesome”长度（大约是`144.52px`）。它的宽度和容器宽度变化并无任何关系，但它受排版内相关的属性的影响，比如`font-size`、`font-family` 等。

再来看`max-content` ：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1af2530a4b14ff2a073d757d21bc43f~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1af2530a4b14ff2a073d757d21bc43f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

当`h1` 的 `width` 取值为 `max-content` 时，它的宽度是`h1` 所在行所有内容的宽度。最后来看 `fit-content` ：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1212a5a6bc4f49e49dc70e4cdf115afc~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1212a5a6bc4f49e49dc70e4cdf115afc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

相对而言，`fit-content` 要比 `min-content` 和 `max-content` 复杂地多：

```css
h1 {
  width: fit-content;
}

// 等同于
h1 {
  width: auto;
  min-width: min-content;
  max-width: max-content;
}
```

简单地说，`fit-content` 相当于 `min-content` 和 `max-content`，其 取值:

- 如果元素的可用空间(Available)充足，`fit-content` 将使 用 `max-content`
- 如果元素的可用空间(Available)不够充足，比 `max-content` 小点，那就是用可用空间的值，不会导致内容溢出
- 如果元素的可用空间(Available)很小，比 `min-content`还小,那就使用 `min-content`

使用下图来描述它们之间的关系：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99680561b42546a18d0255417d4e5481~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99680561b42546a18d0255417d4e5481~tplv-k3u1fbpfcp-zoom-1.image)

`min-content`、`max-content` 和 `fit-content` 被称之个内在尺寸，它可以运用于设置容器尺寸的属性上，比如`width` 、`height` 以及 `inline-size` 和 `block-size` 等。但有些属性上使用的话则会无效：

- `min-content`、`max-content` 和 `fit-content` 用于 `flex-basis` 无效
- `fit-content` 用于设置网格轨道尺寸的属性上无效
- 网格项目或 Flex 项目上显式设置 `width:fit-content`也无效,因为它们的默认宽度是 `min-content`
- 最好不要在 `min-width` 或 `max-width` 上使用 `fit-content`，易造成混乱，建议在 `width` 上使用 `fit-content`

在布局上使用 `min-content` 、`max-content` 或 `fit-content` 可以帮助我们设计内在布局，另外在构建一些自适应的布局也非常灵活。特别是和 CSS 的 Grid 和 Shapes 相关特性结合，还能构建一些具有创意的布局。

最后有一点需要特别声明，`fit-content` 和 `fit-content()`函数不是相同的两个东东，使用的时候需要区别对待。

## CSS 的 display

`display` 对于大家而言并不陌生，主要用来格式化上下文，这里特别拿出来和大家说的是因为 `display` 也有一些变化。其中之一就是 `display` 未来可以支持多个值：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59f9929a5d734841bc013814b5966115~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59f9929a5d734841bc013814b5966115~tplv-k3u1fbpfcp-zoom-1.image)

据最新的消息，Sarafi 浏览器已经把`display` 设置两个值已进入实验性属性。`display` 取两个值的含义大致如下：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53da18acd7904aee9ce89c870bae57a5~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53da18acd7904aee9ce89c870bae57a5~tplv-k3u1fbpfcp-zoom-1.image)

另外单独要说的是，`display` 新增了 `contennts` 属性值，[** W3C 规范是这样描述的**](https://www.w3.org/TR/css-display-3/#box-generation)：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e7fe82e04144101af1e13b66d7ec193~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e7fe82e04144101af1e13b66d7ec193~tplv-k3u1fbpfcp-zoom-1.image)

大致意思是说：

> 设置了 display: contents 的元素自身将不会产生任何盒子，但是它的子元素能正常展示。

比如：

```html
<div class="outer">
  I'm, some content
  <div class="inner">I'm some inner content</div>
</div>

<style>
  .outer {
    border: 2px solid lightcoral;
    background-color: lightpink;
    padding: 20px;
  }

  .innter {
    background-color: #ffdb3a;
    padding: 20px;
  }
</style>
```

上面这个简单地示例代码，你将看到的效果如下：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48c42c50a20b4dea8ce8b94535e9eee5~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48c42c50a20b4dea8ce8b94535e9eee5~tplv-k3u1fbpfcp-zoom-1.image)

如果我们在`.outer` 元素上显式设置 `display: contents` ，该元素本身不会被渲染，但子元素能够正常渲染：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d36c6ed3e8e4443b99cfb9a27af3838~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d36c6ed3e8e4443b99cfb9a27af3838~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

在某些布局中，特别是不希望调整 HTML 的结构的时候，我们就可以使用该特性。比如在 Flexbox 或 Grid 中，希望把其他后代元素变成网格项目或 Flex 项目，那就可以这样做：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa7843a2532240fb8180b0b80f25aacf~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa7843a2532240fb8180b0b80f25aacf~tplv-k3u1fbpfcp-zoom-1.image)

> Demo: codepen.io/airen/full/…

`display: contents` 在规范讨论阶段和 `display: subgrid` 的讨论中是非常的激烈，最终是 `display： contents` 获胜了。你现在在 Grid 的布局中，也没有单独的`display: subgrid` ，而是将`subgrid` 移入到 `grid-template-columns` 和 `grid-template-rows` 中。

另外还有一个比较大的争执就是 `display: contents` 和 Web 可访问性方面的。有关于这方面的讨论，你要是感兴趣的话，可以阅读：

- [More accessible markup with display: contents](https://hiddedevries.nl/en/blog/2018-04-21-more-accessible-markup-with-display-contents)
- [Display: Contents Is Not a CSS Reset](https://adrianroselli.com/2018/05/display-contents-is-not-a-css-reset.html)

## CSS @规则

CSS 中的 `@` 规则有很多种，但大家比较熟悉的应该是 `@import` 、`@media` 和 `@supports` 之类的。今天给大家简单的提几个不常见的，比如：

- 用于嵌套的 `@nest` 和 `@apply`
- 用于注册自定义属性的 `@property`
- 最近讨论比较多的容器查询 `@container`
- [@argyleink](https://twitter.com/argyleink) 在新分享的 PPT 提到的 `@scope` 和 `@layer`

### CSS 的嵌套

使用过 CSS 处理器的同学，应该用过嵌套来组织自己的代码，比如 SCSS:

```css
// SCSS
foo {
  color: red;

  & bar {
    color: green;
  }
}
```

上面的代码经过编译之后：

```css
// CSS
foo {
  color: red;
}

foo bar {
  color: green;
}
```

庆幸的是，[W3C 也在讨论和定义 CSS 中的嵌套规则](https://drafts.csswg.org/css-nesting-1/#nest-selector)。目前两种规则：

```css
foo {
  color: red;

  @nest bar {
    color: green;
  }
}

// 或者
foo {
  color: red;

  & bar {
    color: green;
  }
}

// 都等同于
foo {
  color: red;
}

foo bar {
  color: green;
}
```

也可以和媒体查询 `@media` 相互嵌套：

```css
article {
  color: darkgray;

  & > a {
    color: var(--link-color);
  }
}

code > pre {
  @media (hover) {
    &:hover {
      color: hotpink;
    }
  }
}

code > pre {
  @media (hover) {
    @nest &:hover {
      color: hotpink;
    }
  }
}

article {
  @nest section:focus-within > & {
    color: hotpink;
  }
}

main {
  padding: var(--space-sm);

  @media (width >= 540px) {
    & {
      padding: var(--space-lg);
    }
  }
}
```

除了 `@nest` 之外还有 `@apply` 。你可能在一些前端的框架或构建器中看到过 `@apply`：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11f7654b0e02464a9f45f30411a3a983~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11f7654b0e02464a9f45f30411a3a983~tplv-k3u1fbpfcp-zoom-1.image)

如果你在 Chrome Canary 浏览器“实验性属性” 就可以直接体验 `@apply` ：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20ae10459d9f47d2a59fd4083495baac~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20ae10459d9f47d2a59fd4083495baac~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，它有点类似于 SCSS 中的混合宏 `@mixin` 和 `@extend` :

```css
:root {
  --brand-color: red;
  --heading-style: {
    color: var(--brand-color);
    font-family: cursive;
    font-weight: 700;
  }
}

h1 {
  --brand-color: green;
  @apply --heading-style;
}
```

### CSS Houdini 变量 @property

`@property` 是用来注册一个变量的，该变量是一个 CSS Houdini 中的变量，但它的使用和 CSS 中的自定义属性（CSS 变量）是一样的，不同的是注册方式：

```css
// Chrome 78+
// 需要在 JavaScript脚本中注册
CSS.registerProperty({
	'name': '--custom-property-name',
  'syntax': '<color>',
  'initialValue': 'black',
  'inherits': false
})

// Chrome 85+
// 在CSS文件中注册
@property --custom-property-name {
	'syntax': '<color>',
  'initialValue': 'black',
  'inherits': false
}


```

他的最大特色之一就是可以指定已注册的 CSS 变量的类型、初始值，是否可继承：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1099862d48d2485685ca20425904393b~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1099862d48d2485685ca20425904393b~tplv-k3u1fbpfcp-zoom-1.image)

> 上图截取于 Maxi 在推特上发的推文。

虽然它的使用方式和 CSS 的自定义属性相似，但它要更强大，特别是在动效方面的使用，能增强 CSS 的动效能力，甚至实现一些以前 CSS 无法实现的动效。比如

```css
@property --hue {
  initial-value: 0;
  inherits: false;
  syntax: '<number>';
}

@keyframes rainbow {
  to {
    --hue: 360;
  }
}

@property --milliseconds {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}
.counter {
  counter-reset: ms var(--milliseconds);
  animation: count 1s steps(100) infinite;
}

@keyframes count {
  to {
    --milliseconds: 100;
  }
}
```

把它和 CSS Houdini 的 Paint API 结合起来，可做的事情更多：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5307e326ce384bc586cbb8d473a5e471~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5307e326ce384bc586cbb8d473a5e471~tplv-k3u1fbpfcp-zoom-1.image)

[更多这方向的效果可以在 houdini.how 网站上查阅](https://houdini.how/)：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18e0658ffd0d426bae39634b77372ab4~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18e0658ffd0d426bae39634b77372ab4~tplv-k3u1fbpfcp-zoom-1.image)

### 容器查询 @container

[Una Kravets 在 Google I/O 开发大会上就分享了容器查询](https://web.dev/new-responsive/) `@container` ，她把它称为新的响式布局所需特性之一：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff573b4f8d374e409e75d48ee0828063~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff573b4f8d374e409e75d48ee0828063~tplv-k3u1fbpfcp-zoom-1.image)

那么容器查询 `@container` 可以做什么呢？假设你的设计师给你提供了一份像下图这样的设计稿：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b16dc0f84924db096e9a8515e5a3df2~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b16dc0f84924db096e9a8515e5a3df2~tplv-k3u1fbpfcp-zoom-1.image)

你可能首先会想到的是 `@media` (在没有容器查询之前，似乎也只有这样的方式)，而有了`@container` 之后，就可以换过一种姿势：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75c6aeb2bae7478a9b08bf915b376e3c~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75c6aeb2bae7478a9b08bf915b376e3c~tplv-k3u1fbpfcp-zoom-1.image)

> 这两张图上来自于 @shadeed9 的 《CSS Container Queries For Designers》一文，他的另一篇文章《Say Hello To CSS Container Queries》也是介绍容器查询的。

看上去非常强大，事实上也很强大，并且它的使用和 `@meida` 非常相似：

```css
// Demo: https://codepen.io/una/pen/mdOgyVL
.product {
  contain: layout inline-size;
}

@container (min-width: 350px) {
  .card-container {
    padding: 0.5rem 0 0;
    display: flex;
  }

  .card-container button {
    /* ... */
  }
}
```

> Demo: codepen.io/una/pen/mdO…

对于 `@container` 特性，有叫好的，也有不同的，比如 [Kenton de Jong](https://kentondejong.medium.com/?source=post_page-----f8c2ba77afca--------------------------------) 在他的新博文《[Why I am not a fan of CSS container queries](https://kentondejong.medium.com/why-i-am-not-a-fan-of-css-container-queries-f8c2ba77afca)》阐述了自己不喜欢该 t 特性：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e858aa8d76b249ff8830ba9bfc3dfaaf~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e858aa8d76b249ff8830ba9bfc3dfaaf~tplv-k3u1fbpfcp-zoom-1.image)

就我个人而言，我是很喜欢这个特性，后面会花一定的时间深入了解和学习 `@container`。当然有讨论是一件好事，这样会让该特性更成熟，[如果你也想参与进来讨论的话，可以点击这里加入](https://github.com/oddbird/css-sandbox/blob/main/src/rwd/query/explainer.md)。

### @layer 和 @scope

我以前只看到过 `@scope` 规则，[主要是用来处理 CSS 中样式规则作用域相关的](https://css.oddbird.net/scope/)，但并没有深入了解过。[Una Kravets 在 Google I/O 开发大会](https://web.dev/new-responsive/)分享上再次看到了 `@scope` ：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a322edddacbb41338a09ce46e6975d4b~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a322edddacbb41338a09ce46e6975d4b~tplv-k3u1fbpfcp-zoom-1.image)

> 上图是 Miriam Suzanne 绘制的！

`@scope` 内的样式允许穿透和特定组件的样式，以避免命名冲突，许多框架和插件（如 CSS 模块）已经使我们能够在框架内做到这一点。现在，这个规范将允许我们为我们的组件编写具有可读性的 CSS 的本地封装样式，而不需要调整标记。

```css
/* @scope (<root>#) [to (<boundary>#)]? { … } */

@scope (.tabs) to (.panel) {
  :scope {
    /* targeting the scope root */
  }
  .light-theme :scope .tab {
    /* contextual styles */
  }
}
```

怎么看上去和 Web Componed 中的 Scope 那么的相似呢？

对于 `@layer` ，我第一见：

```css
@layer reset {
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
}
// ...
@layer reset {
  /* add more later */
}

@import url(headings.css) layer(default);
@import url(links.css) layer(default);

@layer default;
@layer theme;
@layer components;

@import url(theme.css) layer(theme);

@layer default, theme, components;

@import url(theme.css) layer(theme);

@layer framework.theme {
  p {
    color: rebeccapurple;
  }
}

@layer framework {
  @layer theme {
    p {
      color: cyan;
    }
  }
}
```

上面代码表示啥意思，我也还没整明白，只知道 `@layer` 被称为层叠层（Cascade Layers）。该特性是 什么[** W3C 层叠和继承规范 Level5**](https://www.w3.org/TR/css-cascade-5/#cascade-layers) 中新提出来的。

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/984274ec7bb64b5e99b5300a62664d9c~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/984274ec7bb64b5e99b5300a62664d9c~tplv-k3u1fbpfcp-zoom-1.image)

## 其他...

在我分享结束没多久，正在整理这篇文章的时候，发现我的偶像 [@argyleink](https://twitter.com/argyleink) 也分享了一个相似的话题《[Hover:CSS! What's New in 2021?](https://2021-hover-conf-new-in-css.netlify.app/#)》，分享了 31 个 CSS 相关的特性，并且按风险级别分为高、中、低三档：

![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba5f115b18fd49aaaeef10a8cf1c3cd0~tplv-k3u1fbpfcp-zoom-1.image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba5f115b18fd49aaaeef10a8cf1c3cd0~tplv-k3u1fbpfcp-zoom-1.image)

你会发现，和我整理的特性有很多吻合之处。如果你听过他去年在伦敦 CSS 大会分享的《**[London CSS: What‘s New in 2020?](https://london-css-2020.netlify.app/)**》，你会发现 2021 年的是 2020 年的升级版。

> 在 2020 年听完 分享之后，我也整理了一份中文版本的《2020 年你不应该错过的 CSS 新特性》，并在淘系前端团队 微信公众号发过。
