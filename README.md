# 🚀 CampusFlow AI – Intelligent Student Onboarding Orchestration Platform

A complete production-ready full-stack application for managing student onboarding processes with AI-powered assistance.

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB Atlas** - Cloud database with Motor async driver
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation
- **Role-based Access Control** - Student/Admin roles

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Material UI (MUI)** - Component library
- **Axios** - HTTP client
- **React Router** - Routing
- **Context API** - State management

### AI Integration
- **Gemini/OpenAI compatible** - Context-aware AI assistant

## Project Structure

```
campus/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── services/
    ├── package.json
    └── README.md
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

4. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

Backend API will be available at `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Features

### 1. Authentication System
- Student and Admin registration
- JWT-based login
- Protected routes
- Role-based access control

### 2. Dynamic Onboarding Dashboard
- Real-time completion percentage
- Health score calculation
- Risk detection (HIGH/MEDIUM/LOW)
- Next best action recommendations

### 3. Document Management
- Required documents list
- Upload simulation
- Status tracking (Pending/Uploaded/Verified)
- Admin verification

### 4. Fee Payment Module
- Total fee tracking
- Payment simulation
- Transaction history
- Course unlock logic (50% fee requirement)

### 5. Course & LMS Module
- Course browsing
- Registration with fee validation
- LMS activation

### 6. Hostel Management
- Preference selection
- Room allocation simulation
- Application status tracking
- Mess registration

### 7. Smart Notification System
- Auto-generated alerts
- Risk notifications
- Task completion alerts
- Unread badge counter

### 8. AI Assistant
- Context-aware responses
- Onboarding status integration
- Intelligent guidance
- Conversation history

### 9. Profile Management
- Editable user information
- Profile completion tracking
- Avatar support

### 10. Admin Analytics Dashboard
- Total students overview
- Completion rate metrics
- Risk students list
- Section-wise analytics

## Business Logic

### Onboarding Completion Calculation
- Documents: 25%
- Fees: 25%
- Courses: 25%
- Hostel: 25%

### Health Score
```
Health Score = 100 - (missing sections * 25)
```

### Risk Detection
- **HIGH**: Fee < 50% AND documents pending
- **MEDIUM**: One or more sections incomplete
- **LOW**: Onboarding progressing well

### Next Best Action
Returns the first incomplete section with priority level.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview

### Documents
- `GET /api/documents/` - Get documents
- `POST /api/documents/upload` - Upload document
- `PUT /api/documents/{id}/verify` - Verify document (admin)

### Fees
- `GET /api/fees/` - Get fee status
- `POST /api/fees/pay` - Make payment
- `GET /api/fees/transactions` - Transaction history

### Courses
- `GET /api/courses/` - Available courses
- `GET /api/courses/my-courses` - Registered courses
- `POST /api/courses/register` - Register for courses

### Hostel
- `GET /api/hostel/` - Hostel status
- `POST /api/hostel/apply` - Apply for hostel
- `PUT /api/hostel/mess-register` - Register for mess

### Notifications
- `GET /api/notifications/` - Get notifications
- `GET /api/notifications/unread-count` - Unread count
- `PUT /api/notifications/{id}/read` - Mark as read

### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `GET /api/ai/history` - Conversation history

### Profile
- `GET /api/profile/` - Get profile
- `PUT /api/profile/` - Update profile

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/students` - All students

## Database Collections

- `users` - User accounts
- `documents` - Student documents
- `fees` - Fee records and transactions
- `courses` - Available courses
- `student_courses` - Course registrations
- `hostels` - Hostel information
- `hostel_applications` - Hostel applications
- `notifications` - User notifications
- `conversations` - AI chat history

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=campusflow
SECRET_KEY=your-secret-key-change-in-production
```

## Production Deployment

### Backend
1. Set environment variables
2. Use production ASGI server (e.g., Gunicorn with Uvicorn workers)
3. Configure CORS for production domain
4. Use secure JWT secret key

### Frontend
1. Build for production: `npm run build`
2. Serve static files with a web server (Nginx, etc.)
3. Configure API proxy

## License

This project is created for educational purposes.

## Support

For issues or questions, please refer to the API documentation at `/docs` endpoint.
