import { JSDOM } from 'jsdom'
import UrlScheme from '../src/url-scheme'
import CancelToken from '../src/CancelToken'
import Cancel from '../src/Cancel'

const { window } = new JSDOM()
jest.useFakeTimers()

test('CancelToken is work fine', () => {
  const source = CancelToken.source()

  expect(source).toEqual({
    token: expect.any(CancelToken),
    cancel: expect.any(Function)
  })

  source.cancel('foo')
  source.cancel('bar')
  return source.token.promise
    .then(reason => {
      expect(reason).toBeInstanceOf(Cancel)
      expect(reason.message).toBe('foo')
      expect(reason.toString()).toBe('Cancel: foo')
    })
})

describe('Timeout checking', () => {
  test('Waits 2.048 second timeout', () => {
    new UrlScheme({
      url: 'scheme://foo/bar?baz=true',
      timeout: 2048
    })

    expect(setTimeout.mock.calls.length).toBe(1)
    expect(setTimeout.mock.calls[0][1]).toBe(2048)
  })

  test('Timeout error throw is right', () => {
    new UrlScheme({
      url: 'scheme://foo/bar?baz=true',
      timeout: 1000
    })
      .catch(err => {
        expect(setTimeout.mock.calls.length).toBe(2)
        expect(setTimeout.mock.calls[0][2]).toBe(1000)
        const error = new Error('URL Scheme request timeout.')
        error.type = 'timeout'
        expect(err).toEqual(error)
      })
  })

  test('Never timeout', () => {
    expect(_ => {
      jest.useFakeTimers()
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        timeout: 0
      })
      expect(setTimeout.mock.calls.length).toBe(0)
    }).not.toThrow()
  })
})

describe('Type checking', () => {
  test('param url checking is work fine', () => {
    expect(_ => {
      new UrlScheme({ url: true })
    }).toThrow('url must be a string.')
    expect(_ => {
      new UrlScheme({ url: { path: 'foo://bar' } })
    }).toThrow('url must be a string.')
    expect(_ => {
      new UrlScheme({ url: /foo:\/\/bar/g })
    }).toThrow('url must be a string.')
    expect(_ => {
      new UrlScheme({ url: '' })
    }).toThrow('url cannot be empty string.')
    expect(_ => {
      new UrlScheme({ url: 'foo://bar' })
    }).not.toThrow()
  })

  test('param query checking is work fine', () => {
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        query: ''
      })
    }).toThrow('query must be an object.')
    expect(_ => {
      new UrlScheme({
        url: 'scheme://foo/bar?baz=true',
        query: ''
      })
    }).toThrow('query must be an object.')
  })
})
