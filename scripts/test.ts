import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { Client } from 'pg';
import { cwd } from 'process';
config();

const cleanDatabase = readFileSync(cwd() + '/db/test.sql', 'utf-8');

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT),
});
client.connect();

client.query(cleanDatabase, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Database cleaned');
  client.end();
});
