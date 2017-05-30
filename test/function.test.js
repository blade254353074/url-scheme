import UrlScheme from '../src/url-scheme'
import CancelToken from '../src/CancelToken'
import Cancel from '../src/Cancel'
import { parse } from 'qs'

global.console.warn = jest.fn()
jest.useFakeTimers()

describe('Timeout checking', () => {
  test('Waits 2.048 second timeout', () => {
    new UrlScheme({
      url: 'scheme://foo/bar',
      timeout: 2048
    })

    expect(setTimeout.mock.calls.length).toBe(1)
    expect(setTimeout.mock.calls[0][1]).toBe(2048)
  })

  test('Timeout error throw is right', () => {
    expect.assertions(3)
    const promise = new UrlScheme({
      url: 'scheme://foo/bar',
      timeout: 1000
    })
      .catch(err => {
        expect(setTimeout.mock.calls.length).toBe(2)
        expect(setTimeout.mock.calls[1][1]).toBe(1000)

        const error = new Error('URL Scheme request timeout.')
        error.type = 'timeout'
        expect(err).toEqual(error)
      })

    jest.runTimersToTime(1000)
    return promise
  })

  test('Never timeout', () => {
    expect(_ => {
      jest.useFakeTimers()
      new UrlScheme({
        url: 'scheme://foo/bar',
        timeout: 0
      })
      expect(setTimeout.mock.calls.length).toBe(0)
    }).not.toThrow()
  })
})

describe('CancelToken test cases', () => {
  test('CancelToken is work fine', () => {
    const source = CancelToken.source()

    expect(source).toEqual({
      token: expect.any(CancelToken),
      cancel: expect.any(Function)
    })

    source.cancel('foo') // cached first reason
    source.cancel('bar') // can't change the first reason
    return source.token.promise
      .then(reason => {
        expect(reason).toBeInstanceOf(Cancel)
        expect(reason.message).toBe('foo')
        expect(reason.toString()).toBe('Cancel: foo')
      })
  })
})

describe('Cover CancelToken.js & Cancel.js other code', () => {
  test('Throw error, when create CancelToken without function', () => {
    const message = 'executor must be a function.'
    expect(() => (new CancelToken()))
      .toThrow(message)
    expect(() => (new CancelToken('not function')))
      .toThrow(message)
    expect(() => (new CancelToken(jest.fn())))
      .not.toThrow()
  })

  test('No reason canceling works fine', () => {
    const source = CancelToken.source()
    source.cancel()
    return source.token.promise
      .then(reason => {
        expect(reason.message).toBe(undefined)
        expect(reason.toString()).toBe('Cancel')
      })
  })
})

describe('Main function checking', () => {
  test('default callback key of querystring and jsonp name is right', () => {
    new UrlScheme({
      url: 'foo://bar?foo=1&bar[]=first&bar[]=second&bar[]=third',
      beforeSend ({ schemeUrl, jsonpId }) {
        const query = parse(schemeUrl.split('?')[1])
        expect(query).toHaveProperty('callback', jsonpId)
        expect(jsonpId).toMatch(/__jsonp/)
      }
    })
  })

  test('Scheme url composing work fine', () => {
    new UrlScheme({
      url: 'foo://bar?foo=1&bar[]=first&bar[]=second&bar[]=third',
      query: {
        biz: {
          foo: 'foo',
          bar: true,
          baz: [1, 2, 3]
        },
        jsonpId: null
      },
      param: 'jsonpId',
      beforeSend ({ schemeUrl, jsonpId }) {
        expect(parse(schemeUrl.split('?')[1]))
          .toMatchObject({
            foo: '1',
            bar: ['first', 'second', 'third'],
            biz: {
              foo: 'foo',
              bar: 'true',
              baz: ['1', '2', '3']
            },
            jsonpId
          })
      }
    })
  })

  test('jsonp callback works fine', async () => {
    expect.assertions(1)
    let result = {
      foo: 'bar',
      baz: true,
      biz: [1, 2, 3],
      bazinga: 'Bazinga!'
    }
    try {
      const res = await new UrlScheme({
        url: 'foo://bar',
        beforeSend (opt) {
          const callbackFunc = global[opt.jsonpId]
          expect(callbackFunc).toBe(Function)
          callbackFunc(result)
        }
      })
      expect(res).toMatchObject(result)
    } catch (e) { }
  })
})
