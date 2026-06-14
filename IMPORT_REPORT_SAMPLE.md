# Import Report Sample

## JSON Format
```json
{
  "summary": {
    "totalRowsProcessed": 100,
    "successfulImports": 95,
    "failedImports": 5,
    "totalAnomaliesDetected": 2,
    "generatedAt": "2026-06-15T00:00:00.000Z"
  },
  "anomalies": [
    {
      "rowNumber": 42,
      "type": "Negative Amount",
      "severity": "High",
      "description": "Amount -50 is negative.",
      "actionTaken": "Flagged for user approval"
    },
    {
      "rowNumber": 88,
      "type": "Missing Currency",
      "severity": "Low",
      "description": "Currency field is empty.",
      "actionTaken": "Defaulted to USD"
    }
  ]
}
```

## Human Readable Format
```text
=======================================
         CSV IMPORT REPORT             
=======================================
Date: 6/15/2026, 5:30:00 AM

--- SUMMARY ---
Total Rows Processed : 100
Successful Imports   : 95
Failed Imports       : 5
Total Anomalies      : 2

--- ANOMALIES DETECTED ---
[Anomaly #1 | Row 42]
  Type    : Negative Amount (High)
  Details : Amount -50 is negative.
  Action  : Flagged for user approval
---------------------------------------
[Anomaly #2 | Row 88]
  Type    : Missing Currency (Low)
  Details : Currency field is empty.
  Action  : Defaulted to USD
---------------------------------------
```
