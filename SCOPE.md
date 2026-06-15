# Import Anomaly Detection Scope

This document outlines the 10 data quality anomalies detected by the `anomalyDetectionEngine` during CSV imports, detailing the detection logic and handling strategy.

## 1. Duplicate Expense
- **Detection**: Locates an existing expense in the database with the exact same `date`, `description`, and `amount`.
- **Handling Strategy**: Flagged with **Medium Severity**. Prompts user for approval to merge or ignore, preventing accidental deletion of legitimate recurring expenses (e.g., daily coffee).

## 2. Conflicting Duplicate
- **Detection**: Finds an existing expense with the same `date` and `description`, but a different `amount`.
- **Handling Strategy**: Flagged with **High Severity**. Requires user manual resolution to ensure the system does not silently overwrite a verified historical truth.

## 3. Missing Currency
- **Detection**: Checks if the `currency` string is null, undefined, or empty.
- **Handling Strategy**: Flagged with **Low Severity**. Defaults to the group's base currency (e.g., USD) pending user confirmation to ensure split calculations do not throw `NaN` errors.

## 4. Invalid Date
- **Detection**: Passes the date string into a Date constructor and checks for `isNaN`.
- **Handling Strategy**: Flagged with **High Severity**. Rejects the row or prompts the user for manual entry. Temporal accuracy is strictly required for historical balances.

## 5. Ambiguous Date
- **Detection**: Splits the date. If both the day and month segments evaluate to `<= 12` (e.g., `04/05/2026`), the format is strictly ambiguous.
- **Handling Strategy**: Flagged with **Medium Severity**. Prompts the user to explicitly select `MM/DD/YYYY` or `DD/MM/YYYY`.

## 6. Unknown Member
- **Detection**: Iterates through the active `Membership` records of the Group. Flags if the participant's email is not found.
- **Handling Strategy**: Flagged with **High Severity**. Prompts the user to send an invite link to the unknown member or map them to an existing user alias.

## 7. Former Member
- **Detection**: Compares the expense `date` against the participant's `leftAt` timestamp in the Membership table.
- **Handling Strategy**: Flagged with **High Severity**. If the expense occurred after they left the group, the split is rejected to preserve the historical ledger.

## 8. Settlement Logged as Expense
- **Detection**: Uses a RegEx/keyword search against the description for terms like `settle`, `paid back`, `repayment`.
- **Handling Strategy**: Flagged with **Medium Severity**. Suggests converting the row into a `Settlement` entity, as logging it as an expense would incorrectly inflate gross group spending.

## 9. Negative Amount
- **Detection**: Mathematical check for `amount < 0`.
- **Handling Strategy**: Flagged with **High Severity**. Expenses represent positive financial liability. Suggests converting to a refund or settlement.

## 10. Precision Issue
- **Detection**: Checks if the decimal length of the amount strictly exceeds `2`.
- **Handling Strategy**: Flagged with **Low Severity**. The system proposes rounding to 2 decimal places to prevent floating-point cascading errors during complex percentage splits.

## User Approval Workflow
Every destructive action (Reject, Edit) requires explicit user approval. 
Original anomalous payload data (`rawData`) is **never deleted**; the anomaly row simply shifts to a `REJECTED` or `EDITED_AND_APPROVED` status. This guarantees an immutable audit trail.
