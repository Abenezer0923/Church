# Akaki Full Gospel Church Management System

A comprehensive web-based church management system built with React.js, Node.js, Express.js, PostgreSQL, and Docker.

## Features

### User Roles & Permissions
- **Super Admin**: Full system access, can create/edit/delete admins and users
- **Admin**: Can manage church members and their payment records
- **User**: Basic access (member view)

### Core Functionality
- **Member Management**: Add, edit, view, and manage church members
- **Payment Tracking**: Record and track monthly payments (tithe, offerings, special offerings)
- **Dashboard**: Overview of key statistics and recent activities
- **User Management**: Super admin can manage system users
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js 18, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **UI Components**: Lucide React icons, React Hook Form, React Hot Toast

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd akaki-church-management
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

4. **Default Login Credentials**
   - Email: `admin@akakichurch.com`
   - Password: `password`

## Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a database named `akaki_church`
   - Run the SQL script from `server/database/init.sql`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Project Structure

```
akaki-church-management/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── database/          # Database scripts
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users (Super Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Members (Admin & Super Admin)
- `GET /api/members` - Get all members (with pagination and search)
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member (soft delete)

### Payments (Admin & Super Admin)
- `GET /api/payments` - Get all payments (with filters)
- `GET /api/payments/member/:memberId` - Get member payment history
- `POST /api/payments` - Record new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/stats/summary` - Get payment statistics

## Database Schema

### Users Table
- id, email, password, role, first_name, last_name, phone, is_active, created_at, updated_at

### Members Table
- id, member_id, first_name, last_name, email, phone, address, date_of_birth, gender, marital_status, occupation, monthly_income, membership_date, is_active, created_by, created_at, updated_at

### Monthly Payments Table
- id, member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, notes, recorded_by, created_at

## Key Features Explained

### Member Management
- Automatic member ID generation (AFGC0001, AFGC0002, etc.)
- Comprehensive member profiles with personal and contact information
- Soft delete functionality to maintain data integrity

### Payment System
- Monthly payment tracking with breakdown (tithe, offering, special offering)
- Multiple payment methods (cash, bank transfer, mobile money)
- Prevents duplicate payments for the same month/year
- Payment history and statistics

### Security
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization

### User Experience
- Responsive design for all screen sizes
- Real-time notifications with toast messages
- Loading states and error handling
- Pagination for large datasets
- Search and filter functionality

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Building for Production
```bash
# Build frontend
cd client && npm run build

# The built files will be in client/build/
```

## Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=akaki_church
DB_USER=church_admin
DB_PASSWORD=church_password_2024
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Akaki Full Gospel Church Management System** - Streamlining church administration and member management.