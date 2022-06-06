## Teamup Client

[Teamup API Documentation](https://apidocs.teamup.com/)

### Installation

```bash
npm i @sawjan/teamup-client
```

### Usage

```js
const Client = require('@sawjan/teamup-client')

const { SubCalendar } = new Client({
  url: 'https://api.teamup.com',
  calToken: '<calendar_token>',
  apiKey: '<api_key>',
})

SubCalendar.listSubCalendars().then(({ data }) => {
  console.log(data)
})
```

### APIs

#### **Events**

1.  **listEvents**

    _Args_:

    startDate: _string_ [YYYY-MM-DD] _(optional)_

    endDate: _string_ [YYYY-MM-DD] _(optional)_

    subcalendarId: _array_ _(optional)_

    query: _string_ _(optional)_

1.  **listEvent**

    _Args_:

    \*eventId: number

#### **SubCalendar**

1.  **listSubCalendars**

    _Args_:

    includeInactive: _boolean_ _(optional)_

1.  **listSubCalendar**

    _Args_:

    \*subCalendarId: _number_
