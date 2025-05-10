# Next.js 15 Starter Application

A modern Next.js 15 starter application with comprehensive authentication, PostgreSQL database integration (Neon compatible), role-based access control, a full-featured admin panel, user profile management, an integrated support system, notifications, and more. Built with TypeScript, Zod for validation, and shadcn/ui for styling.

## Features

-   **Next.js 15**: Latest Next.js framework with App Router and Turbopack support for development.
-   **Comprehensive Authentication**:
    -   NextAuth.js v4 with credentials & Google OAuth.
    -   Email verification, password reset, and account linking.
    -   Database-backed session tracking.
-   **Advanced User Profile Management**:
    -   Update personal information (name).
    -   Change password (for credential accounts).
    -   Manage preferences (UI theme, email notifications, regional settings, session length).
    -   View account activity log and personal usage statistics.
    -   Secure account deletion.
-   **Full-Featured Admin Panel**:
    -   User Management: CRUD operations, role assignment.
    -   Role Management: CRUD operations, permission assignment (built-in roles protected).
    -   System Permissions Viewing: Overview of all defined permissions.
    -   System Analytics: Dashboard with key metrics.
    -   Audit Log: Tracks role assignment changes.
-   **Integrated Support System**:
    -   Ticket Creation: For both guests and authenticated users.
    -   Ticket Management: Users view their tickets; Admins/Support Agents manage all tickets.
    -   Detailed Ticket View: Conversation history, status updates, ability to reply.
    -   FAQ Section: Searchable and categorized frequently asked questions.
-   **Real-time Notification System**:
    -   In-app notifications via header icon with unread count.
    -   Notifications for new support tickets, replies, and status changes.
    -   Mark as read (single/all) functionality.
-   **Robust Role-Based Access Control (RBAC)**:
    -   Predefined roles (`admin`, `user`, `support_agent`) and granular permissions.
    -   Centralized route protection via `middleware.ts`.
    -   Server-side and client-side access control mechanisms.
-   **Database Integration**: Direct PostgreSQL access (Neon compatible) using the `pg` library.
-   **Modern UI/UX**: Built with shadcn/ui and Tailwind CSS, featuring a responsive design and dark mode.
-   **Developer Experience**:
    -   TypeScript for type safety.
    -   ESLint 9 and Prettier for code quality and consistency.
    -   Zod for robust schema validation (forms and API).
    -   Next.js Bundle Analyzer for performance insights.
-   **User Activity & Session Tracking**: Logs significant user actions and manages sessions in the database.
-   **Email Notifications**: Nodemailer for transactional emails (welcome, verification, password reset, etc.).

## Prerequisites

-   Node.js (see `.nvmrc` for version, e.g., `20.17.0`)
-   PostgreSQL instance (e.g., local, Docker, or a cloud provider like Neon)

## Getting Started

1.  **Clone the repository**

    ```bash
    git clone https://github.com/martencarlos/starter
    cd starter
    ```

2.  **Install dependencies**

    Use npm as specified in `.vscode/settings.json` (`npm.packageManager`).
    ```bash
    npm install
    ```

3.  **Set up environment variables**

    Copy the `.env.example` file to `.env.local` and update the values:

    ```bash
    cp .env.example .env.local
    ```

    Edit `.env.local` with your configuration:

    ```env
    # Database - e.g., Neon PostgreSQL
    DATABASE_URL='your-neon-database-url'

    # Authentication - Next Auth
    NEXTAUTH_SECRET='generate-a-strong-random-secret-key' # openssl rand -hex 32
    NEXTAUTH_URL='http://localhost:3000'

    # Email - Nodemailer (e.g., Zoho, Gmail, SendGrid)
    EMAIL_USER='your-email-address'
    EMAIL_PASSWORD='your-email-app-password-or-api-key'
    # EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE might be needed depending on your provider

    # Google OAuth (Optional)
    GOOGLE_CLIENT_ID='your-google-client-id'
    GOOGLE_CLIENT_SECRET='your-google-client-secret'

    # Next.js Bundle Analyzer (Optional)
    # BUNDLE_ANALYZER_ENABLED=true
    ```

4.  **Initialize the database**

    Connect to your PostgreSQL instance and execute the SQL commands from `sql/init.sql`. This will create all necessary tables, roles, permissions, and their relationships.

    ```bash
    # Example using psql, replace with your connection details or use a GUI tool
    psql "your-database-url" -f sql/init.sql
    ```

5.  **Create an initial admin user (Optional but Recommended)**

    Run the script to create an admin user. You will be prompted for details.
    ```bash
    npm run create-admin
    ```
    Alternatively, you can register a new user through the UI and then manually assign the 'admin' role in your database.

6.  **Run the development server**

    ```bash
    npm run dev
    ```

7.  **Open the application**

    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Database Structure

The application uses the following tables:

-   `users`: User accounts, including OAuth details.
-   `password_reset`: Password reset tokens.
-   `email_verification`: Email verification tokens.
-   `user_sessions`: User session tracking with IP and user agent.
-   `roles`: System roles (e.g., admin, user, support_agent).
-   `permissions`: Predefined system permissions.
-   `user_roles`: Maps users to roles.
-   `role_permissions`: Maps roles to permissions.
-   `role_assignment_history`: Audit log for role changes.
-   `support_tickets`: Support ticket details, including creator info.
-   `ticket_messages`: Messages within support tickets.
-   `ticket_contact_info`: Fallback contact info for tickets.
-   `notifications`: User-specific notifications.
-   `user_activity`: Logs significant user actions (login, profile updates, etc.).
-   `user_preferences`: Stores user-specific settings (theme, notifications, etc.).

Refer to `sql/init.sql` for detailed schema information.

## Project Structure

## Authentication Flow

1.  **Registration**: Users sign up with name, email, and password.
2.  **Email Verification**: A verification link is sent to new users to activate their account.
3.  **Login**:
    *   **Credentials**: Standard email and password authentication.
    *   **Google OAuth**: Sign-in or sign-up using a Google account. If an email already exists, the Google account is linked.
4.  **Password Reset**: Self-service password reset functionality via email link for credential-based accounts.
5.  **Session Management**: JWT-based sessions managed by NextAuth.js, with session records stored in the database for tracking and server-side invalidation capabilities.

## Role-Based Access Control (RBAC)

This application includes a comprehensive RBAC system:

### Key Features

-   **User Roles**: Users can be assigned multiple roles. Default roles include `admin`, `user`, and `support_agent`.
-   **Predefined Permissions**: A comprehensive set of fine-grained permissions (e.g., `manage:users`, `read:audit_log`, `reply:support_tickets`) are defined in `sql/init.sql` and assigned to roles.
-   **Centralized Protection via Middleware**: `middleware.ts` robustly handles access control for both UI routes and API endpoints based on authentication status, roles, and permissions.
-   **Server-Side Checks**: Server components and `authOptions` use `roleService` for critical RBAC logic.
-   **Client-Side Controls**: Custom hooks (`useRoles`, `usePermissions`) and components (`WithRole`) allow for dynamic UI rendering based on user access rights.
-   **Auditability**: Role assignment changes are logged in the `role_assignment_history` table.

### Schema Design

-   `roles`: Defines available roles.
-   `permissions`: Defines granular permissions.
-   `user_roles`: Maps users to roles.
-   `role_permissions`: Maps roles to permissions.
-   `role_assignment_history`: Logs changes to user role assignments.

### Default Roles

-   **admin**: Full system access, including user and role management, analytics, and audit logs.
-   **user**: Basic role for standard registered users, allowing access to profile management and their own support tickets.
-   **support_agent**: Access to view and reply to support tickets.

### Protection Mechanisms

-   **Middleware (`middleware.ts`)**: The primary gatekeeper for routes, checking authentication, roles, and permissions.
-   **API Route Handlers**: Server-side checks within API endpoints ensure data integrity and authorization.
-   **Server Components**: Utilize `roleService` for conditional rendering or data fetching based on access.
-   **Client Components**: Employ `useRoles` and `WithRole` for UI adaptation.
-   **Session Token**: JWT enriched with roles and permissions for efficient client-side checks.

## Admin Panel

The admin panel, accessible to users with the 'admin' role, provides comprehensive tools for system management:

-   **User Management**: View, create, edit, and delete users. Assign and unassign roles to users.
-   **Role Management**: View, create, edit, and delete custom roles. Assign and unassign permissions to roles. (Built-in 'admin' and 'user' roles have restricted editability).
-   **Permissions Overview**: View all predefined system permissions and a count of roles they are assigned to.
-   **System Analytics**: A dashboard displaying key metrics like total users, verified users, role counts, permission counts, and active sessions.
-   **Audit Log**: Review a history of role assignment and removal actions, including who performed the action and when.

## User Profile & Settings

Authenticated users have access to a dedicated profile section where they can:

-   **View Account Overview**: See basic account details, roles, member since date, and email verification status.
-   **Update Account Information**: Change their display name.
-   **Manage Security**: Change their password (for credential-based accounts).
-   **Set Preferences**:
    -   Choose UI theme (light, dark, system).
    -   Manage email notification preferences (general, marketing, support, security).
    -   Set regional preferences like timezone and date format.
    -   Configure session settings (e.g., extended session length).
-   **View Account Activity**: See a log of recent activities like logins, profile updates, and password changes.
-   **View User Stats**: A dashboard showing personal statistics related to support tickets, login activity, and account utilization.
-   **Delete Account**: A "Danger Zone" option to permanently delete their account (not available for OAuth-linked accounts, which must be managed via the OAuth provider).

## Support System

The application features an integrated support system:

-   **Ticket Creation**: Users (both authenticated and guests) can submit support tickets via a contact form.
-   **Ticket Management**:
    -   **Users**: Can view their own ticket history, filter by status (all, open, closed), and view ticket details including the conversation.
    -   **Admins/Support Agents**: Can view all tickets, reply to tickets, and manage ticket statuses.
-   **Ticket Conversation**: View messages between the user and support, and add new replies. System messages (e.g., status changes) are also shown.
-   **FAQ Section**: A searchable and filterable list of frequently asked questions categorized for easy browsing.
-   **Notifications**: Users and support staff receive notifications for new tickets and replies.

## Notification System

A real-time (polling-based) notification system keeps users informed:

-   **In-App Display**: Notifications are accessible via a bell icon in the header.
-   **Unread Count**: A badge on the bell icon indicates the number of unread notifications.
-   **Types of Notifications**:
    -   New support ticket created.
    -   Reply to a support ticket (from user or support).
    -   Support ticket status change.
-   **Interaction**: Notifications can be marked as read individually or all at once. Clicking a notification typically navigates to the relevant page (e.g., a specific support ticket).

## Development Tools

-   **ESLint & Prettier**: Configured for code linting and formatting to maintain code quality.
-   **Next.js Bundle Analyzer**: Can be enabled to analyze webpack bundle sizes.
-   **Turbopack**: Used for faster development builds (`npm run dev`).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
