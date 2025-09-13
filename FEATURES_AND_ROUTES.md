# Buyer Lead Management System - Features & Routes Documentation

## Overview
A comprehensive Next.js application for managing buyer leads in a real estate context. Built with Next.js 15, TypeScript, Prisma ORM, NextAuth.js for authentication, and Tailwind CSS for styling.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas
- **File Processing**: CSV import/export functionality

## Authentication System

### Routes
- `GET /auth/signin` - Sign-in page
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

### Features
- Credential-based authentication
- Session management
- Protected routes middleware
- User registration and login

### Default User Account
- **Demo Login**: Any email ending with `@demo.com`
- **Example**: `admin@demo.com` or `user@demo.com`
- **Note**: No password required for demo mode

## Core Application Features

### 1. Buyer Management (CRUD Operations)

#### Pages & Routes
- `GET /` - Dashboard homepage with overview statistics
- `GET /buyers` - Buyers listing page with filtering and pagination
- `GET /buyers/[id]` - Individual buyer detail view
- `GET /buyers/[id]/edit` - Edit buyer form
- `GET /buyers/new` - Create new buyer form

#### API Endpoints
- `GET /api/buyers` - Fetch buyers list with filtering
- `POST /api/buyers` - Create new buyer
- `GET /api/buyers/[id]` - Get specific buyer details
- `PUT /api/buyers/[id]` - Update buyer information
- `DELETE /api/buyers/[id]` - Delete buyer

#### Features
- **Create**: Add new buyer leads with comprehensive information
- **Read**: View buyer details and lists with advanced filtering
- **Update**: Edit existing buyer information
- **Delete**: Remove buyer records with confirmation

### 2. Data Fields & Validation

#### Buyer Schema Fields
- **Personal Information**:
  - `fullName` (required, string, 2-100 characters)
  - `email` (required, valid email format)
  - `phone` (required, string, 10-15 characters)
  - `city` (required, string, 2-50 characters)

- **Property Requirements**:
  - `propertyType` (enum: 'Apartment', 'Villa', 'Plot', 'Commercial', 'Other')
  - `bhk` (enum: '1BHK', '2BHK', '3BHK', '4BHK', '5+BHK')
  - `purpose` (enum: 'Buy', 'Rent', 'Investment')
  - `budgetMin` (number, minimum 0)
  - `budgetMax` (number, minimum budgetMin)

- **Lead Management**:
  - `timeline` (enum: 'Immediate', '1-3 months', '3-6 months', '6+ months')
  - `source` (enum: 'Website', 'Referral', 'Advertisement', 'Social Media', 'Walk-in', 'Other')
  - `status` (enum: 'New', 'Contacted', 'Qualified', 'Negotiating', 'Closed', 'Lost')
  - `notes` (optional text field)
  - `tags` (optional, comma-separated strings)

- **Metadata**:
  - `ownerId` (associated user ID)
  - `createdAt` (auto-generated timestamp)
  - `updatedAt` (auto-updated timestamp)

### 3. Filtering & Search System

#### Query Parameters
- `search` - Full-text search across name, email, phone, city
- `status` - Filter by lead status
- `propertyType` - Filter by property type
- `purpose` - Filter by purpose (Buy/Rent/Investment)
- `source` - Filter by lead source
- `bhk` - Filter by BHK configuration
- `page` - Pagination (default: 1)
- `limit` - Items per page (default: 10, max: 100)

#### Search Features
- **Real-time filtering** without page refresh
- **Multi-field search** across key buyer information
- **Dropdown filters** for categorical data
- **Pagination** with configurable page sizes
- **Sort by** updated date (newest first)

### 4. CSV Import/Export System

#### Routes
- `POST /api/buyers/import` - CSV file upload and processing
- `GET /api/buyers/export` - Download buyers data as CSV

#### Import Features
- **File Upload**: Accept CSV files with buyer data
- **Validation**: Comprehensive validation using Zod schemas
- **Error Reporting**: Detailed feedback on validation failures
- **Batch Processing**: Handle multiple records efficiently
- **Duplicate Handling**: Skip or update existing records

#### Export Features
- **Full Export**: Download all buyer records
- **Filtered Export**: Export based on current page filters
- **CSV Format**: Standard comma-separated values
- **Headers Included**: Column names for easy identification

#### CSV Format
```csv
fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,status,notes,tags
John Doe,john@example.com,9876543210,Mumbai,Apartment,2BHK,Buy,5000000,8000000,1-3 months,Website,New,First-time buyer,urgent;family
```

### 5. Dashboard & Analytics

#### Features
- **Lead Statistics**: Total leads, status breakdown
- **Recent Activity**: Latest buyer additions/updates
- **Quick Actions**: Direct links to common tasks
- **Status Distribution**: Visual representation of lead stages

### 6. User Interface Components

#### Reusable Components
- **BuyerCard**: Individual buyer display card
- **BuyerForm**: Form for creating/editing buyers
- **FilterBar**: Advanced filtering interface
- **StatusBadge**: Visual status indicators
- **ConfirmDialog**: Action confirmation modals

#### Styling Features
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Consistent theming
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages

## Database Schema

### Users Table
```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  buyers    Buyer[]
}
```

### Buyers Table
```sql
model Buyer {
  id           String   @id @default(cuid())
  fullName     String
  email        String
  phone        String
  city         String
  propertyType String
  bhk          String
  purpose      String
  budgetMin    Int
  budgetMax    Int
  timeline     String
  source       String
  status       String
  notes        String?
  tags         String?
  ownerId      String
  owner        User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Security Features

- **Authentication Required**: All routes protected except sign-in
- **User Isolation**: Users can only access their own buyer records
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **CSRF Protection**: NextAuth.js built-in protection

## Error Handling

- **Client-Side**: Form validation with real-time feedback
- **Server-Side**: Comprehensive error responses with appropriate HTTP codes
- **Database**: Graceful handling of connection and constraint errors
- **File Upload**: Validation and error reporting for CSV imports

## Performance Features

- **Server-Side Rendering**: Fast initial page loads
- **Database Indexing**: Optimized queries for filtering and search
- **Pagination**: Efficient handling of large datasets
- **Caching**: Next.js automatic caching for static assets

## Development & Deployment

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Database management interface

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Future Enhancement Opportunities

1. **Email Integration**: Automated follow-up emails
2. **SMS Notifications**: Lead status updates
3. **Advanced Analytics**: Lead conversion tracking
4. **Integration APIs**: CRM system connections
5. **Mobile App**: React Native companion app
6. **Reporting Dashboard**: Advanced business intelligence
7. **Lead Scoring**: Automated qualification scoring
8. **Document Management**: File attachments for leads
9. **Calendar Integration**: Appointment scheduling
10. **Team Collaboration**: Multiple user access levels

---

This documentation provides a comprehensive overview of all features, routes, and functionality available in the Buyer Lead Management System.