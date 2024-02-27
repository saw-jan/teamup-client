const { AxiosError } = require('axios')
const Logger = require('./Logger')

module.exports = class API {
  _request
  _logger

  constructor(request) {
    this._request = request
    this._logger = new Logger()
  }

  _validateOptionType(option) {
    const isObject =
      option && typeof option === 'object' && option.constructor === Object
    if (!isObject) {
      this._logger.error('Option must be object type')
    }
  }

  _validateId(id) {
    const msg = `Invalid id: ${id}`
    if (id !== undefined && id !== null) {
      if (typeof id !== 'number' && typeof id !== 'string') {
        this._logger.error(msg)
      } else if (typeof id === 'string') {
        if (isNaN(id)) {
          this._logger.error(msg)
        }
      }
    } else {
      this._logger.error(msg)
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

  _filterUrlParams(params) {
    const urlParams = {}
    for (const paramKey in params) {
      if (params[paramKey] !== null) {
        urlParams[paramKey] = params[paramKey]
      }
    }
    return urlParams
  }

  _renderResponse(response) {
    const { status, statusText, data } = response
    return { status, statusText, data }
  }

  _renderErrorResponse(error) {
    if (error instanceof AxiosError) {
      const {
        response: { status, statusText, data },
      } = error

      const errorResponse = { status, statusText, error: {} }
      if (data.error) {
        errorResponse.error = data.error
      }
      return errorResponse
    }
    this._logger.error(error)
  }
}
