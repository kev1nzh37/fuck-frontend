---
title: 浏览器和DOM
order: 2
---

# 浏览器和 DOM

![浏览器和DOM.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41f602f7310847dbac6406e454221e4d~tplv-k3u1fbpfcp-watermark.image)

## CDN

### 如何判断是否是 CDN？

#### http 响应头里会有 X 开头的标头（X-Cache)

### 什么是 CDN?

#### 类似京东快递，在就近的地方都有分配全国智能仓，每个仓库都有一部分自营的货物，

你下单了之后，会从离你最近的仓库发货。

### CDN 的访问过程

#### 1. 访问 DNS，找到缓存或者迭代去找 IP。 

#### 2. 这里的 IP 是 CDN 的负载均衡系统的 IP。

#### 3.  局负载均衡系统会根据客户端的 IP 地址和请求的 url 和相应的区域负载均衡系统通信

#### 4.  区域负载均衡系统拿着这两个东西获取距离客户端最近且有相应资源的 cdn 缓存服务器的地址，

返回给全局负载均衡系统

#### 5. .全局负载均衡系统返回确定的 cdn 缓存服务器的地址给客户端。

#### 6.  客户端请求缓存服务器上的文件

### 回源

#### 当 cdn 缓存服务器中没有符合客户端要求的资源的时候，

缓存服务器会请求上一级缓存服务器，以此类推，直到获取到。
最后如果还是没有，就会回到我们自己的服务器去获取资源。

#### 如何导致回源？

##### 没有资源，资源过期，访问的资源是不缓存资源等都会导致回源

## DNS

### 解析过程

#### 第一步：检查浏览器缓存中是否缓存过该域名对应的 IP 地址

#### 第二步：如果在浏览器缓存中没有找到 IP，那么将继续查找本机系统是否缓存过 IP

#### 第三步：向本地域名解析服务系统发起域名解析的请求

#### 第四步：向根域名解析服务器发起域名解析请求

#### 第五步：根域名服务器返回 gTLD 域名解析服务器地址

#### 第六步：向 gTLD 服务器发起解析请求

#### 第七步：gTLD 服务器接收请求并返回 Name Server 服务器

#### 第八步：Name Server 服务器返回 IP 地址给本地服务器

#### 第九步：本地域名服务器缓存解析结果

#### 第十步：返回解析结果给用户

## 缓存

### 页面的缓存状态是由 header 决定的

### 强缓存/协商缓存

#### 强缓存

##### 强缓存：是当我们访问 URL 的时候，不会向服务器发送请求，直接从缓存中读取资源，但是会返回 200 的状态码。

##### Cache-Control

###### max-age

##### （单位为 s）指定设置缓存最大的有效时间，定义的是时间长短。

当浏览器向服务器发送请求后，在 max-age 这段时间里浏览器就不会再向服务器发送请求了。

##### 在有效时间内都会使用这个版本的资源，即使服务器上的资源发生了变化，浏览器也不会得到通知。

##### max-age 会覆盖掉 Expires

###### s-maxage

##### 同 max-age，只用于共享缓存（比如 CDN 缓存）

###### no-cache

##### 指定不缓存响应，表明资源不进行缓存

##### 设置了 no-cache 之后并不代表浏览器不缓存，而是在缓存前要向服务器确认资源是否被更改。

因此有的时候只设置 no-cache 防止缓存还是不够保险，还可以加上 private 指令，将过期时间设为过去的时间。

###### public/private

##### 响应会被缓存/响应只作为私有的缓存

##### 默认 public

###### no-store

##### 绝对禁止缓存，每次都会从服务器获取请求。

###### must-revalidate

##### 指定如果页面是过期的，则去服务器进行获取

##### Expires

###### 是 HTTP1.0 控制网页缓存的字段，值为一个时间戳，准确来讲是格林尼治时间，

服务器返回该请求结果缓存的到期时间，意思是，再次发送请求时，如果未超过过期时间，
直接使用该缓存，如果过期了则重新请求。

###### 缺点：就是它判断是否过期是用本地时间来判断的，本地时间是可以自己修改的。

##### pragma

###### 这个是 HTTP1.0 中禁用网页缓存的字段，其取值为 no-cache，和 Cache-Control 的 no-cache 效果一样。

#### 协商缓存

##### 协商缓存：协商缓存就是强缓存失效后，浏览器携带缓存标识向服务器发送请求，由服务器根据缓存标识来决定是否使用缓存的过程。

两种情况：
1.  协商缓存生效，返回 304
2.  协商缓存失效，返回 200 和请求结果

##### Last-Modified

###### 服务器响应请求时，返回该资源文件在服务器最后被修改的时间。

##### If-Modified-Since

###### If-Modified-Since 则是客户端再次发起该请求时，携带上次请求返回的 Last-Modified 值，

通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有 If-Modified-Since 字段，
则会根据 If-Modified-Since 的字段值与该资源在服务器的最后被修改时间做对比，
若服务器的资源最后被修改时间大于 If-Modified-Since 的字段值，则重新返回资源，状态码为 200；
否则则返回 304，代表资源无更新，可继续使用缓存文件。

##### ETag

###### 是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)。

###### 使用 ETag 可以解决 Last-modified 存在的一些问题

##### a、某些服务器不能精确得到资源的最后修改时间，这样就无法通过最后修改时间判断资源是否更新

##### b、如果资源修改非常频繁，在秒以下的时间内进行修改，而 Last-modified 只能精确到秒

##### c、一些资源的最后修改时间改变了，但是内容没改变，使用 ETag 就认为资源还是没有修改的。

###### ETag 计算

##### Nginx: 官方默认的 ETag 计算方式是为"文件最后修改时间 16 进制-文件长度 16 进制"。

例：ETag： “59e72c84-2404”
Express: Express 框架使用了 serve-static 中间件来配置缓存方案，其中，使用了一个叫 etag
的 npm 包来实现 etag 计算。
从其源码可以看出，有两种计算方式：
方式一：使用文件大小和修改时间
方式二：使用文件内容的 hash 值和内容长度

##### If-None-Match

###### 客户端再次发起该请求时，携带上次请求返回的唯一标识 Etag 值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。

服务器收到该请求后，发现该请求头中含有 If-None-Match，则会根据 If-None-Match 的字段值与该资源在服务器的 Etag 值做对比，
一致则返回 304，代表资源无更新，继续使用缓存文件；
不一致则重新返回资源文件，状态码为 200。

##### ETag 与 Last-Modified 谁优先

###### 在 Express 中，使用了 fresh

这个包来判断是否是最新的资源。

如果不是强制刷新，而且请求头带上了 if-modified-since 和 if-none-match 两个字段，
则先判断 etag，再判断 last-modified。

#### 强缓存与协商缓存的区别

##### 1. 强缓存不发请求到服务器，所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器，所以资源是否更新，服务器肯定知道。

##### 2. 大部分 web 服务器都默认开启协商缓存。

#### 刷新对于强缓存和协商缓存的影响

##### 1. 当 ctrl+f5 强制刷新网页时，直接从服务器加载，跳过强缓存和协商缓存。

##### 2. 当 f5 刷新网页时，跳过强缓存，但是会检查协商缓存。

##### 3. 浏览器地址栏中写入 URL，回车 浏览器发现缓存中有这个文件了，不用继续请求了，直接去缓存拿。（最快）

#### 缓存位置

##### 查找浏览器缓存时会按顺序查找

###### Service Worker

Memory Cache
Disk Cache
Push Cache。

##### Service Worker

###### 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker 的话，

传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。
Service Worker 的缓存与浏览器其他内建的缓存机制不同，
它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

##### Memory Cache

###### 内存中的缓存，主要包含的是当前中页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等。

读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。
一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

##### Disk Cache

###### 存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。

在所有浏览器缓存中，Disk Cache 覆盖面基本是最大的。它会根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，
哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，
就不会再次去请求数据。绝大部分的缓存都来自 Disk Cache。

memory cache 要比 disk cache 快的多。举个例子：从远程 web 服务器直接提取访问文件可能需要 500 毫秒(半秒)，那么磁盘访问可能需要 10-20 毫秒，
而内存访问只需要 100 纳秒，更高级的还有 L1 缓存访问(最快和最小的 CPU 缓存)只需要 0.5 纳秒。

##### prefetch cache(预取缓存)

###### ink 标签上带了 prefetch，再次加载会出现。

prefetch 是预加载的一种方式，被标记为 prefetch 的资源，将会被浏览器在空闲时间加载。

##### Push Cache

###### Push Cache（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。

它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，
在 Chrome 浏览器中只有 5 分钟左右，同时它也并非严格执行 HTTP 头中的缓存指令。

#### 最佳实践

##### 缓存的意义就在于减少请求，更多地使用本地的资源，给用户更好的体验的同时，也减轻服务器压力。

所以，最佳实践，就应该是尽可能命中强缓存，同时，能在更新版本的时候让客户端的缓存失效。

在更新版本之后，如何让用户第一时间使用最新的资源文件呢？机智的前端们想出了一个方法，
在更新版本的时候，顺便把静态资源的路径改了，这样，就相当于第一次访问这些资源，就不会存在缓存的问题了。

##### HTML：使用协商缓存。

CSS&JS&图片：使用强缓存，文件命名带上 hash 值。

##### hash：跟整个项目的构建相关，构建生成的文件 hash 值都是一样的，只要项目里有文件更改，整个项目构建的 hash 值都会更改。

chunkhash：根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的 hash 值。

contenthash：由文件内容产生的 hash 值，内容不同产生的 contenthash 值也不一样。

显然，我们是不会使用第一种的。改了一个文件，打包之后，其他文件的 hash 都变了，缓存自然都失效了。这不是我们想要的。
那 chunkhash 和 contenthash 的主要应用场景是什么呢？在实际在项目中，我们一般会把项目中的 css 都抽离出对应的 css 文件来加以引用。
如果我们使用 chunkhash，当我们改了 css 代码之后，会发现 css 文件 hash 值改变的同时，js 文件的 hash 值也会改变。这时候，contenthash 就派上用场了。

## Cooike

### cookie 是浏览器提供的功能。cookie  其实是存储在浏览器中的纯文本，

浏览器的安装目录下会专门有一个 cookie 文件夹来存放各个域下设置的 cookie。

### 每个域名下的 cookie 的大小最大为 4KB，每个域名下的 cookie 数量最多为 20 个

### JS 原生的 API 提供了获取 cookie 的方法：document.cookie

（注意，这个方法只能获取非 HttpOnly 类型的 cookie）。在 console 中执行这段代码可以看到结果如下图：
打印出的结果是一个字符串类型，因为 cookie 本身就是存储在浏览器中的字符串。
但这个字符串是有格式的，由键值对  key=value 构成，键值对之间由一个分号和一个空格隔开。

### cookie 的属性

#### cookie 选项包括：expires、domain、path、secure、HttpOnly。

以一个分号和一个空格分开。

#### expires：选项用来设置“cookie 什么时间内有效”。expires 其实是 cookie 失效日期，

expires 必须是  GMT  格式的时间（可以通过  new Date().toGMTString()或者  new Date().toUTCString()  来获得）。

于失效的 cookie 浏览器会清空。如果没有设置该选项，则默认有效期为 session，
即会话 cookie。这种 cookie 在浏览器关闭后就没有了。

#### domain 和 path：domain 是域名，path 是路径，两者加起来就构成了 URL，domain 和 path 一起来限制 cookie 能被哪些 URL 访问。

一句话概括：某 cookie 的  domain 为“baidu.com”, path 为“/ ”，若请求的 URL(URL 可以是 js/html/img/css 资源请求，
但不包括 XHR 请求)的域名是“baidu.com”或其子域如“api.baidu.com”、“dev.api.baidu.com”，
且 URL 的路径是“/ ”或子路径“/home”、“/home/login”，
则浏览器会将此 cookie 添加到该请求的 cookie 头部中。
所以 domain 和 path2 个选项共同决定了 cookie 何时被浏览器自动添加到请求头部中发送出去。
如果没有设置这两个选项，则会使用默认值。domain 的默认值为设置该 cookie 的网页所在的域名，
path 默认值为设置该 cookie 的网页所在的目录。

#### secure：secure 选项用来设置 cookie 只在确保安全的请求中才会发送。

当请求是 HTTPS 或者其他安全协议时，包含  secure  选项的  cookie  才能被发送至服务器。

#### httpOnly：这个选项用来设置 cookie 是否能通过  js  去访问。默认情况下，cookie 不会带 httpOnly 选项(即为空)，

所以默认情况下，客户端是可以通过 js 代码去访问（包括读取、修改、删除等）这个 cookie 的。
当 cookie 带 httpOnly 选项时，客户端则无法通过 js 代码去访问（包括读取、修改、删除等）这个 cookie。
在客户端是不能通过 js 代码去设置一个 httpOnly 类型的 cookie 的，这种类型的 cookie 只能通过服务端来设置。

### 如何设置 cookie

#### 服务端设置 cookie

不管你是请求一个资源文件（如 html/js/css/图片），还是发送一个 ajax 请求，服务端都会返回 response。
而 response header 中有一项叫 set-cookie，是服务端专门用来设置 cookie 的。服务端返回的 response header 中有 5 个 set-cookie 字段，
每个字段对应一个 cookie（注意不能将多个 cookie 放在一个 set-cookie 字段中），
set-cookie 字段的值就是普通的字符串，每个 cookie 还设置了相关属性选项。
注意：
一个 set-Cookie 字段只能设置一个 cookie，当你要想设置多个 cookie，需要添加同样多的 set-Cookie 字段。
服务端可以设置 cookie 的所有选项：expires、domain、path、secure、HttpOnly

#### 客户端设置 cookie

document.cookie = "name=Jonh; ";

### 什么时候 cookie 会被覆盖：name/domain/path 这 3 个字段都相同的时候

## CORS

### 什么是 CORS?

当一个资源从与该资源本身所在的服务器不同的域、协议、端口请求一个资源时，资源会发起一个跨域 HTTP 请求。

跨域资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。
另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，
或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），
从而获知服务端是否允许该跨域请求。

服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，
服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）。

浏览器将 CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

### 简单请求

#### 不会触发 CORS 预检的请求称为简单请求，满足以下所有条件的才会被视为简单请求，基本上我们日常开发只会关注前面两点

1. 使用 GET、POST、HEAD 其中一种方法
2. 只使用了如下的安全首部字段，不得人为设置其他首部字段
   （1）Accept
   （2）Accept-Language
   （3）Content-Language
   （4）Content-Type  仅限以下三种
       text/plain
       multipart/form-data
     application/x-www-form-urlencoded
   （5）HTML 头部 header field 字段：DPR、Download、Save-Data、Viewport-Width、WIdth

请求中的任意 XMLHttpRequestUpload  对象均没有注册任何事件监听器；
XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问
请求中没有使用 ReadableStream 对象

#### 基本流程

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 Origin 字段。

Origin 字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

如果 Origin 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含 Access-Control-Allow-Origin 字段，
就知道出错了，从而抛出一个错误，被 XMLHttpRequest 的 onerror 回调函数捕获。注意，这种错误无法通过状态码识别，因为 HTTP 回应的状态码有可能是 200。

#### 如果 Origin 指定的域名在许可范围内，

服务器返回的响应，会多出几个头信息字段。

##### Access-Control-Allow-Origin：  该字段是必须的。它的值要么是请求时 Origin 字段的值，要么是一个\*，表示接受任意域名的请求。

##### Access-Control-Allow-Credentials：该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。

设为 true，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。这个值也只能设为 true，如果服务器不要浏览器发送 Cookie，删除该字段即可。

##### Access-Control-Expose-Headers：字段可选。

CORS 请求时，XMLHttpRequest 对象的 getResponseHeader()方法只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、
Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。
上面的例子指定，getResponseHeader('FooBar')可以返回 FooBar 字段的值。

#### withCredentials

##### 如果发起请求时设置 withCredentials  标志设置为  true，从而向服务器发送 cookie，

但是如果服务器端的响应中未携带 Access-Control-Allow-Credentials: true，浏览器将不会把响应内容返回给请求的发送者
对于附带身份凭证的请求，服务器不得设置  Access-Control-Allow-Origin  的值为\*， 必须是某个具体的域名
注意，简单 GET 请求不会被预检；
如果对此类带有身份凭证请求的响应中不包含该字段，这个响应将被忽略掉，并且浏览器也不会将相应内容返回给网页

### 非简单请求

#### 预检请求的发送

##### "预检"请求用的请求方法是 OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是 Origin，表示请求来自哪个源。

除了 Origin 字段，"预检"请求的头信息包括两个特殊字段。
（1）Access-Control-Request-Method
该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法，上例是 PUT。
（2）Access-Control-Request-Headers
该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字

#### 预检请求的回应

##### 服务器收到"预检"请求以后，检查了 Origin、Access-Control-Request-Method

和 Access-Control-Request-Headers 字段以后，确认允许跨源请求，就可以做出回应。

##### Access-Control-Allow-Methods：该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。

注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

##### Access-Control-Allow-Headers：如果浏览器请求包括 Access-Control-Request-Headers 字段，则 Access-Control-Allow-Headers 字段是必需的。

它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

##### Access-Control-Allow-Credentials：该字段与简单请求时的含义相同。

##### Access-Control-Max-Age：该字段可选，用来指定本次预检请求的有效期，单位为秒。

上面结果中，有效期是 20 天（1728000 秒），即允许缓存该条回应 1728000 秒（即 20 天），在此期间，不用发出另一条预检请求。

### 与 JSONP 的比较

#### CORS 与 JSONP 的使用目的相同，但是比 JSONP 更强大。

JSONP 只支持 GET 请求，CORS 支持所有类型的 HTTP 请求。
JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。

## DOM 操作

### 创建节点

#### 1. document.createElement(tagname)

创建一个由 tagName 决定的 HTML 元素

#### 2. document.createTextNode(data)

创建一个文本节点，文本内容为 data

#### 3. document.createDocumentFragment()

创建一个空白的文档片段。文档片段是 DocumentFragment 对象的引用。是 DOM 节点，但并不是主 DOM 树的一部分。一般利用文档片段创建一个临时节点，
将需要添加到 DOM 树中的节点先添加到文档片段中，再将文档片段添加到 DOM 树中，这个时候文档片段中的子元素会替换文档片段。
由于文档片段是存在于内存中的，所以将子元素添加到文档片段中不会引起 reflow(回流) 。能够起到性能优化的效果。

### 通过节点关系获取节点

#### 1. Node.parentNode

返回指定节点在 DOM 树中的父节点。

#### 2. Node.parentElement

返回指定节点在 DOM 树中的父元素节点，如果没有父元素或者父元素不是一个元素节点，则返回 null。

#### 3. Node.childNodes

返回指定节点的所有子元素的集合。包括文本节点等。

#### 4. Node.children

返回指定节点的所有子元素的集合。只包含元素节点。

#### 5. Node.nextSibling

返回指定节点的下一个兄弟节点。包括文本节点等。

#### 6. Node.nextElementSibling

返回指定节点的下一个兄弟元素节点。

#### 7. Node.previousSibling

返回指定节点的上一个兄弟节点。包括文本节点等。

#### 8. Node.previousElementSibling

返回指定节点的上一个兄弟元素节点。

#### 9. Node.firstChild

返回指定节点的第一个子节点。包括文本节点等。

#### 10. Node.firstElementChild

返回指定节点的第一个子元素节点。

#### 11. Node.lastChild

返回指定节点的最后一个子节点。包括文本节点等。

#### 12. Node.lastElementChild

返回指定节点的最后一个子元素节点。

### 节点操作

#### 1. Node.appendChild()

将一个节点添加到指定节点的子节点列表的末尾。

#### 2. Node.removeChild()

将一个节点从 DOM 树中移除。移除后还存在于内存中，还可以继续添加到 DOM 树中。

#### 3. Node.insertBefore()

在当前节点的某个子节点之前再插入一个子节点。

#### 4. Node.replaceChild()

用指定节点替换当前节点的一个子节点，返回被替换掉的节点。

### 节点选择

#### 1. document.querySelector(selectors)

selectors 是一个字符串，包含一个或多个 css 选择器。返回获取到的元素。

#### 2. document.querySelectorAll(selectors)

和 querySelector 用法类似，只是返回值为 NodeList 对象。

#### 3. document.getElementById()

根据元素 ID 获取元素。

#### 4. document.getElementsByTagName()

根据元素标签名获取元素，返回值为 HTMLCollection 集合。

#### 5. document.getElementsByName()

根据元素 name 属性获取元素，返回值为 NodeList 对象。

#### 6. document.getElementsByClassname()

根据元素类名获取元素，返回值为 HTMLCollection 集合。

### 属性操作

#### 1. element.setAttribute(name /_属性名_/, value /_属性值_/)

给元素设置属性。如果该属性已存在，则更新。

#### 2. element.removeAttribute(attrName /_要删除的属性名_/)

删除元素的某个属性。

#### 3. element.getAttribute(attrName)

获取元素上属性名为 attrName 属性的值。如果该属性名不存在则放回 null 或者 ''空字符串。

#### 4. element.hasAttribute(attrName)

检测该元素上是否有该属性。返回值为 true or false。

### DOM 事件

#### 1. element.addEventListener(type, listener, [, options])

给元素添加指定事件 type 以及响应该事件的回调函数 listener。

#### 2. element.removeEventListener(type, listener, [, options])

移除元素上指定事件，如果元素上分别在捕获和冒泡阶段都注册了事件，需要分别移除。

#### 3. document.createEvent()

创建一个自定义事件，随后必须使用 init 进行初始化。

#### 4. element.dispatchEvent(event)

对指定元素触发一个事件。
elem.disapcthEvent(new Event('click'));

### 元素样式尺寸

#### 1. window.getComputedStyle(elem)

获取 elem 所有应用了 css 后的属性值。返回一个实时的 CSSStyleDeclaration 对象。

#### 2. elem.getBoundingClientRect()

返回元素的大小以及相对于视口的位置。返回一个 DOMRect 对象。包括元素的 left right top bottom width height x y 属性值。
