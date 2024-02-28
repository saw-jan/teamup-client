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

1.  **listEvents**([options]): Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

    For available options see [Query Parameters](https://apidocs.teamup.com/docs/api/0f9f896800ffe-get-events-collection-get-events-changed-search-events#Query-Parameters)

1.  **listEvent**(eventId): Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

#### **SubCalendar**

1.  **listSubCalendars**([options]): Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

    For available options see [Query Parameters](https://apidocs.teamup.com/docs/api/046361930f27a-get-a-collection-of-sub-calendars#Query-Parameters)

1.  **listSubCalendar**(subCalendarId): Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

## Structs

### Response

```js
{
  status: <string>,
  statusText: <string>,
  data: <array>|<object>
}
```

### ErrorResponse

```js
{
  status: <string>,
  statusText: <string>,
  error: <object>
}
```
