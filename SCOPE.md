# Import Anomaly Detection Scope

## Anomaly 1
Type: Duplicate Expense
Detection: Same amount, same date, identical description.
Action: Flagged for user approval.
Reason: Avoid accidental double counting while preventing deletion of legitimate identical recurring expenses.

## Anomaly 2
Type: Conflicting Duplicate
Detection: Same date and description, but different amount.
Action: Flag for user manual resolution.
Reason: Prevents overriding legitimate updates or logging conflicting truths.

## Anomaly 3
Type: Missing Currency
Detection: Currency string is null or empty.
Action: Default to USD pending user confirmation.
Reason: Calculations require uniform currency; assuming default prevents hard failure.

## Anomaly 4
Type: Invalid Date
Detection: Date string cannot be parsed by Date object.
Action: Prompt user for manual date entry.
Reason: Ensures temporal accuracy for balances.

## Anomaly 5
Type: Ambiguous Date
Detection: Date parts (day and month) are both <= 12 (e.g., 04/05/2026).
Action: Prompt user to confirm format (MM/DD vs DD/MM).
Reason: Prevents logging an April expense in May.

## Anomaly 6
Type: Unknown Member
Detection: Participant email/name is not in the active Membership table.
Action: Prompt to invite member or map to an existing one.
Reason: Cannot assign financial liability to a ghost user.

## Anomaly 7
Type: Former Member
Detection: Expense date > participant's `leftAt` timestamp.
Action: Reject participant split or prompt reactivation.
Reason: Preserves the integrity of the historical ledger (Meera left earlier).

## Anomaly 8
Type: Settlement Logged as Expense
Detection: Description contains keywords like 'settle', 'paid back'.
Action: Convert row to a Settlement record.
Reason: Settlements balance debts, whereas expenses increase gross ledger volume.

## Anomaly 9
Type: Negative Amount
Detection: Amount < 0.
Action: Convert to refund or settlement.
Reason: Expenses are fundamentally positive additions to shared cost.

## Anomaly 10
Type: Precision Issue
Detection: Amount has > 2 decimal places.
Action: Round to 2 decimal places.
Reason: Standardizes currency tracking and prevents floating point rounding explosions.

## User Approval Workflow
User approval workflow:
Every destructive action requires approval.

