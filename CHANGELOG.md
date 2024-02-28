# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **BREAKING:** APIs return custom data and error responses
- Document latest changes in README docs
- New TeamupClient config options: `bearerToken`
- New APIs:
  - Event.`listAllDayEvents()` Gets events occurring for the whole day
  - Event.`listRecurringEvents()` Gets recurring events

### Changed

- **BREAKING:** TeamupClient config options are renamed

  - `calToken` -> `calendarKey`
  - `apiKey` -> `teamupToken`
  - `calPassword` -> `teamupPassword`

- **BREAKING:** `Events` class is renamed to `Event`
- `Client` is merged to the `Request` class
- Consistent variables naming
- Solidify url joining
- Request `.get()` method now accepts url params as args

### Removed

- Remove `Client` class

## [1.1.0] - 2022-06-10

### Added

- Logger to handle logging
- More validation for options and ids

### Changed

- Refactor internal usage of API classes

## [1.0.0] - 2022-06-07

### Added

- `Events`, `Client`, `SubCalendar`, `API` and `Request` classes
- APIs for listing events: listEvents and listEvent
- APIs for listing sub-calendars: listSubCalendars and listSubCalendar
