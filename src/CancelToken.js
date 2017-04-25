import Cancel from './Cancel'

class CancelToken {
  static source () {
    let cancel
    const token = new CancelToken(function (c) {
      cancel = c
    })
    return { token, cancel }
  };

  constructor (executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.')
    }

    let resolvePromise
    this.promise = new Promise(function promiseExecutor (resolve) {
      resolvePromise = resolve
    })

    let token = this
    executor(function cancel (message) {
      if (token.reason) return
      token.reason = new Cancel(message)
      resolvePromise(token.reason)
    })
  }
}

export default CancelToken
