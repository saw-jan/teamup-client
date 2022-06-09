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

    const urlParams = this.#buildParams(params)
    const path = urlParams ? `${this.#ENDPOINT}?${urlParams}` : this.#ENDPOINT

    return this._Request.get(path)
  }

  listEvent(eventId) {
    this._validateId(eventId)

    return this._Request.get(join(this.#ENDPOINT, eventId.toString()))
  }

  #buildParams(params) {
    this.#validateParams(params)

    let urlParams = ''
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        if (key === 'subcalendarId') {
          params[key].forEach((id) => {
            urlParams += `${key}[]=${id}&`
          })
        } else {
          urlParams += `${key}=${params[key]}&`
        }
      }
    })

    return urlParams.substring(0, urlParams.length - 1)
  }

  #validateParams(params) {
    Object.keys(params).forEach((key) => {
      if (!Object.keys(this.#URL_PARAMS).includes(key)) {
        this._Logger.error(`Invalid url param: '${key}'`)
      }

      if (params[key]) {
        if (
          key === 'format' &&
          !this.#URL_PARAMS.format.split('|').includes(params[key])
        ) {
          this._Logger.error(`Format can either be 'html' or 'markdown'`)
        }

        if (key !== 'format') {
          if (key === 'subcalendarId' && !params[key] instanceof Array) {
            this._Logger.error(
              `Parameter '${key}' must be of type '${this.#URL_PARAMS[key]}'`
            )
          } else if (
            key !== 'subcalendarId' &&
            typeof params[key] !== this.#URL_PARAMS[key]
          ) {
            this._Logger.error(
              `Parameter '${key}' must be of type '${
                this.#URL_PARAMS[key]
              }'. Given '${typeof params[key]}'`
            )
          }
        }
      }
    })
  }
}
