const Client = require('./Client')
const Events = require('./Events')
const SubCalendar = require('./SubCalendar')

module.exports = class TeamupClient {
  #Client

  constructor({ url, calToken, apiKey, calPassword }) {
    if (!this.constructor.instance) {
      this.constructor.instance = this

      this.#Client = new Client(url, calToken, apiKey, calPassword)
      this.Events = new Events(this.#Client)
      this.SubCalendar = new SubCalendar(this.#Client)
    }
    return this.constructor.instance
  }
}
