# Check AI Visibility - Turborepo Monorepo

A modern full-stack application built with the following technologies:

- **Frontend**: Next.js 15.4 with React, TypeScript, Tailwind CSS, and ShadCN UI
- **Backend**: Hono.js with TypeScript and Node.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Better-auth
- **Monorepo**: Turborepo with NPM workspaces

## Project Structure

```
check-ai-visibility/
├── apps/
│   ├── frontend/          # Next.js 15.4 frontend with ShadCN UI
│   └── backend/           # Hono.js backend with Prisma and Better-auth
├── packages/              # Shared packages (future use)
├── turbo.json             # Turborepo configuration
└── package.json           # Root package.json with workspaces
```

## Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- NPM 8+

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd check-ai-visibility
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
Navigate to `apps/backend/.env` and configure:

```env
# MongoDB connection string
DATABASE_URL="mongodb://localhost:27017/check-ai-visibility"

# Better Auth configuration
BETTER_AUTH_SECRET="your-super-secret-key-change-in-production"
BETTER_AUTH_URL="http://localhost:3001"

# GitHub OAuth (optional - for social login)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when you run the application

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update the `DATABASE_URL` in your `.env` file

### 5. Generate Prisma Client
```bash
cd apps/backend
npx prisma generate
```

### 6. Start Development Servers

From the root directory:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

Or start services individually:
```bash
# Frontend only
cd apps/frontend && npm run dev

# Backend only  
cd apps/backend && npm run dev
```

## Features

### Authentication
- ✅ Email/Password authentication
- ✅ Session management
- ✅ User registration
- ✅ GitHub OAuth (configurable)
- ✅ Better-auth integration

### Frontend
- ✅ Next.js 15.4 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ShadCN UI components
- ✅ Responsive authentication forms

### Backend
- ✅ Hono.js web framework
- ✅ TypeScript
- ✅ Prisma ORM with MongoDB
- ✅ Better-auth integration
- ✅ RESTful API structure

## API Endpoints

### Health Check
- `GET /` - Root health check
- `GET /api/health` - API health check

### Authentication
- `POST /api/auth/sign-in/email` - Email sign in
- `POST /api/auth/sign-up/email` - Email sign up
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/sign-in/github` - GitHub OAuth

## Scripts

### Root Level (Turborepo)
- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Lint all applications
- `npm run clean` - Clean all build outputs

### Frontend (`apps/frontend`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint frontend code

### Backend (`apps/backend`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Lint backend code

## MongoDB Schema

The application uses the following MongoDB collections via Prisma:

### Users
```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}
```

### Accounts (OAuth)
```prisma
model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  // ... other OAuth fields
}
```

### Sessions
```prisma
model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Development Notes

### Technologies Used
- **Turborepo**: Monorepo build system for efficient development
- **Next.js 15.4**: React framework with App Router
- **Hono.js**: Fast, lightweight web framework
- **Prisma**: Type-safe database client and ORM
- **Better-auth**: Modern authentication library
- **ShadCN UI**: Beautiful, accessible UI components
- **TypeScript**: Type safety across the entire stack

### Folder Structure Rationale
- `apps/`: Contains all applications (frontend, backend)
- `packages/`: Shared libraries and components (expandable)
- Monorepo setup allows for shared dependencies and coordinated builds

### Key Decisions
1. **MongoDB with Prisma**: Flexible NoSQL database with type-safe ORM
2. **Better-auth**: Modern alternative to NextAuth with better TypeScript support
3. **Hono.js**: Lightweight, fast alternative to Express
4. **ShadCN UI**: Pre-built, customizable components for rapid development
5. **Turborepo**: Efficient monorepo management and caching

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally
   - Check connection string format
   - Verify network access for Atlas

2. **Prisma Client Not Generated**
   ```bash
   cd apps/backend && npx prisma generate
   ```

3. **Port Conflicts**
   - Frontend uses port 3000
   - Backend uses port 3001
   - Change ports in respective package.json scripts if needed

4. **Authentication Not Working**
   - Check `BETTER_AUTH_SECRET` is set
   - Verify `BETTER_AUTH_URL` matches backend URL
   - For GitHub OAuth, verify client ID/secret

### Resetting Development Environment
```bash
# Clean all build outputs
npm run clean

# Reinstall dependencies
rm -rf node_modules apps/*/node_modules
npm install

# Regenerate Prisma client
cd apps/backend && npx prisma generate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
