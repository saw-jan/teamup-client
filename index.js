require('dotenv').config()

const axios = require('axios')

const CALENDAR_TOKEN = process.env.CALENDAR_TOKEN || ''
const TEAMUP_TOKEN = process.env.TEAMUP_TOKEN || ''

const fetch = axios.create({
  baseURL: `https://api.teamup.com/${CALENDAR_TOKEN}`,
  headers: {
    'Teamup-Token': TEAMUP_TOKEN,
  },
})

const startDate = '2022-06-06'
const endDate = '2022-06-17'

function getCalenderEvents(startDate = '', endDate = '', subcalendars = []) {
  let params = `startDate=${startDate}&endDate=${endDate}`
  subcalendars.forEach((sub) => {
    params += `&subcalendarId[]=${sub}`
  })

  return fetch.get(`/events?${params}`)
}

function getSubCalendars() {
  return fetch.get('/subcalendars')
}

function getSubCalendar(subcalendarId) {
  return fetch.get(`/subcalendars/${subcalendarId}`)
}

async function generateData() {
  const leaves = []
  const wfh = []

  // sub calender ids
  const calTypes = []
  const {
    data: { subcalendars },
  } = await getSubCalendars()
  // get calender ids for 'leave' and 'work-from-home'
  subcalendars.forEach(({ name, id }) => {
    if (name === 'leave' || name === 'work-from-home') {
      calTypes.push(id)
    }
  })

  // get calender events
  const {
    data: { events },
  } = await getCalenderEvents(startDate, endDate, calTypes)

  for (const event of events) {
    const { start_dt, title, who, all_day, subcalendar_id } = event
    const {
      data: {
        subcalendar: { name },
      },
    } = await getSubCalendar(subcalendar_id)

    const date = new Date(start_dt).toUTCString().replace(/ [0-9]{2}:(.*)/, '')

    if (name === 'leave') {
      leaves.push({
        title,
        who,
        all_day,
        type: name,
        date,
      })
    } else if (name === 'work-from-home') {
      wfh.push({
        title,
        who,
        all_day,
        type: name,
        date,
      })
    }
  }
}

generateData()
