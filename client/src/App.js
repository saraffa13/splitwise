import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProjectPeople from './pages/ProjectPeople';
import ProjectExpenses from './pages/ProjectExpenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id/people" element={<ProjectPeople />} />
          <Route path="/project/:id/expenses" element={<ProjectExpenses />} />
          <Route path="/project/:id/expenses/add" element={<AddExpense />} />
          <Route path="/project/:id/expenses/edit/:expenseId" element={<EditExpense />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
