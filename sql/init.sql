-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  oauth_access_token TEXT,
  oauth_refresh_token TEXT,
  oauth_expires_at TIMESTAMP WITH TIME ZONE
);

-- Create password_reset table
CREATE TABLE IF NOT EXISTS password_reset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_password_reset_token UNIQUE (token)
);

-- Create email_verification table
CREATE TABLE IF NOT EXISTS email_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_email_verification_token UNIQUE (token)
);

-- Create user_sessions table (for tracking active sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address VARCHAR(45),
  CONSTRAINT unique_session_token UNIQUE (session_token)
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'create:post', 'read:user'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Roles (Junction Table)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions (Junction Table)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role Assignment History (Audit Log)
CREATE TABLE IF NOT EXISTS role_assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL, -- User ID of admin who assigned/removed role, or NULL if system
    action VARCHAR(10) NOT NULL, -- 'assign' or 'remove'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL AND oauth_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_role_assignment_history_user_id ON role_assignment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_role_assignment_history_role_id ON role_assignment_history(role_id);
CREATE INDEX IF NOT EXISTS idx_role_assignment_history_assigned_by ON role_assignment_history(assigned_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_roles_updated_at') THEN
    CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_permissions_updated_at') THEN
    CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Default roles and permissions
INSERT INTO roles (name, description) VALUES ('admin', 'Administrator with full access') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('user', 'Standard user with basic access') ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (name, description) VALUES ('manage:users', 'Can create, read, update, and delete users') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('manage:roles', 'Can manage roles and their permissions') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('manage:permissions', 'Can manage permissions definitions') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('view:admin_dashboard', 'Can view the admin dashboard') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:users', 'Can view user directory') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:reports', 'Can view system reports') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:audit_log', 'Can view system audit log') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:analytics', 'Can view system analytics') ON CONFLICT (name) DO NOTHING;

-- Assign all manage permissions to admin role
DO $$
DECLARE
    admin_role_id_val INTEGER;
    perm_id INTEGER;
    perm_name TEXT;
    admin_permissions TEXT[] := ARRAY[
        'manage:users', 'manage:roles', 'manage:permissions', 
        'view:admin_dashboard', 'read:users', 'read:reports', 
        'read:audit_log', 'read:analytics'
    ];
BEGIN
    SELECT id INTO admin_role_id_val FROM roles WHERE name = 'admin';

    IF admin_role_id_val IS NOT NULL THEN
        FOREACH perm_name IN ARRAY admin_permissions
        LOOP
            SELECT id INTO perm_id FROM permissions WHERE name = perm_name;
            IF perm_id IS NOT NULL THEN
                INSERT INTO role_permissions (role_id, permission_id) VALUES (admin_role_id_val, perm_id) ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;
END $$;