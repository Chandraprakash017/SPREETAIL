const expenseService = require('../services/expenseService');
const { validationResult } = require('express-validator');

exports.createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { groupId, amount, currency, description, date, participants } = req.body;
    const payerId = req.user.userId; // Extracted from JWT

    const expense = await expenseService.createExpense(groupId, payerId, amount, currency, description, date, participants);
    res.status(201).json({ message: 'Expense created', expense });
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const expenseId = parseInt(req.params.id, 10);
    const { amount, currency, description, date, participants } = req.body;
    
    const expense = await expenseService.updateExpense(expenseId, { amount, currency, description, date }, participants);
    res.status(200).json({ message: 'Expense updated', expense });
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = parseInt(req.params.id, 10);
    await expenseService.deleteExpense(expenseId);
    res.status(200).json({ message: 'Expense soft-deleted successfully' });
  } catch (error) {
    next(error);
  }
};
