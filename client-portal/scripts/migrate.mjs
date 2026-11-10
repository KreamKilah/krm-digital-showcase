import pg from 'pg';
import { readFile } from 'node:fs/promises';
const url=process.env.DATABASE_URL;
if(!url)throw Error('DATABASE_URL required');
const pool=new pg.Pool({connectionString:url,max:2});
try{
 await pool.query(await readFile(new URL('../sql/001_initial.sql',import.meta.url),'utf8'));
 console.log('KRM portal migration applied');
}finally{await pool.end()}
