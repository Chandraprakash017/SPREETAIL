const express = require('express');
const { body } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(verifyToken);

const expenseValidation = [
  body('groupId').isInt(),
  body('amount').isFloat({ gt: 0 }),
  body('description').notEmpty(),
  body('date').isISO8601(),
  body('participants').isArray({ min: 1 })
];

router.post('/', expenseValidation, expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
