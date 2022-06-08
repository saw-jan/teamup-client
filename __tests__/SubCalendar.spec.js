const SubCalendar = require('../lib/SubCalendar')
const Logger = require('../lib/Logger')

describe('SubCalendar class', function () {
  let API
  const Request = { get: jest.fn() }

  beforeAll(function () {
    API = new SubCalendar(Request, new Logger())
  })

  describe('method: listSubCalendars', function () {
    test('no options', function () {
      API.listSubCalendars()

      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test.each([[{ includeInactive: true }], [{ includeInactive: false }]])(
      'valid options value',
      function (options) {
        API.listSubCalendars(options)

        expect(Request.get).toHaveBeenCalledTimes(1)
      }
    )

    test.each([
      [{ includeInactive: 'text' }],
      [{ includeInactive: [] }],
      [{ includeInactive: {} }],
    ])('invalid options value', function (options) {
      expect(() => API.listSubCalendars(options)).toThrow()
    })

    test.each([
      [{}],
      [{ includeInactive: '' }],
      [{ includeInactive: null }],
      [{ includeInactive: undefined }],
      [{ includeInactive: 0 }],
    ])('ignored options value', function (options) {
      API.listSubCalendars(options)

      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('invalid option parameter', function () {
      expect(() => API.listSubCalendars({ someKey: true })).toThrow()
    })

    // TODO:
    // remove this loop and use test.each when the tests pass
    ;[[], true, false, 123].forEach((option) => {
      test.failing('invalid options', function () {
        expect(() => API.listSubCalendars(option)).toThrow()
      })
    })
    // remove this and added to above list
    test('invalid options - odd', function () {
      expect(() => API.listSubCalendars('string')).toThrow()
    })
  })

  describe('method: listSubCalendar', function () {
    test('with id (number)', function () {
      API.listSubCalendar(1234)

      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('with id (string)', function () {
      API.listSubCalendar('1234')

      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('without id', function () {
      expect(() => API.listSubCalendar()).toThrow()
    })

    // TODO:
    // remove this loop and use test.each when the tests pass
    ;[[], {}, true, 'text'].forEach((id) => {
      test.failing('invalid id', function () {
        expect(() => API.listSubCalendar(id)).toThrow()
      })
    })
    // remove this and added to above list
    test('invalid id - odd', function () {
      expect(() => API.listSubCalendar(false)).toThrow()
    })
  })
})
