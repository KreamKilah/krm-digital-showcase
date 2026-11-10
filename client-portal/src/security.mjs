import { randomBytes, createHash, scrypt as scryptCb, timingSafeEqual, randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt=promisify(scryptCb);
export const uuid=()=>randomUUID();
export const opaque=()=>randomBytes(32).toString('base64url');
export const digest=value=>createHash('sha256').update(value).digest('hex');
export function normalizeEmail(value){
 if(typeof value!=='string')return null;
 const email=value.trim().toLowerCase();
 return email.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?email:null;
}
export function validatePassword(value){
 return typeof value==='string' && value.length>=12 && value.length<=128 && !/[\u0000-\u001f]/.test(value);
}
export async function hashPassword(password){
 if(!validatePassword(password))throw Error('Password must be 12-128 characters');
 const salt=randomBytes(16).toString('hex');
 const derived=await scrypt(password,salt,64);
 return 'scrypt$'+salt+'$'+derived.toString('hex');
}
export async function verifyPassword(password,encoded){
 try{
  const [method,salt,expected]=encoded.split('$');
  if(method!=='scrypt'||!/^([0-9a-f]{32})$/.test(salt)||!/^([0-9a-f]{128})$/.test(expected)||typeof password!=='string')return false;
  const actual=await scrypt(password,salt,64);
  return timingSafeEqual(actual,Buffer.from(expected,'hex'));
 }catch{return false}
}
export function constantTokenMatch(left,right){
 if(typeof left!=='string'||typeof right!=='string'||left.length!==right.length)return false;
 return timingSafeEqual(Buffer.from(left),Buffer.from(right));
}
export function parseCookies(str=''){
 const out=Object.create(null);
 for(const item of str.split(';')){
  const pos=item.indexOf('=');if(pos<1)continue;
  const name=item.slice(0,pos).trim();if(!/^[a-zA-Z0-9_-]+$/.test(name))continue;
  try{out[name]=decodeURIComponent(item.slice(pos+1).trim())}catch{}
 }
 return out;
}
export const COOKIE='__Host-krm_session';
export function sessionCookie(token,maxAge=28800){
 return COOKIE+'='+encodeURIComponent(token)+'; Path=/; Max-Age='+maxAge+'; HttpOnly; Secure; SameSite=Strict';
}
export function safeHttpUrl(input){
 try{const url=new URL(input);if(url.protocol!=='https:'||url.username||url.password||url.href.length>1200)return null;return url.href}catch{return null}
}
export function validId(input){return typeof input==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input)}
