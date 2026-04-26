import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: [
    "./src/app/modules/user/schemas/users.ts"
    , "./src/app/modules/mortgage/schemas/mortgages.ts"
  ],
  out: './database/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '3306'),
    user: process.env.USERNAME,
    password: process.env.PASSWORD || undefined,
    database: process.env.DATABASE || 'DatabaseName',
  },
  verbose: true,
  strict: true,
}); 