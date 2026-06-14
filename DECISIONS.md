# Decision 1

Decision:
Use PostgreSQL

Alternatives:
- MongoDB
- MySQL

Reason:
Assignment explicitly requires relational DB.

---

# Decision 2

Decision:
Use Membership table instead of storing members directly.

Reason:
Sam joins later.
Meera leaves earlier.

Historical calculations require membership history.

---

# Decision 3

Decision:
Store calculated participant shares.

Reason:
Traceability.
Users can inspect exactly how balances were generated.


