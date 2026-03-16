# DevPlus Frontend

A modern React.js frontend for the DevPlus Team Task & GitHub Contribution Tracker.

## Tech Stack

- React.js 18
- React Router DOM v6
- React Bootstrap
- Axios
- Chart.js & react-chartjs-2
- React Toastify

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:8080

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will run on http://localhost:3000

## Features

### Authentication
- JWT-based authentication
- Role-based access control (Manager, Team Lead, Member)
- Protected routes

### Dashboard
- Role-based dashboard views
- Project overview for managers
- Task summary for all users
- Statistics cards

### Project Management
- Create and manage projects
- Add/remove team members
- Configure GitHub repository links

### Task Board
- Kanban-style board (To Do, In Progress, Done)
- Create, edit, and delete tasks
- Assign tasks to team members
- Priority and due date management
- Filter by priority and assignee

### Contribution Tracking
- Real-time commit feed
- Member contribution statistics
- Weekly commit charts
- Inactive member alerts

### Webhook Setup
- Copy webhook URL for GitHub configuration
- Step-by-step setup instructions

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── Sidebar.jsx         # Side navigation menu
│   ├── TaskCard.jsx        # Task display component
│   ├── MemberCard.jsx      # Team member card
│   ├── CommitFeed.jsx      # Commit list display
│   ├── ContributionChart.jsx # Bar chart for contributions
│   └── ProtectedRoute.jsx  # Auth route wrapper
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Main dashboard
│   ├── ProjectList.jsx     # Projects list
│   ├── ProjectDetail.jsx   # Project details with tabs
│   ├── MemberStats.jsx     # Team statistics
│   ├── TaskBoard.jsx       # Kanban board
│   └── WebhookSetup.jsx    # Webhook configuration
├── services/
│   ├── api.js              # Axios instance
│   ├── authService.js      # Auth API calls
│   ├── projectService.js   # Project API calls
│   ├── taskService.js      # Task API calls
│   └── commitService.js    # Commit API calls
├── context/
│   └── AuthContext.jsx     # Authentication state
├── App.jsx                 # Main app component
├── App.css                 # Global styles
└── index.js                # Entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## User Roles & Permissions

### Manager
- Create and manage projects
- Add/remove team members
- View all team statistics
- Receive weekly email reports

### Team Lead
- Create and assign tasks
- View team member statistics
- Manage project tasks

### Member
- View assigned tasks
- Update task status
- View own commit history

## API Integration

The frontend communicates with the backend API:

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT Bearer token in Authorization header
- **Content-Type**: `application/json`

## Styling

The application uses a custom dark theme:
- Primary background: `#0d1117`
- Secondary background: `#161b22`
- Accent purple: `#7c3aed`
- Accent green: `#22c55e`

All styles are defined in `App.css` using CSS custom properties.

## Building for Production

```bash
npm run build
```

The build output will be in the `build/` directory.

## Troubleshooting

### API Connection Issues
- Ensure the backend is running on port 8080
- Check CORS settings in the backend
- Verify the API URL in the service files

### Authentication Issues
- Clear localStorage and re-login
- Check JWT token expiration
- Verify token is being sent in requests

## License

MIT License