# Splitwise Web Application

A simple expense splitting web application built with React and Node.js, similar to Splitwise. No login required - just create projects, add people, and split expenses!

## Features

- ✅ Create projects/trips
- ✅ Add people to projects
- ✅ Add expenses with description, amount, and who paid
- ✅ Split expenses among selected people
- ✅ Automatic balance calculation
- ✅ View all expenses and balances
- ✅ No authentication required

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Styling**: CSS with modern gradient design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

### Installation

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Default: `mongodb://localhost:27017/splitwise`

4. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas and update the connection string in `.env`

### Running the Application

**Option 1: Run both servers together (recommended):**
```bash
npm run dev
```

**Option 2: Run servers separately:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. **Create a Project**: Enter a project name and click "Create Project"
2. **Add People**: Add people to your project by entering their names
3. **Add Expenses**: 
   - Enter expense description and amount
   - Select who paid for the expense
   - Select people among whom the expense should be split
   - Click "Add Expense"
4. **View Balances**: See who owes money and who is owed money
5. **View Expenses**: See all expenses with details

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details with expenses and balances
- `POST /api/projects/:id/people` - Add a person to a project
- `DELETE /api/projects/:id/people/:personId` - Remove a person from a project

### Expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/project/:projectId` - Get all expenses for a project
- `DELETE /api/expenses/:id` - Delete an expense

## Project Structure

```
splitwise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Main styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## Notes

- Expenses are divided equally among selected people
- Balances are calculated automatically
- Positive balance = person is owed money
- Negative balance = person owes money
- No user authentication - all data is accessible to anyone with the project ID

## License

ISC

