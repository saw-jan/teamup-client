const Request = require('./Request')
const Event = require('./Event')
const SubCalendar = require('./SubCalendar')

module.exports = class TeamupClient {
  constructor({ url, calendarKey, teamupToken, teamupPassword, bearerToken }) {
    const request = new Request(url, calendarKey, {
      teamupToken,
      teamupPassword,
      bearerToken,
    })

    // exposed API
    this.Event = new Event(request)
    this.SubCalendar = new SubCalendar(request)
  }
}
