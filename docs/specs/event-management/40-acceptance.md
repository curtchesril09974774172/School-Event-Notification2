# Acceptance Criteria for EVENT-MANAGEMENT

## Scenario 1: Admin Creates Event
**Given** An authenticated admin user
**When** They submit a valid event creation form
**Then** The event is saved and appears in the events list

## Scenario 2: Student Views Events
**Given** An authenticated student user
**When** They navigate to the events page
**Then** They see a list of upcoming events

## Scenario 3: Admin Updates Event
**Given** An existing event
**When** Admin edits the event details
**Then** The changes are saved and visible to all users

## Scenario 4: Unauthorized User Tries to Create Event
**Given** A non-admin user
**When** They attempt to create an event
**Then** They receive a 403 Forbidden error