import UrlScheme from '../src/url-scheme'

global.console.warn = jest.fn()

describe('Type checking', () => {
  test('param url checking is work fine', () => {
    const message = 'url must be a string.'
    expect(_ => {
      new UrlScheme({ url: true })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({ url: { path: 'foo://bar' } })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({ url: /foo:\/\/bar/g })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({ url: '' })
    }).toThrow('url cannot be empty string.')
    expect(_ => {
      new UrlScheme({ url: 'foo://bar' })
    }).not.toThrow()
  })

  test('param query checking is work fine', () => {
    const message = 'query must be an object.'
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        query: ''
      })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        query: 233
      })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        query: ['1', '2', '3']
      })
    }).not.toThrow()
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        query: {
          baz: 'override',
          biz: true,
          faz: [1, 2, 3]
        }
      })
    }).not.toThrow()
  })

  test('param beforeSend checking is work fine', () => {
    const message = 'beforeSend must be a function.'
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar',
        beforeSend: 'string'
      })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar',
        beforeSend: 233
      })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar',
        beforeSend: true
      })
    }).toThrow(message)
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar',
        beforeSend () {}
      })
    }).not.toThrow()
  })

  test('param url & defaults.scheme checking is work fine', () => {
    const defaultsScheme = UrlScheme.defaults.scheme
    expect(_ => {
      new UrlScheme({ url: 'foo/bar' })
    }).toThrow('scheme in url parameter or UrlScheme.defaults.scheme is required.')
    expect(_ => {
      UrlScheme.defaults.scheme = null
      new UrlScheme({ url: 'foo/bar' })
    }).toThrow('scheme in url parameter or UrlScheme.defaults.scheme is required.')
    expect(_ => {
      UrlScheme.defaults.scheme = 'foobar'
      new UrlScheme({ url: 'foo/bar' })
      // restore defaults scheme
      UrlScheme.defaults.scheme = defaultsScheme
    }).not.toThrow()
  })

  test('console warning when callback name override a key of query', () => {
    new UrlScheme({
      url: 'foo://bar',
      query: {
        callback() { }
      }
    })
    expect(console.warn).toHaveBeenCalled()
  })

  test('Throw error when setting negetive number on defaults timeout', () => {
    expect(_ => {
      UrlScheme.defaults.timeout = -1
    }).toThrow('timeout must be a positive number.')
    expect(_ => {
      UrlScheme.defaults.timeout = 100
    }).not.toThrow()
  })
})
