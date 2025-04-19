import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

export default async function () {
  // 1) Carrega as variáveis do .env.test
  dotenv.config({ path: resolve(__dirname, '../.env.test') });

  // 2) Analisa a URL do DATABASE_URL
  const url = process.env.DATABASE_URL!;
  const parsed = new URL(url);
  const dbName = parsed.pathname.slice(1); // 'mydatabase_test'
  const adminConnection = new URL(url);
  adminConnection.pathname = '/postgres'; // conecta no DB system 'postgres'

  console.log(adminConnection.toString());

  // 3) Conecta e tenta criar o database
  const client = new Client({ connectionString: adminConnection.toString() });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✔ Created database ${dbName}`);
  } catch (err: any) {
    if (err.code === '42P04') {
      console.log(`ℹ Database ${dbName} already exists`);
    } else {
      throw err;
    }
  }
  await client.end();

  // 4) Aplica o schema via Prisma CLI local
  const prismaCli = resolve(__dirname, '../node_modules/.bin/prisma');
  execSync(
    `"${prismaCli}" db push --schema="${resolve(
      __dirname,
      '../prisma/schema.prisma',
    )}"`,
    { stdio: 'inherit' },
  );
}
