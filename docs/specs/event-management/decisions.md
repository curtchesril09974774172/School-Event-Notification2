# Decisions Log for EVENT-MANAGEMENT

## 2026-03-31 - Database Schema Choice
**Context:** Need to store event data persistently

**Options Considered:**
- Use existing MySQL database
- Add a new NoSQL database for events

**Decision:** Use existing MySQL database to maintain consistency with user data

**Consequences:** Must ensure schema compatibility, no additional infrastructure needed

---

<Add more entries as decisions are made during development>