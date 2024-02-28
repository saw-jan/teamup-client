//
// This example works with the current codebase
//

const Teamup = require('../lib')

const client = new Teamup({
  url: 'https://api.teamup.com',
  calendarKey: process.env.CALENDAR_KEY,
  teamupToken: process.env.TEAMUP_TOKEN,
})

;(async function getLeaves() {
  // fetch id for leave calendar
  let leaveCalId
  await client.SubCalendar.getSubCalendars()
    .then(({ data: { subcalendars } }) => {
      for (const subCal of subcalendars) {
        if (subCal.name === 'leave') {
          leaveCalId = subCal.id
          break
        }
      }
    })
    .catch((err) => console.log(err))

  if (leaveCalId) {
    // get all events identified by leaveCalId
    await client.Event.getEvents({
      startDate: '2022-06-06',
      endDate: '2022-06-10',
      subcalendarId: [leaveCalId],
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }
})()
