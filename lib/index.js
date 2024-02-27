const Request = require('./Request')
const Events = require('./Events')
const SubCalendar = require('./SubCalendar')

module.exports = class TeamupClient {
  constructor({ url, calendarKey, teamupToken, teamupPassword, bearerToken }) {
    const request = new Request(url, calendarKey, {
      teamupToken,
      teamupPassword,
      bearerToken,
    })

    // exposed API
    this.Events = new Events(request)
    this.SubCalendar = new SubCalendar(request)
  }
}
