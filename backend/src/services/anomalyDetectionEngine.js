/**
 * Anomaly Detection Engine for CSV Imports
 * Never silently modifies data. Only returns flags and suggestions.
 */

exports.analyzeRow = (row, existingData) => {
  const anomalies = [];

  // 1. Negative Amount
  if (row.amount < 0) {
    anomalies.push({
      type: 'Negative Amount',
      severity: 'High',
      description: `Amount ${row.amount} is negative.`,
      suggestedAction: 'Convert to refund or settlement.',
      confidenceScore: 1.0,
    });
  }

  // 2. Precision Issue
  if (row.amount && row.amount.toString().split('.')[1]?.length > 2) {
    anomalies.push({
      type: 'Precision Issue',
      severity: 'Low',
      description: `Amount ${row.amount} has more than 2 decimal places.`,
      suggestedAction: 'Round to 2 decimal places.',
      confidenceScore: 1.0,
    });
  }

  // 3. Missing Currency
  if (!row.currency || row.currency.trim() === '') {
    anomalies.push({
      type: 'Missing Currency',
      severity: 'Low',
      description: 'Currency field is empty.',
      suggestedAction: 'Default to USD upon user confirmation.',
      confidenceScore: 0.9,
    });
  }

  // 4. Invalid Date
  const parsedDate = new Date(row.date);
  if (isNaN(parsedDate.getTime())) {
    anomalies.push({
      type: 'Invalid Date',
      severity: 'High',
      description: `Date '${row.date}' cannot be parsed.`,
      suggestedAction: 'Prompt user for manual date entry.',
      confidenceScore: 1.0,
    });
  } else {
    // 5. Ambiguous Date (e.g. 04/05/2026 where both day and month <= 12)
    const dateParts = row.date.split(/[-/]/);
    if (dateParts.length >= 2 && parseInt(dateParts[0]) <= 12 && parseInt(dateParts[1]) <= 12 && dateParts[0] !== dateParts[1]) {
      anomalies.push({
        type: 'Ambiguous Date',
        severity: 'Medium',
        description: `Date '${row.date}' format is ambiguous (MM/DD vs DD/MM).`,
        suggestedAction: 'Prompt user to confirm date format.',
        confidenceScore: 0.8,
      });
    }
  }

  // 6. Settlement Logged as Expense
  const descLower = (row.description || '').toLowerCase();
  const settlementKeywords = ['settle', 'paid back', 'repayment', 'clear debt'];
  if (settlementKeywords.some(kw => descLower.includes(kw))) {
    anomalies.push({
      type: 'Settlement Logged as Expense',
      severity: 'Medium',
      description: 'Description matches common settlement keywords.',
      suggestedAction: 'Convert row to a Settlement record.',
      confidenceScore: 0.85,
    });
  }

  // Check against existing data for context-aware anomalies
  if (existingData) {
    // 7. Unknown Member
    const isMember = existingData.memberships.some(m => m.user.email === row.participantEmail);
    if (!isMember) {
      anomalies.push({
        type: 'Unknown Member',
        severity: 'High',
        description: `Participant '${row.participantEmail}' is not in the group.`,
        suggestedAction: 'Prompt to invite member or map to existing.',
        confidenceScore: 0.95,
      });
    } else {
      // 8. Former Member
      const membership = existingData.memberships.find(m => m.user.email === row.participantEmail);
      if (membership && membership.leftAt && parsedDate > new Date(membership.leftAt)) {
        anomalies.push({
          type: 'Former Member',
          severity: 'High',
          description: `Participant left the group before this expense date.`,
          suggestedAction: 'Reject participant split or reactivate membership.',
          confidenceScore: 1.0,
        });
      }
    }

    // Duplicates Checks
    const sameDateDesc = existingData.expenses.filter(e => 
      e.description.toLowerCase() === row.description.toLowerCase() && 
      new Date(e.date).toDateString() === parsedDate.toDateString()
    );

    if (sameDateDesc.length > 0) {
      const exactMatch = sameDateDesc.find(e => parseFloat(e.amount) === parseFloat(row.amount));
      if (exactMatch) {
        // 9. Duplicate Expense
        anomalies.push({
          type: 'Duplicate Expense',
          severity: 'Medium',
          description: 'An expense with the exact same amount, date, and description exists.',
          suggestedAction: 'Flag for user approval to merge or ignore.',
          confidenceScore: 0.9,
        });
      } else {
        // 10. Conflicting Duplicate
        anomalies.push({
          type: 'Conflicting Duplicate',
          severity: 'High',
          description: 'An expense with the same date and description exists, but the amount differs.',
          suggestedAction: 'Flag for user manual resolution.',
          confidenceScore: 0.85,
        });
      }
    }
  }

  return anomalies;
};
