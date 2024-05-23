const { getSuccesResponse, getErrorResponse } = require('./helpers/helpers')
const Event = require('../lib/Event')

// mocks
jest.mock('../lib/Request', () => {
  return function () {
    return {
      ...jest.requireActual('../lib/Request'),
      get: jest.fn(),
    }
  }
})
const Request = require('../lib/Request')
const API = require('../lib/API')

const route = '/events'
const params = {
  startDate: null,
  endDate: null,
  query: null,
  subcalendarId: null,
  format: null,
  modifiedSince: null,
  mode: null,
}

describe('Event class', function () {
  const spyValidateOptionType = jest.spyOn(API.prototype, '_validateOptionType')
  const spyValidateId = jest.spyOn(API.prototype, '_validateId')
  const spyRenderSuccessResponse = jest
    .spyOn(API.prototype, '_renderSuccessResponse')
    .mockImplementation((data) => data)
  const spyRenderErrorResponse = jest
    .spyOn(API.prototype, '_renderErrorResponse')
    .mockImplementation((data) => data)
  const event = new Event(new Request())

  afterEach(function () {
    jest.clearAllMocks()
  })

  describe('method: getEvents', function () {
    const successResponse = {
      ...getSuccesResponse('events'),
      data: { events: [{}, {}] },
    }
    let spyGet
    beforeEach(function () {
      spyGet = jest
        .spyOn(event._request, 'get')
        .mockImplementation(() => successResponse)
    })

    test('no options', async function () {
      const response = await event.getEvents()
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(route, {})
      expect(spyValidateOptionType).toHaveBeenCalledTimes(1)
      expect(spyValidateOptionType).toHaveBeenCalledWith(params)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderSuccessResponse).toHaveBeenCalledWith(
        successResponse,
        'events'
      )
      expect(response.data).toStrictEqual(successResponse.data)
    })
    test.each([
      [{ startDate: '2022-01-01' }],
      [{ endDate: '2022-01-01' }],
      [{ endDate: '01-01-2022' }],
      [{ query: 'meeting' }],
      [{ subcalendarId: [12345] }],
      [{ subcalendarId: [12345, 54321] }],
      [{ format: 'html' }],
      [{ format: 'markdown' }],
      [
        {
          startDate: '2022-01-01',
          endDate: '2022-01-01',
          query: 'meeting',
          subcalendarId: [12345],
          format: 'html',
        },
      ],
    ])('valid options value', async function (options) {
      const response = await event.getEvents(options)

      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith('/events', options)
      expect(response.data).toStrictEqual(successResponse.data)
    })
    test.each([[{}], [{ subcalendarId: null }]])(
      'ignored options value',
      async function (options) {
        await event.getEvents(options)
        expect(spyGet).toHaveBeenCalledTimes(1)
        expect(spyGet).toHaveBeenCalledWith('/events', {})
      }
    )
    test('ignored option: undefined', async function () {
      await event.getEvents(undefined)
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith('/events', {})
    })
    test('error response', async function () {
      spyGet.mockImplementation(() => Promise.reject(getErrorResponse()))

      const response = await event.getEvents()
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(getErrorResponse())
      expect(response.error).toStrictEqual({})
    })
    test('error', async function () {
      const err = new Error()
      spyGet.mockImplementation(() => {
        throw err
      })

      await event.getEvents()
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(err)
    })
  })

  describe('method: getAllDayEvents', function () {
    test('success response', async function () {
      const successResponse = {
        ...getSuccesResponse('events'),
        data: [{ all_day: false }, { all_day: true }],
      }
      const spyGetEvents = jest
        .spyOn(event, 'getEvents')
        .mockImplementation(() => successResponse)

      const response = await event.getAllDayEvents()

      expect(spyGetEvents).toHaveBeenCalledTimes(1)
      expect(spyGetEvents).toHaveBeenCalledWith(params)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(response.data).toHaveLength(1)
      expect(response.data).toStrictEqual([{ all_day: true }])
    })
    test('error response', async function () {
      const spyGetEvents = jest
        .spyOn(event, 'getEvents')
        .mockImplementation(() => getErrorResponse())

      const response = await event.getAllDayEvents()

      expect(spyGetEvents).toHaveBeenCalledTimes(1)
      expect(spyGetEvents).toHaveBeenCalledWith(params)
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(getErrorResponse())
      expect(response.error).toStrictEqual({})
    })
    test('error', async function () {
      const err = new Error()
      jest.spyOn(event, 'getEvents').mockImplementation(() => {
        throw err
      })

      await event.getAllDayEvents()
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(err)
    })
  })

  describe('method: getRecurringEvents', function () {
    test('success response', async function () {
      const successResponse = {
        ...getSuccesResponse('events'),
        data: [{ rrule: '' }, { rrule: 'Daily' }],
      }
      const spyGetEvents = jest
        .spyOn(event, 'getEvents')
        .mockImplementation(() => successResponse)

      const response = await event.getRecurringEvents()

      expect(spyGetEvents).toHaveBeenCalledTimes(1)
      expect(spyGetEvents).toHaveBeenCalledWith(params)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(response.data).toHaveLength(1)
      expect(response.data).toStrictEqual([{ rrule: 'Daily' }])
    })
    test('error response', async function () {
      const spyGetEvents = jest
        .spyOn(event, 'getEvents')
        .mockImplementation(() => getErrorResponse())

      const response = await event.getRecurringEvents()

      expect(spyGetEvents).toHaveBeenCalledTimes(1)
      expect(spyGetEvents).toHaveBeenCalledWith(params)
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(getErrorResponse())
      expect(response.error).toStrictEqual({})
    })
    test('error', async function () {
      const err = new Error()
      jest.spyOn(event, 'getEvents').mockImplementation(() => {
        throw err
      })

      await event.getRecurringEvents()
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(err)
    })
  })

  describe('method: getEvent', function () {
    const successResponse = getSuccesResponse('event')
    let spyGet
    beforeEach(function () {
      spyGet = jest
        .spyOn(event._request, 'get')
        .mockImplementation(() => successResponse)
    })
    test('with event id (number)', async function () {
      const response = await event.getEvent(1234)

      expect(spyValidateId).toHaveBeenCalledTimes(1)
      expect(spyValidateId).toHaveBeenCalledWith(1234)
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(`${route}/1234`)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderSuccessResponse).toHaveBeenCalledWith(
        successResponse,
        'event'
      )
      expect(response.data).toStrictEqual(successResponse.data)
    })
    test('with event id (string)', async function () {
      await event.getEvent('1234')
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(`${route}/1234`)
    })
    test('error response', async function () {
      spyGet.mockImplementation(() => Promise.reject(getErrorResponse()))

      const response = await event.getEvent(1234)
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(getErrorResponse())
      expect(response.error).toStrictEqual({})
    })
    test('error', async function () {
      const err = new Error()
      spyGet.mockImplementation(() => {
        throw err
      })

      await event.getEvent(1234)
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(err)
    })
  })
})
