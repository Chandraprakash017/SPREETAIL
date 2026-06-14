const groupService = require('../services/groupService');

exports.createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const creatorUserId = req.user.userId; // Provided by verifyToken middleware
    const group = await groupService.createGroup(name, description, creatorUserId);
    res.status(201).json({ message: 'Group created', group });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.id, 10);
    const { userId } = req.body;
    const membership = await groupService.addMember(groupId, userId);
    res.status(200).json({ message: 'Member added', membership });
  } catch (error) {
    if (error.message === 'User is already an active member of this group') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.userId, 10);
    const membership = await groupService.removeMember(groupId, userId);
    res.status(200).json({ message: 'Member removed', membership });
  } catch (error) {
    if (error.message === 'User is not an active member of this group') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};
