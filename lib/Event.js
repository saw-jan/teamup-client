const API = require('./API')

module.exports = class Event extends API {
  #ENDPOINT = '/events'
  #URL_PARAMS = {
    startDate: 'string',
    endDate: 'string',
    query: 'string',
    subcalendarId: 'array',
    format: 'html|markdown',
    modifiedSince: 'number',
    mode: 'synchronize|monitor',
  }

  constructor(request) {
    super(request)
  }

  async listEvents(
    params = {
      startDate: null,
      endDate: null,
      query: null,
      subcalendarId: null,
      format: null,
      modifiedSince: null,
      mode: null,
    }
  ) {
    this._validateOptionType(params)
    try {
      const response = await this._request.get(
        this.#ENDPOINT,
        this.#builUrlParams(params)
      )
      return this._renderSuccessResponse(response, 'events')
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  async listAllDayEvents(
    params = {
      startDate: null,
      endDate: null,
      query: null,
      subcalendarId: null,
      format: null,
      modifiedSince: null,
      mode: null,
    }
  ) {
    try {
      const result = await this.listEvents(params)
      result.data = this.#filterEvents(result.data, 'all_day', (value) => value)
      return this._renderSuccessResponse(result)
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  async listRecurringEvents(
    params = {
      startDate: null,
      endDate: null,
      query: null,
      subcalendarId: null,
      format: null,
      modifiedSince: null,
      mode: null,
    }
  ) {
    try {
      const result = await this.listEvents(params)
      result.data = this.#filterEvents(
        result.data,
        'rrule',
        (value) => value !== ''
      )
      return this._renderSuccessResponse(result)
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  async listEvent(eventId) {
    this._validateId(eventId)
    try {
      const response = await this._request.get(
        `${this.#ENDPOINT}/${eventId.toString()}`
      )
      return this._renderSuccessResponse(response, 'event')
    } catch (e) {
      return this._renderErrorResponse(e)
    }
  }

  #filterEvents(events, filterKey, conditionFn) {
    const filteredEvents = []
    for (const event of events) {
      if (conditionFn(event[filterKey])) filteredEvents.push(event)
    }
    return filteredEvents
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
        if (key === 'format') {
          if (!this.#URL_PARAMS.format.split('|').includes(params[key])) {
            this._logger.error(`Format can either be 'html' or 'markdown'`)
          }
          return
        }
        if (key === 'subcalendarId') {
          if (
            !(params[key] instanceof Array) ||
            typeof params[key] == 'string'
          ) {
            this._logger.error(
              `Parameter '${key}' must be of type '${this.#URL_PARAMS[key]}'`
            )
          }
          return
        }
        if (typeof params[key] !== this.#URL_PARAMS[key]) {
          this._logger.error(
            `Parameter '${key}' must be of type '${
              this.#URL_PARAMS[key]
            }'. Given '${typeof params[key]}'`
          )
        }
        if (key === 'startDate' || key === 'endDate') {
          if (params[key] === '') {
            this._logger.error(`Invalid date for '${key}': ${params[key]}`)
          }
        }
      }
    })
  }
}
