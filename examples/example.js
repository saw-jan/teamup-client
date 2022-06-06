const Client = require('@sawjan/teamup-client')

const { SubCalendar } = new Client({
  url: 'https://api.teamup.com',
  calToken: process.env.CALENDAR_TOKEN,
  apiKey: process.env.API_KEY,
})

;(async function () {
  const { data } = await SubCalendar.listSubCalendars()
  console.log(data)
})()
