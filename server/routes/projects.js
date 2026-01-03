const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Expense = require('../models/Expense');

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({ name, people: [] });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single project with expenses and balances
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const expenses = await Expense.find({ projectId: req.params.id }).sort({ expenseDate: -1, createdAt: -1 });
    
    // Calculate balances
    const balances = calculateBalances(project.people, expenses);
    
    res.json({
      project,
      expenses,
      balances
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a person to a project
router.post('/:id/people', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Person name is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if person already exists
    const personExists = project.people.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (personExists) {
      return res.status(400).json({ error: 'Person already exists in this project' });
    }

    project.people.push({ name });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a person from a project
router.delete('/:id/people/:personId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.people = project.people.filter(p => p._id.toString() !== req.params.personId);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed balances for a person
router.get('/:id/person/:personName/balances', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const expenses = await Expense.find({ projectId: req.params.id });
    const personName = req.params.personName;
    
    // Calculate detailed balances
    const detailedBalances = calculateDetailedBalances(project.people, expenses, personName);
    
    res.json(detailedBalances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate balances for all people
function calculateBalances(people, expenses) {
  const balances = {};
  
  // Initialize balances
  people.forEach(person => {
    balances[person.name] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    const amountPerPerson = expense.amount / expense.splitAmong.length;
    
    // Person who paid gets credited
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
    
    // People who owe get debited
    expense.splitAmong.forEach(personName => {
      balances[personName] = (balances[personName] || 0) - amountPerPerson;
    });
  });

  return balances;
}

// Calculate detailed balances showing who owes whom (simplified - net amounts)
function calculateDetailedBalances(people, expenses, personName) {
  const netBalances = {}; // Net amount per person (positive = they owe personName, negative = personName owes them)
  let totalBalance = 0;

  // Initialize
  people.forEach(person => {
    if (person.name !== personName) {
      netBalances[person.name] = 0;
    }
  });

  // Process each expense
  expenses.forEach(expense => {
    const amountPerPerson = expense.amount / expense.splitAmong.length;
    const isInSplit = expense.splitAmong.includes(personName);
    const isPayer = expense.paidBy === personName;

    if (isPayer && isInSplit) {
      // Person paid and is in split - others owe them their share
      expense.splitAmong.forEach(splitPerson => {
        if (splitPerson !== personName) {
          netBalances[splitPerson] = (netBalances[splitPerson] || 0) + amountPerPerson;
          totalBalance += amountPerPerson;
        }
      });
    } else if (isPayer && !isInSplit) {
      // Person paid but not in split - everyone in split owes them their share
      expense.splitAmong.forEach(splitPerson => {
        netBalances[splitPerson] = (netBalances[splitPerson] || 0) + amountPerPerson;
        totalBalance += amountPerPerson;
      });
    } else if (!isPayer && isInSplit) {
      // Person didn't pay but is in split - they owe the payer their share
      netBalances[expense.paidBy] = (netBalances[expense.paidBy] || 0) - amountPerPerson;
      totalBalance -= amountPerPerson;
    }
  });

  // Separate into owesTo and owedFrom based on net balances
  const owesTo = {};
  const owedFrom = {};

  Object.entries(netBalances).forEach(([name, amount]) => {
    if (amount > 0) {
      // This person owes money to personName
      owedFrom[name] = amount;
    } else if (amount < 0) {
      // personName owes money to this person
      owesTo[name] = Math.abs(amount);
    }
  });

  return {
    personName,
    totalBalance,
    owesTo,
    owedFrom
  };
}

module.exports = router;

