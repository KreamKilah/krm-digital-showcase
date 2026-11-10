import { createApp, poolFromEnv } from './app.mjs';
const port=Number(process.env.PORT||3000);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('Invalid PORT');
const db=poolFromEnv();
await db.query('SELECT 1');
const app=createApp(db);
const server=app.listen(port,'0.0.0.0',()=>console.log('KRM Client Portal listening on port '+port));
function shutdown(){server.close(async()=>{await db.end();process.exit(0)})}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
