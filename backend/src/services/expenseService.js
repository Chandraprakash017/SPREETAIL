const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createExpense = async (groupId, payerId, amount, currency, description, date, participants) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create the Expense
    const expense = await tx.expense.create({
      data: {
        groupId,
        payerId,
        amount,
        currency: currency || 'USD',
        description,
        date: new Date(date),
      },
    });

    // 2. Create the Participants
    const participantData = participants.map(p => ({
      expenseId: expense.id,
      userId: p.userId,
      shareAmount: p.shareAmount,
      sharePercentage: p.sharePercentage || null,
    }));

    await tx.expenseParticipant.createMany({
      data: participantData,
    });

    return tx.expense.findUnique({
      where: { id: expense.id },
      include: { participants: true },
    });
  });
};

exports.updateExpense = async (expenseId, data, participants) => {
  return prisma.$transaction(async (tx) => {
    // Update main expense details
    const expense = await tx.expense.update({
      where: { id: expenseId },
      data: {
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    // Replace participants for recalculations
    if (participants && participants.length > 0) {
      await tx.expenseParticipant.deleteMany({
        where: { expenseId },
      });

      const participantData = participants.map(p => ({
        expenseId: expense.id,
        userId: p.userId,
        shareAmount: p.shareAmount,
        sharePercentage: p.sharePercentage || null,
      }));

      await tx.expenseParticipant.createMany({
        data: participantData,
      });
    }

    return tx.expense.findUnique({
      where: { id: expenseId },
      include: { participants: true },
    });
  });
};

exports.deleteExpense = async (expenseId) => {
  // Soft Delete for Auditability
  return prisma.expense.update({
    where: { id: expenseId },
    data: { deletedAt: new Date() },
  });
};
