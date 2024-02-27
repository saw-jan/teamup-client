const axios = require('axios')
const { trim } = require('lodash')

module.exports = class Request {
  #axios

  constructor(
    url,
    calendarKey,
    headers = { teamupToken, teamupPassword, bearerToken }
  ) {
    this.#axios = axios.create({
      baseURL: this.getBaseUrl(url, calendarKey),
      headers: this.getAuthHeaders(headers),
    })
  }

  getBaseUrl(url, calendarKey) {
    url = trim(url, '/') + '/'
    calendarKey = trim(calendarKey, '/')
    return new URL(calendarKey, url).href
  }

  getAuthHeaders(headers = { teamupToken, teamupPassword, bearerToken }) {
    const { teamupToken, teamupPassword, bearerToken } = headers

    const authHeaders = { 'Teamup-Token': teamupToken }

    if (teamupPassword) {
      authHeaders['Teamup-Password'] = teamupPassword
    }

    if (bearerToken) {
      authHeaders['Authorization'] = `Bearer ${bearerToken}`
    }

    return authHeaders
  }

  get(path) {
    return this.#axios.get(path)
  }

  post(path, body) {
    return this.#axios.post(path, body)
  }

  put(path) {
    return this.#axios.post(path, body)
  }

  delete(path) {
    return this.#axios.post(path)
  }
}
