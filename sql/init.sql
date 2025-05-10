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

CREATE TABLE IF NOT EXISTS password_reset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_password_reset_token UNIQUE (token)
);

CREATE TABLE IF NOT EXISTS email_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_email_verification_token UNIQUE (token)
);

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

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(10) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, 
    ticket_number TEXT UNIQUE NOT NULL DEFAULT 'ST-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    subject TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    created_by_name VARCHAR(100),
    created_by_email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, 
    sender VARCHAR(50) NOT NULL, 
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_contact_info_ticket_id ON ticket_contact_info(ticket_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_related_entity_id ON notifications(related_entity_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_tickets_updated_at') THEN
    CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_preferences_updated_at') THEN
    CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

INSERT INTO roles (name, description) VALUES ('admin', 'Administrator with full access') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('user', 'Standard user with basic access') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('support_agent', 'Support agent with access to support tickets') ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (name, description) VALUES ('manage:users', 'Can create, read, update, and delete users') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('manage:roles', 'Can manage roles and their permissions') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('manage:permissions', 'Can manage permissions definitions') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('view:admin_dashboard', 'Can view the admin dashboard') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:users', 'Can view user directory') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:reports', 'Can view system reports') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:audit_log', 'Can view system audit log') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('read:analytics', 'Can view system analytics') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('manage:support_tickets', 'Can manage all support tickets (admins)') ON CONFLICT (name) DO NOTHING;
INSERT INTO permissions (name, description) VALUES ('reply:support_tickets', 'Can reply to support tickets (support agents)') ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
    admin_role_id_val INTEGER;
    support_agent_role_id_val INTEGER;
    perm_id INTEGER;
    perm_name TEXT;
    admin_permissions TEXT[] := ARRAY[
        'manage:users', 'manage:roles', 'manage:permissions', 
        'view:admin_dashboard', 'read:users', 'read:reports', 
        'read:audit_log', 'read:analytics', 'manage:support_tickets', 'reply:support_tickets'
    ];
    support_agent_permissions TEXT[] := ARRAY[
        'reply:support_tickets'
    ];
BEGIN
    SELECT id INTO admin_role_id_val FROM roles WHERE name = 'admin';
    SELECT id INTO support_agent_role_id_val FROM roles WHERE name = 'support_agent';

    IF admin_role_id_val IS NOT NULL THEN
        FOREACH perm_name IN ARRAY admin_permissions
        LOOP
            SELECT id INTO perm_id FROM permissions WHERE name = perm_name;
            IF perm_id IS NOT NULL THEN
                INSERT INTO role_permissions (role_id, permission_id) VALUES (admin_role_id_val, perm_id) ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;

    IF support_agent_role_id_val IS NOT NULL THEN
        FOREACH perm_name IN ARRAY support_agent_permissions
        LOOP
            SELECT id INTO perm_id FROM permissions WHERE name = perm_name;
            IF perm_id IS NOT NULL THEN
                INSERT INTO role_permissions (role_id, permission_id) VALUES (support_agent_role_id_val, perm_id) ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;
END $$;
