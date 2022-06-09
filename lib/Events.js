const { join } = require('path')
const API = require('./API')

module.exports = class Events extends API {
  #ENDPOINT = '/events'
  #URL_PARAMS = {
    startDate: 'string',
    endDate: 'string',
    query: 'string',
    subcalendarId: 'array',
    format: 'html|markdown',
  }

  constructor(request, logger) {
    super(request, logger)
  }

  listEvents(
    params = {
      startDate: null,
      endDate: null,
      query: null,
      subcalendarId: null,
      format: null,
    }
  ) {
    this._validateOptionType(params)

    const urlParams = this.#getUrlParams(params)
    const path = urlParams ? `${this.#ENDPOINT}?${urlParams}` : this.#ENDPOINT

    return this._Request.get(path)
  }

  listEvent(eventId) {
    this._validateId(eventId)

    return this._Request.get(join(this.#ENDPOINT, eventId.toString()))
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
        if (key === 'format') {
          if (!this.#URL_PARAMS.format.split('|').includes(params[key])) {
            this._Logger.error(`Format can either be 'html' or 'markdown'`)
          }
          return
        }
        if (key === 'subcalendarId') {
          if (
            !(params[key] instanceof Array) ||
            typeof params[key] == 'string'
          ) {
            this._Logger.error(
              `Parameter '${key}' must be of type '${this.#URL_PARAMS[key]}'`
            )
          }
          return
        }
        if (typeof params[key] !== this.#URL_PARAMS[key]) {
          this._Logger.error(
            `Parameter '${key}' must be of type '${
              this.#URL_PARAMS[key]
            }'. Given '${typeof params[key]}'`
          )
        }
        if (key === 'startDate' || key === 'endDate') {
          if (params[key] === '') {
            this._Logger.error(`Invalid date for '${key}': ${params[key]}`)
          }
        }
      }
    })
  }
}
