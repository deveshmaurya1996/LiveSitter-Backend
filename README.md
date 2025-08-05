# Job Tracker Application

A professional, full-stack job application tracking system built with modern technologies. This application provides role-based access control with separate user and admin interfaces for managing job applications.

## 🏗️ Project Structure

```
FSD_Assignment_Project/
├── backend/                    # Node.js + Express + MongoDB Backend
│   ├── config/                 # Configuration files
│   │   ├── config.js          # App configuration and environment variables
│   │   └── database.js        # MongoDB connection and initialization
│   ├── controllers/           # Request handlers
│   │   └── jobController.js   # Job-related API endpoints
│   ├── middleware/            # Custom middleware
│   │   └── errorHandler.js    # Global error handling
│   ├── models/               # Data models and schemas
│   │   └── Job.js            # Job schema definition and validation
│   ├── routes/               # API routes
│   │   └── jobRoutes.js      # Job-related routes
│   ├── services/             # Business logic layer
│   │   └── JobService.js     # Job operations and data processing
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main application entry point
├── frontend/                  # React + TypeScript + Tailwind CSS Frontend
│   ├── public/               # Static assets
│   │   └── index.html        # Main HTML file
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── AdminJobCard.tsx
│   │   │   ├── AdminJobList.tsx
│   │   │   ├── JobForm.tsx
│   │   │   ├── JobHistory.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── UserJobCard.tsx
│   │   │   └── UserJobList.tsx
│   │   ├── services/         # API services
│   │   │   └── api.ts        # Type-safe API client
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── index.ts      # Centralized types
│   │   ├── utils/            # Utility functions
│   │   │   └── cn.ts         # CSS class utilities
│   │   ├── App.tsx           # Main application component
│   │   ├── index.tsx         # Application entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── tsconfig.json         # TypeScript configuration
├── README.md                 # This file
├── README.txt               # Original project description
└── setup.bat               # Setup script
```

## 🚀 Features

### Backend Features
- **Professional Architecture**: Clean separation of concerns with MVC pattern
- **Service Layer**: Business logic separated from controllers
- **Schema-Driven Design**: Comprehensive job schema with validation
- **RESTful API**: Full CRUD operations for job management
- **Advanced Search**: Search jobs by role, company, status, and location
- **Pagination**: Efficient data loading with pagination support
- **Status Tracking**: Complete job status history tracking
- **Statistics**: Job status statistics and recent activity
- **Error Handling**: Comprehensive error handling and validation
- **Logging**: Request logging and error tracking
- **Health Checks**: Application health monitoring
- **Graceful Shutdown**: Proper server shutdown handling

### Frontend Features
- **TypeScript**: Full type safety throughout the application
- **Role-Based Access**: Separate user and admin interfaces
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Component Architecture**: Modular, reusable components
- **State Management**: React hooks for efficient state management
- **Real-time Updates**: Immediate UI updates after actions
- **Search & Filter**: Advanced job filtering and search
- **Pagination**: Client-side pagination for better UX
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Proper loading indicators and error states

### User Experience Features
- **User View**: 
  - Browse available jobs
  - Apply for jobs with one-click
  - See application status
  - Search and filter jobs
- **Admin View**:
  - Full job management (CRUD)
  - Status updates with history tracking
  - Job statistics and analytics
  - Bulk operations support

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (native driver)
- **Environment**: dotenv
- **CORS**: Cross-origin resource sharing
- **Validation**: Custom schema validation

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FSD_Assignment_Project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=jobtracker
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm start
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Jobs
- `GET /jobs` - Get all jobs (with pagination)
- `GET /jobs/:id` - Get job by ID
- `POST /jobs` - Create new job
- `PUT /jobs/:id` - Update job details
- `PUT /jobs/:id/status` - Update job status
- `DELETE /jobs/:id` - Delete job

#### Search & Analytics
- `GET /jobs/search` - Search jobs
- `GET /jobs/statistics` - Get status statistics
- `GET /jobs/activity` - Get recent activity

#### Health Check
- `GET /health` - Application health status

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction (asc/desc, default: desc)

## 🎯 Key Features Explained

### Role-Based Access Control
The application implements two distinct user interfaces:

#### User Interface
- **Purpose**: Job seekers browsing and applying for positions
- **Features**:
  - View available jobs
  - Apply for jobs (changes status to "Applied")
  - Search and filter jobs
  - See application status
  - Compact job cards

#### Admin Interface
- **Purpose**: Job management and status tracking
- **Features**:
  - Full CRUD operations
  - Status management with history
  - Job analytics and statistics
  - Detailed job information
  - Bulk operations

### Job Status System
Jobs follow a progression system:
1. **New Job** - Initial state (no status)
2. **Applied** - User has applied
3. **Reviewed** - Application under review
4. **Interviewed** - Interview scheduled/completed
5. **Offered** - Job offer received
6. **Rejected** - Application rejected

### Status History Tracking
Every status change is recorded with:
- Status value
- Timestamp
- Automatic history updates

## 🔧 Development Tools Used

### Code Quality
- **Refactoring**: Used AI tools for code refactoring and optimization
- **Formatting**: Prettier for consistent code formatting
- **Type Safety**: TypeScript for compile-time error checking

### Architecture Patterns
- **MVC Pattern**: Model-View-Controller separation
- **Service Layer**: Business logic isolation
- **Repository Pattern**: Data access abstraction
- **Component Architecture**: Modular React components

## 📊 Database Schema

### Job Collection
```javascript
{
  _id: ObjectId,
  role: String (required),
  company: String (required),
  status: String (enum: Applied, Reviewed, Interviewed, Offered, Rejected),
  location: String,
  salary: String,
  description: String,
  appliedDate: Date,
  history: Array<{status: String, timestamp: Date}>,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB connection
3. Set up process manager (PM2)
4. Configure reverse proxy (Nginx)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the code comments
- Open an issue in the repository

---

**Built with ❤️ using modern web technologies** 