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
      API.listEvents(options)
      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test.each([
      [{ startDate: true }],
      [{ endDate: [] }],
      [{ query: {} }],
      [{ subcalendarId: 'id' }],
      [{ format: 'text' }],
    ])('invalid options value', function (options) {
      expect(() => API.listEvents(options)).toThrow()
    })

    test.each([
      [{}],
      [{ startDate: '' }],
      [{ endDate: undefined }],
      [{ query: false }],
      [{ subcalendarId: null }],
      [{ format: 0 }],
    ])('ignored options value', function (options) {
      API.listEvents(options)
      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('invalid option parameter', function () {
      expect(() => API.listEvents({ someKey: true })).toThrow()
    })

    // TODO:
    // remove this loop and use test.each when the tests pass
    ;[[], true, false, 123].forEach((option) => {
      test.failing('invalid options', function () {
        expect(() => API.listEvents(option)).toThrow()
      })
    })
    // remove this and added to above list
    test('invalid options - odd', function () {
      expect(() => API.listEvents('string')).toThrow()
    })
  })

  describe('method: listEvent', function () {
    test('with event id (number)', function () {
      API.listEvent(1234)
      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('with event id (string)', function () {
      API.listEvent('1234')
      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('without event id', function () {
      expect(() => API.listEvent()).toThrow()
    })

    // TODO:
    // remove this loop and use test.each when the tests pass
    ;[[], 'string', true, 123].forEach((id) => {
      test.failing('invalid event id', function () {
        expect(() => API.listEvent(id)).toThrow()
      })
    })
    // remove this and added to above list
    test('invalid event id - odd', function () {
      expect(() => API.listEvent(false)).toThrow()
    })
  })
})
