const axios = require('axios')

module.exports = class Request {
  #axios

  constructor(client) {
    this.#axios = axios.create({
      baseURL: client.getBaseUrl(),
      headers: client.getAuthHeader(),
    })
  }

  get(path) {
    console.log(path)
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
