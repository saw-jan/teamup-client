const { buildParams } = require('./helpers')
const Events = require('../lib/Events')
const Logger = require('../lib/Logger')

describe('Events class', function () {
  let API
  const Request = { get: jest.fn() }

  beforeAll(function () {
    API = new Events(Request, new Logger())
  })

  describe('method: listEvents', function () {
    test('no options', function () {
      API.listEvents()
      expect(Request.get).toHaveBeenCalledTimes(1)
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
      API.listEvents(options)

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
      expect(() => API.listEvents(options)).toThrow()
    })

    test.each([[{}], [{ subcalendarId: null }]])(
      'ignored options value',
      function (options) {
        API.listEvents(options)
        expect(Request.get).toHaveBeenCalledTimes(1)
        expect(Request.get).toHaveBeenCalledWith(`/events`)
      }
    )

    test('invalid option parameter', function () {
      expect(() => API.listEvents({ someKey: true })).toThrow()
    })

    test.each([[], 'string', true, false, 123, null])(
      'invalid options',
      function (option) {
        expect(() => API.listEvents(option)).toThrow()
      }
    )

    test('ignored option: undefined', function () {
      API.listEvents(undefined)
      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events`)
    })
  })

  describe('method: listEvent', function () {
    test('with event id (number)', function () {
      API.listEvent(1234)
      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events/1234`)
    })

    test('with event id (string)', function () {
      API.listEvent('1234')
      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith(`/events/1234`)
    })

    test('without event id', function () {
      expect(() => API.listEvent()).toThrow()
    })

    test.each([[], 'string', true, false, {}, null, undefined])(
      'invalid event id',
      function (id) {
        expect(() => API.listEvent(id)).toThrow()
      }
    )
  })
})
