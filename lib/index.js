const Client = require('./Client')
const Logger = require('./Logger')
const Events = require('./Events')
const SubCalendar = require('./SubCalendar')

module.exports = class TeamupClient {
  #Client
  #Logger

  constructor({ url, calToken, apiKey, calPassword }) {
    if (!this.constructor.instance) {
      this.constructor.instance = this

      this.#Logger = new Logger()
      this.#Client = new Client(url, calToken, apiKey, calPassword)
      this.Events = new Events(this.#Client, this.#Logger)
      this.SubCalendar = new SubCalendar(this.#Client, this.#Logger)
    }
    return this.constructor.instance
  }
}
