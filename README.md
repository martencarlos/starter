# Next.js 15 Starter Application

A modern Next.js 15 starter application with authentication, PostgreSQL database integration (Neon), and form validation using Zod.

## Features

- **Next.js 15**: Latest Next.js framework with App Router
- **PostgreSQL with Neon**: Direct database access without an ORM
- **Authentication**: Complete auth system using NextAuth.js
- **Form Validation**: Schema validation with Zod
- **Email**: Email functionality using Nodemailer
- **Styling**: UI components from shadcn/ui with Tailwind CSS

## Prerequisites

- Node.js (see `.nvmrc` for version)
- PostgreSQL (or Neon account)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/nextjs-15-starter.git
cd nextjs-15-starter
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```
# Database - Neon PostgreSQL
DATABASE_URL='your-neon-database-url'

# Authentication - Next Auth
NEXTAUTH_SECRET='your-secret-key'
NEXTAUTH_URL='http://localhost:3000'

# Email - Nodemailer
EMAIL_USER='your-email'
EMAIL_PASSWORD='your-email-password'
```

4. **Initialize the database**

If using Neon, navigate to your dashboard and run the SQL queries from `sql/init.sql`.

5. **Run the development server**

```bash
npm run dev
```

6. **Open the application**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Database Structure

The application uses the following tables:

- `users`: User accounts
- `password_reset`: Password reset tokens
- `email_verification`: Email verification tokens
- `user_sessions`: User session tracking

## Project Structure

```
├── app/                 # Next.js application directory
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard page
│   └── ...
├── components/          # React components
│   ├── auth/            # Authentication components
│   ├── ui/              # UI components
│   └── ...
├── lib/                 # Utility functions and services
│   ├── db.ts            # Database connection
│   ├── email.ts         # Email service
│   ├── services/        # Business logic services
│   └── validations/     # Zod validation schemas
├── sql/                 # SQL scripts
│   └── init.sql         # Database initialization
└── ...
```

## Authentication Flow

1. **Registration**: Users sign up with name, email, and password
2. **Email Verification**: Verification link sent to users
3. **Login**: Email and password authentication
4. **Password Reset**: Self-service password reset via email

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.