const Logger = require('./Logger')

module.exports = class API {
  _Request
  _Logger

  constructor(request) {
    this._Request = request
    this._Logger = new Logger()
  }

  _validateOptionType(option) {
    const isObject =
      option && typeof option === 'object' && option.constructor === Object
    if (!isObject) {
      this._Logger.error('Option must be object type')
    }
  }

  _validateId(id) {
    const msg = `Invalid id: ${id}`
    if (id !== undefined && id !== null) {
      if (typeof id !== 'number' && typeof id !== 'string') {
        this._Logger.error(msg)
      } else if (typeof id === 'string') {
        if (isNaN(id)) {
          this._Logger.error(msg)
        }
      }
    } else {
      this._Logger.error(msg)
    }
  }

  _buildUrlParams(params) {
    let urlParams = ''

    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        if (params[key] instanceof Array) {
          params[key].forEach((value) => {
            urlParams += `${key}[]=${value}&`
          })
        } else {
          urlParams += `${key}=${params[key]}&`
        }
      }
    })

    return urlParams.substring(0, urlParams.length - 1)
  }
}
