import UrlScheme from '../src/url-scheme'
import CancelToken from '../src/CancelToken'
import Cancel from '../src/Cancel'

test('CancelToken is work fine', done => {
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
      done()
    })
    .catch(done.fail)
})
