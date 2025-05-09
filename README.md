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

\`\`\`bash
git clone https://github.com/martencarlos/starter
cd starter
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local` and update the values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:

\`\`\`
# Database - Neon PostgreSQL
DATABASE_URL='your-neon-database-url'

# Authentication - Next Auth
NEXTAUTH_SECRET='your-secret-key'
NEXTAUTH_URL='http://localhost:3000'

# Email - Nodemailer
EMAIL_USER='your-email'
EMAIL_PASSWORD='your-email-password'
\`\`\`

4. **Initialize the database**

If using Neon, navigate to your dashboard and run the SQL queries from `sql/init.sql`.

5. **Run the development server**

\`\`\`bash
npm run dev
\`\`\`

6. **Open the application**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Database Structure

The application uses the following tables:

- `users`: User accounts
- `password_reset`: Password reset tokens
- `email_verification`: Email verification tokens
- `user_sessions`: User session tracking

## Project Structure

\`\`\`
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
\`\`\`

## Authentication Flow

1. **Registration**: Users sign up with name, email, and password
2. **Email Verification**: Verification link sent to users
3. **Login**: Email and password authentication
4. **Password Reset**: Self-service password reset via email

## Role-Based Access Control (RBAC)

This application includes a comprehensive RBAC system that controls access to resources based on user roles and permissions.

### Key Features

- **User Roles**: Users can be assigned multiple roles (e.g., `admin`, `user`, `editor`).
- **Predefined Permissions**: A fixed set of fine-grained permissions (e.g., `read:users`, `manage:roles`) are defined in the system (`sql/init.sql`). These permissions are assigned to roles.
- **Centralized Protection via Middleware**: `middleware.ts` handles access control for both UI routes and API endpoints based on authentication, roles, and permissions.
- **Server-Side Checks**: Server components and `authOptions` use `roleService` for RBAC logic.
- **Client-Side Controls**: Hooks (`useRoles`, `usePermissions`) and components (`WithRole`, `WithPermission`) allow for dynamic UI rendering based on user access.

### Schema Design

The RBAC system uses the following database tables:

- `roles`: Defines available roles in the system
- `permissions`: Defines the set of available granular permissions (managed via `sql/init.sql`)
- `user_roles`: Junction table mapping users to roles
- `role_permissions`: Junction table mapping roles to permissions

### Default Roles

The system comes with two default roles:

- **user**: Basic role assigned to all registered users
- **admin**: Full system access

### Protection Mechanisms

The primary mechanism for route protection is `middleware.ts`. It checks authentication status, and then verifies if the user has the necessary roles or permissions for the requested path, as defined in its configuration maps.

Session tokens (JWT) are enriched with user roles and permissions, allowing client-side components and hooks to adapt the UI.

Server components can use `roleService` for more granular checks if needed, beyond what the middleware provides at the route level.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.