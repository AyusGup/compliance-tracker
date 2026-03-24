import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../db';
import path from 'path';

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: path.join(__dirname, '../../drizzle') });
  console.log('Migrations complete!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
