import qs from 'qs'
import CancelToken from './CancelToken'

let _timeout = 60000
let count = +new Date()
function noop () {}

function isPositiveNum (num) {
  num = Number(num)
  return !isNaN(num) && num >= 0
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
    url, query, cancelToken,
    name, timeout, beforeSend,
    param = 'callback',
    prefix = '__jsonp'
  }) {
    if (typeof url !== 'string') {
      throw new TypeError('url must be a string.')
    }
    if (!url) {
      throw new Error('url cannot be empty string.')
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
      throw new Error('scheme in url parameter or UrlScheme.defaults.scheme is required.')
    }
    let scheme = urlHasScheme ? url.split(':')[0] : defaults.scheme
    scheme = `${scheme}`.toLowerCase()

    const qIndex = url.indexOf('?')
    const hasQueryString = qIndex > -1
    query = hasQueryString
      ? Object.assign(qs.parse(url.substring(qIndex + 1)), query)
      : query || {}

    if (param in query) console.warn(`Param \`${param}\` override the same key in search query.`)
    this.jsonpId = query[param] = name || `${prefix}${count++}` // jsonp id

    const queryString = qs.stringify(query)

    this.timeout = isPositiveNum(timeout)
      ? timeout
      : defaults.timeout

    this.schemeUrl = urlHasScheme
      ? `${scheme}${url.slice(scheme.length, qIndex + 1)}${queryString}`
      : `${scheme}://${url.slice(0, qIndex + 1)}${queryString}`

    const promise = this.init({
      beforeSend,
      cancelToken,
      timeout: this.timeout
    })

    return promise
  }

  init ({ beforeSend, cancelToken, timeout }) {
    const { jsonpId, schemeUrl, cleanup } = this

    return new Promise((resolve, reject) => {
      if (cancelToken) {
        cancelToken.promise.then(function onCanceled (cancel) {
          cleanup()
          reject(cancel)
        })
      }

      if (timeout > 0) {
        this.timer = setTimeout(function () {
          const err = new Error('URL Scheme request timeout.')
          err.type = 'timeout'
          cleanup()
          reject(err)
        }, timeout)
      }

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

      if (typeof beforeSend === 'function') {
        beforeSend({ schemeUrl, jsonpId })
      }
      this.request(schemeUrl)
    })
  }

  request (src) {
    let iframe = document.createElement('iframe')
    iframe.setAttribute('style', 'display:none')
    iframe.setAttribute('width', '0')
    iframe.setAttribute('height', '0')
    iframe.setAttribute('tabindex', '-1')
    iframe.setAttribute('src', src)
    document.documentElement.appendChild(iframe)
    iframe.parentNode.removeChild(iframe)
    iframe = null
  }

  cleanup = _ => {
    const { timer, jsonpId } = this

    window[jsonpId] = noop
    if (timer) clearTimeout(timer)
  }
}

export { CancelToken }
export default UrlScheme
