# Architectural Decisions Log

This document tracks major technical decisions, alternatives considered, and the rationale behind the final choices made during development.

## Decision 1: Relational Database over NoSQL
- **Decision**: Use **PostgreSQL**.
- **Alternatives Considered**: MongoDB, Firebase.
- **Final Choice & Reason**: PostgreSQL. The assignment explicitly required a relational DB. Additionally, expense-sharing applications inherently rely on highly relational, structured data (Users -> Memberships -> Groups -> Expenses -> Participants). ACID compliance ensures split transactions don't result in orphaned shares.

## Decision 2: Historical Membership Tracking
- **Decision**: Use a dedicated `Membership` junction table with `joinedAt` and `leftAt` timestamps instead of a simple array of users.
- **Alternatives Considered**: Storing a JSON array of active users on the `Group` model, or permanently deleting the row when a user leaves.
- **Final Choice & Reason**: The temporal `Membership` table. If Sam joins later, he shouldn't be liable for prior expenses. If Meera leaves earlier, her historical balances must remain frozen. Hard deletions would corrupt historical balance calculations.

## Decision 3: Storing Calculated Participant Shares
- **Decision**: Store the absolute calculated financial share of each participant per expense in an `ExpenseParticipant` table.
- **Alternatives Considered**: Storing only the percentage/split rule and calculating the actual debt dynamically on-the-fly when loading the dashboard.
- **Final Choice & Reason**: Store the calculated shares. This enforces strict traceability. Users can inspect exactly how balances were generated down to the penny. If a split logic bug is introduced in V2 of the app, historical transactions remain completely unaffected because their explicit financial values are hard-coded in the database.
