# School Management System

A school management system built with Next.js, Node.js, Express, and MongoDB. This application allows administrators to manage teachers, students, classes, subjects, and attendance records.

## Features

- **Admin Authentication**
  - Secure login system
  - Session management
  - Cookies for session management
  - Role-based access control
  - JWT authentication

- **Dashboard**
  - Overview of school statistics
  - Quick access to all modules
  - Multiple Search and filter options

- **Teacher Management**
  - Add, view, update, and delete teacher records
  - Assign subjects to teachers

- **Student Management**
  - Manage student records
  - Track student details and enrollment

- **Class Management**
  - Create and manage classes
  - Assign students to classes

- **Subject Management**
  - Add and manage subjects
  - Assign subjects to classes

- **Attendance System (Upcoming)**
  - Mark and track attendance
  - Generate attendance reports

- **Other Features**
  - Responsive design
  - Full-screen mode
  - User-friendly interface

## Tech Stack

- **Frontend**
  - Next.js 15 with App Router
  - TypeScript
  - Tailwind CSS
  - React Hook Form for form handling

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication

## Project Structure

```
frontend/
  src/
    app/
      admin/
        login/         # Admin login page
      dashboard/       # Main dashboard and management pages
        teachers/      # Teacher management
        students/      # Student management
        classes/       # Class management
        subjects/      # Subject management
        attendance/    # Attendance management
    components/       # Reusable components
    services/         # API service layer

backend/
  controllers/     # Route controllers
  models/          # Database models
  routes/          # API routes
  index.js         # Server entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` in the backend directory:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - Create `.env.local` in the frontend directory:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000
     ```

4. Start the development servers:
   ```bash
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

5. Access the application at http://localhost:3000

## API Endpoints

- `POST /api/auth/login` - Admin login
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance records

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Format code: `npm run format`


## feel free to collaborate and contribute

## License

MIT
