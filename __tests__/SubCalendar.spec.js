const { getSuccesResponse, getErrorResponse } = require('./helpers/helpers')
const SubCalendar = require('../lib/SubCalendar')

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

const route = '/subcalendars'
const params = {
  includeInactive: null,
}

describe('SubCalendar class', function () {
  const spyValidateOptionType = jest.spyOn(API.prototype, '_validateOptionType')
  const spyValidateId = jest.spyOn(API.prototype, '_validateId')
  const spyValidateArg = jest.spyOn(API.prototype, '_validateArg')

  let spyRenderSuccessResponse, subcalendar
  beforeEach(function () {
    subcalendar = new SubCalendar(new Request())
    spyRenderSuccessResponse = jest
      .spyOn(API.prototype, '_renderSuccessResponse')
      .mockImplementation((data) => data)
    jest
      .spyOn(API.prototype, '_renderErrorResponse')
      .mockImplementation((data) => {
        throw data
      })
  })

  afterEach(function () {
    jest.clearAllMocks()
  })

  describe('method: getSubCalendars', function () {
    const successResponse = {
      ...getSuccesResponse('subcalendars'),
      data: { subcalendars: [{}, {}] },
    }
    let spyGet
    beforeEach(function () {
      spyGet = jest
        .spyOn(subcalendar._request, 'get')
        .mockImplementation(() => successResponse)
    })

    test('no options', async function () {
      const response = await subcalendar.getSubCalendars()

      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(route, {})
      expect(spyValidateOptionType).toHaveBeenCalledTimes(1)
      expect(spyValidateOptionType).toHaveBeenCalledWith(params)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderSuccessResponse).toHaveBeenCalledWith(
        successResponse,
        'subcalendars'
      )
      expect(response.data).toStrictEqual(successResponse.data)
    })
    test.each([[{ includeInactive: true }], [{ includeInactive: false }]])(
      'valid options value',
      async function (options) {
        await subcalendar.getSubCalendars(options)

        expect(spyGet).toHaveBeenCalledTimes(1)
        expect(spyGet).toHaveBeenCalledWith(route, options)
      }
    )
    test.each([[{}], [{ includeInactive: null }]])(
      'ignored options value',
      async function (options) {
        await subcalendar.getSubCalendars(options)
        expect(spyGet).toHaveBeenCalledTimes(1)
        expect(spyGet).toHaveBeenCalledWith(route, {})
      }
    )
    test('ignored option: undefined', async function () {
      await subcalendar.getSubCalendars(undefined)
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith('/subcalendars', {})
    })
    test('error response', async function () {
      spyGet.mockImplementation(() => Promise.reject(getErrorResponse()))
      expect(
        async () => await subcalendar.getSubCalendars()
      ).rejects.toStrictEqual(getErrorResponse())
    })
    test('error', async function () {
      const err = new Error()
      spyGet.mockImplementation(() => {
        throw err
      })
      expect(
        async () => await subcalendar.getSubCalendars()
      ).rejects.toStrictEqual(err)
    })
  })

  describe('method: getInactiveSubCalendars', function () {
    test('success response', async function () {
      const successResponse = {
        ...getSuccesResponse('subcalendars'),
        data: [{ active: false }, { active: true }],
      }
      const spyGetEvents = jest
        .spyOn(subcalendar, 'getSubCalendars')
        .mockImplementation(() => successResponse)

      const response = await subcalendar.getInactiveSubCalendars()

      expect(spyGetEvents).toHaveBeenCalledTimes(1)
      expect(spyGetEvents).toHaveBeenCalledWith({ includeInactive: true })
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(response.data).toHaveLength(1)
      expect(response.data).toStrictEqual([{ active: false }])
    })
    test('error response', async function () {
      const spyGetEvents = jest
        .spyOn(subcalendar, 'getSubCalendars')
        .mockImplementation(() => getErrorResponse())
      expect(
        async () => await subcalendar.getInactiveSubCalendars()
      ).rejects.toStrictEqual(getErrorResponse())
    })
    test('error', async function () {
      const err = new Error()
      jest.spyOn(subcalendar, 'getSubCalendars').mockImplementation(() => {
        throw err
      })
      expect(
        async () => await subcalendar.getInactiveSubCalendars()
      ).rejects.toStrictEqual(err)
    })
  })

  describe('method: getSubCalendarByName', function () {
    test('success response', async function () {
      const successResponse = {
        ...getSuccesResponse('subcalendars'),
        data: [{ name: 'meeting' }, { name: 'leave' }],
      }
      const spyGetEvents = jest
        .spyOn(subcalendar, 'getSubCalendars')
        .mockImplementation(() => successResponse)

      const response = await subcalendar.getSubCalendarByName('meeting')

      expect(spyValidateArg).toHaveBeenCalledTimes(1)
      expect(spyValidateArg).toHaveBeenCalledWith('meeting', ['string'])
      expect(spyGetEvents).toHaveBeenCalledTimes(1)
      expect(spyGetEvents).toHaveBeenCalledWith()
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(response.data).toStrictEqual({ name: 'meeting' })
    })
    test('error response', async function () {
      const spyGetEvents = jest
        .spyOn(subcalendar, 'getSubCalendars')
        .mockImplementation(() => getErrorResponse())
      expect(
        async () => await subcalendar.getSubCalendarByName('meeting')
      ).rejects.toStrictEqual(getErrorResponse())
    })
    test('error', async function () {
      const err = new Error()
      jest.spyOn(subcalendar, 'getSubCalendars').mockImplementation(() => {
        throw err
      })
      expect(
        async () => await subcalendar.getSubCalendarByName('meeting')
      ).rejects.toStrictEqual(err)
    })
  })

  describe('method: getSubCalendar', function () {
    const successResponse = getSuccesResponse('subcalendar')
    let spyGet
    beforeEach(function () {
      spyGet = jest
        .spyOn(subcalendar._request, 'get')
        .mockImplementation(() => successResponse)
    })

    test('with id (number)', async function () {
      const response = await subcalendar.getSubCalendar(1234)

      expect(spyValidateId).toHaveBeenCalledTimes(1)
      expect(spyValidateId).toHaveBeenCalledWith(1234)
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(`${route}/1234`)
      expect(spyRenderSuccessResponse).toHaveBeenCalledTimes(1)
      expect(spyRenderSuccessResponse).toHaveBeenCalledWith(
        successResponse,
        'subcalendar'
      )
      expect(response.data).toStrictEqual(successResponse.data)
    })
    test('with id (string)', async function () {
      await subcalendar.getSubCalendar(1234)
      expect(spyGet).toHaveBeenCalledTimes(1)
      expect(spyGet).toHaveBeenCalledWith(`${route}/1234`)
    })
    test('error response', async function () {
      spyGet.mockImplementation(() => Promise.reject(getErrorResponse()))
      expect(
        async () => await subcalendar.getSubCalendar(1234)
      ).rejects.toStrictEqual(getErrorResponse())
    })
    test('error', async function () {
      const err = new Error()
      spyGet.mockImplementation(() => {
        throw err
      })
      expect(
        async () => await subcalendar.getSubCalendar(1234)
      ).rejects.toStrictEqual(err)
    })
  })
})
