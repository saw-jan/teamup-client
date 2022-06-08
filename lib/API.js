module.exports = class API {
  _Request
  _Logger

  constructor(request, logger) {
    this._Request = request
    this._Logger = logger
  }
}
