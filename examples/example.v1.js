//
// This example works with the version ^1
//

const Client = require('../lib')

const { Events, SubCalendar } = new Client({
  url: 'https://api.teamup.com',
  calToken: process.env.CALENDAR_TOKEN,
  apiKey: process.env.API_KEY,
})

;(async function getLeaves() {
  // fetch id for leave calendar
  let leaveCalId
  await SubCalendar.listSubCalendars()
    .then(({ data: { subcalendars } }) => {
      for (const subCal of subcalendars) {
        if (subCal.name === 'leave') {
          leaveCalId = subCal.id
          break
        }
      }
    })
    .catch((err) => console.log(err.response.data))

  if (leaveCalId) {
    // get all events identified by leaveCalId
    await Events.listEvents({
      startDate: '2022-06-06',
      endDate: '2022-06-10',
      subcalendarId: [leaveCalId],
    })
      .then(({ data: { events } }) => console.log(events))
      .catch((err) => console.log(err.response.data))
  }
})()
