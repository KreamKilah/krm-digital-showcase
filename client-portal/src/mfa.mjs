// KRM TOTP: RFC 6238 30-second / SHA-1, encrypted at rest with AES-256-GCM.
// This is a second factor, NOT a standalone user authentication token.
import { randomBytes, createCipheriv, createDecipheriv, createHmac, timingSafeEqual } from 'node:crypto';
import { digest } from './security.mjs';
const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32(bytes){
 const b=Buffer.from(bytes);let bits=0,value=0,out='';
 for(const c of b){value=(value<<8)|c;bits+=8;while(bits>=5){out+=ALPHABET[(value>>>(bits-=5))&31];}}
 if(bits>0)out+=ALPHABET[(value<<(5-bits))&31];
 return out;
}
export const newSecret=()=>randomBytes(20);
function key(){
 const raw=process.env.MFA_ENCRYPTION_KEY;
 const k=typeof raw==='string'?Buffer.from(raw,'base64url'):null;
 if(!k||k.length!==32)throw Error('MFA_ENCRYPTION_KEY must be 32 random bytes encoded as base64url');
 return k;
}
export function encryptSecret(bytes){
 const nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(),nonce);
 const payload=Buffer.concat([cipher.update(bytes),cipher.final()]),tag=cipher.getAuthTag();
 return [nonce,tag,payload].map(x=>x.toString('base64url')).join('.');
}
export function decryptSecret(encoded){
 const parts=typeof encoded==='string'?encoded.split('.'):null;
 if(!parts||parts.length!==3)throw Error('Invalid MFA secret ciphertext');
 const [nonce,tag,payload]=parts.map(p=>Buffer.from(p,'base64url'));
 if(nonce.length!==12||tag.length!==16||payload.length!==20)throw Error('Invalid MFA secret ciphertext');
 const decipher=createDecipheriv('aes-256-gcm',key(),nonce);
 decipher.setAuthTag(tag);return Buffer.concat([decipher.update(payload),decipher.final()]);
}
export function totpForStep(secret,step){
 const counter=Buffer.alloc(8);
 counter.writeBigUInt64BE(BigInt(step));
 const mac=createHmac('sha1',secret).update(counter).digest();
 const offset=mac[mac.length-1]&15;
 return String((mac.readUInt32BE(offset)&0x7fffffff)%1000000).padStart(6,'0');
}
export function matchTotp(secret,code,{now=Date.now(),lastStep=-1}={}){
 if(typeof code!=='string'||!/^\d{6}$/.test(code))return null;
 const current=Math.floor(now/30000);
 for(const step of [current-1,current,current+1]){
  if(step<=Number(lastStep)||step<0)continue;
  const expected=totpForStep(secret,step);
  if(timingSafeEqual(Buffer.from(expected),Buffer.from(code)))return step;
 }
 return null;
}
export function enrollmentUri(email,secret){
 const url=new URL('otpauth://totp/'+encodeURIComponent('KRM DIGITAL:'+email));
 url.searchParams.set('secret',base32(secret));url.searchParams.set('issuer','KRM DIGITAL');
 url.searchParams.set('algorithm','SHA1');url.searchParams.set('digits','6');url.searchParams.set('period','30');
 return url.href;
}
export function recoveryCodes(count=8){
 return Array.from({length:count},()=>{
  const code=base32(randomBytes(15));
  const display=code.match(/.{1,4}/g).join('-');
  return {display,hash:digest(code)};
 });
}
export function normalizeRecovery(input){
 if(typeof input!=='string')return null;
 const code=input.toUpperCase().replace(/-/g,'');
 return /^[A-Z2-7]{24}$/.test(code)?code:null;
}
