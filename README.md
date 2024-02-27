## Teamup Client

[Teamup API Documentation](https://apidocs.teamup.com/)

### Installation

```bash
npm i @sawjan/teamup-client
```

### Examples

See example code: [examples](./examples/)

### APIs

#### **Events**

1.  **listEvents**([options])

    - `options?` \<Object\>

      - `startDate?`: \<string\>

      - `endDate?`: \<string\>

      - `query?`: \<string\>

      For more options see [Query Parameters](https://apidocs.teamup.com/docs/api/0f9f896800ffe-get-events-collection-get-events-changed-search-events#Query-Parameters)

    - Returns: Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

1.  **listEvent**(eventId)

    - `eventId` \<number\>
    - Returns: Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

#### **SubCalendar**

1.  **listSubCalendars**([options])

    - `options?` \<Object\>

      - `includeInactive?`: \<boolean\>

    - Returns: Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

1.  **listSubCalendar**(subCalendarId)

    - `subCalendarId` \<number\>
    - Returns: Promise\<[Response](#response)|[ErrorResponse](#errorresponse)\>

## Structs

### Response

```js
{
  status: <string>,
  statusText: <string>,
  data: <object>
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
