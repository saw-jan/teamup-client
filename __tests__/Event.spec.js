const { AxiosError } = require('axios')
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
    .mockImplementation(jest.fn())
  const spyRenderErrorResponse = jest
    .spyOn(API.prototype, '_renderErrorResponse')
    .mockImplementation(jest.fn())
  const event = new Event(new Request())

  afterEach(function () {
    jest.clearAllMocks()
  })

  describe('method: getEvents', function () {
    const successResponse = getSuccesResponse('events')
    let spyGet
    beforeEach(function () {
      spyGet = jest
        .spyOn(event._request, 'get')
        .mockImplementation(() => successResponse)
    })

    test('no options', async function () {
      await event.getEvents()
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(route, {})
      expect(spyValidateOptionType).toHaveBeenCalledTimes(1)
      expect(spyValidateOptionType).toHaveBeenCalledWith(params)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderSuccessResponse).toHaveBeenCalledWith(
        successResponse,
        'events'
      )
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
      await event.getEvents(options)

      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith('/events', options)
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
      spyGet.mockImplementation(() => Promise.reject(new AxiosError()))

      await event.getEvents()
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(new AxiosError())
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
      await event.getEvent(1234)

      expect(spyValidateId).toHaveBeenCalledTimes(1)
      expect(spyValidateId).toHaveBeenCalledWith(1234)
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith('/events/1234')
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderSuccessResponse).toHaveBeenCalledWith(
        successResponse,
        'event'
      )
    })
    test('with event id (string)', async function () {
      await event.getEvent('1234')
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith('/events/1234')
    })
    test('error response', async function () {
      spyGet.mockImplementation(() => Promise.reject(new AxiosError()))

      await event.getEvents()
      expect(spyRenderErrorResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderErrorResponse).toHaveBeenCalledWith(new AxiosError())
    })
  })
})

function getSuccesResponse(filter) {
  switch (filter) {
    case 'events':
      return { status: 200, statusText: 'Ok', data: { events: [] } }
    case 'event':
      return { status: 200, statusText: 'Ok', data: { event: {} } }
  }
}
