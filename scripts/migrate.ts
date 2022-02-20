import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { Client } from 'pg';
import { cwd } from 'process';
config();

const migrateDatabase = readFileSync(cwd() + '/db/migrate.sql', 'utf-8');

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT),
});
client.connect();

client.query(migrateDatabase, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Database migrated');
  client.end();
});
