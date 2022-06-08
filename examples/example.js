const Client = require('@sawjan/teamup-client')

const { Events, SubCalendar } = new Client({
  url: 'https://api.teamup.com',
  calToken: process.env.CALENDAR_TOKEN,
  apiKey: process.env.API_KEY,
})

;(async function getLeaves() {
  // fetch id for leave calendar
  let leaveCalId
  await SubCalendar.listSubCalendars({ includeInactive: true }).then(
    ({ data: { subcalendars } }) => {
      for (const subCal of subcalendars) {
        if (subCal.name === 'leave') {
          leaveCalId = subCal.id
          break
        }
      }
    }
  )

  // get all events identified by leaveCalId
  const {
    data: { events },
  } = await Events.listEvents({
    startDate: '2022-06-06',
    endDate: '2022-06-10',
    subcalendarId: leaveCalId,
  })

  // leave events
  console.log(events)
})()
