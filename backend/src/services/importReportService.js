/**
 * Import Report Generator
 */

exports.generateJSONReport = (totalRows, successfulImports, failedImports, anomalies) => {
  return {
    summary: {
      totalRowsProcessed: totalRows,
      successfulImports,
      failedImports,
      totalAnomaliesDetected: anomalies.length,
      generatedAt: new Date().toISOString(),
    },
    anomalies: anomalies.map(a => ({
      rowNumber: a.rowNumber,
      type: a.type,
      severity: a.severity,
      description: a.description,
      actionTaken: a.actionTaken || 'Flagged for review',
    })),
  };
};

exports.generateHumanReadableReport = (jsonReport) => {
  let report = `=======================================\n`;
  report += `         CSV IMPORT REPORT             \n`;
  report += `=======================================\n`;
  report += `Date: ${new Date(jsonReport.summary.generatedAt).toLocaleString()}\n\n`;
  
  report += `--- SUMMARY ---\n`;
  report += `Total Rows Processed : ${jsonReport.summary.totalRowsProcessed}\n`;
  report += `Successful Imports   : ${jsonReport.summary.successfulImports}\n`;
  report += `Failed Imports       : ${jsonReport.summary.failedImports}\n`;
  report += `Total Anomalies      : ${jsonReport.summary.totalAnomaliesDetected}\n\n`;
  
  if (jsonReport.anomalies.length > 0) {
    report += `--- ANOMALIES DETECTED ---\n`;
    jsonReport.anomalies.forEach((anomaly, index) => {
      report += `[Anomaly #${index + 1} | Row ${anomaly.rowNumber || 'N/A'}]\n`;
      report += `  Type    : ${anomaly.type} (${anomaly.severity})\n`;
      report += `  Details : ${anomaly.description}\n`;
      report += `  Action  : ${anomaly.actionTaken}\n`;
      report += `---------------------------------------\n`;
    });
  } else {
    report += `Great job! No anomalies detected.\n`;
  }

  return report;
};
