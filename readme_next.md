如何使用
安装它：
npm install --save next react react-dom
并在您的package.json中添加一个脚本，如下所示：

{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
之后，文件系统是主API。每个.js文件都成为自动处理和呈现的路径。

填充./pages/index.js项目内部：

export default () => <div>Welcome to next.js!</div>
然后跑去npm run dev跑去http://localhost:3000。要使用其他端口，您可以运行npm run dev -- -p <your port here>。

到目前为止，我们得到：

自动转换和捆绑（使用webpack和babel）
热门代码重装
服务器渲染和索引 ./pages
静态文件服务。./static/映射到/static/（给定您在项目中创建./static/目录）
要查看这是多么简单，请查看示例应用程序 - nextgram

自动代码拆分
import您宣布的每一个都会捆绑在一起并与每个页面一起提供。这意味着页面从不加载不必要的代码

import cowsay from 'cowsay-browser'

export default () => (
  <pre>
    {cowsay.say({ text: 'hi there!' })}
  </pre>
)
CSS
内置CSS支持
例子
我们捆绑了styled-jsx以支持隔离的范围CSS。目的是支持类似于Web Components的“shadow CSS”，遗憾的是它不支持服务器渲染并且只支持JS。

export default () => (
  <div>
    Hello world
    <p>scoped!</p>
    <style jsx>{`
      p {
        color: blue;
      }
      div {
        background: red;
      }
      @media (max-width: 600px) {
        div {
          background: blue;
        }
      }
    `}</style>
    <style global jsx>{`
      body {
        background: black;
      }
    `}</style>
  </div>
)
有关更多示例，请参阅styled-jsx文档。

CSS-在-JS
例子
可以使用任何现有的CSS-in-JS解决方案。最简单的是内联样式：

export default () => <p style={{ color: 'red' }}>hi there</p>
要使用更复杂的CSS-in-JS解决方案，通常必须为服务器端呈现实现样式刷新。我们通过允许您定义包装每个页面的自定义<Document>组件来实现此功能。

导入CSS / Sass / Less / Stylus文件
为了支持导入.css，.scss，.less或.styl文件，你可以使用这些模块，配置服务器渲染应用合理的默认值。

@时代周报/下一CSS
@时代周报/下一萨斯
@时代周报/下一少
@时代周报/下一手写笔
静态文件服务（例如：图像）
创建static项目根目录中调用的文件夹。然后，您可以从代码中引用带有/static/URL的文件：

export default () => <img src="/static/my-image.png" alt="my image" />
注意：不要将static目录命名为其他任何名称。该名称是必需的，是Next.js用于提供静态资产的唯一目录。

填充 <head>
例子
我们公开了一个内置组件，用于将元素附加到<head>页面。

import Head from 'next/head'

export default () => (
  <div>
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <p>Hello world!</p>
  </div>
)
为避免重复标记，您<head>可以使用该key属性，这将确保标记仅呈现一次：

import Head from 'next/head'

export default () => (
  <div>
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
    </Head>
    <Head>
      <meta name="viewport" content="initial-scale=1.2, width=device-width" key="viewport" />
    </Head>
    <p>Hello world!</p>
  </div>
)
在这种情况下，只<meta name="viewport" />渲染第二个。

注意：<head>在卸载组件时清除get 的内容，因此请确保每个页面完全定义它所需的内容<head>，而不要假设其他页面添加了什么

获取数据和组件生命周期
例子
当您需要状态，生命周期挂钩或初始数据填充时，您可以导出React.Component（而不是无状态函数，如上所示）：

import React from 'react'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  render() {
    return (
      <div>
        Hello World {this.props.userAgent}
      </div>
    )
  }
}
请注意，要在页面加载时加载数据，我们使用的getInitialProps是async静态方法。它可以异步获取解析为Object填充的JavaScript平面的任何内容props。

返回的数据getInitialProps在服务器渲染时被序列化，类似于JSON.stringify。确保返回的对象getInitialProps是普通的Object而不是使用Date，Map或Set。

对于初始页面加载，getInitialProps仅在服务器上执行。getInitialProps只有在通过Link组件导航到不同路径或使用路由API 时才会在客户端上执行。

注：getInitialProps能不能在孩子组件使用。只在pages。


如果您在内部使用某些仅服务器模块getInitialProps，请确保正确导入它们。否则，它会减慢你的应用程序。


您还可getInitialProps以为无状态组件定义生命周期方法：

const Page = ({ stars }) =>
  <div>
    Next stars: {stars}
  </div>

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
getInitialProps 接收具有以下属性的上下文对象：

pathname - URL的路径部分
query - 解析为对象的URL的查询字符串部分
asPath- String浏览器中显示的实际路径（包括查询）
req - HTTP请求对象（仅限服务器）
res - HTTP响应对象（仅限服务器）
jsonPageRes- 获取响应对象（仅限客户端）
err - 如果在渲染过程中遇到任何错误，则为Error对象
路由
同 <Link>
例子
可以通过<Link>组件启用路由之间的客户端转换。考虑这两页：

// pages/index.js
import Link from 'next/link'

export default () => (
  <div>
    Click{' '}
    <Link href="/about">
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
)
// pages/about.js
export default () => <p>Welcome to About!</p>
注意：用于<Link prefetch>获得最佳性能，同时在后台链接和预取

客户端路由的行为与浏览器完全相同：

获取组件
如果定义getInitialProps，则获取数据。如果发生错误，_error.js则呈现
在完成1和2之后，pushState执行并呈现新组件
要注入pathname，query或asPath在组件中，您可以使用withRouter。

使用URL对象
例子
该组件<Link>还可以接收URL对象，它将自动对其进行格式化以创建URL字符串。

// pages/index.js
import Link from 'next/link'

export default () => (
  <div>
    Click{' '}
    <Link href={{ pathname: '/about', query: { name: 'Zeit' } }}>
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
)
这将生成URL字符串/about?name=Zeit，您可以使用Node.js URL模块文档中定义的每个属性。

替换而不是推送网址
<Link>组件的默认行为是到push堆栈中的新URL。您可以使用replaceprop来阻止添加新条目。

// pages/index.js
import Link from 'next/link'

export default () => (
  <div>
    Click{' '}
    <Link href="/about" replace>
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
)
使用支持的组件 onClick
<Link>支持任何支持该onClick事件的组件。如果您不提供<a>标记，它将只添加onClick事件处理程序，并且不会传递该href属性。

// pages/index.js
import Link from 'next/link'

export default () => (
  <div>
    Click{' '}
    <Link href="/about">
      <img src="/static/image.png" alt="image" />
    </Link>
  </div>
)
强制链接暴露href给其子级
如果child是<a>标记但没有href属性，我们将其指定，以便用户不需要重复。但是，有时候，您需要<a>在包装器内部传递标签，并且不会将其Link识别为超链接，因此不会将其传输href给子项。在这种情况下，您应该passHref为其定义一个布尔属性Link，强制它将其href属性暴露给子级。

请注意：使用非标记a和未通过的标记passHref可能会导致链接看起来正确导航，但是，当被搜索引擎抓取时，将不会被识别为链接（由于缺少href属性）。这可能会对您的网站SEO造成负面影响。

import Link from 'next/link'
import Unexpected_A from 'third-library'

export default ({ href, name }) => (
  <Link href={href} passHref>
    <Unexpected_A>
      {name}
    </Unexpected_A>
  </Link>
)
禁用滚动更改为页面顶部
默认行为<Link>是滚动到页面顶部。当定义了散列时，它将滚动到特定的id，就像普通<a>标签一样。为了防止滚动到顶部/哈希scroll={false}可以添加到<Link>：

<Link scroll={false} href="/?counter=10"><a>Disables scrolling</a></Link>
<Link href="/?counter=10"><a>Changes with scrolling to top</a></Link>
势在必行
例子
您还可以使用。进行客户端页面转换 next/router

import Router from 'next/router'

export default () => (
  <div>
    Click <span onClick={() => Router.push('/about')}>here</span> to read more
  </div>
)
拦截 popstate
在某些情况下（例如，如果使用自定义路由器），您可能希望popstate在路由器对其进行操作之前进行监听并做出反应。例如，您可以使用它来操纵请求，或强制SSR刷新。

import Router from 'next/router'

Router.beforePopState(({ url, as, options }) => {
  // I only want to allow these two routes!
  if (as !== "/" || as !== "/other") {
    // Have SSR render bad routes as a 404.
    window.location.href = as
    return false
  }

  return true
});
如果你从中返回一个假值beforePopState，Router将不会处理popstate; 在这种情况下，你将负责处理它。请参阅禁用文件系统路由。

以上Router对象附带以下API：

route- String目前的路线
pathname- String排除查询字符串的当前路径
query- Object使用已解析的查询字符串。默认为{}
asPath- String浏览器中显示的实际路径（包括查询）
push(url, as=url)- pushState使用给定的网址执行呼叫
replace(url, as=url)- replaceState使用给定的网址执行呼叫
beforePopState(cb=function) - intercept popstate before router processes the event.
The second as parameter for push and replace is an optional decoration of the URL. Useful if you configured custom routes on the server.

With URL object
You can use an URL object the same way you use it in a <Link> component to push and replace an URL.

import Router from 'next/router'

const handler = () => {
  Router.push({
    pathname: '/about',
    query: { name: 'Zeit' }
  })
}

export default () => (
  <div>
    Click <span onClick={handler}>here</span> to read more
  </div>
)
This uses the same exact parameters as in the <Link> component.

Router Events
You can also listen to different events happening inside the Router. Here's a list of supported events:

routeChangeStart(url) - Fires when a route starts to change
routeChangeComplete(url) - Fires when a route changed completely
routeChangeError(err, url) - Fires when there's an error when changing routes
beforeHistoryChange(url) - Fires just before changing the browser's history
hashChangeStart(url) - Fires when the hash will change but not the page
hashChangeComplete(url) - 哈希更改但不是页面时触发
这url是浏览器中显示的URL。如果你打电话Router.push(url, as)（或类似），则该值url会as。

以下是如何正确收听路由器事件routeChangeStart：

const handleRouteChange = url => {
  console.log('App is changing to: ', url)
}

Router.events.on('routeChangeStart', handleRouteChange)
如果您不想再听取该事件，可以取消订阅该off方法：

Router.events.off('routeChangeStart', handleRouteChange)
如果取消路径加载（例如，通过连续快速单击两个链接），routeChangeError将触发。传递err将包含cancelled设置为的属性true。

Router.events.on('routeChangeError', (err, url) => {
  if (err.cancelled) {
    console.log(`Route to ${url} was cancelled!`)
  }
})
浅路由
例子
浅路由允许您在不运行的情况下更改URL getInitialProps。您将收到更新pathname并query通过url加载的同一页面的支柱，而不会丢失状态。

您可以通过调用Router.push或Router.replace使用该shallow: true选项来执行此操作。这是一个例子：

// Current URL is "/"
const href = '/?counter=10'
const as = href
Router.push(href, as, { shallow: true })
现在，URL已更新为/?counter=10。您可以在this.props.router.query里面看到更新的URL Component（确保您正在使用withRouter您Component的注入router支柱）。

您可以通过componentDidUpdate钩子观察URL更改，如下所示：

componentDidUpdate(prevProps) {
  const { pathname, query } = this.props.router
  // verify props have changed to avoid an infinite loop
  if (query.id !== prevProps.router.query.id) {
    // fetch data based on the new query
  }
}
笔记：

浅路由仅适用于相同的页面URL更改。举个例子，我们假设我们有一个名为的另一个页面about，你运行它：

Router.push('/?counter=10', '/about?counter=10', { shallow: true })
由于这是一个新页面，它将卸载当前页面，加载新页面并调用getInitialProps即使我们要求进行浅层路由。

使用更高阶的组件
例子
如果要访问router应用程序中任何组件内的对象，可以使用withRouter高阶组件。以下是如何使用它：

import { withRouter } from 'next/router'

const ActiveLink = ({ children, router, href }) => {
  const style = {
    marginRight: 10,
    color: router.pathname === href? 'red' : 'black'
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default withRouter(ActiveLink)
上面的router对象附带了一个类似的API next/router。

预取页面
⚠️这是一个仅限制作的功能⚠️

例子
Next.js有一个API，允许您预取页面。

由于Next.js服务器呈现您的页面，因此您的应用程序的所有未来交互路径都是即时的。有效的Next.js为您提供了一个网站的良好的初始下载性能，具有应用程序的提前下载功能。阅读更多。

预取Next.js只下载JS代码。在呈现页面时，您可能需要等待数据。

同 <Link>
您可以将prefetchprop 添加到任何<Link>和Next.js将在后台预取这些页面。

import Link from 'next/link'

// example header component
export default () => (
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/about">
          <a>About</a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/contact">
          <a>Contact</a>
        </Link>
      </li>
    </ul>
  </nav>
)
势在必行
大多数预取需求都由<Link />我们解决，但我们还公开了一个用于高级用法的命令式API：

import { withRouter } from 'next/router'

export default withRouter(({ router }) => (
  <div>
    <a onClick={() => setTimeout(() => router.push('/dynamic'), 100)}>
      A route transition will happen after 100ms
    </a>
    {// but we can prefetch it!
    router.prefetch('/dynamic')}
  </div>
)
路由器实例应仅在应用程序的客户端内部使用。为了防止有关此主题的任何错误，在服务器端呈现路由器时，请在componentDidMount()生命周期方法中使用强制预取方法。

import React from 'react'
import { withRouter } from 'next/router'

class MyLink extends React.Component {
  componentDidMount() {
    const { router } = this.props
    router.prefetch('/dynamic')
  }

  render() {
    const { router } = this.props

    return (
       <div>
        <a onClick={() => setTimeout(() => router.push('/dynamic'), 100)}>
          A route transition will happen after 100ms
        </a>
      </div>
    )
  }
}

export default withRouter(MyLink)
自定义服务器和路由
例子
通常，您启动下一个服务器next start。但是，可以100％以编程方式启动服务器，以便自定义路由，使用路由模式等。

将自定义服务器与服务器文件一起使用时，例如调用server.js，请确保更新脚本键入package.json：

{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
此示例/a解析./pages/b并/b解决./pages/a：

// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/b', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
该nextAPI如下：

next(opts: object)
支持的选项：

dev（bool）是否以开发模式启动Next.js - 默认false
dir（string）下一个项目所在的位置 - 默认'.'
quiet（bool）隐藏包含服务器信息的错误消息 - 默认false
conf（object）你将使用的相同对象next.config.js- 默认{}
然后，将start脚本更改为NODE_ENV=production node server.js。

禁用文件系统路由
默认情况下，Next将在/pages与文件名匹配的路径名下提供每个文件（例如，/pages/some-file.js在服务于site.com/some-file。

如果您的项目使用自定义路由，则此行为可能导致从多个路径提供相同的内容，这可能会导致SEO和UX出现问题。

要禁用此行为并阻止基于文件的路由/pages，只需在以下选项中设置以下选项next.config.js：

// next.config.js
module.exports = {
  useFileSystemPublicRoutes: false
}
注意，useFileSystemPublicRoutes只需从SSR禁用文件名路由; 客户端路由仍然可以访问这些路径。如果使用此选项，则应防止以编程方式导航到您不想要的路由。

您可能还希望将客户端路由器配置为禁止客户端重定向到文件名路由; 请参阅拦截popstate。

动态assetPrefix
有时我们需要assetPrefix动态设置。在assetPrefix根据传入请求更改时，这很有用。为此，我们可以使用app.setAssetPrefix。

以下是它的一个示例用法：

const next = require('next')
const micro = require('micro')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handleNextRequests = app.getRequestHandler()

app.prepare().then(() => {
  const server = micro((req, res) => {
    // Add assetPrefix support based on the hostname
    if (req.headers.host === 'my-app.com') {
      app.setAssetPrefix('http://cdn.com/myapp')
    } else {
      app.setAssetPrefix('')
    }

    handleNextRequests(req, res)
  })

  server.listen(port, (err) => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
动态导入
例子
Next.js支持JavaScript的TC39 动态导入提议。有了它，您可以动态导入JavaScript模块（包括React组件）并使用它们。

您可以将动态导入视为将代码拆分为可管理块的另一种方法。由于Next.js支持使用SSR进行动态导入，因此您可以使用它做出惊人的事情。

以下是使用动态导入的几种方法。

1.基本用法（也是SSR）
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/hello'))

export default () => (
  <div>
    <Header />
    <DynamicComponent />
    <p>HOME PAGE is here!</p>
  </div>
)
2.使用自定义加载组件
import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(() => import('../components/hello2'), {
  loading: () => <p>...</p>
})

export default () => (
  <div>
    <Header />
    <DynamicComponentWithCustomLoading />
    <p>HOME PAGE is here!</p>
  </div>
)
3.没有SSR
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/hello3'), {
  ssr: false
})

export default () => (
  <div>
    <Header />
    <DynamicComponentWithNoSSR />
    <p>HOME PAGE is here!</p>
  </div>
)
4.一次使用多个模块
import dynamic from 'next/dynamic'

const HelloBundle = dynamic({
  modules: () => {
    const components = {
      Hello1: () => import('../components/hello1'),
      Hello2: () => import('../components/hello2')
    }

    return components
  },
  render: (props, { Hello1, Hello2 }) =>
    <div>
      <h1>
        {props.title}
      </h1>
      <Hello1 />
      <Hello2 />
    </div>
})

export default () => <HelloBundle title="Dynamic Bundle" />
习惯 <App>
例子
Next.js使用该App组件初始化页面。您可以覆盖它并控制页面初始化。这可以让你做出惊人的事情：

在页面更改之间保持布局
导航页面时保持状态
使用自定义错误处理 componentDidCatch
将其他数据注入页面（例如，通过处理GraphQL查询）
要覆盖，请创建./pages/_app.js文件并覆盖App类，如下所示：

import React from 'react'
import App, { Container } from 'next/app'

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}
习惯 <Document>
例子
在服务器端呈现
用于更改初始服务器端呈现的文档标记
通常用于为css-in-js库实现服务器端渲染，如样式组件，迷人或情感。默认情况下，styled-jsx包含在Next.js中。
页面Next.js跳过周围文档标记的定义。例如，您永远不会包含<html>，<body>等。要覆盖该默认行为，您必须创建一个文件./pages/_document.js，您可以在其中扩展Document该类：

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
该ctx对象相当于在所有getInitialProps钩子中收到的对象，另外一个：

renderPage（Function）一个回调，执行实际的React渲染逻辑（同步）。装饰这个函数是有用的，以支持像Aphrodite的服务器渲染包装器renderStatic
Note: React-components outside of <Main /> will not be initialised by the browser. Do not add application logic here. If you need shared components in all your pages (like a menu or a toolbar), take a look at the App component instead.

Custom error handling
404 or 500 errors are handled both client and server side by a default component error.js. If you wish to override it, define a _error.js in the pages folder:

import React from 'react'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    return (
      <p>
        {this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }
}
Reusing the built-in error page
If you want to render the built-in error page you can by using next/error:

import React from 'react'
import Error from 'next/error'
import fetch from 'isomorphic-unfetch'

export default class Page extends React.Component {
  static async getInitialProps() {
    const res = await fetch('https://api.github.com/repos/zeit/next.js')
    const statusCode = res.statusCode > 200 ? res.statusCode : false
    const json = await res.json()

    return { statusCode, stars: json.stargazers_count }
  }

  render() {
    if (this.props.statusCode) {
      return <Error statusCode={this.props.statusCode} />
    }

    return (
      <div>
        Next stars: {this.props.stars}
      </div>
    )
  }
}
If you have created a custom error page you have to import your own _error component instead of next/error

Custom configuration
For custom advanced behavior of Next.js, you can create a next.config.js in the root of your project directory (next to pages/ and package.json).

注意：next.config.js是一个常规的Node.js模块，而不是一个JSON文件。它将被Next服务器和构建阶段使用，而不会包含在浏览器构建中。

// next.config.js
module.exports = {
  /* config options here */
}
或使用功能：

module.exports = (phase, {defaultConfig}) => {
  //
  // https://github.com/zeit/
  return {
    /* config options here */
  }
}
phase是加载配置的当前上下文。您可以在此处查看所有阶段：常量 阶段可以从next/constants以下位置导入：

const {PHASE_DEVELOPMENT_SERVER} = require('next/constants')
module.exports = (phase, {defaultConfig}) => {
  if(phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
    }
  }

  return {
    /* config options for all phases except development here */
  }
}
设置自定义构建目录
您可以指定用于自定义生成目录的名称。例如，以下配置将创建build文件夹而不是.next文件夹。如果未指定配置，则接下来将创建一个.next文件夹。

// next.config.js
module.exports = {
  distDir: 'build'
}
禁用etag生成
您可以根据缓存策略禁用HTML页面的etag生成。如果未指定配置，则Next将为每个页面生成etags。

// next.config.js
module.exports = {
  generateEtags: false
}
配置onDemandEntries
接下来介绍一些选项，这些选项可以让您控制服务器如何处置或保留内存页面：

module.exports = {
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  }
}
这是仅限开发的功能。如果要在生产中缓存SSR页面，请参阅SSR缓存示例。

在解析页面时配置扩展名 pages
针对类似的模块@zeit/next-typescript，增加了对结尾的页面的支持.ts。pageExtensions允许您pages在解析页面时配置目录中查找的扩展名。

// next.config.js
module.exports = {
  pageExtensions: ['jsx', 'js']
}
配置构建ID
Next.js使用在构建时生成的常量来标识正在提供的应用程序的哪个版本。next build在每台服务器上运行时，这可能会导致多服务器部署出现问题。为了在构建之间保留静态构建ID，您可以提供以下generateBuildId功能：

// next.config.js
module.exports = {
  generateBuildId: async () => {
    // For example get the latest git commit hash here
    return 'my-build-id'
  }
}
自定义webpack配置
例子
一些常见的功能可用作模块：

@时代周报/下一CSS
@时代周报/下一萨斯
@时代周报/下一少
@时代周报/下一preact
@时代周报/下一打字稿
警告：该webpack功能执行两次，一次用于服务器，一次用于客户端。这允许您使用isServer属性区分客户端和服务器配置

多种配置可以与功能组合组合在一起。例如：

const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')

module.exports = withTypescript(withSass({
  webpack(config, options) {
    // Further custom configuration here
    return config
  }
}))
为了扩展我们的使用范围webpack，您可以定义一个扩展其配置的函数next.config.js。

// next.config.js is not transformed by Babel. So you can only use javascript features supported by your version of Node.js.

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config
  }
}
第二个参数webpack是一个包含自定义WebPack配置时有用的属性的对象：

buildId- String构建标识，用作构建之间的唯一标识符
dev - Boolean shows if the compilation is done in development mode
isServer - Boolean shows if the resulting configuration will be used for server side (true), or client size compilation (false).
defaultLoaders - Object Holds loader objects Next.js uses internally, so that you can use them in custom configuration

babel - Object the babel-loader configuration for Next.js.
hotSelfAccept - Object the hot-self-accept-loader configuration. This loader should only be used for advanced use cases. For example @zeit/next-typescript adds it for top-level typescript pages.
Example usage of defaultLoaders.babel:

// Example next.config.js for adding a loader that depends on babel-loader
// This source was taken from the @zeit/next-mdx plugin source:
// https://github.com/zeit/next-plugins/blob/master/packages/next-mdx
module.exports = {
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options
        }
      ]
    })

    return config
  }
}
Customizing babel config
Examples
In order to extend our usage of babel, you can simply define a .babelrc file at the root of your app. This file is optional.

如果找到，我们将把它视为真理的来源，因此它需要定义下一个需要的东西，这是next/babel预设。

这样设计使您不会对我们可以对babel配置进行的修改感到惊讶。

这是一个示例.babelrc文件：

{
  "presets": ["next/babel"],
  "plugins": []
}
该next/babel预设包括对transpile阵营应用所需的一切。这包括：

预设ENV
预设反应
插件，建议类的属性
插件，建议对象休息扩
插件 - 转换 - 运行
风格，JSX
这些预设/插件不应添加到您的自定义中.babelrc。相反，您可以在next/babel预设上配置它们：

{
  "presets": [
    ["next/babel", {
      "preset-env": {},
      "transform-runtime": {},
      "styled-jsx": {},
      "class-properties": {}
    }]
  ],
  "plugins": []
}
在modules上选项"preset-env"应保持false否则的WebPack代码分担。

将配置公开给服务器/客户端
该next/config模块使您的应用程序可以访问存储在您的next.config.js。将任何仅服务器运行时配置放在serverRuntimeConfig属性下，以及客户端和服务器端代码都可访问的任何内容publicRuntimeConfig。

// next.config.js
module.exports = {
  serverRuntimeConfig: { // Will only be available on the server side
    mySecret: 'secret'
  },
  publicRuntimeConfig: { // Will be available on both server and client
    staticFolder: '/static',
    mySecret: process.env.MY_SECRET // Pass through env variables
  }
}
// pages/index.js
import getConfig from 'next/config'
// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

console.log(serverRuntimeConfig.mySecret) // Will only be available on the server side
console.log(publicRuntimeConfig.staticFolder) // Will be available on both server and client

export default () => <div>
  <img src={`${publicRuntimeConfig.staticFolder}/logo.png`} alt="logo" />
</div>
在备用主机名上启动服务器
要使用其他默认主机名启动开发服务器，您可以使用--hostname hostname_here或-H hostname_here选择下一个dev。这将启动TCP服务器侦听所提供主机上的连接。

CDN支持资产前缀
要设置CDN，您可以设置assetPrefix设置并配置CDN的来源以解析托管Next.js的域。

const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  // You may only need to add assetPrefix in the production.
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : ''
}
注意：Next.js将在它加载的脚本中自动使用该前缀，但这对任何情况都没有影响/static。如果您想通过CDN提供这些资产，您必须自己引入前缀。本示例中介绍了一种引入在组件内部工作且因环境而异的前缀的方法。

生产部署
要部署而不是运行next，您需要提前构建生产用途。因此，构建和启动是单独的命令：

next build
next start
例如，建议使用now以下package.json类似部署：

{
  "name": "my-app",
  "dependencies": {
    "next": "latest"
  },
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
然后跑now，享受！

Next.js也可以部署到其他托管解决方案。请查看维基的“部署”部分。

注意：子命令NODE_ENV正确配置（next如果不存在），以最大限度地提高性能。如果您以编程方式使用Next.js ，则您有责任NODE_ENV=production手动设置！

注意：我们建议把.next，或者您的自定义文件夹DIST，在.gitignore或.npmignore。否则，使用files或now.files选择加入要部署的文件的白名单，排除.next或自定义dist文件夹。

浏览器支持
Next.js支持IE11和所有现代浏览器开箱即用@babel/preset-env。为了支持IE11，Next.js添加了一个全局polyfill Promise。如果您使用自己的代码或任何外部NPM依赖项需要目标浏览器不支持的功能，则需要实现polyfill。

该polyfills示例演示实现polyfills推荐的方法。

静态HTML导出
例子
next export是一种将Next.js应用程序作为独立静态应用程序运行的方法，无需Node.js服务器。导出的应用程序几乎支持Next.js的所有功能，包括动态URL，预取，预加载和动态导入。

方法next export是将所有页面预渲染为HTML。它基于pathname键到页面对象的映射来实现。这种映射称为exportPathMap。

页面对象有2个值：

page- 要呈现String的pages目录内的页面
query- 预渲染时传递给Object的query对象getInitialProps。默认为{}
用法
像往常一样使用Next.js开发您的应用程序。然后运行：

next build
next export
默认情况下next export不需要任何配置。它将生成一个默认值，exportPathMap其中包含指向pages目录内页面的路由。此默认映射可用defaultPathMap，如下例所示。

如果您的应用程序具有动态路由，您可以添加动态exportPathMap在next.config.js。此函数是异步的，并将默认值exportPathMap作为参数。

// next.config.js
module.exports = {
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/readme.md': { page: '/readme' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } }
    }
  }
}
请注意，如果路径以目录结尾，则会将其导出为/dir-name/index.html，但如果以扩展名结尾，则会将其导出为指定的文件名，例如/readme.md上面的。如果您使用的文件扩展名不是.html，则可能需要在提供此内容时将Content-Type标题设置为text/html。

然后只需运行以下命令：

next build
next export
为此，您可能需要添加一个NPM脚本，package.json如下所示：

{
  "scripts": {
    "build": "next build",
    "export": "npm run build && next export"
  }
}
并立即运行：

npm run export
然后，您在out目录中拥有应用程序的静态版本。

您还可以自定义输出目录。为了那次next export -h帮助。

现在，您可以将out目录部署到任何静态托管服务。请注意，是部署到GitHub的页面，另一个步骤记录在这里。

例如，只需访问该out目录并运行以下命令即可将您的应用程序部署到ZEIT Now。

now
复制自定义文件
如果您必须复制robots.txt等自定义文件或生成sitemap.xml，您可以在其中执行此操作exportPathMap。 exportPathMap获取一些上下文参数来帮助您创建/复制文件：

dev- true当exportPathMap被调用的发展。false跑步的时候next export。在开发exportPathMap中用于定义路径和行为，如不需要复制文件。
dir - 项目目录的绝对路径
outDir- out目录的绝对路径（可配置-o或--outdir）。如果dev是true的值outDir会null。
distDir- .next目录的绝对路径（使用distDirconfig键配置）
buildId - 正在运行导出的buildId
// next.config.js
const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const copyFile = promisify(fs.copyFile)

module.exports = {
  exportPathMap: async function (defaultPathMap, {dev, dir, outDir, distDir, buildId}) {
    if (dev) {
      return defaultPathMap
    }
    // This will copy robots.txt from your project root into the out directory
    await copyFile(join(dir, 'robots.txt'), join(outDir, 'robots.txt'))
    return defaultPathMap
  }
}
局限性
有了next export，我们构建了您的应用程序的HTML版本。在导出时，我们将运行getInitialProps您的页面。

传递给的对象的req和res字段不可用，因为没有服务器正在运行。contextgetInitialProps

在静态导出时，您将无法动态呈现HTML，因为我们预先构建HTML文件。如果要使用动态呈现next start或自定义服务器API

多区域
例子
区域是Next.js应用程序的单个部署。就像那样，你可以拥有多个区域。然后，您可以将它们合并为一个应用程序。

例如，您可以有两个这样的区域：

https://docs.my-app.com服务/docs/**
https://ui.my-app.com用于提供所有其他页面
通过多区域支持，您可以将这两个应用程序合并为一个应用程序。这允许您的客户使用单个URL浏览它。但您可以独立开发和部署这两个应用程序。

这与微服务完全相同，但对于前端应用程序。

如何定义区域
没有特殊区域相关的API。你只需要做以下事情：

确保只保留应用中所需的页面。（例如，https：//ui.my-app.com不应包含页面/docs/**）
确保您的应用具有assetPrefix。（您也可以动态定义assetPrefix 。）
如何合并它们
您可以使用任何HTTP代理合并区域。

您可以使用微代理作为本地代理服务器。它允许您轻松定义如下的路由规则：

{
  "rules": [
    {"pathname": "/docs**", "method":["GET", "POST", "OPTIONS"], "dest": "https://docs.my-app.com"},
    {"pathname": "/**", "dest": "https://ui.my-app.com"}
  ]
}
对于生产部署，如果您现在使用ZEIT，则可以使用路径别名功能。否则，您可以将现有代理服务器配置为使用一组规则来路由HTML页面，如上所示。
