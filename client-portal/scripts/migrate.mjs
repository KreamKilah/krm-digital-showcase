import pg from 'pg';
import { readFile } from 'node:fs/promises';
const url=process.env.DATABASE_URL;
if(!url)throw Error('DATABASE_URL required');
const pool=new pg.Pool({connectionString:url,max:2});
try{
 for(const name of ['001_initial.sql','002_mfa.sql']){
  await pool.query(await readFile(new URL('../sql/'+name,import.meta.url),'utf8'));
 }
 console.log('KRM portal migrations applied (base + MFA)');
}finally{await pool.end()}
