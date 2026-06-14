const express = require('express');
const groupController = require('../controllers/groupController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Require authentication for all group endpoints
router.use(verifyToken);

router.post('/', groupController.createGroup);
router.post('/:id/members', groupController.addMember);
router.delete('/:id/members/:userId', groupController.removeMember);

module.exports = router;
