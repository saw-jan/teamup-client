const { join } = require('path')
const Request = require('./Request')
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

  constructor(client) {
    super(new Request(client))
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
    const urlParams = this.#buildParams(params)
    const path = urlParams
      ? join(this.#ENDPOINT, `?${urlParams}`)
      : this.#ENDPOINT

    return this._Request.get(path)
  }

  listEvent(eventId) {
    if (!eventId) {
      throw new Error('[ERROR] EventId is empty')
    }

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
        throw new Error(`Invalid url param: '${key}'`)
      }

      if (params[key]) {
        if (
          key === 'format' &&
          !this.#URL_PARAMS.format.split('|').includes(params[key])
        ) {
          throw new Error(`Format can either be 'html' or 'markdown'`)
        }

        if (key !== 'format') {
          if (key === 'subcalendarId' && !params[key] instanceof Array) {
            throw new Error(
              `Parameter '${key}' must be of type '${this.#URL_PARAMS[key]}'`
            )
          } else if (
            key !== 'subcalendarId' &&
            typeof params[key] !== this.#URL_PARAMS[key]
          ) {
            throw new Error(
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
