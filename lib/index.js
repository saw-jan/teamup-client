const Client = require('./Client')
const Logger = require('./Logger')
const Request = require('./Request')
const Events = require('./Events')
const SubCalendar = require('./SubCalendar')

module.exports = class TeamupClient {
  #Client
  #Logger
  #Request

  constructor({ url, calToken, apiKey, calPassword }) {
    if (!this.constructor.instance) {
      this.constructor.instance = this

      this.#Logger = new Logger()
      this.#Client = new Client(url, calToken, apiKey, calPassword)
      this.#Request = new Request(this.#Client)

      this.Events = new Events(this.#Request, this.#Logger)
      this.SubCalendar = new SubCalendar(this.#Request, this.#Logger)
    }
    return this.constructor.instance
  }
}
