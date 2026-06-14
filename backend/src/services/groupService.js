const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createGroup = async (name, description, creatorUserId) => {
  // DB Write 1 & 2: Transaction ensures group creation and initial membership
  return prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: { name, description },
    });

    await tx.membership.create({
      data: {
        userId: creatorUserId,
        groupId: group.id,
      },
    });

    return group;
  });
};

exports.addMember = async (groupId, userId) => {
  // DB Write 3: Create a new membership record to preserve historical timeline.
  const activeMembership = await prisma.membership.findFirst({
    where: { groupId, userId, leftAt: null },
  });

  if (activeMembership) {
    throw new Error('User is already an active member of this group');
  }

  return prisma.membership.create({
    data: {
      groupId,
      userId,
    },
  });
};

exports.removeMember = async (groupId, userId) => {
  // DB Write 4: Soft-delete by setting leftAt instead of actual deletion.
  const activeMembership = await prisma.membership.findFirst({
    where: { groupId, userId, leftAt: null },
  });

  if (!activeMembership) {
    throw new Error('User is not an active member of this group');
  }

  return prisma.membership.update({
    where: { id: activeMembership.id },
    data: { leftAt: new Date() },
  });
};
