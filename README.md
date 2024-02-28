## Teamup Calendar Client

A library for working with [Teamup](https://www.teamup.com/) calendar.

### Installation

```bash
npm i @sawjan/teamup-client
```

### Usage

```js
const TeamupClient = require('@sawjan/teamup-client')

const client = new TeamupClient({
  url: 'https://api.teamup.com',
  calendarKey: '<calendar-key>',
  teamupToken: '<teamup-token>',
  bearerToken: '<bearer-token>',
})
```

### Examples

See example code: [examples](./examples/)

### APIs

#### **Event**

- .**getEvents**([options])

  For available options see [Query Parameters](https://apidocs.teamup.com/docs/api/0f9f896800ffe-get-events-collection-get-events-changed-search-events#Query-Parameters)

- .**getAllDayEvents**([options])
- .**getRecurringEvents**([options])
- .**getEvent**(eventId)

#### **SubCalendar**

- .**getSubCalendars**([options])

  For available options see [Query Parameters](https://apidocs.teamup.com/docs/api/046361930f27a-get-a-collection-of-sub-calendars#Query-Parameters)

- .**getInactiveSubCalendars**([options])
- .**getSubCalendar**(subCalendarId):
- .**getSubCalendarByName**(subCalendarName)

All APIs will either return Promise\<[SuccessResponse](#successresponse)\> or throw Promise\<[ErrorResponse](#errorresponse)\>

## Structs

### SuccessResponse

```js
{
  status: <number>,
  statusText: <string>,
  data: <array>|<object>
}
```

### ErrorResponse

```js
{
  status: <number>,
  statusText: <string>,
  error: <object>
}
```
