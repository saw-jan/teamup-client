# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Removed

## [2.0.1] - 2024-05-24

### Fixed

- get requests doesn't pass query params correctly (https://github.com/saw-jan/teamup-client/pull/9)

## [2.0.0] - 2024-05-23

### Added

- **BREAKING:** APIs return custom data and error responses
- Document latest changes in README docs
- New TeamupClient config options: `bearerToken`
- New APIs:
  - Event.`getAllDayEvents()` Gets events occurring for the whole day
  - Event.`getRecurringEvents()` Gets recurring events
  - SubCalendar.`getInactiveSubCalendars()` Gets inactive sub-calendars
  - SubCalendar.`getSubCalendarByName()` Gets a sub-calendar by name

### Changed

- **BREAKING:** TeamupClient config options are renamed

  - `calToken` -> `calendarKey`
  - `apiKey` -> `teamupToken`
  - `calPassword` -> `teamupPassword`

- **BREAKING:** `Events` class is renamed to `Event`
- **BREAKING:** exposed methods are renamed:
  - `listEvents` -> `getEvents`
  - `listEvent` -> `getEvent`
  - `listSubCalendars` -> `getSubCalendars`
  - `listSubCalendar` -> `getSubCalendar`
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
