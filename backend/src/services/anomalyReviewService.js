const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.approveAnomaly = async (anomalyId, resolverUserId) => {
  return prisma.$transaction(async (tx) => {
    const anomaly = await tx.importAnomaly.findUnique({ where: { id: anomalyId } });
    if (!anomaly || anomaly.status !== 'PENDING') throw new Error('Anomaly not found or already resolved');

    // 1. Mark as APPROVED. Original rawData remains untouched for auditability.
    const updatedAnomaly = await tx.importAnomaly.update({
      where: { id: anomalyId },
      data: { status: 'APPROVED', resolvedAt: new Date() },
    });

    // 2. The rawData contains the payload that was originally paused
    // In a real flow, we would call expenseService.createExpense(anomaly.rawData) here.

    return updatedAnomaly;
  });
};

exports.rejectAnomaly = async (anomalyId, resolverUserId) => {
  // We NEVER delete the anomaly. We just mark it rejected. Audit trail remains intact.
  return prisma.importAnomaly.update({
    where: { id: anomalyId },
    data: { status: 'REJECTED', resolvedAt: new Date() },
  });
};

exports.editAndApproveAnomaly = async (anomalyId, editedData, resolverUserId) => {
  return prisma.$transaction(async (tx) => {
    const anomaly = await tx.importAnomaly.findUnique({ where: { id: anomalyId } });
    if (!anomaly || anomaly.status !== 'PENDING') throw new Error('Anomaly not found or already resolved');

    // We do NOT overwrite the original rawData. We keep it for the audit trail.
    // We update status to EDITED_AND_APPROVED
    const updatedAnomaly = await tx.importAnomaly.update({
      where: { id: anomalyId },
      data: { 
        status: 'EDITED_AND_APPROVED', 
        resolvedAt: new Date(),
      },
    });

    // In a real flow, we would call expenseService.createExpense(editedData) here.

    return updatedAnomaly;
  });
};
