const { buildParams } = require('./helpers')
const Event = require('../lib/Event')

// mocks
jest.mock('../lib/Request', () => {
  return function () {
    return {
      get: () => ({ status: 200, statusText: 'Ok', data: {} }),
    }
  }
})
const Request = require('../lib/Request')

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
  const event = new Event(new Request())

  describe('method: getEvents', function () {
    const spyGet = jest.spyOn(event._request, 'get')
    const spyRenderSuccessResponse = jest.spyOn(event, '_renderSuccessResponse')

    test.only('no options', function () {
      event.getEvents()
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(route, {})
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
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
    ])('valid options value', function (options) {
      const urlParams = buildParams(options)
      event.getEvents(options)

      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events?${urlParams}`)
    })

    test.each([
      [{ startDate: true }],
      [{ endDate: [] }],
      [{ query: {} }],
      [{ subcalendarId: 'id' }],
      [{ format: 'text' }],
      [{ startDate: '' }],
      [{ endDate: undefined }],
      [{ subcalendarId: undefined }],
    ])('invalid options value', function (options) {
      expect(() => event.getEvents(options)).toThrow()
    })

    test.each([[{}], [{ subcalendarId: null }]])(
      'ignored options value',
      function (options) {
        event.getEvents(options)
        expect(Request.get).toHaveBeenCalledTimes(1)
        expect(Request.get).toHaveBeenCalledWith(`/events`)
      }
    )

    test('invalid option parameter', function () {
      expect(() => event.getEvents({ someKey: true })).toThrow()
    })

    test.each([[], 'string', true, false, 123, null])(
      'invalid options',
      function (option) {
        expect(() => event.getEvents(option)).toThrow()
      }
    )

    test('ignored option: undefined', function () {
      event.getEvents(undefined)
      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events`)
    })
  })

  describe('method: listEvent', function () {
    test('with event id (number)', function () {
      event.listEvent(1234)
      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events/1234`)
    })

    test('with event id (string)', function () {
      event.listEvent('1234')
      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events/1234`)
    })

    test('without event id', function () {
      expect(() => event.listEvent()).toThrow()
    })

    test.each([[], 'string', true, false, {}, null, undefined])(
      'invalid event id',
      function (id) {
        expect(() => event.listEvent(id)).toThrow()
      }
    )
  })
})
