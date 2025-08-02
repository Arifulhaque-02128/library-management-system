# Bookari - Library Management System

A comprehensive digital library management system built with modern web technologies, featuring separate interfaces for library users and administrators. The system enables efficient book borrowing, user management, and administrative oversight.

## 🌐 Live Demo

- **User Interface**: [https://bookari-libsys.vercel.app/](https://bookari-libsys.vercel.app/)
- **Admin Dashboard**: [https://bookari-libsys.vercel.app/admin](https://bookari-libsys.vercel.app/admin)

## 🚀 Features

### 📚 User Features
- **Book Discovery**: Browse available library books with detailed information
- **Book Borrowing**: Request books for borrowing with approval workflow
- **User Profiles**: Personalized dashboard showing borrowed books and user profile
- **Account Management**: Secure registration and authentication system
- **Real-time Status**: Track borrowing requests and return deadlines

### 🛠️ Admin Features
- **Dashboard Analytics**: Visual overview of library statistics
- **User Management**: Approve accounts, manage user roles, and permissions
- **Book Management**: Add, edit, and delete books with rich metadata
- **Borrowing System**: Approve/reject requests, track returns, and manage overdue items
- **Request Processing**: Handle account approvals and borrowing workflows

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.1.2** - React framework for production
- **React 19.0.0** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with Zod validation

### Backend & Database
- **Next.js API Routes** - Serverless backend functions
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication solution
- **bcrypt** - Password hashing

### UI Components & Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **React Colorful** - Color picker component
- **Tailwind Animate** - CSS animations

### External Services
- **ImageKit** - Image optimization and management
- **Vercel** - Deployment platform


## 🏗️ System Architecture

### User Flow
1. **Registration** → Account creation with pending approval status
2. **Admin Approval** → Account verification by library administrators
3. **Book Discovery** → Browse and search available books
4. **Borrowing Request** → Submit borrowing requests for desired books
5. **Admin Processing** → Approval/rejection of borrowing requests
6. **Book Management** → Track borrowed books and return deadlines

### Admin Workflow
1. **Dashboard Overview** → Monitor library statistics and recent activities
2. **Account Management** → Approve new user registrations
3. **Book Catalog** → Manage book inventory and metadata
4. **Borrowing System** → Process requests and track returns
5. **User Administration** → Manage user roles and permissions

## 📱 User Interface

### Public Routes
- `/` - Homepage with book catalog
- `/books/[id]` - Individual book details and borrowing
- `/signin` - User authentication
- `/signup` - Account registration

### Protected User Routes
- `/user/[libraryId]` - User profile and borrowed books dashboard

### Admin Routes (Role-based Access)
- `/admin` - Admin dashboard with analytics
- `/admin/users` - User management interface
- `/admin/books` - Book catalog management
- `/admin/books/new` - Add new books
- `/admin/books/edit/[id]` - Edit existing books
- `/admin/borrow-records` - Borrowing system management
- `/admin/account-requests` - Pending account approvals

## 🔐 Authentication & Authorization

- **Role-based Access Control**: Separate permissions for users and administrators
- **Account Approval System**: New registrations require admin approval
- **Secure Authentication**: NextAuth.js with bcrypt password hashing
- **Protected Routes**: Middleware-based route protection

## 💾 Database Schema

### Collections
- **Users**: User accounts, roles, and library IDs
- **Books**: Book catalog with metadata and availability
- **BorrowRecords**: Borrowing history and current loans
- **AccountRequests**: Pending user registrations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database
- ImageKit account for image management

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bookari-library-system.git
cd bookari-library-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

4. **Run the development server**
```bash
npm run dev
```

5. **Access the application**
- User Interface: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin

## 🎯 Key Features Implementation

### Smart Borrowing System
- **15-day loan period** with automatic due date calculation
- **Overdue tracking** with status indicators
- **Late return detection** and management
- **Request approval workflow** for administrators

### Advanced Book Management
- **Rich metadata** including ratings, descriptions, and summaries
- **Color-coded covers** with custom color picker
- **Image optimization** through ImageKit integration
- **Inventory tracking** with copy management

### User Experience
- **Responsive design** for all device types
- **Real-time notifications** using React Hot Toast
- **Intuitive navigation** with role-based interfaces
- **Form validation** with comprehensive error handling

## 🔧 Technical Highlights

- **Server-Side Rendering** with Next.js for optimal performance
- **Type Safety** throughout the application with TypeScript
- **State Management** using Redux Toolkit for predictable updates
- **Component Architecture** with reusable UI components
- **API Design** following RESTful principles
- **Database Optimization** with efficient MongoDB queries

## 📈 Future Enhancements

- Email notifications for due dates and approvals
- Advanced search and filtering capabilities
- Reading recommendations based on user history
- Mobile app development
- Integration with external library systems
- Analytics dashboard for usage insights


**Built with ❤️ using Next.js, MongoDB, and modern web technologies**