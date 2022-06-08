module.exports = class Logger {
  error(message) {
    throw new Error(`[ERROR] ${message}`)
  }

  warn(message) {
    console.warn(`[WARN] ${message}`)
  }

  info(message) {
    console.warn(`[INFO] ${message}`)
  }
}
