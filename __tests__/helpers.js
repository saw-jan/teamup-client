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
