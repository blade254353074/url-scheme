import qs from 'qs'

let count = +new Date()
function noop () {}

class UrlScheme {
  constructor ({
    url, query,
    param = 'callback', prefix = '__jsonp',
    name, timeout, beforeSend
  }) {
    const { defaults } = UrlScheme
    if (!url || typeof url !== 'string') throw new Error('Url string required')
    if (query != null && typeof query !== 'object') throw new Error('Query must be an object')

    const urlHasScheme = url.indexOf(':') > 0
    const hasDefaultScheme = defaults.scheme != null
    if (!urlHasScheme && !hasDefaultScheme) {
      throw new Error('Need scheme in url parameter or defaults.scheme')
    }
    let scheme = urlHasScheme ? url.split(':')[0] : defaults.scheme
    scheme = `${scheme}`.toLowerCase()

    const qIndex = url.indexOf('?')
    const hasQueryString = qIndex > -1
    query = hasQueryString
      ? Object.assign(qs.parse(url.substring(qIndex + 1)), query)
      : query

    if (param in query) console.warn(`Param \`${param}\` override the same key in search query`)
    const jsonpId = query[param] = name || `${prefix}${count++}` // jsonp id

    const queryString = qs.stringify(query)

    const timeoutNum = Number(timeout)
    if (isNaN(timeoutNum) || timeoutNum < 0) {
      const defaultTimeout = Number(defaults.timeout)
      timeout = isNaN(defaultTimeout) || defaultTimeout < 0
        ? 60000
        : defaultTimeout
    }

    const schemeUrl = urlHasScheme
      ? `${scheme}${url.slice(scheme.length, qIndex + 1)}${queryString}`
      : `${scheme}://${url.slice(0, qIndex + 1)}${queryString}`

    let timer

    function cleanup () {
      try {
        delete window[jsonpId]
      } catch (e) {
        window[jsonpId] = noop
      }
      if (timer) clearTimeout(timer)
    }

    const promise = new Promise((resolve, reject) => {
      timer = setTimeout(_ => {
        cleanup()
        reject(new Error('Scheme request timeout'))
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
    })

    if (typeof beforeSend === 'function') beforeSend({ schemeUrl, jsonpId })

    console.log(query, schemeUrl, param, prefix, name, timeout)

    return promise
  }
}

UrlScheme.defaults = {
  scheme: null,
  timeout: 60000
}

UrlScheme.interceptors = {}

export default UrlScheme
