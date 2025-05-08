const bcryptjs = require('bcryptjs');
const { Pool } = require('pg');

// Configure the database connection
const pool = new Pool({
    connectionString:
        'postgresql://db_owner:npg_tkweuKGR5C1N@ep-old-firefly-a9j3twwm-pooler.gwc.azure.neon.tech/db?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function createAdminUser() {
    const client = await pool.connect();

    try {
        console.log('Creating admin user...');

        // Admin user data
        const name = 'admin';
        const email = 'admin@carlosmarten.com';
        const password = 'Admin_89';

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Start a transaction
        await client.query('BEGIN');

        // Check if user already exists
        const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);

        let userId;

        if (existingUser.rows.length > 0) {
            console.log('User already exists, updating...');
            userId = existingUser.rows[0].id;

            // Update the existing user
            await client.query('UPDATE users SET name = $1, password = $2, email_verified = TRUE WHERE id = $3', [
                name,
                hashedPassword,
                userId
            ]);
        } else {
            console.log('Creating new user...');

            // Insert the user
            const userResult = await client.query(
                `INSERT INTO users (name, email, password, email_verified) 
         VALUES ($1, $2, $3, TRUE) 
         RETURNING id`,
                [name, email, hashedPassword]
            );

            userId = userResult.rows[0].id;
        }

        // Check if admin role exists
        const adminRole = await client.query('SELECT id FROM roles WHERE name = $1', ['admin']);

        let roleId;

        if (adminRole.rows.length > 0) {
            roleId = adminRole.rows[0].id;
        } else {
            // Create admin role if it doesn't exist
            console.log('Admin role not found, creating...');

            const roleResult = await client.query(
                `INSERT INTO roles (name, description) 
         VALUES ($1, $2) 
         RETURNING id`,
                ['admin', 'Administrator with full access']
            );

            roleId = roleResult.rows[0].id;

            // Create basic permissions if they don't exist
            const permissions = [
                { name: 'read:own_profile', description: 'Can view own profile' },
                { name: 'update:own_profile', description: 'Can update own profile' },
                { name: 'read:users', description: 'Can view all users' },
                { name: 'create:users', description: 'Can create users' },
                { name: 'update:users', description: 'Can update any user' },
                { name: 'delete:users', description: 'Can delete users' }
            ];

            for (const permission of permissions) {
                // Check if permission exists
                const existingPermission = await client.query('SELECT id FROM permissions WHERE name = $1', [
                    permission.name
                ]);

                let permissionId;

                if (existingPermission.rows.length > 0) {
                    permissionId = existingPermission.rows[0].id;
                } else {
                    // Create permission
                    const permResult = await client.query(
                        `INSERT INTO permissions (name, description) 
             VALUES ($1, $2) 
             RETURNING id`,
                        [permission.name, permission.description]
                    );

                    permissionId = permResult.rows[0].id;
                }

                // Assign permission to admin role
                await client.query(
                    `INSERT INTO role_permissions (role_id, permission_id) 
           VALUES ($1, $2) 
           ON CONFLICT (role_id, permission_id) DO NOTHING`,
                    [roleId, permissionId]
                );
            }
        }

        // Assign admin role to user
        await client.query(
            `INSERT INTO user_roles (user_id, role_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, role_id) DO NOTHING`,
            [userId, roleId]
        );

        // Commit the transaction
        await client.query('COMMIT');

        console.log('✅ Admin user created successfully:');
        console.log(`   Name: ${name}`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('   Role: admin');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error creating admin user:', error);
        console.error(error.stack);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the function
createAdminUser().catch((err) => {
    console.error('Failed to create admin user:', err);
    process.exit(1);
});
