import qs from 'qs'
import CancelToken from './CancelToken'

let _timeout = 60000
let count = +new Date()
function noop () {}

function isPositiveNum (num) {
  num = Number(num)
  return !isNaN(num) && num >= 0
}

function init ({ beforeSend, cancelToken, timeout }) {
  const { jsonpId, schemeUrl, cleanup } = this

  return new Promise((resolve, reject) => {
    if (cancelToken) {
      cancelToken.promise.then(function onCanceled (cancel) {
        cleanup()
        reject(cancel)
      })
    }

    this.timer = setTimeout(function () {
      const err = new Error('URL Scheme request timeout')
      err.type = 'timeout'
      cleanup()
      reject(err)
    }, timeout)

    window[jsonpId] = function (response) {
      cleanup()
      if (response == null) return resolve()
      if (typeof response === 'string') {
        try {
          resolve(JSON.parse(response))
        } catch (err) {
          resolve(response)
        }
      } else {
        resolve(response)
      }
    }

    if (typeof beforeSend === 'function') beforeSend({ schemeUrl, jsonpId })
    window.location = schemeUrl
  })
}

class UrlScheme {
  static defaults = {
    scheme: null,
    get timeout () {
      return _timeout
    },
    set timeout (newValue) {
      if (!isPositiveNum(newValue)) {
        throw new TypeError('timeout must be a positive number.')
      }
      _timeout = newValue
    }
  };
  static interceptors = {};
  static CancelToken = CancelToken;
  static isCancel (value) {
    return !!(value && value.__CANCEL__)
  }

  constructor ({
    url, query,
    param = 'callback', prefix = '__jsonp',
    cancelToken,
    name, timeout, beforeSend
  }) {
    if (!url || typeof url !== 'string') {
      throw new TypeError('url string is required')
    }
    if (query != null && typeof query !== 'object') {
      throw new TypeError('query must be an object.')
    }
    if (beforeSend && typeof beforeSend !== 'function') {
      throw new TypeError('beforeSend must be a function.')
    }

    const { defaults } = UrlScheme
    const urlHasScheme = url.indexOf(':') > 0
    const hasDefaultScheme = defaults.scheme != null
    if (!urlHasScheme && !hasDefaultScheme) {
      throw new Error('scheme in url parameter or UrlScheme.defaults.scheme is required')
    }
    let scheme = urlHasScheme ? url.split(':')[0] : defaults.scheme
    scheme = `${scheme}`.toLowerCase()

    const qIndex = url.indexOf('?')
    const hasQueryString = qIndex > -1
    query = hasQueryString
      ? Object.assign(qs.parse(url.substring(qIndex + 1)), query)
      : query

    if (param in query) console.warn(`Param \`${param}\` override the same key in search query`)
    this.jsonpId = query[param] = name || `${prefix}${count++}` // jsonp id

    const queryString = qs.stringify(query)

    if (!isPositiveNum(timeout)) {
      this.timeout = !(isPositiveNum(defaults.timeout))
        ? 60000
        : +defaults.timeout
    } else {
      this.timeout = timeout
    }

    this.schemeUrl = urlHasScheme
      ? `${scheme}${url.slice(scheme.length, qIndex + 1)}${queryString}`
      : `${scheme}://${url.slice(0, qIndex + 1)}${queryString}`

    const promise = init.call(this, {
      beforeSend, cancelToken, timeout
    })

    return promise
  }

  cleanup = _ => {
    const { timer, jsonpId } = this

    window[jsonpId] = noop
    if (timer) clearTimeout(timer)
  }
}

export { CancelToken }
export default UrlScheme
