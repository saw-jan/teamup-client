const { join } = require('path')

module.exports = class Client {
  #API_KEY_HEADER_NAME = 'Teamup-Token'
  #PASSWORD_HEADER_NAME = 'Teamup-Password'

  #url
  #calToken
  #apiKey
  #calPassword

  constructor(url, calToken, apiKey, calPassword) {
    this.#url = url
    this.#calToken = calToken
    this.#apiKey = apiKey
    this.#calPassword = calPassword
  }

  getBaseUrl() {
    return join(this.#url, this.#calToken).replace(
      /(?<=http(s)?):\/(?!\/)/,
      '://'
    )
  }

  getAuthHeader() {
    const headers = { [this.#API_KEY_HEADER_NAME]: this.#apiKey }
    if (this.#calPassword)
      headers[this.#PASSWORD_HEADER_NAME] = this.#calPassword

    return headers
  }
}
