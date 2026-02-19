# CampusFlow AI - Backend API

## Setup Instructions

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure Environment Variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

3. **Run the Server**
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

4. **Seed Sample Data (Optional)**
```bash
python seed_data.py
```

This will create sample courses and hostels for testing.

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `DATABASE_NAME`: Database name (default: campusflow)
- `SECRET_KEY`: JWT secret key (change in production)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview

### Documents
- `GET /api/documents/` - Get user documents
- `POST /api/documents/upload` - Upload document
- `PUT /api/documents/{id}/verify` - Verify document (admin)

### Fees
- `GET /api/fees/` - Get fee status
- `POST /api/fees/pay` - Make payment
- `GET /api/fees/transactions` - Get transaction history

### Courses
- `GET /api/courses/` - Get available courses
- `GET /api/courses/my-courses` - Get registered courses
- `POST /api/courses/register` - Register for courses
- `POST /api/courses/create` - Create course (admin)

### Hostel
- `GET /api/hostel/` - Get hostel status
- `POST /api/hostel/apply` - Apply for hostel
- `PUT /api/hostel/mess-register` - Register for mess

### Notifications
- `GET /api/notifications/` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/{id}/read` - Mark as read

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/history` - Get conversation history

### Profile
- `GET /api/profile/` - Get profile
- `PUT /api/profile/` - Update profile

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/students` - Get all students
