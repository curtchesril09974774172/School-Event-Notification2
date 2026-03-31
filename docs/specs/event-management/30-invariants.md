# Invariants for EVENT-MANAGEMENT

Invariants are conditions that must always hold true during the operation of the system.

## Data Invariants

- All events must have a unique ID
- Event dates must be in the future or present
- Event titles cannot be empty

## Business Logic Invariants

- Only users with admin role can create/update/delete events
- Events cannot be deleted if they have associated notifications pending

## System Invariants

- Database connection must be available for event operations
- API responses must include proper CORS headers