const { join } = require('path')
const Request = require('./Request')
const API = require('./API')

module.exports = class SubCalendar extends API {
  #logger

  #ENDPOINT = '/subcalendars'
  #URL_PARAMS = {
    includeInactive: 'boolean',
  }

  constructor(client, logger) {
    super(new Request(client))
    this.#logger = logger
  }

  listSubCalendars(
    params = {
      includeInactive: null,
    }
  ) {
    const urlParams = this.#buildParams(params)
    const path = urlParams
      ? join(this.#ENDPOINT, `?${urlParams}`)
      : this.#ENDPOINT

    return this._Request.get(path)
  }

  listSubCalendar(calendarId) {
    if (!calendarId) {
      this.#logger(`Invalid 'Sub-CalendarId': ${calendarId}`)
    }

    return this._Request.get(join(this.#ENDPOINT, calendarId.toString()))
  }

  #buildParams(params) {
    this.#validateParams(params)

    let urlParams = params.includeInactive
      ? `includeInactive:${params.includeInactive}`
      : ''

    return urlParams
  }

  #validateParams(params) {
    Object.keys(params).forEach((key) => {
      if (!Object.keys(this.#URL_PARAMS).includes(key)) {
        this.#logger(`Invalid url param: '${key}'`)
      }

      if (params[key]) {
        if (typeof params[key] !== this.#URL_PARAMS[key]) {
          this.#logger(
            `Parameter '${key}' must be of type '${
              this.#URL_PARAMS[key]
            }'. Given '${typeof params[key]}'`
          )
        }
      }
    })
  }
}
