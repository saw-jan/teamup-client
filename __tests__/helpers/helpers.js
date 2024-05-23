exports.buildParams = function (params) {
  let urlParams = ''
  Object.keys(params).forEach(function (key) {
    if (key === 'subcalendarId') {
      params[key].forEach((id) => {
        urlParams += `${key}[]=${id}&`
      })
    } else {
      urlParams += `${key}=${params[key]}&`
    }
  })
  return urlParams.substring(0, urlParams.length - 1)
}

exports.getSuccesResponse = function (filter) {
  return { status: 200, statusText: 'Ok', data: { [filter]: {} } }
}

exports.getErrorResponse = function () {
  return { status: 400, statusText: 'Bad Request', error: {} }
}
