import 'dotenv/config';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../tasks/entities/task.entity.js';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export default new DataSource({
    type: 'postgres',
    host: requiredEnv('DB_HOST'),
    port: Number(requiredEnv('DB_PORT')),
    username: requiredEnv('DB_USERNAME'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_DATABASE'),
    entities: [TaskEntity],
    migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
});
