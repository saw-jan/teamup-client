## Teamup Client

[Teamup API Documentation](https://apidocs.teamup.com/)

### Installation

```bash
npm i @sawjan/teamup-client
```

OR

```bash
yarn add @sawjan/teamup-client
```

### Example

```js
const Client = require('@sawjan/teamup-client')

// create a client instance
const { SubCalendar } = new Client({
  url: 'https://api.teamup.com',
  calToken: '<calendar_token>',
  apiKey: '<api_key>',
})

// list all the sub-calendars
SubCalendar.listSubCalendars().then(({ data }) => {
  console.log(data)
})
```

### APIs

#### **Events**

1.  **listEvents**([options])

    - `options?` \<Object\>

      - `startDate?`: \<string\>

      - `endDate?`: \<string\>

      - `subcalendarId?`: \<Array\<number\>\>

      - `query?`: \<string\>

    - Returns: \<Promise\<Response\>\>

1.  **listEvent**(eventId)

    - `eventId` \<number\>
    - Returns: \<Promise\<Response\>\>

#### **SubCalendar**

1.  **listSubCalendars**([options])

    - `options?` \<Object\>

      - `includeInactive?`: \<boolean\>

    - Returns: \<Promise\<Response\>\>

1.  **listSubCalendar**(subCalendarId)

    - `subCalendarId` \<number\>
    - Returns: \<Promise\<Response\>\>
