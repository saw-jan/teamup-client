const { join } = require('path')
const API = require('./API')

module.exports = class SubCalendar extends API {
  #ENDPOINT = '/subcalendars'
  #URL_PARAMS = {
    includeInactive: 'boolean',
  }

  constructor(request, logger) {
    super(request, logger)
  }

  listSubCalendars(
    params = {
      includeInactive: null,
    }
  ) {
    this._validateOptionType(params)

    const urlParams = this.#getUrlParams(params)
    const path = urlParams ? `${this.#ENDPOINT}?${urlParams}` : this.#ENDPOINT

    return this._Request.get(path)
  }

  listSubCalendar(calendarId) {
    this._validateId(calendarId)

    return this._Request.get(join(this.#ENDPOINT, calendarId.toString()))
  }

  #getUrlParams(params) {
    this.#validateParams(params)

    return this._buildUrlParams(params)
  }

  #validateParams(params) {
    Object.keys(params).forEach((key) => {
      if (!Object.keys(this.#URL_PARAMS).includes(key)) {
        this._Logger.error(`Invalid url param: '${key}'`)
      }

      if (params[key] !== null) {
        if (typeof params[key] !== this.#URL_PARAMS[key]) {
          this._Logger.error(
            `Parameter '${key}' must be of type '${
              this.#URL_PARAMS[key]
            }'. Given '${typeof params[key]}'`
          )
        }
      }
    })
  }
}
