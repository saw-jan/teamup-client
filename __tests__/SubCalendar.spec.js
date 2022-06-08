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

    test.each([[[]], ['string'], [true], [false], [123]])(
      'invalid options',
      function (options) {
        expect(() => API.listSubCalendars(options)).toThrow()
      }
    )
  })

  describe('method: listSubCalendar', function () {
    test('with event id (number)', function () {
      API.listSubCalendar(1234)

      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('with event id (string)', function () {
      API.listSubCalendar('1234')

      expect(Request.get).toHaveBeenCalledTimes(1)
    })

    test('without event id', function () {
      expect(() => API.listSubCalendar()).toThrow()
    })
  })
})
