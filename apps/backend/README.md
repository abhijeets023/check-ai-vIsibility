# CheckAI Visibility Backend

Complete API backend for CheckAI Visibility platform built with tRPC, Prisma, and MongoDB.

## Features

- **Complete tRPC API** with type safety
- **MongoDB database** with Prisma ORM
- **User management** with Better-auth integration
- **Brand management** for tracking companies
- **AI visibility scanning** with placeholder AI providers
- **Report generation** and sharing
- **Subscription management** (manual for now)
- **Public API endpoints** for shared reports and badges

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup:**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or use migrations (for production)
npm run db:migrate
```

4. **Start development server:**
```bash
npm run dev
```

## API Router Structure

### Authentication (`/trpc/auth`)
- `getSession` - Get current user session
- `updateProfile` - Update user profile
- `deleteAccount` - Delete user account

### Brand Management (`/trpc/brand`)
- `create` - Create new brand
- `list` - List user's brands
- `getById` - Get single brand
- `update` - Update brand
- `delete` - Delete brand
- `validateUrl` - Validate website URL

### Visibility Scanning (`/trpc/scan`)
- `create` - Start new visibility scan
- `list` - List user's scans
- `getById` - Get scan with results
- `getStatus` - Get scan progress
- `cancel` - Cancel running scan
- `retry` - Retry failed scan
- `getComparison` - Get competitor comparison

### Report Management (`/trpc/report`)
- `generate` - Generate PDF/JSON reports
- `list` - List user's reports
- `getById` - Get report details
- `download` - Download report file
- `share` - Create public share link
- `getShared` - Get shared report (public)
- `delete` - Delete report

### User Management (`/trpc/user`)
- `getProfile` - Get user profile
- `updateProfile` - Update profile
- `getUsage` - Get scan usage stats
- `getSettings` - Get user settings
- `updateSettings` - Update settings
- `addScans` - Add scans to user account (admin)
- `getSubscriptionFeatures` - Get tier features

### Subscription Management (`/trpc/subscription`)
- `getCurrent` - Get current subscription
- `getPlans` - Get available plans
- `updateSubscription` - Manual subscription management
- `getUsageHistory` - Get usage statistics
- `resetMonthlyScans` - Reset monthly scan limits
- `createCheckoutSession` - Placeholder for payment
- `handleWebhook` - Placeholder for webhooks

### Public API (`/trpc/public`)
- `getSharedReport` - Access shared reports (no auth)
- `getPublicScore` - Get AI visibility badge
- `validateShareToken` - Validate share tokens
- `getStats` - Platform statistics
- `getTrendingBrands` - Most scanned brands

## Database Schema

### Core Models
- **User** - User accounts with subscription info
- **Brand** - Company brands to track
- **VisibilityScan** - Scan jobs and results
- **ScanResult** - Individual AI provider responses
- **ScanReport** - Generated reports (PDF/JSON)

### Subscription Tiers
- **FREE** - 3 scans/month, 1 brand
- **BASIC** - 25 scans/month, 5 brands, report sharing
- **PRO** - 100 scans/month, 20 brands, API access
- **AGENCY** - 500 scans/month, unlimited brands, white-label

## Placeholder Services

### AI Providers
- OpenAI integration (placeholder)
- Perplexity integration (placeholder)
- Mock responses with realistic data

### File Storage
- Local storage simulation
- Ready for AWS S3/Cloudflare R2 integration

### PDF Generation
- Mock PDF generation
- Ready for puppeteer/jsPDF integration

### Background Processing
- Simple in-memory queue
- Ready for Redis/Bull queue integration

## Development Commands

```bash
# Development
npm run dev              # Start dev server with watch
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to DB (dev)
npm run db:migrate      # Create and run migrations
npm run db:reset        # Reset database
npm run db:studio       # Open Prisma Studio

# Quality
npm run lint           # Lint code
npm run type-check     # Type check without build
```

## Environment Variables

Required variables:
```env
DATABASE_URL="mongodb://localhost:27017/check-ai-visibility"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
```

Optional (for future features):
```env
OPENAI_API_KEY="sk-..."
PERPLEXITY_API_KEY="pplx-..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
STRIPE_SECRET_KEY="sk_..."
REDIS_URL="redis://..."
```

## Next Steps

1. **AI Integration** - Replace placeholder AI services with real API calls
2. **File Storage** - Implement AWS S3 or similar for report storage
3. **Payment Integration** - Add Stripe for subscription management
4. **Email Notifications** - Add email service for scan completion
5. **Background Jobs** - Implement Redis queue for scan processing
6. **Authentication** - Complete Better-auth integration
7. **API Documentation** - Generate OpenAPI docs from tRPC schema

## Architecture

```
src/
├── index.ts              # Server entry point
├── lib/
│   ├── trpc.ts          # tRPC configuration
│   └── auth.ts          # Authentication setup
├── routers/
│   ├── app.ts           # Main router
│   ├── auth.ts          # Authentication endpoints
│   ├── brand.ts         # Brand management
│   ├── scan.ts          # Visibility scanning
│   ├── report.ts        # Report generation
│   ├── user.ts          # User management
│   ├── subscription.ts  # Subscription management
│   └── public.ts        # Public API endpoints
└── generated/
    └── prisma/          # Generated Prisma client
```

The backend is now fully set up with a complete API structure, ready for frontend integration and gradual replacement of placeholder services with real implementations.
