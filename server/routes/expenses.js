const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Project = require('../models/Project');

// Create a new expense
router.post('/', async (req, res) => {
  try {
    const { projectId, description, amount, paidBy, splitAmong } = req.body;

    // Validation
    if (!projectId || !description || !amount || !paidBy || !splitAmong) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
      return res.status(400).json({ error: 'At least one person must be selected for splitting' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify paidBy exists in project
    const paidByExists = project.people.some(p => p.name === paidBy);
    if (!paidByExists) {
      return res.status(400).json({ error: 'Person who paid must be in the project' });
    }

    // Verify all splitAmong people exist in project
    const allPeopleExist = splitAmong.every(name => 
      project.people.some(p => p.name === name)
    );
    if (!allPeopleExist) {
      return res.status(400).json({ error: 'All people in split must be in the project' });
    }

    const expense = new Expense({
      projectId,
      description,
      amount,
      paidBy,
      splitAmong,
      expenseDate: req.body.expenseDate ? new Date(req.body.expenseDate) : new Date()
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all expenses for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const expenses = await Expense.find({ projectId: req.params.projectId })
      .sort({ expenseDate: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const { description, amount, paidBy, splitAmong } = req.body;

    // Validation
    if (!description || !amount || !paidBy || !splitAmong) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
      return res.status(400).json({ error: 'At least one person must be selected for splitting' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Verify project exists
    const project = await Project.findById(expense.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify paidBy exists in project
    const paidByExists = project.people.some(p => p.name === paidBy);
    if (!paidByExists) {
      return res.status(400).json({ error: 'Person who paid must be in the project' });
    }

    // Verify all splitAmong people exist in project
    const allPeopleExist = splitAmong.every(name => 
      project.people.some(p => p.name === name)
    );
    if (!allPeopleExist) {
      return res.status(400).json({ error: 'All people in split must be in the project' });
    }

    expense.description = description;
    expense.amount = amount;
    expense.paidBy = paidBy;
    expense.splitAmong = splitAmong;
    if (req.body.expenseDate) {
      expense.expenseDate = new Date(req.body.expenseDate);
    }

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

