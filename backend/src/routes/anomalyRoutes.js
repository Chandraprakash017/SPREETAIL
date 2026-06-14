const express = require('express');
const anomalyController = require('../controllers/anomalyController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(verifyToken);

router.post('/:id/approve', anomalyController.approve);
router.post('/:id/reject', anomalyController.reject);
router.post('/:id/edit', anomalyController.edit);

module.exports = router;
