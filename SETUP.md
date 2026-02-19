# CampusFlow AI - Complete Setup Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- MongoDB Atlas account (or local MongoDB instance)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
# DATABASE_NAME=campusflow
# SECRET_KEY=your-secret-key-change-in-production

# Run the server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at:
- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Seed Sample Data (Optional)

In the backend directory, run:

```bash
python seed_data.py
```

This creates sample courses and hostels for testing.

## Testing the Application

### 1. Register a Student Account

1. Go to `http://localhost:5173/register`
2. Fill in the registration form:
   - Full Name: John Doe
   - Email: student@example.com
   - Student ID: STU001
   - Role: Student
   - Password: password123
3. Click Register

### 2. Register an Admin Account

1. Go to `http://localhost:5173/register`
2. Fill in the registration form:
   - Full Name: Admin User
   - Email: admin@example.com
   - Role: Admin
   - Password: admin123
3. Click Register

### 3. Test Student Features

After logging in as a student:

1. **Dashboard**: View onboarding progress and health score
2. **Documents**: Upload required documents
3. **Fees**: Make fee payments (simulated)
4. **Courses**: Register for courses (requires 50% fee payment)
5. **Hostel**: Apply for hostel accommodation
6. **AI Assistant**: Chat with AI about onboarding status
7. **Profile**: Update profile information

### 4. Test Admin Features

After logging in as an admin:

1. **Admin Dashboard**: View analytics and student metrics
2. **Documents**: Verify student documents
3. **Hostel**: Allocate hostel rooms to students

## Common Issues

### Backend Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB Atlas connection string in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check if MongoDB service is running (for local MongoDB)

2. **Module Not Found Errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

3. **Port Already in Use**
   - Change the port in the uvicorn command: `--port 8001`

### Frontend Issues

1. **Cannot Connect to Backend**
   - Ensure backend is running on port 8000
   - Check `vite.config.js` proxy configuration

2. **Module Not Found Errors**
   - Run `npm install` again
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **CORS Errors**
   - Ensure backend CORS is configured correctly in `app/main.py`

## Production Deployment

### Backend

1. Set production environment variables
2. Use a production ASGI server:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```
3. Configure reverse proxy (Nginx)
4. Use secure JWT secret key

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```
2. Serve `dist` folder with a web server (Nginx, Apache, etc.)
3. Configure API proxy

## API Testing

Use the Swagger UI at `http://localhost:8000/docs` to test API endpoints directly.

## Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the README files in backend and frontend directories
3. Check console logs for error messages
