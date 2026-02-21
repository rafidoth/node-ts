import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import crypto from "node:crypto";
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex");
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
}

// Default admin user for development/seeding
// IMPORTANT: Change these credentials in production!
const adminUser = {
    email: 'admin@example.com',
    password: "changeme",
    display_name: 'Admin',
};

export async function up(pgm: MigrationBuilder): Promise<void> {
    const hash = await hashPassword(adminUser.password);
    pgm.sql(`
        INSERT INTO users (email, password_hash, display_name, role)
        VALUES ('${adminUser.email}', '${hash}', '${adminUser.display_name}', 'admin')
        ON CONFLICT (email) DO NOTHING;
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`DELETE FROM users WHERE email = '${adminUser.email}';`);
}
