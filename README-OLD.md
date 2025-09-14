# Lead Manager - Setup & Run Guide

A Next.js application for managing buyer leads with authentication, CRUD operations, and CSV import/export functionality.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for version control)

## Quick Start Guide

### 1. Navigate to Project Directory
```bash
cd d:\buyer-lead-intake
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
The `.env.local` file should already be configured with SQLite database. If needed, update:
```bash
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (optional for magic links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@yourapp.com"
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates SQLite database)
npx prisma migrate dev --name init

# Optional: View database in Prisma Studio
npx prisma studio
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Application Features

### Authentication
- **Demo Login**: Use `demo@demo.com` for quick access
- **Magic Link**: Configure email settings for magic link authentication

### Available Pages (Once Fully Implemented)
- `/` - Home page (redirects to `/buyers` if authenticated)
- `/auth/signin` - Login page
- `/buyers` - List and search buyers with filters and pagination
- `/buyers/new` - Create new buyer lead
- `/buyers/[id]` - View and edit specific buyer

### API Endpoints
- `GET /api/buyers` - List buyers with filtering and pagination
- `POST /api/buyers` - Create new buyer
- `GET /api/buyers/[id]` - Get specific buyer
- `PUT /api/buyers/[id]` - Update buyer
- `DELETE /api/buyers/[id]` - Delete buyer
- `POST /api/buyers/import` - Import buyers from CSV
- `GET /api/buyers/export` - Export buyers to CSV

### CSV Import/Export Format
```csv
fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
John Doe,john@example.com,9876543210,Chandigarh,Apartment,2,Buy,5000000,7000000,0-3m,Website,"Looking for 2BHK","vip,urgent",New
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run migrations
npx prisma migrate reset     # Reset database
npx prisma studio           # Open database browser
npx prisma db push          # Push schema changes without migration
```

## Testing the Application

### 1. Start the Application
```bash
npm run dev
```

### 2. Access the Application
- Open browser to `http://localhost:3000`
- You'll see the home page with "Get Started" button

### 3. Login
- Click "Get Started" or go to `/auth/signin`
- Use "Demo Login" button for instant access
- Or enter any email ending with `@demo.com`

### 4. Test Features (As They Get Implemented)
- Navigate to `/buyers` to see the buyers list
- Create new buyers at `/buyers/new`
- Test CSV import/export functionality
- Edit and view individual buyer records

## Current Implementation Status

✅ **Completed:**
- Project structure and configuration
- Database schema with Prisma
- Authentication with NextAuth
- Validation schemas with Zod
- Reusable UI components
- Complete API routes for CRUD operations
- CSV import/export functionality

🚧 **In Progress:**
- Frontend pages (buyers list, create, edit)
- CSV upload interface
- Search and filtering UI

## Troubleshooting

### Database Issues
```bash
# Reset database if needed
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Port Issues
If port 3000 is in use:
```bash
# Start on different port
npm run dev -- -p 3001
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Next Steps

The backend and API are fully functional. The remaining work is to implement the frontend pages:

1. `/buyers` - List page with search, filters, and pagination
2. `/buyers/new` - Create buyer form
3. `/buyers/[id]` - Edit buyer form with history
4. CSV import/export UI components

## Database Schema

### Buyers Table
- Basic info: fullName, email, phone
- Location: city (enum)
- Property details: propertyType, bhk, purpose
- Financial: budgetMin, budgetMax
- Timeline and source tracking
- Status management
- Notes and tags
- Ownership tracking

### Features Included
- Validation with Zod schemas
- Ownership-based access control
- History tracking for changes
- CSV import with validation
- Responsive design with Tailwind CSS

The application is now ready to run and test the API endpoints!

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
