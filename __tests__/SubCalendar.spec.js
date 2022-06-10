const { buildParams } = require('./helpers')
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
        const urlParams = buildParams(options)
        API.listSubCalendars(options)

        expect(Request.get).toHaveBeenCalledTimes(1)
        expect(Request.get).toHaveBeenCalledWith(`/subcalendars?${urlParams}`)
      }
    )

    test.each([
      [{ includeInactive: 'text' }],
      [{ includeInactive: [] }],
      [{ includeInactive: {} }],
      [{ includeInactive: undefined }],
      [{ includeInactive: 1234 }],
    ])('invalid options value', function (options) {
      expect(() => API.listSubCalendars(options)).toThrow()
    })

    test.each([[{}], [{ includeInactive: null }]])(
      'ignored options value',
      function (options) {
        API.listSubCalendars(options)

        expect(Request.get).toHaveBeenCalledTimes(1)
        expect(Request.get).toHaveBeenCalledWith('/subcalendars')
      }
    )

    test('invalid option parameter', function () {
      expect(() => API.listSubCalendars({ someKey: true })).toThrow()
    })

    test.each([([], 'string', true, false, 123, null)])(
      'invalid options',
      function (option) {
        expect(() => API.listSubCalendars(option)).toThrow()
      }
    )

    test('ignored option: undefined', function () {
      API.listSubCalendars(undefined)

      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith('/subcalendars')
    })
  })

  describe('method: listSubCalendar', function () {
    test('with id (number)', function () {
      API.listSubCalendar(1234)

      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith('/subcalendars/1234')
    })

    test('with id (string)', function () {
      API.listSubCalendar('1234')

      expect(Request.get).toHaveBeenCalledTimes(1)
      expect(Request.get).toHaveBeenCalledWith('/subcalendars/1234')
    })

    test('without id', function () {
      expect(() => API.listSubCalendar()).toThrow()
    })

    test.each([[], {}, true, false, 'text', null, undefined])(
      'invalid id',
      function (id) {
        expect(() => API.listSubCalendar(id)).toThrow()
      }
    )
  })
})
