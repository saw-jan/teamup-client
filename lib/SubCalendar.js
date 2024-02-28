const { join } = require('path')
const API = require('./API')

module.exports = class SubCalendar extends API {
  #ENDPOINT = '/subcalendars'
  #URL_PARAMS = {
    includeInactive: 'boolean',
  }

  constructor(request) {
    super(request)
  }

  async listSubCalendars(
    params = {
      includeInactive: null,
    }
  ) {
    this._validateOptionType(params)
    try {
      const response = await this._request.get(
        this.#ENDPOINT,
        this.#builUrlParams(params)
      )
      return this._renderSuccessResponse(response, 'subcalendars')
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  async listInactiveSubCalendars() {
    try {
      const result = await this.listSubCalendars({ includeInactive: true })
      result.data = this.#filterSubCalendars(
        result.data,
        'active',
        (value) => !value
      )
      return this._renderSuccessResponse(result)
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  async listSubCalendar(resourceId) {
    this._validateId(resourceId)
    try {
      const response = await this._request.get(
        `${this.#ENDPOINT}/${resourceId.toString()}`
      )
      return this._renderSuccessResponse(response, 'subcalendar')
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  #filterSubCalendars(subCalendars, filterKey, conditionFn) {
    const filteredSubCalens = []
    for (const subCalendar of subCalendars) {
      if (conditionFn(subCalendar[filterKey])) {
        filteredSubCalens.push(subCalendar)
      }
    }
    return filteredSubCalens
  }

  #builUrlParams(params) {
    this.#validateParams(params)
    return this._filterUrlParams(params)
  }

  #validateParams(params) {
    Object.keys(params).forEach((key) => {
      if (!Object.keys(this.#URL_PARAMS).includes(key)) {
        this._logger.error(`Invalid url param: '${key}'`)
      }

      if (params[key] !== null) {
        if (typeof params[key] !== this.#URL_PARAMS[key]) {
          this._logger.error(
            `Parameter '${key}' must be of type '${
              this.#URL_PARAMS[key]
            }'. Given '${typeof params[key]}'`
          )
        }
      }
    })
  }
}
