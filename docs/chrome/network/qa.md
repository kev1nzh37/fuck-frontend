---
title: 66条计算机QA
order: 50
toc: menu
group:
  title: 计算机网络
  order: 2
---

# 66 条计算机 Q&A

### 1.比较 http 0.9 和 http 1.0😀

1. http0.9 只是一个简单的协议，只有一个 GET 方法，没有首部，目标用来获取 HTML。
2. HTTP1.0 协议大量内容：首部，响应码，重定向，错误，条件请求，内容编码等。

http0.9 流程：

> 客户端，构建请求，通过 DNS 查询 IP 地址，三次握手建立 TCP 连接，客户端发起请求，服务器响应，四次挥手，断开 TCP 连接。（一个来回：服务器收到请求信息，读取对应的文件如 HTML，并将数据返回给客户端）

http1.0 流程：

> 客户端，构建请求，通过 DNS 查询 IP 地址，三次握手建立 TCP 连接，客户端发起请求，服务器响应，四次挥手，断开 TCP 连接。（多个来回：HTTP1.0 引入请求投和响应头，由于出现了如 Js,css 等多种形式的文本，http0.9 以满足不了需求，so，引入了 content-encoding，content-type 等字段）

因为不足缺陷，就有了 http1.1。

![https://user-gold-cdn.xitu.io/2020/6/13/172ae05c5b648092?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/13/172ae05c5b648092?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 2.关于 http1.1 以及 http2😁

http1.1 中浏览器再也不用为每个请求重新发起 TCP 连接了，增加内容有：缓存相关首部的扩展，OPTIONS 方法，Upgrade 首部，Range 请求，压缩和传输编码，管道化等。但还是满足不了现在的 web 发展需求，so，就有了 http.2 版本。

http2 解决了（管道化特性可以让客户端一次发送所有的请求，但是有些问题阻碍了管道化的发展，即是某个请求花了很长时间，那么**队头阻塞**会影响其他请求。）http 中的队头阻塞问题。

使用 http2 会比 http1.1 在使用 TCP 时，用户体验的感知多数延迟的效果有了量化的改善，以及提升了 TCP 连接的利用率（并行的实现机制不依赖与服务器建立多个连接）

所以需要学习 http2，了解更过的内容来掌握计算机网咯。

对于 http2，你可以来运行一个 http2 的服务器，获取并安装一个 http2 的 web 服务器，下载并安装一张**TLS**证书，让浏览器和服务器通过 http2 来连接。（从数字证书认证机构申请一张证书）。

了解 http2 的协议，先让我们了解一下 web 页面的请求，就是用户在浏览器中呈现的效果，发生了些什么呢？

> 资源获取的步骤：

把待请求 URL 放入队列，判断 URL 是否已在请求队列，否的话就结束，是的话就判断请求域名是否 DNS 缓存中，没有的话就解析域名，有的话就到指定域名的 TCP 连接是否开启，没有的话就开启 TCP 连接，进行 HTTPS 请求，初始化并完成 TLS 协议握手，向页面对应的 URL 发送请求。

> 接收响应以及页面渲染步骤：

接收请求，判断是否 HTML 页面，是就解析 HTML，对页面引用资源排优先级，添加引用资源到请求队列。（如果页面上的关键资源已经接收到，就开始渲染页面），判断是否有还要继续接收资源，继续解析渲染，直到结束。

### 3.HTTP 的几种请求方法用途 😂

第一种`GET`方法：发送一个请求来获取服务器上的某一些资源。

第二种`POST`方法：向 URL 指定的资源提交数据或附加新的数据。

第三种`PUT`方法：跟 POST 方法一样，可以向服务器提交数据，但是它们之间也所有不同，PUT 指定了资源在服务器的位置，而 POST 没有哦。

第四种`HEAD`方法：指请求页面的首部。

第五种`DELETE`方法：删除服务器上的某资源。

第六种`OPTIONS`方法：它用于获取当前 URL 所支持的方法，如果请求成功，在 Allow 的头包含类似`GET,POST`等的信息。

第七种`TRACE`方法：用于激发一个远程的，应用层的请求消息回路。

第八种`CONNECT`方法：把请求连接转换到 TCP/TP 通道。

### 4.从浏览器地址栏输入 url 到显示页面的步骤 🤣

简单说说，浏览器根据请求的 url 交给 dns 域名解析，查找真正的 ip 地址，向服务器发起请求；服务器交给后台处理后，返回数据，浏览器会接收到文件数据，比如，html,js，css，图像等；然后浏览器会对加载到的资源进行语法解析，建立相应的内部数据结构；载入解析到得资源文件，渲染页面，完成显示页面效果。

🙅 不够清楚明白码？

那就再次详细一下，咳咳，从浏览器接收 url，开始进行网络请求线程，发出一个完整的 HTTP 请求，从服务器端接收请求到对应的后台接收到请求，然后是后台和前台的 http 交互；其中的缓存问题（http 的缓存），浏览器接收到 http 数据包后的解析流程，css 的可视化格式模型，js 引擎解析过程等；其他呈现页面效果。

🙅：这里就需要你对浏览器内核的理解：其中主要的渲染引擎和 JS 引擎，这里了解一下你对浏览器内核的理解。

1. 渲染引擎，是负责取得网页的内容，整理信息，以及计算网页的显示方式，然后输出到显示器上。
2. JS 引擎是用于解析和执行 javascript 来实现网页的动态效果。

> 浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。其实最开始渲染引擎和 JS 引擎是没有区分明确的，不过后来 JS 引擎越来越独立，so，内核就倾向于渲染引擎。

> 对于资源请求/获取,资源响应/页面渲染，会给网络带宽和设备资源带来压力，这个时候就会考虑到 web 的性能优化。

### 5.web 的性能优化 😃

其中里面的**性能关键：**

> 什么是数据包
> 数据包（IP 数据包），指封装在固定结构的一系列字节，它定义了数据包的长度，传输的细节，以及其他与 TCP 相关的信息。

延迟：指 IP 数据包从一个网络端点到另一个网络端点所花费的时间。（所花费时间在于往返时延，是延迟的时间的两倍）

带宽：只要带宽没有饱和，两个网络端点的连接会一次处理尽可能多的数据量（所以带宽可能会成为性能的瓶颈）

建立连接时间：在客户端和服务器之间建立连接往返数据（三次握手）

TCP 三次握手过程：客户端向服务器发起一个 SYN 包，服务器端返回对应的 SYN 的 ACK 响应以及新的 SYN 包，然后客户端返回对应的 ACK。（在客户端和服务器之间建立正常的 TCP 网络连接时，客户端首先发出一个 SYN 消息，服务器使用 SYN+ACK 应答表示接收了这个消息，最后客户端再以 ACK 消息响应。）

![https://user-gold-cdn.xitu.io/2020/6/13/172ae6185927c0eb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/13/172ae6185927c0eb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> SYN 是同步序列编号，是 TCP/IP 建立连接时使用的握手信息。
> ACK 是确认字符，在数据通信中，接收站发给发送站的一种传输类控制字符。表示发来的数据已确认接收无误。在 TCP/IP 协议中，如果接收方成功的接收到数据，那么会回复一个 ACK 数据。通过 ACK 信号有自己固定的格式，长度大小，由接收方回复给发送方。

**详解三次握手**：

第一次握手，建立连接时，客户端发送 SYN 包到服务器，并进入 SYN_SENT 状态，等待服务器确认，其中 SYN 就是同步序列编号。

第二次握手，服务器收到 SYN 包，必须确认客户的 SYN，同时自己也发送一个 SYN 包，即是 SYN+ACK 包，此时服务器进入 SYN_RECV 状态。

第三次握手，客户端收到服务器的 SYN+ACK 包，向服务器发送确认包 ACK，此包发送完毕，客户端和服务器进入 ESTABLISHED（TCP 连接成功）状态，完成三次握手。

> 完成三次握手，客户端与服务器开始传送数据。

TLS 协商时间（TLS 会造成额外的往返传输）

1. 客户端发起 https 连接，需要进行传输层安全协议协商
2. TLS 用来取代安全套接层 SSL

除了网络，还有**页面内容本身或服务器性能**，如首字节时间 TTFB，内容下载时间，开始渲染时间，文档加载完成的时间等。

> 那么什么是 TTFB，它是指客户端从开始定位到 web 页面，至接收到主体页面响应的第一字节所耗费的时间。它是测量：从浏览器发起请求至收到其第一字节之间的耗时。

> 内容下载时间是等同于被请求资源的最后字节到达时间。

> 开始渲染时间，从客户看到空白页面的时长。

### 5.1web 性能优化技术（减少客户端网络延迟和优化页面渲染性能来提升 web 性能）

优化技术：

- DNS 查询优化
- 客户端缓存
- 优化 TCP 连接
- 避免重定向
- 网络边缘的缓存
- 条件缓存
- 压缩和代码极简化
- 图片优化

### 6. http1.1😄

- 改进持久连接和 CDN 域名的分片机制
- 不成熟的 http 管道化
- 提供虚拟主机支持
- 对动态生成的内容完美支持
- 引入 cookie 以及安全机制

对于 http1 的问题，迎来了 http2。其中 http1 的问题：

队头阻塞，大多数情况下，浏览器会希望同时获取许多资源，但 http1 未提供机制来同时请求这些资源，如果仅是使用一个连接，需要发起请求，等待响应，然后才能发起下一个请求。

在 http1 中要给特性为管道化，可以允许一次发送一组请求，但是需要按照发送顺序依次接收响应。所以在请求应答过程中，如发生什么情况，剩下的工作都会被阻塞，这就是“队头阻塞”（阻塞在那次请求应答发生错误），阻碍网络传输和 web 页面的渲染，指导失去响应。

低效的 TCP 利用，TCP 协议作为最可靠的协议之一，其核心是拥塞窗口。

> 拥塞窗口，是卫星通信在因特网中防止通信拥塞的一种措施，它是在发端采用了一种“拥塞避免”算法和“慢速启动”算法相结合的机制。“拥塞窗口”就是“拥塞避免”的窗口，它是一个装在发送端的可滑动窗口，窗口的大小是不超过接收端确认通知的窗口。

拥塞窗口指在接收方确认数据包之前，发送方可以发送的 TCP 包的数据。（如拥塞窗口指定为 1 的情况，那么发送方就发出 1 哥数据包之后，只有接收方确认了那个发出的数据包，才能发送下一个）

拥塞控制能防止过多的数据注入到网络中，用于避免网络过载，TCP 中可以通过**慢启动**探索当前连接对应拥塞窗口的合适大小。即发送者发送数据的时候并非一开始注入大量数据到网络中，而是发送一个数据包进行测试，当得到确认回复后，额外发送一个未确认包。

这意味着得到一个确认回复，可以发送两个数据包，得到两个确认回复，可以发送四个数据包，以几何形式增长很快到达协议规定的拥塞窗口大小（发包数上限），这时候连接进入**拥塞避免阶段**，这种机制需要往返几次才能得知最佳拥塞窗口大小，但往返几次所需的时间成本不可忽略。

- 拥塞窗口的大小取决于网络的拥塞程度，并且动态地在变化。发送方让自己的发送窗口等于拥塞窗口。如果再考虑到接收方的接收能力，那么发送窗口还可能小于拥塞窗口。
- 发送方控制拥塞窗口的原则是：只要网络没有出现拥塞，拥塞窗口就再增大一些，以便把更多的分组发送出去。但只要网络出现拥塞，拥塞窗口就减少一些，以减少注入到网络中的分组数。

> tcp 中的慢启动概念，是用来探索当前连接对应拥塞窗口的合适大小。用来弄清楚新连接当前的网络情况。“慢速启动”是在连接建立后，每收到一个来自收端的确认，就控制窗口增加一个段值大小，当窗口值达到“慢速启动”的限值后，慢速启动便停止工作，避免了网络发生拥塞。

> TCP 传输控制协议的设计思路是，对假设情况很保守情况下，能够公平对待同一网络的不同流量的应用，它的避免拥塞机制被设计城即使在最差的网络情况下也可以起作用。

臃肿的消息首部，HTTP/1.1 能压缩请求内容，但是消息首部却不能压缩。它可能占据请求的绝大部分（也可能是全部）也是比较常见了。（在这里如果能压缩请求首部，把 😙 请求变得更小，就能够缓解带宽压力了，降低系统的总负载）

受限的优先级设置，即如果浏览器针对指定域名开启多个 socket 请求，若 web 页面某些资源会比另外一些资源重要，会加重资源的排队效应，会延迟请求其他的资源，优先级高的资源先获取，优先级低的资源会在资源高的资源处理完成，（在处理过程中，浏览器不会发起新的资源请求）等待高的完成后再发起请求，(这就会让总的页面下载时间延长)。

> 在请求优先级高的资源的时间区间内浏览器并不会发起优先级较低的新请求

小结：HTTP1.1 慢启动影响资源首次加载速度，TCP 建立连接后，会开始请求传输，开始比较慢，然后不断加快，为了防止出现网络拥堵，会让页面的首次渲染时间变长。开始多个 tcp，如出现网络下降，无法识别资源的优先级，会出现竞态问题。

### 7.如何进行网站性能优化 😅

1. 内容方面，减少 Http 请求（合并文件，css 精灵，inline Image)，减少 DNS 查询（DNS 缓存，将资源分布到合适的数量的主机名），减少 DOM 元素的数量。
2. Cookie 方面，可以减少 Cookie 的大小。
3. css 方面，将样式表放到页面顶部；不使用 css 表达式；使用`<link>`不使用`@import`；可将 css 从外部引入；压缩 css。
4. JavaScript 方面，将脚本放到页面底部；将 JavaScript 从外部引入；压缩 JavaScript，删除不需要的脚本，减少 DOM 的访问。
5. 图片方面，可优化 css 精灵，不要再 HTML 中拉伸图片，优化图片（压缩）。

### 8.http 状态码以及含义 😆

1. 对于 1xx 的状态码，为信息状态码，100 为继续，表示确认，成功返回具体参数信息。
2. 对于 2xx 的状态码，200 表示正常返回信息，201 表示请求成功并且服务器创建了新的资源，202 表示服务器已接受请求，但尚未处理。
3. 对于 3xx，重定向，301 表示，请求的网页已永久移动到新位置，302 表示，临时性重定向，303 表示临时性重定向，且总是使用 GET 请求新的 URI。304 表示，自从上次请求后，请求的网页未修改过。
4. 对于 4xx，客户端错误，404，服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求，401，请求未授权，403，禁止访问，404，找不到如何与 URI 相匹配的资源。
5. 对于 5xx，服务器错误，500，最常见的服务器端错误，503，服务器端暂时无法处理请求，可能是过载或维护。

### 9.http-数据压缩 😉

![https://user-gold-cdn.xitu.io/2020/6/14/172b08e8d47c61ea?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b08e8d47c61ea?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

数据压缩，在浏览器中发送请求时会带着`Content-Encoding: gzip`，里面时浏览器支持的压缩格式列表，有多种如，gzip，deflate，br 等。这样服务器就可以从中选择一个压缩算法，放进`Content-Encoding`响应头里，再把原数据压缩后发给浏览器。

### 10.http-分块传输 😊

分块传输，就是将传输的文件分解成多个小块，然后分发给浏览器，浏览器收到后再重新组装复原。

每个分开包含两个部分，分块长度和分块数据（长度头和数据块），长度头以 CRLF 结尾的一行明文，数据块紧跟在长度头后面，也是用 CRLF 结尾，最后用一个长度为 0 的块表示结束。

在响应报文里用头字段 Transfer-Encoding:chunked 表示报文里的 body 部分不是一次性发送过来的，而是分成了许多块逐个发送的。

在 Transfer-Encoding：chunked 和 Content-Length 中，这两个字段是互斥的。

> 一个响应报文的传输长度要么已知，要么长度未知（chunked）。

![https://user-gold-cdn.xitu.io/2020/6/14/172b09fa3489df62?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b09fa3489df62?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Content-Length: 299

![https://user-gold-cdn.xitu.io/2020/6/14/172b0a2a83e5d591?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0a2a83e5d591?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b0972bdb97e97?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0972bdb97e97?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 11.http-范围请求 😋

断点续传

> 要实现该功能需要制定下载的实体范围，这种制定范围发送请求叫做范围请求。

Accept-Ranges：服务器使用 http 响应头 Accept-Ranges 标识自身支持范围请求，字段的具体值用于定义范围请求的单位。

语法

```docs
Accept-Ranges: bytes,范围请求的单位是 bytes （字节）
Accept-Ranges: none,不支持任何范围请求单位

```

范围请求时用于不需要全部数据，只需要其中的部分请求时，可以使用范围请求，允许客户端在请求头里使用专用字段来表示只获取文件的一部分。

Range 的格式，请求头 Range 是 HTTP 范围请求的专用字段，格式是“bytes=x-y”,以字节为单位的数据范围。

![https://user-gold-cdn.xitu.io/2020/6/14/172b0c14ea510804?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0c14ea510804?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. “0-”表示从文档起点开始到文档结束的整个文件。
2. “100-”表示从第 100 哥字节开始到文档末尾。
3. “-10”表示从文档末尾倒数的第 10 个字节开始。

示例：

```docs
执行范围时会使用头部字段 Range 来指定资源 byte 的范围。
Range格式：
5001-10000字节
Range : byte = 5001-10000
5000之后的
Range : byte = 5001-
0-3000字节，5001-10000字节
Range : byte=-3000,5001-10000

```

![https://user-gold-cdn.xitu.io/2020/6/14/172b0c34578a2bc9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0c34578a2bc9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

上图表示服务器收到 Range 字段后，检测范围合法性，范围越界，就会返回状态码 416，如你的文件只有 1000 个字节，但请求范围在 20000-3000，就会导致这个状态码的出现。

如果成功读取文件，范围正确，返回状态码“206”。服务器要添加一个响应头字段 Content-Range,告诉片段的实际偏移量和资源的总大小。

最后是发送数据，直接把片段用 TCP 发给客户端，一个范围请求就算是处理完了。

> 格式是“bytes x-y/length”,与 Range 头区别在没有“=”

![https://user-gold-cdn.xitu.io/2020/6/14/172b0c7e7ccf3d82?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0c7e7ccf3d82?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Content-Range: bytes 0-4395719/4395720

![https://user-gold-cdn.xitu.io/2020/6/14/172b0c8572c4965e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0c8572c4965e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 12.http-多段数据 😎

多端数据，就是在 Range 头里使用多个“x-y"，一次性获取多个片段数据。使用一种特殊的 MIME 类型：“multipart/byteranges”，用来表示响应报文包含了多个范围时使用。多重范围请求 响应会在头部 Content-Type 表明 multipart-byteranges。

多段数据图：分隔标记 boundary 来区分不同的分段

![https://user-gold-cdn.xitu.io/2020/6/14/172b0e1450bf4bf0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0e1450bf4bf0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b0e4a32d294e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0e4a32d294e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b0e4e8d3333da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b0e4e8d3333da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 13.说一说 cookies，sessionStorage 和 localStorage 的区别？😍

- cookie 是网站用来标识用户身份而存储在用户本地终端上的数据
- cookie 数据始终在同源的 http 请求中携带，即使是不需要的情况，so，会在浏览器和服务器间来回传递
- sessionStorage 和 localStorage 不会自动把数据发送给服务器，仅仅在本地保存

> 存储的大小

cookie 的数据大小不能超过 4k；sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或者更大。

> 有限期时间

1. localStorage 存储持久数据，浏览器关闭后数据不会丢失，除了主动删除数据
2. sessionStorage 数据在当前浏览器窗口关闭后自动删除
3. 设置得 cookie 过期时间之前都有效，就算窗口或者是浏览器关闭

### 14.为什么说利用多个域名来存储网站资源会更有效？😘

因为 CDN 缓存更方便；突破浏览器并发限制；节约 cookie 带宽；节约主域名得连接数，优化页面响应速度；防止不必要得安全性问题。

### 15.http2.0 的内容 🥰

http2 是超文本传输协议的第二版，相比 http1 协议的文本传输格式，http2 是以二进制的格式进行数据传输的，具有更小的传输体积以及负载。

http2.0 分层，分帧层（http2 多路复用能力的核心部分),数据或 http 层（包含传统上被认为是 HTTP 及其关联数据的部分）。

HTTP2.0：

- 多路复用机制，引入了二进制的分帧层机制来实现多路复用。（分帧层是基于帧的二进制协议。这方便了机器解析。请求和响应交织在一起。）
- 可以设置请求的优先级（客户端的分帧层对分割块标上请求的优先级）。
- 头部压缩 请求头压缩，增加传输效率。

> HTTP/2 较 HTTP/1.1 优化亮点

- 多路复用的流
- 头部压缩
- 资源优先级和依赖设置
- 服务器推送
- 流量控制
- 重置消息

多路复用的实现：

![https://user-gold-cdn.xitu.io/2020/6/14/172b110637f61896?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b110637f61896?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在单个域名下仍可以建立一个 TCP 管道，使用一个 TCP 长连接，下载整个资源页面，只需要一次慢启动，并且避免了竞态，浏览器发起请求，分帧层会对每个请求进行分割，将同一个请求的分割块打上相同的 id 编号，然后通过协议栈将所有的分割体发送给服务器，然后通过服务器的分帧层根据 id 编号进行请求组装，服务器的分帧层将回应数据分割按同一个回应体进行 ID 分割回应给客户端，客户端拼装回应。

对于 http2 中的帧（frame），http1 不是基于帧（frame）的，是文本分隔的。

GET/HTTP/1.1 `<crlf>`

![https://user-gold-cdn.xitu.io/2020/6/14/172b1153ebe34e72?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b1153ebe34e72?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这样，对于 http1 的请求或者是响应可能有的问题：

1. 一次只能处理一个请求或者是响应，完成之前是不能停止解析的。
2. 无法预判解析需要多少内层。

HTTP/1 的请求和响应报文，是由起始行、首部和正文组成，换行符分隔；HTTP/2 是将请求和响应数据分割成更小的帧，采用二进制编码，易于解析的。

参考图片：

![https://user-gold-cdn.xitu.io/2020/6/14/172b11c399279634?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b11c399279634?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 帧结构总结
> 所有的帧都包含一个 9 byte 的帧头 + 可边长的正文不同。根据帧的类型不同，正文部分的结构也不一样。

帧头：

![https://user-gold-cdn.xitu.io/2020/6/14/172b11ebb1d14d28?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b11ebb1d14d28?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 16.http2-幕后 😗

http2 作为一个二进制协议，拥有包含轻量型，安全和快速在内的所有优势，保留了原始的 http 协议语义，对于 http2 更改了在系统之间传输数据的方式。

> 二进制分帧层（binary framing layer），所有通信都在单个 TCP 连接上执行，该连接在整个对话期间一直处于打开状态，主要是二进制协议将通信分解为帧的方式，这些帧交织在客户端与服务器之间的双向逻辑流中。

HTTP/2 连接的拓扑结构(展示了一个用于建立多个流的连接)

在流 1 中，发送了一条请求消息，并返回了相应的响应消息。

![https://user-gold-cdn.xitu.io/2020/6/14/172b127e8494eefd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b127e8494eefd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP/2 帧结构

![https://user-gold-cdn.xitu.io/2020/6/14/172b12973ecf94b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b12973ecf94b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

前 9 个字节对于每个帧是一致的。解析时只需要读取这些字节，就可以准确地知道在整个帧中期望的字节数。

帧首部字段表格：

[Untitled](https://www.notion.so/ced34e34842f4e24a5298ae8e4d5aef0)

备注：流 Id 是用来标识帧所属的流。流看作在连接上的一系列帧，它们构成了单独的 HTTP 请求和响应。

对于 http1 的请求和响应都分成消息首部和消息体两部分；http2 从上面一张图可以知道，http2 的请求和响应分成 HEADERS 帧和 DATA 帧。

比较一下：👇

![https://user-gold-cdn.xitu.io/2020/6/14/172b1360b8507905?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b1360b8507905?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b1362d267f0a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b1362d267f0a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

http2 的一个重要特性是基于流的流量控制。提供了客户端调整传输速度的能力。其中 WINDOW_UPDATE 帧用来指示流量控制信息。

有了多路复用，客户端可以一次发出多有资源的请求，不用像 http1 那样，发出对新对象请求之前，需要等待前一个响应完成。所以浏览器失去了在 Http1 中的默认资源请求优先级策略。

### 17.浏览器生成 http 请求消息 😙

![https://user-gold-cdn.xitu.io/2020/6/14/172b19ced1107696?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b19ced1107696?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b19d534737456?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b19d534737456?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b19deeeca1f1e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b19deeeca1f1e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b19eda9646cf0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b19eda9646cf0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b19f0e86d7a88?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b19f0e86d7a88?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

http 的头字段

[Untitled](https://www.notion.so/6c329a66372c40e5ab3a5afe6134daa4)

HTTP 消息示例：

![https://user-gold-cdn.xitu.io/2020/6/14/172b2c1bc28bcf49?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b2c1bc28bcf49?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. HTTP,超文本传送协议。
2. 协议，通信操作的规则定义称为协议。
3. URI，统一资源标识符。
4. 1 条请求消息中只能写 1 个 URI。如果需要获取多个文件，必须
   对每个文件单独发送 1 条请求。

![https://user-gold-cdn.xitu.io/2020/6/14/172b2d0b46c0958a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b2d0b46c0958a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/14/172b2d0ed4ecbf7e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b2d0ed4ecbf7e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

IP 的基本思路

![https://user-gold-cdn.xitu.io/2020/6/14/172b2f24da76352a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b2f24da76352a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Ip 地址的表示方法

![https://user-gold-cdn.xitu.io/2020/6/14/172b362b02e1c539?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b362b02e1c539?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

IP 地址的结构-子网掩码表示网络号与主机号之间的边界。

![https://user-gold-cdn.xitu.io/2020/6/14/172b36378ae2233f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b36378ae2233f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

解析器的调用方法

![https://user-gold-cdn.xitu.io/2020/6/14/172b369861a35e88?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b369861a35e88?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

DNS 服务器的基本工作

![https://user-gold-cdn.xitu.io/2020/6/14/172b38605815b736?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/14/172b38605815b736?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

DNS 服务器之间的查询操作

![https://user-gold-cdn.xitu.io/2020/6/15/172b39238974f2e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/15/172b39238974f2e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

数据通过类似管道的结构来流动

![https://user-gold-cdn.xitu.io/2020/6/15/172b394685ed1a10?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/15/172b394685ed1a10?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 18.了解网络基础知识 🙂

![https://user-gold-cdn.xitu.io/2020/6/15/172b435b071be76f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/15/172b435b071be76f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 物理层
- 数据链路层
- 网络层
- 传输层
- 会话层
- 表示层
- 应用层

计算机网络，可以将规模分 WAN,Wide Area Network 广域网，和 LAN 局域网。通过电脑连接交换机再到路由器的连接。

> 你知道计算机与网络都经历了怎么样的一个发展过程吗？

1. 批处理就是指事先将用户程序和数据装入卡带或磁带，由计算机按照一定的顺序读取，使用户所要执行的这些程序和数据能够一并批量得到处理的方式。

![https://user-gold-cdn.xitu.io/2020/6/17/172c288998999db9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c288998999db9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 分时系统，是指多个终端与同一个计算机连接，允许多个用户同时使用一台计算机的系统。

![https://user-gold-cdn.xitu.io/2020/6/17/172c289c9dfa5608?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c289c9dfa5608?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 计算机网络

![https://user-gold-cdn.xitu.io/2020/6/17/172c28c11fbcd043?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c28c11fbcd043?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/17/172c28d50fd297e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c28d50fd297e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> TCP/IP 的机制是什么，TCP/IP 通信协议的统称，学习这个有人一定 🙅 不了解什么是协议。

但我们在接触到程序时，常常听到协议如 IP，TCP，HTTP 等协议。记住 TCP/IP 就是 IP,TCP,HTTP 等协议的集合。协议就是计算机与计算机之间通过网络实现通信时需要达成的一种的“约定”。这些协议就是让不同厂商的设备，不同的 CPU 和不同的操作系统组成的计算机之间进行通信。

就是两台计算机之间都能支持相同的协议，并遵循才能实现相互通信。

![https://user-gold-cdn.xitu.io/2020/6/17/172c29fc7b42662b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c29fc7b42662b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 分组交换协议

分组交换就是将大数据分割成一个一个叫做包的较小单位进行传输的方法。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2acdc104ac67?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2acdc104ac67?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

分层模块

![https://user-gold-cdn.xitu.io/2020/6/17/172c2c11eef74dda?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2c11eef74dda?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 了解 OSI 参考模型

OSI 将分为易于理解的 7 层：

1.物理层，2.数据链路层，3.网络层，4.传输层，5.会话层，6.表示层，7.应用层。

应用层：是对特定应用的协议。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2c7a7478383f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2c7a7478383f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

表示层：设备固有数据格式和网络标准数据格式的转换。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2c822d6719a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2c822d6719a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

会话层：通信管理。负责建立和断开通信连接。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2c8dec9fbbbf?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2c8dec9fbbbf?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

传输层：管理两个节点之间的数据传输。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2ca1f66f4b87?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2ca1f66f4b87?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

网络层：地址管理与路由选择。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2ca7cb32fa17?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2ca7cb32fa17?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

数据链路层：互连设备之间传送和识别数据帧。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2cb2fd09e1e1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2cb2fd09e1e1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

物理层：以“0”，“1”代表电压的高低，灯光的闪灭。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2ccecae57ef9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2ccecae57ef9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 如何模块化通信传输

![https://user-gold-cdn.xitu.io/2020/6/17/172c2cecd0e18747?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2cecd0e18747?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 网络构成要素

![https://user-gold-cdn.xitu.io/2020/6/17/172c2d5414fc0c5a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2d5414fc0c5a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

网卡：

![https://user-gold-cdn.xitu.io/2020/6/17/172c2d69ba749e92?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2d69ba749e92?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

什么是网关，它是 OSI 参考模型中负责将从传输层到应用层的数据进行转换和转发的设备。

![https://user-gold-cdn.xitu.io/2020/6/17/172c2d9754257cf3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2d9754257cf3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

代理服务：

![https://user-gold-cdn.xitu.io/2020/6/17/172c2dbefebe3e05?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/17/172c2dbefebe3e05?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 19.有哪些渲染优化呢？😝

第一，我们可以禁止使用 iframe，第二，可以禁止使用 gif 图片来实现 loading 效果，降低 CPU 的消耗，来提升渲染性能，第三，使用 CSS3 代码来代替 JS 动画。

对于一些小图标，可以使用 base64 位编码，以减少网络请求，但不建议大图使用，因为比较耗费 CPU，小图标优势在于，可以减少 HTTP 请求，避免文件跨域，修改及时生效。

页面头部的 style 和 script 会阻塞页面，在 Renderer 进程中的 JS 线程和渲染线程是互斥的。

### 20.学习 TCP 和 IP 的基础知识 🤤

TCP/IP 协议族市一组协议的集合，也称为互联网协议族。

20 世纪 60 年代后半叶，应 DoD 要求，美国开始进行通信技术相关的演技，ARPANET 的诞生，开发分组交互技术，在 1975 年，TCP/IP 的诞生。1983 年，ARPANET 决定正式启用 TCP/IP 为通信协议。

![https://user-gold-cdn.xitu.io/2020/6/19/172cca9249090e6b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/19/172cca9249090e6b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> TCP/IP 与 OSI 参考模型

对于 OSI 七层模型太细了，而互联网协议族 TCP/IP 模型划分为四层。

TCP/IP 模型（应用层，传输层，互联网层，网络接口层）-应用层，传输层，网络层，链路层。

![https://user-gold-cdn.xitu.io/2020/6/19/172ccf1c9113dcca?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/19/172ccf1c9113dcca?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

传输层就是可以让应用程序之间实现通信。

![https://user-gold-cdn.xitu.io/2020/6/19/172ccf570c34bfa9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/19/172ccf570c34bfa9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在其中 TCP 是一种面向有连接的传输层协议，保证两端通信主机之间的通信可达。UDP 是一种面向无连接的传输层协议，so，UDP 用于分组数据较少或者多播，广播通信以及视频通信等领域。

应用层

![https://user-gold-cdn.xitu.io/2020/6/19/172ccf9b3feeb1e6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/19/172ccf9b3feeb1e6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 21.面试题：TCP/IP 市如何在媒介上进行传输的呢？😑

![https://user-gold-cdn.xitu.io/2020/6/20/172cf6401868081c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/20/172cf6401868081c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在不同层次的协议 ✍

![https://user-gold-cdn.xitu.io/2020/6/20/172cfd0a63358b38?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/20/172cfd0a63358b38?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

数据包首部：

以太网包首部：IP 包首部，TCP 包首部，数据

IP 包首部：TCP 包首部，数据

TCP 包首部：数据

> 每个分层中，都会对所发送的数据附加一个首部，它包含了该层中必要的信息。（发送的目标地址，协议相关的信息等）

- 包是全能性术语
- 帧是数据链路层中包的单位
- 数据包，IP 和 UDP 等网络层以上的分层中包的单位
- 段，表示 TCP 数据流中的信息
- 消息，应用协议中数据的单位

![https://user-gold-cdn.xitu.io/2020/6/23/172def13489a05bc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/23/172def13489a05bc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 数据包的首部，明确表明了协议应该如何读取数据。掌握数据包首部，通常，为协议提供的信息为包首部，所要发送的内容为数据。

发送数据包，TCP/IP 通信流程：🤔

1. 应用程序处理，发送通信开始 TCP/IP 通信，应用程序会进行编码处理，编码相当于 OSI 中的表示层功能。
2. TCP 模块的处理，TCP 负责建立连接，发送数据以及断开连接，TCP 提供将应用层发来的数据顺利发送至对端的可靠传输。在应用层数据的前端附加一个 TCP 首部，它包含源端口号和目标端口号，序号以及校验和（用来判断数据是否被破坏）然后附加一个 TCP 首部的包再发给 IP。
3. IP 模块的处理，在 TCP 首部的前端加上自己的 IP 首部，它包含接收端 IP 地址和发送端 IP 地址。若不知道接收端的 MAC 地址，可以用 ARP 查找，只要知道对端 MAC 地址，就可以将 MAC 以及 IP 地址交给以太网的驱动程序，来实现数据传输。
4. 网络接口的处理，从 IP 传过来的 IP 包，然后附加上以太网首部并进行发送处理，以太网首部包含接收端的 MAC 地址，发送端的 MAC 的地址，以及标志以太网类型的以太网数据的协议。

> 数据包，经过以太网的数据链路时，大致上附加了以太网包首部，IP 包首部，TCP 包首部或者 UDP 包，以及应用自己的包首部和数据，最后包追加了包尾。

分层中包的结构

![https://user-gold-cdn.xitu.io/2020/6/23/172df5aa873962ef?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/23/172df5aa873962ef?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 数据包接收流程 🙄

1. 网络接口的处理，主机收到以太网包后，从以太网的包首部找到 MAC 地址判断是否为发给自己的，若不是就丢弃，如果是，就查找以太网包首部中的类型域从而确定以太网协议所传送过来的数据类型。
2. 通过 IP 模块处理，然后 TCP 模块处理（需要判断是否被破坏），检查是否按照序号接收数据。当数据接收完毕后，会发送“确认回执”给发送端。注意，这里的回执信息未能达到发送端，那么发送端会认为没有收到而一直反复发送。
3. 应用程序的处理，接收端应用程序会直接接收发送端发送的数据信息。

### 22.了解一下 http-http3.0😶

在 http2.0 中，TCP 管道传输途中也会导致丢包问题，造成队头阻塞（在 http2.0 中的 TCP 建立连接三次握手，和 HTTPS 的 TSL 连接也会耗费较多时间）

其实多路复用技术可以只通过一个 TCP 连接就可以传输所有的请求数据。

![https://user-gold-cdn.xitu.io/2020/6/24/172e6a2d16585d93?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/24/172e6a2d16585d93?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

http3 中弄了一个基于 UDP 协议的 QUIC 协议，QUIC 虽说基于 UDP，但是在基础上添加了很多功能。QUIC（快速 UDP 网络连接）是一种实验性的网络传输协议，由 Google 开发，该协议旨在使网页传输更快。

对于在 http 中的缺点就是延迟，浏览器的阻塞，在对同一域名，同时只能连接 4 个，超过了浏览器的最大连接限数时，后面的请求就会被阻塞；DNS 的查询就是将域名解析为 IP，来向目标服务器的 IP 建立连接，其中通过 DNS 缓存可以达到减少时间的作用；建立连接，HTTP 是基于 tcp 协议的，三次握手，每次连接都无法复用，so，会每次请求都要三次握手和慢启动，都会影响导致延迟。（慢启动对大量小文件请求影响较大）

http 处于计算机网络中的应用层，建立在 TCP 协议之上。（掌握了解 tcp 建立连接的 3 次握手和断开连接的 4 次挥手和每次建立连接带来的 RTT 延迟时间）。

相对于 HTTP1.0 使用了 header 里的 if-modified-since,expires 来做缓存判断，在 HTTP1.1 中引入了 entity tag,if-unmodified-since,if-match,if-none-match 等更多可供选择的缓存头来控制缓存策略。

http1.0 传输数据时，每次都要重新建立连接，增加延迟，http1.1 加入了 keep-alive 可以复用部分连接，但在域名分片等情况下仍要连接夺冠时连接，耗费资源，以及给服务器带来性能压力。

http1.1 尝试使用 pipeling 来解决问题，就是浏览器可以一次性发出多个请求，在同一个域名下，同一条 TCP 连接，但对于 pipeling 要求返回是按照顺序的，即（如果前面有个请求很耗时的话，后面的请求即使服务器已经处理完，任会等待前面的请求处理完才开始按序返回。）

在 http1.x 中，Header 携带内容过大，增加了传输的成本，在传输的内容都是明文，在一定程度上无法保证其数据的安全性。（在 http1.x 问题的出现，有了 SPDY 协议，用于解决 http/1.1 效率不高的问题，降低延迟，压缩 Header 等）

> HTTP2 主要解决用户和网站只用一个连接（同域名下所有通信都只用单个连接完成，单个连接可以承载任意数量的双向数据流，数据流是以消息的形式发送，消息由一个或多个帧组成）。

so，http 采用二进制格式传输数据，不像 http1.x 的文本格式。（二进制：http2 将请求和响应数据分割成帧，并且它们采用二进制的编码），对于 HTTP2 的概念：（流，消息，帧）

1. 流，它是连接中的一个虚拟信道；
2. 消息，它是 HTTP 消息，请求，以及响应；
3. 帧，它是 HTTP2.0 通信的最小单位。

> 多个帧可以乱序发送，可根据帧首部的标识流进行重新组装。

对于 http2,同一域名下只需要使用一个 TCP 连接，那么当出现丢包时，会导致整个 TCP 都要开始等待重传。对于 http1.1 来说，可以开启多个 TCP 连接，出现这种情况指挥影响一个连接（或者部分），其余的 TCP 连接正常传输。

HTTP/2 对首部采取了压缩策略，为了减少资源消耗并提升性能。（因为在 http1 中，在 header 携带 cookie 下，可能每次都要重复传输数据）

so，有了 QUIC 协议，整合了 TCP，TLS，和 HTTP/2 的优点，并加以优化。那么 QUIC 是啥，它是用来替代 TCP，SSL/TLS 的传输层协议，在传输层之上还有应用层。

> 注意，它是一个基于 UDP 协议的 QUIC 协议，使用在 http3 上。

**QUIC 新功能**

![https://user-gold-cdn.xitu.io/2020/6/29/172fee527d2f03b7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/172fee527d2f03b7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTPS 的一次完全握手的连接过程

![https://user-gold-cdn.xitu.io/2020/6/29/172fee5432b0b43a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/172fee5432b0b43a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

QUIC 可以解决传输单个数据流可以保证有序的交付，并且不会影响其他的数据流。（解决 http2 问题）

表示在 QUIC 连接中，一个连接上的多个 stream，如其中 stream1,stream2,stream3,stream4，其中 stream2 丢失（quic packet)，其余 UDP 到达，应用层直接读取。--- 无需等待，不存在 TCP 队头阻塞，丢失的包需要重新传即可。

补充：

1. TCP 是基于 IP 和端口去识别连接的；
2. QUIC 是通过 ID 的方式去识别连接的

对于 QUIC 的包都是经过认证的，除了个别，so，这样，通过加密认证的报文，就可以降低安全风险。

> HTTP2-TLS,TCP,IP

小结 QUIC 特点：（基于 UDP）--- http3-QUIC,UDP,IP

1. 多路数据流
2. TLS
3. 有序交付
4. 快速握手
5. 可靠性

### 23.网络中的 UDP😛

UPD 面向报文的协议，就是 UDP 只是报文的搬运工，不会对报文进行任何拆分和拼接操作，在发送端，应用层将数据传给传输层的 UDP 协议，UDP 会给数据加一个 UDP 头标识下是 UUDP 协议，然后传给网络层。

接收端，网络层将数据传给传输层，UDP 只去除 IP 报文头就传给应用层，不会任何拼接操作。

UDP 是无连接，通信不需要建立和断开连接，UDP 是不可靠的，不关心数据的安全等问题，UDP 是没有拥塞控制，在网络条件不好的情况下可能会导致丢包。

> 传输：UDP 支持一对一，一对多，多对多，多对一的的传输方式， UDP 提供了单播，多播，广播的功能。

### 24.网络中的 TCP😜

UDP 没有 TCP 那么复杂，UDP 头部开销小，但是 TCP 头部比 UDP 头部复杂得多，UDP 头部只有 8 字节，相比 TCP 的至少 20 字节要少很多。

> Sequence number

这个序号保证了 TCP 传输的报文都是有序的，对端可以通过序号顺序的拼接报文

> Window Size

表示窗口大小，还能接收多少字节的数据

> Acknowledgement Number

表示上一个序号的数据已经接收到，接收端期望接收的下一个字节的编号是多少

**标识符**

当 ACK=1，表示确认号字段有效

当 SYN=1，ACK=0 时，表示当前报文段是一个连接请求报文

当 SYN=1，ACK=1 时，表示当前报文段是一个同意建立连接的应答报文

当 FIN=1，表示此报文段是一个释放连接的请求报文

> 性能指标 RTT

表示发送端发送数据到接收到对端数据所需的往返时间

> 小结

1. TCP（Transmission Control Protocol，传输控制协议）是基于连接的协议
2. UDP（User Data Protocol，用户数据报协议）是面向非连接的协议。

### 25.建立连接三次握手 😕

建立连接开始时，两端都是 CLOSED 状态，通信开始前，双方都会创建 TCB，后进入 LISTEN 状态，开始等待客户端发送数据。

第一次握手

> 客户端向服务器端发送连接请求报文段，请求发送后，客户端进入 SYN-SENT 状态。

第二次握手

> 服务端收到连接请求报文段后，发送完成后便进入 SYN-RECEIVED 状态。

第三次握手

> 客户端收到连接同意的应答后，要向服务端发送一个确认报文。客户端发完这个报文段后便进入 ESTABLISHED 状态，服务端收到这个应答后也进入 ESTABLISHED 状态，此时连接建立成功。

有人问了，两次握手就可以建立连接了，为啥要第三次呢？

> 因为防止失效的连接请求报文段被服务器端接收，从而导致错误。

### 26.http 请求码有哪些？🤑

100 为继续，一般发送 post 请求时，已经发送了 http header 之后服务端将返回此信息，表示确认，之后发送具体参数信息；201，请求成功并且服务器创建了新的资源；202，服务器已接受请求，但未处理。

301，请求的网页已经永久移动到新的位置；302，临时性重定向；303，临时性重定向，且总是使用 GET 请求新的 URI；304，自从上次请求后，请求的网页未修改过。

404，服务器无法理解请求；401，请求未授权；403，禁止访问。

### 27.面试时，简单说说 TCP 传输的三次握手四次挥手 😲

传输，为了准确无误地把数据传输给目标，TCP 协议采用了三次握手策略，用 TCP 协议把数据包送出去后，会向对方确认是否成功达到，发送端发送一个带 SYN 标志的数据包给到对方，接收端收到后，会回传一个带有 SYN/ACK 标志的数据包表示传送到达的确认信息，然后发送端也再次回传一个带有 ACK 标志的数据包，表示“握手”结束了。

握手过程中使用的标志：SYN 和 ACK

断开一个 TCP 连接需要四次挥手：

> 第一次挥手

主动关闭的一方，发送一个 FIN(上述讲过---当 FIN=1，表示此报文段是一个释放连接的请求报文)，传送数据，用来告诉对方（被动关闭方），说不会再给你发送数据了。---主动关闭的一方可以接受数据。

> 第二次挥手

被动关闭方 收到 FIN 包，发送 ACK 给对方，确认序号。

> 第三次挥手

被动关闭方 发送一个 FIN，关闭方，说我不会再给你发数据了。（你不给我发送数据，我也不给你发送数据了）

> 第四次挥手

主动关闭一方收到 FIN ，发送要给 ACK ，用来确认序号

### 28.常说的 HTTPS🙁

其实 HTTP 协议时承载于 TCP 协议之上的，再 HTTP 和 TCP 之间添加一个安全协议层，SSL 或者 TSL（ssl/tls 协议传输，包含证书，卸载，流量转发，负载均衡，页面适配，浏览器适配，refer 传递等），则就是常说的 HTTPS。

### 29.GET 和 POST 的区别，何时使用 POST？😖

1. GET 是用于信息获取，使用 URL 传递参数，发送信息的数量有限；
2. POST 是用于修改服务器上的资源；
3. 一般使用 POST，当无法使用缓存文件，向服务器发送大量的数据，发送未知的字符

### 30.面试问，HTTP 协议的主要特点 😨

1. 简单快速
2. 灵活
3. 无连接
4. 无状态

### 31.面试问，说说 HTTP 报文的组成部分 😟

![https://user-gold-cdn.xitu.io/2020/6/30/17302e7a3737469d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/17302e7a3737469d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP 报文的组成部分包含：请求报文和响应报文

请求报文： 有请求行，请求头， 空行，请求体

响应报文： 有状态行，响应头，空行，响应体

> 请求报文包含：

1.请求方法，2.请求 URL，3.HTTP 协议以及版本，4.报文头，5.报文体

- 请求行，有请求方法，请求 URL，http 协议以及版本；
- 请求头，一堆键值对
- 空行，当服务器在解析请求头的时候，遇到了空行，表明后面的内容是请求体
- 请求体，请求数据

> 响应报文包含：

1.报文协议以及版本，2，状态码以及状态描述，3，响应头，4，响应体

- 状态行：http 协议和版本，状态码以及状态描述
- 响应头
- 空行
- 响应体

### 32.面试时问，知道哪些 HTTP 方法 😤

1. GET 方法获取资源
2. POST 方法传输资源
3. PUT 方法更新资源
4. DELETE 方法删除资源
5. HEAD 方法获得报文首部

### 33.持久链接 😢

在 http1.0 中，客户端每隔很短时间会对服务器发出请求，查看是否有新的数据，只要轮询足够快，就可以造成交互实时进行，但这个做法，会对两端造成大量的性能浪费。

对于 http1.1 中的长连接，使用 connection:keep-alive 进行长连接，客户端只请求一次，但是服务器会将继续保持连接，再次请求时，避免了重新建立连接。

注意，keep-alive 不会永久保持连接，只有保持一个时间段。

### 34.安全问题：CSRF 和 XSS😭

CSRF 的基本概念，攻击原理，防御措施

CSRF（Cross-site request forgery）：跨站请求伪造

理解 CSRF 攻击：攻击者盗用了你的身份，以你的名义发送恶意请求。

> 以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账……造成的问题包括：个人隐私泄露以及财产安全。

CSRF 的原理:(要完成一次 CSRF 攻击)

- 登录受信任网站 A，并在本地生成 Cookie。
- 在不登出 A 的情况下，访问危险网站 B。

![https://user-gold-cdn.xitu.io/2020/6/29/172ffa8c99d81d44?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/172ffa8c99d81d44?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/29/172ffaae72032a02?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/172ffaae72032a02?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

XSS 的基本概念,跨域脚本攻击。

xss 是一种发生在 web 前端的漏洞，所以其危害的对象也主要是前端用户。

跨域脚本攻击是，恶意攻击者往 web 页面里插入恶意的 script 代码，在浏览器中运行 script 代码，达到恶意攻击用户的目的。

so，实现 xss 攻击具备 2 个条件，第一需要向 web 页面注入恶意的代码，第二，这些恶意代码被浏览器成功的执行。

![https://user-gold-cdn.xitu.io/2020/6/29/1730077d709821da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/1730077d709821da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/29/17300789f4df0b9d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/17300789f4df0b9d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

CSRF 和 XSS 的区别：

1. CSRF 需要登录，获取 COOKIE，利用网站本身的漏洞，去请求网站的 api
2. XSS,不需要登录，向网站注入 JS 代码，执行 JS 里的代码，篡改网站的内容

### 35.从一个 HTTP 请求来看网络分层原理

![https://user-gold-cdn.xitu.io/2020/6/29/173008cdde2b8093?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/173008cdde2b8093?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/29/173008ffd7f29089?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/173008ffd7f29089?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

一个 HTTP 请求的分层解析流程：

![https://user-gold-cdn.xitu.io/2020/6/29/1730093a09a9cfbe?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/1730093a09a9cfbe?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

TCP，它是面向连接的，可靠的，基于字节流的传输层通信协议。

特点：

- 基于连接，数据传输之前需要建立连接
- 全双工的，双向传输
- 字节流，不限制数据大小，打包成报文段，保证有序接收，重复报文自动丢弃
- 流量缓冲，解决双方处理能力的不匹配
- 可靠的传输服务，保证可达，丢包时通过重发机制实现可靠性
- 拥塞控制，防止网络出现恶性拥塞

TCP 连接，源地址，源端口，目的地址，目的端口

**从 TCP-IP 协议底层**

![https://user-gold-cdn.xitu.io/2020/6/29/17300b3d1eed8628?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/17300b3d1eed8628?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/29/17300bbda7ba429b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/29/17300bbda7ba429b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 滑动窗口协议与累计确认（延时 ACK）

滑动窗口大小同通过 tcp 三次握手和对端协商，且受网络状况影响

![https://user-gold-cdn.xitu.io/2020/6/30/17302455ef013a81?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/17302455ef013a81?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 36.HTTPS 安全加密通道原理分析

![https://user-gold-cdn.xitu.io/2020/6/30/173024bbe89f27b8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/173024bbe89f27b8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

什么是 HTTPS 协议，由于 HTTP 天生“明文”的特点，整个传输过程完全透明，任何人都能够在链路中截获，修改或者伪造请求、响应报文，数据不具有可信性。

使用 HTTPS 时，所有的 HTTP 请求和响应发送到网络前，都要进行加密。

![https://user-gold-cdn.xitu.io/2020/6/30/173024c1eb2a3273?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/173024c1eb2a3273?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```
https = http + ssl/tls

对称加密：加密 解密使用同一密钥

非对称加密：公钥-随意分发，私钥-服务器自己保持

公钥加密的数据，只能通过私钥解密
私钥加密的数据，只能公钥能解密

```

加密算法：

对称密钥加密算法，编，解码使用相同密钥的算法

非对称密钥加密算法，一个公钥，一个私钥，两个密钥是不同的，公钥可以公开给如何人使用，私钥是严格保密的。

加密通道的建立：

![https://user-gold-cdn.xitu.io/2020/6/30/17302575a59c7111?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/17302575a59c7111?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 数字证书的申请和验证

如何申请：

- 生成自己的公钥和私钥，服务器自己保留私钥
- 向 CA 机构提交公钥，公司，域名信息等待认证
- CA 机构通过线上，线下多种途径验证你提交信息的真实性，合法性
- 信息审核通过，CA 机构则会向你签发认证的数字证书，包含了公钥，组织信息，CA 信息，有效时间，证书序列号，同时生成了一个签名
- 签名步骤：hash(用于申请证书所提交的明文信息)= 信息摘要
- CA 再使用 CA 机构的私钥对信息摘要进行加密，密文就是证书的数字签名

![https://user-gold-cdn.xitu.io/2020/6/30/1730265b929a1733?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/1730265b929a1733?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 37.https 的对称加密，非对称加密，混合加密，CA 认证 😨

HTTPS ，超文本传输安全协议，目标是安全的 HTTP 通道，应用是安全数据传输。HTTP 协议虽然使用广，但是存在不小的安全缺陷，主要是数据的**明文传送**和**消息完整性**检测的缺乏。

HTTPS 协议是由 HTTP 加上 TLS/SSL 协议构建的可进行加密传输，身份认证的网络协议。

通过， 数字证书，加密算法，非对称密钥 等技术完成互联网数据传输加密，实现互联网传输安全保护。

HTTPS 主要特性：

1. 数据保密性
2. 数据完整性
3. 身份校验安全性

客户端和服务器端在传输数据之前，会通过基于证书对双方进行身份认证。客户端发起 SSL 握手消息给服务端要求连接，服务端将证书发送给客户端。客户端检查服务器端证书，确认是否由自己信任的证书签发机构签发，如果不是，将是否继续通讯的决定权交给用户选择，如果检查无误或者用户选择继续，则客户端认可服务端的身份。

服务端要求客户端发送证书，并检查是否通过验证，失败则关闭连接，认证成功，从客户端证书中获得客户端的公钥。

> HTTP 原理

客户端的浏览器首先要通过网络与服务器建立连接，该连接时通过 TCP 来完成的，一般 TCP 连接的端口号是 80，建立连接后，客户端发送一个请求给服务器端；服务器端接收到请求后，给予相应的响应信息。

> HTTPS 原理

客户端将它所支持的算法列表和一个用作产生密钥的随机数发送给服务器，服务器从算法列表中选择一种加密算法，并将它和一份包含服务器公用密钥的证书发送给客户端，该证书还包含了用于认证目的的服务器标识，服务器同时还提供了一个用作产生密钥的随机数。

客户端对服务器的证书进行验证，并抽取服务器的公用密钥，再产生一个称作 pre_master_secret 的随机密码串，并使用服务器的公用密钥对其进行加密，并将加密后的信息发送给服务器。

客户端与服务器端根据 pre_master_secret 以及客户端与服务器的随机数独立计算出加密和 MAC 密钥。

> 混合加密

在传输数据中使用对称加密，但对称加密的密钥采用非对称加密来传输，混合加密比较安全，但无法知道数据是否被篡改

> CA 认证

CA 认证, 即是电子认证服务，指电子签名相关各方提供真实性，可靠性验证的活动。

![https://user-gold-cdn.xitu.io/2020/6/30/17302f1448956ce1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/17302f1448956ce1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

特性：参阅百度百科—简介，[点击进入](https://baike.baidu.com/item/CA%E8%AE%A4%E8%AF%81/6471579?fr=aladdin#1)

![https://user-gold-cdn.xitu.io/2020/6/30/17302f252081e54a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/17302f252081e54a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 38.https 对比 http🥶

http 传输方式：明文传输，网站或相关服务与用户之间的数据交互无加密，容易被监听，篡改。

https 传输方式：在 HTTP 加入了 SSL 层，用于数据传输加密。

http 身份认证：无任何身份认证，用户无法通过 http 辨认出网站的真实身份。

https 身份认证：经过 CA 多重认证，包含域名管理权限认证等。

http 成本：无任何使用成本，所有网站默认是 http 模式。

https 需要成本，需要申请 SSL 证书来实现 https。

http 连接端口：80 端口。

https 连接端口：443 端口。

### 39.证书如何安全传输，被掉包了怎么办？😳

![https://user-gold-cdn.xitu.io/2020/6/30/173030007197773c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/173030007197773c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 40.http3 中 QUIC😵

QUIC 是谷歌制定的一种基于 UDP 的低时延的互联网传输层协议。

1、避免前序包阻塞；2、零 RTT 建连；3、FEC 前向纠错

> HTTP 的历史

![https://user-gold-cdn.xitu.io/2020/6/30/1730309e8316db8b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/1730309e8316db8b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP/2 和 HTTP/3 建立连接的差别

TCP/建立连接与 QUIC 建立连接

![https://user-gold-cdn.xitu.io/2020/6/30/173030f3af8ade61?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/173030f3af8ade61?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

队头阻塞/多路复用

HTTP/1.1 提出了 Pipelining 技术，允许一个 TCP 连接同时发送多个请求

请求与响应，与，Pipelining

![https://user-gold-cdn.xitu.io/2020/6/30/1730310839b6b002?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/1730310839b6b002?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

http/1.1 队头阻塞

![https://user-gold-cdn.xitu.io/2020/6/30/1730311458b33eb4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/1730311458b33eb4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP/2 的多路复用解决了队头阻塞问题

![https://user-gold-cdn.xitu.io/2020/6/30/1730313eae76e29f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/1730313eae76e29f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/6/30/17303166961ba066?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/6/30/17303166961ba066?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

拥塞控制：

- 慢启动
- 拥塞避免
- 快速重传
- 快速恢复

### 41.HTTP 协议入门

HTTP 基于 TCP/IP 协议的应用层协议，不涉及数据包 packet 传输，主要客户端和服务器之间的通信格式，默认使用 80 端口。TCP 连接建立后，客户端向服务器请求网页，协议规定，服务器只能回应 HTML 格式的字符串，不能回应别的格式。

http1.0 可以传输文字，传输图像，视频，二进制文件；除了 GET 方法，还有 POST，HEAD 等；每次通信都需要 头信息 HTTP header，状态码，多字符集支持，缓存，权限等。

字段：ontent-Type 字段

头信息必须是 ASCII 码，后面的数据可以是任何格式，字段值：

```
text/plain
text/html
text/css
image/jpeg
image/png
image/svg+xml
audio/mp4
video/mp4
application/javascript
application/pdf
application/zip
application/atom+xml

```

客户端请求的时候，使用 Accept 字段，表示可以接受哪些数据格式。

```
Accept: */*

```

Content-Encoding 字段,表示数据的压缩方式

```
Content-Encoding: gzip
Content-Encoding: compress
Content-Encoding: deflate

```

客户端在请求时，用 Accept-Encoding 字段说明接受哪些压缩方法。

```
Accept-Encoding: gzip, deflate

```

http1.0 就是每个 TCP 连接只能发送一个请求，发送完毕后就关闭，so，为解决问题，用了一个非标准 Connection 字段，Connection:keep-alive。

HTTP/1.1 引入了持久连接（persistent connection），TCP 连接默认不关闭，可以被多个请求复用，不用声明 Connection: keep-alive。

也不是永久性不关闭的，只要有一段时间没有活动，就会关闭 TCP 连接，一般对于同一个域名，大多数浏览器允许同时建立 6 个持久连接。

1.1 版引入了管道机制（pipelining），同一个 TCP 连接里，可以同时发送多个请求。但是还是按照顺序，一个请求回应后，再回应另一个请求。（但也减少不小的消耗时间）。

使用**分块传输编码**，只要请求或回应的头信息**有 Transfer-Encoding 字段**

```
Transfer-Encoding: chunked

```

什么是多工？双向，实时的通信就叫 多工。

HTTP2 复用 TCP 连接，在一个连接里，两端都可以同时发送多个请求或响应，而且不用按照顺序一一对应，避免了“队头堵塞”。

http2 引入了头信息压缩机，头信息使用 gzip 或 compress 压缩后再发送，客户端和服务器同时维护一张头信息表，所有字段存在这个表里，生成一个索引号，以后就只发送索引号，这样就提高速度了。

HTTP/2 允许服务器未经请求，主动向客户端发送资源（服务器推送）

### 42.什么是 cookie 呢 🥴

cookie 是某网站为了辨别用户身份，进行 session 跟踪而存储在用户本地终端的数据（通常经过加密），由用户客户端计算机暂时或永久保存的信息。

1. 存储在用户本地终端上的数据
2. 用来辨别用户身份
3. 保存在用户本地终端

cookie 是一些数据，存储在你电脑上的文本文件中，当 web 服务器向浏览器发送 web 页面时，在连接关闭后，服务端不会记录用户的信息，cookie 的作用就是解决如何记录客户端的用户信息。

场景：当用户访问 web 页面，用户信息记录在 cookie 中，当用户下一次访问页面后，可以在 cookie 中读取用户访问记录。

cookie 是以键值对形式存储的，当浏览器从服务器上请求 web 页面，该页面的 cookie 会被添加到请求中，服务端通过这种方式用来获取用户信息。

> 可以使用 JavaScript 来创建，读取，修改，删除 cookie

使用 document.cookie 属性来创建，读取以及删除 cookie

创建：

```
document.cookie = "username = dadaqianduan";

```

给 cookie 添加一个过期时间：

```
document.cookie = "username = dadaqianduan; expires=xxxxxx";

```

默认情况下，cookie 属于当前页面：

```
document.cookie = "username = dadaqianduan; expires= ; path=/";

```

读取 cookie

```
var x = document.cookie;

```

修改 cookie

```
document.cookie = "username = dada; expires=xxx; path=/";

```

删除 cookie， 把设置时间的 expires 参数改为以前的时间即可。

```
document.cookie = "username = ; expires= xxx";

```

为什么会有 cookie 呢？因为 http 请求时无协议的，http1.x，无状态协议，客户端同一个请求发送多次，服务端并不能识别是不是同一个客户端发送，为了解决无状态，就有了 cookie。

cookies 是服务器暂存放在你的电脑里的资料，以.txt 格式的文本文件，好让服务器用来辨认你的计算机，当你在浏览网站时，web 服务器会发送一个小小的资料放在你的计算机上。

当你下一次访问同一个网站，web 浏览器会先看看有没有它上次留下来的 cookies 资料，有的话就输出特定的内容给你。

![https://user-gold-cdn.xitu.io/2020/7/1/1730886e6fcb0f5b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/1730886e6fcb0f5b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/173088a659ee51a7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/173088a659ee51a7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/17308e9ecfdc8c49?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17308e9ecfdc8c49?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> cookie 原理

浏览器第一次请求服务器，服务器响应请求中携带 cookie，给浏览器，浏览器第二次请求，携带 cookie，给服务器，服务器根据 cookie 辨别用户，也可以修改 cookie 内容。

![https://user-gold-cdn.xitu.io/2020/7/1/17308f00bd981d2e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17308f00bd981d2e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/17308f04e410a873?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17308f04e410a873?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/17308f45ebbf6461?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17308f45ebbf6461?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/17308f549491f9d0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17308f549491f9d0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

domain 时.baidu.com 的 cookie 绑定到了域名商。跨域的域名不能写入在 cookies 文件里

![https://user-gold-cdn.xitu.io/2020/7/1/17308f95893f42a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17308f95893f42a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> cookie 的属性有哪些

Name, Value, Domain, Path, Expires/Max-Age, Size, HttpOnly, Secure, SameSite

掌握面试中的 HttpOnly,这个属性设置为 true，就不能通过 js 脚本获取 cookie 的指，能有效防止 xss 的攻击。

Cookie 中的 HttpOnly 和 Secure 中：

标记为 Secure 的 Cookie 只能被 https 协议加密过的请求发送给服务端。但也无法保证其安全保障。

如果 cookie 中设置了 HttpOnly 属性，通过 js 脚本将无法读取到 cookie 信息，有效防止 xss 的攻击，窃取 cookie 内容，增加了 cookie 的安全性，但是重要信息还是不要存储在 cookie 中。

因为 xss 为跨站脚本攻击，是 web 程序常见的漏洞，属于被动式且用于客户端的攻击方式

```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly

```

SameSite

> SameSite Cookie 允许服务器要求某个 cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。

示例：

```
Set-Cookie: key=value; SameSite=Strict

```

SameSite 有三个值：

None: 浏览器在同站请求，跨站请求下继续发送 cookies，不区分大小写。（所有三方的请求都会携带 cookie)

Strict: 浏览器将只在访问相同站点时发送 cookie。（所有三方的链接都不会携带 cookie)

Lax: Same-site cookies 将会为一些跨站子请求保留，如图片加载或者 frames 的调用，但只有当用户从外部站点导航到 URL 时才会发送。(只有同步且是 get 请求才可携带 cookie)

> 在 https 协议中，才能通过 js 去设置 secure 类型的 cookie,在 http 协议的网页中是无法设置 secure 类型 cookie 的。默认情况，https 协议还是 http 协议的请求，cookie 都会被发送到服务端。

### 43.什么是 token 呢？🤬

token 的出现，是在客户端频繁向服务端请求数据，服务端频繁的去数据库查询用户名和密码并进行对比，判断用户名和密码正确与否，并作出相应提示。token 是服务端生成的一串字符串，以作客户端进行请求的一个令牌，第一登录时，服务器生成一个 token，将此 token 返回给客户端，客户端带上这个 token，无需再次带上用户名和密码了。

token 的出现减轻了服务器的压力，减少频繁地数据库查询。

![https://user-gold-cdn.xitu.io/2020/7/1/1730969968065ee1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/1730969968065ee1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> token 的优点

- 无状态，可扩展
- 安全性
- 多平台跨域
- 基于标准

![https://user-gold-cdn.xitu.io/2020/7/1/173096a4cbef05b9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/173096a4cbef05b9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/173096a7fa0cf0c3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/173096a7fa0cf0c3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/173096acbc9fdca2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/173096acbc9fdca2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/1730976e4eb435be?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/1730976e4eb435be?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 基于 Token 的身份验证的过程

浏览器，输入 userName, Password，到 mysql，校验成功 生成 token，将 token 返回给客户端，当客户端发起请求时，每次访问 api 都携带 token 到服务器端，经过过滤器，校验 token，校验成功后返回请求数据，校验失败后返回错误码。

### 44.cookie,session,token😷

cookie，记录访问过的网站或正在访问的网站，对于 HTTP 协议是无状态的，服务器不知道浏览器上一次访问做了什么，也无法对用户会话进行跟踪连接，所以，cookie 是由服务器发送到客户端浏览器的一段文本文件，包含了网站访问活动信息。Cookie 存放在客户端，用来保存客户端会话信息；由于存储在客户端，它的安全性不能完全保证。

session 表示是 c/s 架构中服务器和客户端一次会话的过程，用来保存认证用户信息。session 是一种 HTTP 存储机制，提供持久机制。Session 存放在服务器端，用户验证客户端信息。由于存储在服务器，安全性有一定的保证。

token 是一种认证方式(是“令牌”的意思，主要是用于身份的验证方式。)

### 45.跨域 🤒

![https://user-gold-cdn.xitu.io/2020/7/1/17309fb3b4f33316?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17309fb3b4f33316?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

网页的 URL 的协议、域名、端口有一个不同，就算是跨域了

> 跨域：JSONP

![https://user-gold-cdn.xitu.io/2020/7/1/17309fc545cc969c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17309fc545cc969c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/1/17309fd32d037e4d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/1/17309fd32d037e4d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 46.思维导图 http 小结

![https://user-gold-cdn.xitu.io/2020/7/2/1730ca0dcf9e50ed?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730ca0dcf9e50ed?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730cbafb1c59c47?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730cbafb1c59c47?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730cc27d5041daf?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730cc27d5041daf?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730cc8b62f47ad4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730cc8b62f47ad4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730cd24b2a73ebd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730cd24b2a73ebd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730d0eabc2b5911?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d0eabc2b5911?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730d544bfe2fef6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d544bfe2fef6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 47.http 中的字段 🤠

1. accept，数据格式，请求 accept，响应，content-type，表示收到的数据格式
2. accept，压缩方式，请求 accept-encoding，响应，content-encoding，采用什么样的压缩方式
3. accept，支持语言，请求 accept-language，响应 content-language
4. accept，字符集，请求 accept-charset，响应 content-type，指定字符集
5. accept，范围请求，请求 if-range 和 range，响应 accept-anges 和 content-range
6. cookie，请求时传递给服务端的 cookie 信息
7. set-cookie，响应报文首部设置要传递给客户端的 cookie 信息
8. allow，支持什么 HTTP 方法
9. last-modified，资源的最后修改时间
10. expires,设置资源缓存的失败日期
11. content-language，实体的资源语言
12. content-encoding，实体的编码格式
13. content-length，实体主体部分的大小单位是字节
14. content-range，返回的实体的哪些范围
15. content-type，哪些类型
16. accept-ranges，处理的范围请求
17. age，告诉客户端服务器在多久前创建了响应
18. vary，代理服务器的缓存信息
19. location，用于指定重定向后的 URI
20. If-Match，值是资源的唯一标识
21. User-Agent，将创建请求的浏览器和用户代理名称等信息传递给服务器
22. Transfer-Encoding，传输报文的主体编码方式
23. connection，管理持久连接，keep-alive , close
24. Cache-Control，控制浏览器的强缓存

### 48.如果面试问 HTTP 报文结构是什么，你能回答上来不？

![https://user-gold-cdn.xitu.io/2020/7/2/1730d814eefb6984?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d814eefb6984?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

对于 TCP 而言

```
起始行 + 头部 + 空行 + 实体

```

1. 请求报文

```
GET /home HTTP/1.1

```

1. 响应报文

```
HTTP/1.1 200 OK

```

![https://user-gold-cdn.xitu.io/2020/7/2/1730d8b6a53d2d7a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d8b6a53d2d7a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730d8b8b2a02d6f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d8b8b2a02d6f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 空行是用来分开头部和实体。

### 49.如果面试问 HTTP 请求方法有哪些，你能回答上来不？🤥

1. GET 方法，用来获取资源
2. POST 方法，用来提交数据
3. PUT 方法，用来修改数据
4. DELETE 方法，用来删除资源
5. OPTIONS 方法，用来跨域请求
6. HEAD 方法，用来获取资源的元信息
7. CONNECT 方法，用来建立连接，用于代理服务器

### 50.如果面试问，你对 URI 是如何理解的，你能回答上来不？🤫

URL 统一资源定位符，URI，统一资源标识符。URI 用于区分网络上不同的资源。

URI 包含了 URN 和 URL。

URL 的结构：

![https://user-gold-cdn.xitu.io/2020/7/2/1730d922c915cb25?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d922c915cb25?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 协议名，登录主机的用户信息，主机名和端口，请求路径，查询参数，URI 上定位资源内的一个锚点。

### 51.如果面试问，你对 HTTP 状态码的了解有多少，你能回答上来不？

了解一些特定的 HTTP 状态码：

![https://user-gold-cdn.xitu.io/2020/7/2/1730d9c4c31cebad?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d9c4c31cebad?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730d9ff3358a7db?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730d9ff3358a7db?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 52.如果面试问，说说 HTTP 特点以及缺点，你能回答上来不？

特点是：

1. 灵活可扩展
2. 可靠传输
3. 无状态等

缺点是：

1. 无状态
2. 明文传输
3. 队头阻塞问题

### 53.如果面试问，说说你对 Accept 字段的理解，你能回答上来不？

![https://user-gold-cdn.xitu.io/2020/7/2/1730da1b00192b77?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730da1b00192b77?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730da3125c65de9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730da3125c65de9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 数据格式
- 压缩方式
- 支持语言
- 字符集

### 54.如果面试问，什么是队头阻塞问题，你能回答上来不？🤭

TCP 中是报文，HTTP 是请求。

对于解决 HTTP 的队头阻塞问题是：并发连接和域名分片。

### 55.如果面试问，说说你对 HTTP 代理的理解，你能回答上来不？🧐

代理服务器功能：1，负载均衡，2，保障安全（利用心跳机制监控服务器，一旦发现故障机就将其踢出集群。），3，缓存代理。

理解代理缓存：

- 由一个代理服务器下载的页面存储；
- 一个代理服务器为多个用户提供一条通道；
- 缓冲的代理允许一个代理服务器减少对同一个网站的同样页面的请求次数
- 一旦代理服务器的一个用户请求了某个页面，代理服务器就保存该页面以服务于它的其他用户的同样的请求
- 代理缓存，这种处理减少了用户等待页面显示的时间

![https://user-gold-cdn.xitu.io/2020/7/2/1730e1d851e2612e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e1d851e2612e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

缓存的作用：

![https://user-gold-cdn.xitu.io/2020/7/2/1730e3846c985a5b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e3846c985a5b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 代理服务器或客户端本地磁盘内保存的资源副本，利用缓存可减少对源服务器的访问，可以节省通信流量和通信时间。

示例：

```
Cache-Control: max-age=300；

```

表示时间间隔，再次请求的时间间隔 300s 内，就在缓存中获取，否则就在服务器中

Cache-Control:

- public 表示响应可被任何中间节点缓存
- private 表示中间节点不允许缓存
- no-cache 表示不使用 Cache-Control 的缓存控制方式做前置验证
- no-store 表示真正的不缓存任何东西
- max-age 表示当前资源的有效时间

强缓存：浏览器直接从本地存储中获取数据，不与服务器进行交互

协商缓存：浏览器发送请求到服务器，浏览器判断是否可使用本地缓存

学习了解强缓存 👍：

强缓存主要学习 expires 和 cache-control

cache-control 该字段：max-age，s-maxage，public，private，no-cache，no-store。

```
cache-control: public, max-age=3600, s-maxage=3600

```

- 表示资源过了多少秒之后变为无效
- s-maxage 的优先级高于 max-age
- 在代理服务器中，只有 s-maxage 起作用

public 和 private

- public 表示该资源可以被所有客户端和代理服务器缓存
- private 表示该资源仅能客户端缓存

当浏览器去请求某个文件的时候，服务端就在 response header 里做了缓存的配置：

> 表现为：respone header 的 cache-control

![https://user-gold-cdn.xitu.io/2020/7/2/1730e3a45add53fe?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e3a45add53fe?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730e40361679b99?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e40361679b99?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

学习了解 ✍ 协商缓存：

response header 里面的设置

```
etag: 'xxxx-xxx
last-modified: xx, 24 Dec xxx xxx:xx:xx GMT

```

![https://user-gold-cdn.xitu.io/2020/7/2/1730e4ccfb831f4c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e4ccfb831f4c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730e50ac0c7b4d8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e50ac0c7b4d8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730e54ea7d82497?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e54ea7d82497?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 56.如果面试问，HTTP/2，你能回答上来不？🤓

![https://user-gold-cdn.xitu.io/2020/7/2/1730e6a4b02fba2f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e6a4b02fba2f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP/2 采用哈夫曼编码来压缩整数和字符串，可以达到 50%~90%的高压缩率。

服务器推送

![https://user-gold-cdn.xitu.io/2020/7/2/1730e6f254f2fe81?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e6f254f2fe81?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/2/1730e784472ab9fd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e784472ab9fd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 57.B/S 结构定义 😈

浏览器-服务器结构，B/S 结构，客户端不需要安装专门的软件，只需要浏览器即可，浏览器通过 web 服务器与数据库进行交互，可以方便的在不同平台下工作。

B/S 结构简化了客户端的工作，它是随着 Internet 技术兴起而产生的，对 C/S 技术的改进，但该结构下服务器端的工作较重，对服务器的性能要求更高。

### 58.URI 统一资源标识符 👿

统一资源标识符是一个用于标识某一互联网资源名称的字符串。该标识允许用户对网络中的资源通过特定的协议进行交互操作。URI 常见形式为统一资源定位符（URL），URN 为统一资源名称。用于在特定的命令空间资源的标识，以补充网址。

![https://user-gold-cdn.xitu.io/2020/7/2/1730e819adb0656c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e819adb0656c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 59.HTTP 协议 👹

HTTP 超文本传输协议是互联网上应用最为广泛的一种网络协议。设计 HTTP 最初的目的是为了提供一种发布和接收 HTML 页面的方法。通过 HTTP 或者 HTTPS 协议请求的资源由统一资源标识符来标识

HTTP 协议主要特点

![https://user-gold-cdn.xitu.io/2020/7/2/1730e84ef9c615c9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e84ef9c615c9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 60.数据链路 🔪-数据链路层

> 数据链路层：以太网，无线 LAN，PPP。。。(无线，光纤。。。)

- 数据链路的知识对了解 TCP/IP 与网络起到重要的作用
- 数据链路层的协议定义了通过通信媒介互连的设备传输的规范
- 物理层面是将实际的通信媒介如电压的高低，电波的强弱等信号与二进制 01 进行转换
- 数据链路层处理的数据是一种集合为“帧”的块
- WLAN，无线局域网
- PPP，点对点协议，即是 1 对 1 连接计算机的协议
- ATM，异步传输方式

> 数据链路是让互联网计算机之间相互通信的一种协议，通信手段

- MAC 地址用于识别数据链路中互连的节点

![https://user-gold-cdn.xitu.io/2020/7/2/1730e991d90bf0d6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/2/1730e991d90bf0d6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 无线通信是使用电磁波，红外线，激光等方式进行传播数据。一般在办公室的局域网范围内组成的较高速的连接称为无线局域网。
- IP-x-x-x，在 IP 网络上建立 x-x-x,网络服务商提供一种在 IP 网络商使用 MPLS 技术构建 x-x-x 的服务。

### 61.TCP 和 UDP 的区别

TCP 是一个**面向连接，可靠，基于字节流**的传输层协议。

UDP 是一个**面向无连接**的传输层协议。

TCP 是面向连接的，客户端和服务器端的连接，双方互相通信之前，TCP 需要三次握手建立连接，而 UDP 没有建立连接的过程

tcp 是面向字节流，udp 是面向报文的。UDP 的数据传输是基于数据报的，TCP 继承了 IP 层的特性，TCP 为了维护状态，将一个个 IP 包变成了字节流。

TCP 报文格式图：

![https://user-gold-cdn.xitu.io/2020/7/3/17311985e280a6a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/17311985e280a6a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/17311a0976660bcd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/17311a0976660bcd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/17311db03560f39f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/17311db03560f39f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 序号：Seq 序号，占 32 位，标识从 TCP 源端口向目的端口发送的字节流，发起方发送数据时，对此进行标记
- 确认序号：Ack 序号，占 32 位，只有 ACK 标志位为 1 时，确认序号字段才有效，Ack=Seq+1
- 标志位：共 6 个，即 URG、ACK、PSH、RST、SYN、FIN 等

1. URG，紧急指有效
2. ACK，确认序号有效
3. RST，重置连接
4. SYN，发起一个新连接
5. FIN，释放一个连接
6. PSH，接收方应该尽快将这个报文交给应用层

![https://user-gold-cdn.xitu.io/2020/7/3/17311a72303ab908?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/17311a72303ab908?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 62.三次握手建立连接

TCP 的三次握手的过程:

![https://user-gold-cdn.xitu.io/2020/7/3/1731183c33a9a6e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/1731183c33a9a6e9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/173119bfda6ff9cc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173119bfda6ff9cc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/173119f6e87d4d7b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173119f6e87d4d7b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

有图可知都处于 closed 状态，服务器开始监听某个端口进入 listen 状态，客户端发起请求，发送 SYN,seq=x，然后状态变为 syn-sent 状态。

服务器端接收到返回 syn 和 ack,seq=x,ack =x+1,然后状态变成 syn-rcvd 状态。

客户端收到后，发送 ack,seq=x+1,ack=y+1 给服务器端，状态变为 established，服务器收到后，状态变成 established。

在连接过程中，需要对端确认的，需要消耗 TCP 报文的序列号。SYN 消耗一个序列号而 ACK 不需要。

对于连接四次握手多余，二次握手，会带来资源的浪费，当遇到丢包，重传，连接关闭后，丢包到达服务端，就默认建立连接，可客户端以及关闭，所以三次握手就可以了。

### 63.四次挥手断开连接

TCP 四次挥手的过程

![https://user-gold-cdn.xitu.io/2020/7/3/1731193d5d70f674?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/1731193d5d70f674?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/173119e8740a3e30?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173119e8740a3e30?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/173119ffaf56e517?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173119ffaf56e517?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/17311a8d6a2688d0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/17311a8d6a2688d0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

三次挥手，当服务器将 ack 和 fin 合并为一次挥手，会导致长时间的延迟，以至于客户端误认为 fin 没有到达客户端，让客户端不断重发 fin。

### 64.TCP 滑动窗口

TCP 滑动窗口:

1. 发送窗口

![https://user-gold-cdn.xitu.io/2020/7/3/1731227d188056cc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/1731227d188056cc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 接收窗口

![https://user-gold-cdn.xitu.io/2020/7/3/173122835dfd7365?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173122835dfd7365?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 65.TCP 的拥塞控制？

TCP 连接，拥塞控制：

1. 拥塞窗口（Congestion Window，cwnd）
2. 慢启动阈值（Slow Start Threshold，ssthresh）

> TCP/IP 协议四层

1. 应用层决定了向用户提供应用服务时通信的活动。
2. 传输层对上层应用层，提供处于网络连接中两台计算机之间的数据传输。
3. 网络层用来处理在网络上流动的数据包。
4. 链路层，用来处理连接网络的硬件部分。

- HTTP 协议的职责，生成对目标 web 服务器的 HTTP 请求报文
- tcp 协议的职责，为了方便通信，将 HTTP 请求报文分割成报文段
- IP 协议的职责，搜索对方的地址，一边中转一边传送
- TCP 协议的职责，从对方那里接收到的报文段，重组到达的报文段，按序号以原来的顺序重组请求报文

### 66.了解一下 DNS

DNS 是域名解析系统，它的作用非常简单，就是根据域名查出对应的 IP 地址。

- 从根域名服务器查到顶级域名服务器的 NS 记录和 A 记录，IP 地址
- 从顶级域名服务器查到次级域名服务器的 NS 记录和 A 记录，IP 地址
- 从次级域名服务器查出主机名的 IP 地址

![https://user-gold-cdn.xitu.io/2020/7/3/173155d817197fff?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173155d817197fff?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![https://user-gold-cdn.xitu.io/2020/7/3/173155dc6d0880a4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/7/3/173155dc6d0880a4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
