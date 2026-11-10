import pg from 'pg';
import { uuid, normalizeEmail, hashPassword, validatePassword } from '../src/security.mjs';
const email=normalizeEmail(process.env.SETUP_ADMIN_EMAIL);
const pwd=process.env.SETUP_ADMIN_PASSWORD;
const name=String(process.env.SETUP_ADMIN_NAME||'KRM Owner').trim();
if(!process.env.DATABASE_URL||!email||!validatePassword(pwd)||!name)throw Error('DATABASE_URL, SETUP_ADMIN_EMAIL and a strong SETUP_ADMIN_PASSWORD required');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:1});
try{
 const check=await pool.query('SELECT id FROM users WHERE email=$1',[email]);
 if(check.rowCount)throw Error('Account exists; refusing overwrite');
 await pool.query('INSERT INTO users(id,email,display_name,role,password_hash) VALUES($1,$2,$3,$4,$5)',[uuid(),email,name,'admin',await hashPassword(pwd)]);
 console.log('Admin created. Remove SETUP_ADMIN_PASSWORD from environment now.');
}finally{await pool.end()}
