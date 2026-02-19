# CampusFlow AI - Frontend

## Setup Instructions

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Run the Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

The frontend uses a proxy configuration in `vite.config.js` to connect to the backend API running on `http://localhost:8000`.

## Features

- **Authentication**: Login and Registration with JWT
- **Dashboard**: Overview of onboarding progress
- **Documents**: Upload and manage required documents
- **Fees**: View fee status and make payments
- **Courses**: Browse and register for courses
- **Hostel**: Apply for hostel accommodation
- **Profile**: Manage user profile
- **Admin Dashboard**: Analytics and student management
- **AI Assistant**: Context-aware chat assistant
- **Notifications**: Real-time notification system
