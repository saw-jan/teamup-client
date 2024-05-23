const { AxiosError } = require('axios')
const Logger = require('./Logger')

class Response {
  constructor(status, statusText) {
    this.status = status
    this.statusText = statusText
  }
}

class SuccessResponse extends Response {
  constructor(status, statusText, data) {
    super(status, statusText)
    this.data = data
  }
}

class ErrorResponse extends Response {
  constructor(status, statusText, error) {
    super(status, statusText)
    this.error = error
  }
}

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

  _validateArg(arg, allowedTypes = []) {
    const msg = `Invalid argument: ${arg}`
    if (arg !== undefined && arg !== null) {
      if (allowedTypes.includes(typeof arg)) {
        return
      }
    }
    this._logger.error(msg)
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

  _renderSuccessResponse(response, dataKey) {
    if (response instanceof SuccessResponse) {
      return response
    }

    const { status, statusText, data } = response
    const customResponse = new SuccessResponse(status, statusText, data)
    if (dataKey) {
      customResponse.data = data[dataKey]
    }
    return customResponse
  }

  _renderErrorResponse(error) {
    if (error instanceof AxiosError) {
      const {
        response: { status, statusText, data },
      } = error

      const errorResponse = new ErrorResponse(status, statusText, {})
      if (data.error) {
        errorResponse.error = data.error
      }
      return errorResponse
    }
    if (error instanceof ErrorResponse) {
      return error
    }
    this._logger.error(error)
  }
}
