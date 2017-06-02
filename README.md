# url-scheme

[![npm version](https://badge.fury.io/js/url-scheme.svg)](https://www.npmjs.com/package/url-scheme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/blade254353074/url-scheme.svg?branch=master)](https://travis-ci.org/blade254353074/url-scheme)
[![codecov](https://codecov.io/gh/blade254353074/url-scheme/branch/master/graph/badge.svg)](https://codecov.io/gh/blade254353074/url-scheme)


A promisified url schemes creator for communication between webview & native

# Install

```bash
npm install url-scheme --save
// or
yarn add url-scheme
```

# Usage

```javascript
const UrlScheme = require('url-scheme')
const CancelToken = UrlScheme.CancelToken
// or ES2015+
import UrlScheme, { CancelToken } from 'url-scheme'
```

# Example

Basic usage:

```javascript
// Only url param is required.
// Others are optional.
new UrlScheme({ url: 'foo://bar?baz=true' })
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

Native can get the callback function name from
webview scheme request **url's querystring**, like this:

`foo://bar?baz=true&callback=__jsonp1492871429491`

Then native can execute(eval) in the webview with script:

```Swift
// UIWebView
webView.stringByEvaluatingJavaScript(from: "__jsonp1492871429491({ foo: 'bar' })")
```

After that, webview will trigger `then` callback:

```javascript
// then(res => console.log(res))
// > Object {foo: "bar"}
```

Advanced usage:

```javascript
import UrlScheme, { CancelToken } from 'url-scheme'

let CancelToken = UrlScheme.CancelToken
let source = CancelToken.source()

new UrlScheme({
  url: 'FooScheme://foo/bar?baz=true',
  query: {
    biz: 'foobar',
    boo: [1, 2, 3]
  },
  param: 'callbackName', // default is callback
  prefix: 'callbackPrefix', // default is __jsonp
  beforeSend ({ schemeUrl, jsonpId }) {
    console.log(schemeUrl, jsonpId)
  },
  timeout: 20000, // default is 0, 0/Infinity means never timeout
  cancelToken: source.token
})
  .then(res => console.log(res))
  .catch(err => {
    if (UrlScheme.isCancel(err)) {
      return console.log(err.message || 'It\'s been canceled!')
    }
    console.error(err)
  })

// Native execute script
window.callbackPrefix1492871429491({ foo: 'bar' })
// or cancel the request
source.cancel('No reason')
```

# Defaults

You can specify defaults options that will be applied to every request.

```javascript
UrlScheme.defaults.scheme = 'myscheme'
UrlScheme.defaults.timeout = 20000

// then you can create UrlScheme without specify the scheme
new UrlScheme({ url: 'foo/bar?baz=true' })
// myscheme://foo/bar?baz=true
```

# License

[MIT](https://github.com/blade254353074/url-scheme/blob/master/LICENSE)
