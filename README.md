# url-scheme

A promisified url schemes creator for communication between webview & native

# Usage

```javascript
new UrlScheme({
  url: 'BBCODE://foo/bar?baz=true',
  query: {
    biz: '2333',
    boo: [1, 2, 3]
  },
  param: 'biz_callback',
  prefix: 'CustomGlobalFunction',
  timeout: 20000,
  beforeSend ({ schemeUrl, jsonpId }) {
    console.log(schemeUrl, jsonpId)
  }
})
  .then(res => console.log(res))
  .catch(err => console.error(err))

window.CustomGlobalFunction1492871429491({ foo: 'bar' })
```
