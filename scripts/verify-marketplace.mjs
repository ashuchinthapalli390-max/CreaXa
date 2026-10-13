import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import ts from 'typescript';
const tmp='.sites-runtime/verification';fs.mkdirSync(tmp,{recursive:true});
const transpile=(s)=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
fs.writeFileSync(`${tmp}/currency.mjs`,transpile(fs.readFileSync('lib/currency.ts','utf8')));
let matching=fs.readFileSync('lib/matching.ts','utf8').replace("from './currency'","from './currency.mjs'");
fs.writeFileSync(`${tmp}/matching.mjs`,transpile(matching));
fs.writeFileSync(`${tmp}/enhancements.mjs`,transpile(fs.readFileSync('lib/enhancements.ts','utf8')));
fs.writeFileSync(`${tmp}/database.mjs`,transpile(fs.readFileSync('lib/database.ts','utf8')
  .replace(/import\s*\{\s*env\s*\}\s*from ['"]cloudflare:workers['"];?/,"const env=globalThis.__verificationEnv;")
  .replace(/import\s*\{[^}]*\}\s*from ['"]\.\/supabase['"];?/,"const isSupabaseConfigured=()=>false; const getSupabaseAdmin=()=>null;")));
let server=fs.readFileSync('lib/server.ts','utf8')
  .replace(/import\s*\{\s*env\s*\}\s*from ['"]cloudflare:workers['"];?/,"const env=globalThis.__verificationEnv;")
  .replace(/import\s*\{\s*getAuthUser\s*\}\s*from ['"]\.\.\/app\/auth['"];?/,"const getAuthUser=async()=>globalThis.__verificationUser;")
  .replace(/import\s*\{[^}]*getAuthenticatedUser[^}]*\}\s*from ['"]\.\/auth-edge['"];?/,"const getAuthenticatedUser=async()=>globalThis.__verificationUser; const verifyFirebaseIdToken=async()=>globalThis.__verificationUser;")
  .replace(/import\s*\{\s*getChatGPTUser\s*\}\s*from ['"]\.\.\/app\/chatgpt-auth['"];?/,"const getChatGPTUser=async()=>globalThis.__verificationUser;")
  .replace("from './matching'","from './matching.mjs'")
  .replace("from './enhancements'","from './enhancements.mjs'")
  .replace("from './database'","from './database.mjs'")
  .replace("from './currency'","from './currency.mjs'");
fs.writeFileSync(`${tmp}/server.mjs`,transpile(server));
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const f of fs.readdirSync('drizzle').filter(s=>s.endsWith('.sql')).sort())sql.exec(fs.readFileSync('drizzle/'+f,'utf8'));
const bindValue=v=>v===undefined?null:typeof v==='boolean'?Number(v):v;
function prepare(query){return {args:[],bind(...args){this.args=args.map(bindValue);return this},async all(){return {results:sql.prepare(query).all(...this.args)}},async first(){return sql.prepare(query).get(...this.args)||null},async run(){const r=sql.prepare(query).run(...this.args);return {meta:{changes:Number(r.changes)}}}}}
const objects=new Map();globalThis.__verificationEnv={DB:{prepare,async batch(statements){sql.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());sql.exec('COMMIT');return results}catch(e){sql.exec('ROLLBACK');throw e}}},BUCKET:{async put(id,bytes,opts){objects.set(id,{bytes,opts})},async get(id){const o=objects.get(id);return o?{body:o.bytes}:null},async delete(id){objects.delete(id)}}};
const {handle}=await import('../'+tmp+'/server.mjs');
const origin='https://verification.invalid';let checks=0;
async function call(user,path,data,expected=200,method){globalThis.__verificationUser=user?{userId:user,email:user+'@invalid.local',displayName:user,fullName:user}:null;const req=new Request(origin+'/api/'+path,{method:method||(data!==undefined?'POST':'GET'),headers:{origin,'Content-Type':'application/json'},body:data!==undefined?JSON.stringify(data):undefined});const r=await handle(req,path.split('?')[0].split('/'));const b=r.headers.get('content-type')?.includes('application/json')?await r.json():await r.arrayBuffer();assert.equal(r.status,expected,JSON.stringify(b));checks++;return b}
const future=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
await call(null,'creators');await call(null,'account',{},401);
await call('brand','account',{name:'Brand User',role:'brand',organization:'Organization',industry:'Fashion',terms:true});
await call('creator','account',{name:'Creator User',role:'creator',terms:true});
await call('outsider','account',{name:'Other User',role:'brand',organization:'Organization',industry:'Fashion',terms:true});
const p={name:'Creator User',slug:'creator-user',headline:'AI film production',bio:'Original film creative workflows',specializations:['AI Filmmaking'],styles:['Cinematic'],tools:['Runway'],industries:['Fashion'],contentTypes:['AI Video'],aspectRatios:['9:16'],rate:100,currency:'INR',turnaround:2,availability:'Available',commercial:true,revisions:1,published:true};
await call('creator','profile',p);assert.equal((await call(null,'creators')).length,1);
await call('brand','profile',p,403);
assert.equal((await call(null,'discovery?q=Runway&tools=Runway%7CKling')).total,1);
assert.equal((await call(null,'discovery?tools=Flux')).total,0);
assert.equal((await call(null,'discovery?q=%25')).total,0);
assert.equal((await call(null,'discovery?max=50')).total,0);
assert.equal((await call(null,'discovery?specializations=AI%20Filmmaking&aspectRatios=9%3A16')).total,1);
const c={title:'Campaign',description:'A cinematic creative campaign',industry:'Fashion',contentType:'AI Video',styles:['Cinematic'],specializations:['AI Filmmaking'],tools:['Runway'],platform:'Instagram',aspectRatio:'9:16',quantity:1,budget:500,currency:'INR',deadline:future,revisions:1,commercialUse:'Paid advertising',territory:'India',usageDuration:'12 months',rights:'Negotiated license',status:'published'};
await call('brand','campaign',{...c,deadline:'2020-01-01'},400);
const campaign=await call('brand','campaign',c);const matches=await call('brand','matches/'+campaign.id);assert.equal(matches.matches[0].match.score,100);
await call('outsider','matches/'+campaign.id,undefined,404);
await call('creator','campaign',c,403);
await call(null,'saved-searches',undefined,401);
const savedSearch=await call('brand','saved-searches',{name:'My creative search',filters:{q:'Runway',tools:['Runway'],available:true,page:'100',owner:'outsider'}});
assert.equal((await call('brand','saved-searches'))[0].data.owner,undefined);assert.equal((await call('brand','saved-searches'))[0].data.page,undefined);
assert.equal((await call('outsider','saved-searches')).length,0);
await call('outsider','saved-searches',{id:savedSearch.id,name:'Attempted edit',filters:{}},404);
await call('outsider','saved-searches/'+savedSearch.id,undefined,404,'DELETE');
await call('brand','saved-searches',{name:'My creative search',filters:{}},409);
await call('brand','saved-searches',{id:savedSearch.id,name:'Updated creative search',filters:{tools:['Kling']} });
const duplicate=await call('brand','duplicate-campaign/'+campaign.id,{});const duplicateRecord=(await call('brand','dashboard')).campaigns.find(c=>c.id===duplicate.id);assert.equal(duplicateRecord.status,'draft');assert.equal(duplicateRecord.data.deadline,'');assert.deepEqual(duplicateRecord.data.assets,[]);
await call('outsider','duplicate-campaign/'+campaign.id,{},404);await call('creator','duplicate-campaign/'+campaign.id,{},403);
const invite=await call('brand','invitation',{campaign:campaign.id,creator:'creator',budget:500,message:'Please create the agreed film.',start:future,responseDeadline:future,rights:'Negotiated license',revisions:1});
await call('brand','invitation',{campaign:campaign.id,creator:'creator',budget:500,message:'Please create the agreed film.',start:future,responseDeadline:future,rights:'Negotiated license',revisions:1},409);
await call('outsider','invitation/'+invite.id,{action:'accept'},404);
await call('brand','invitation/'+invite.id,{action:'accept'},403);
await call('creator','invitation/'+invite.id,{action:'accept'});
await call('creator','invitation/'+invite.id,{action:'accept'},409);
const dash=await call('creator','dashboard');assert.equal(dash.engagements.length,1);const eid=dash.engagements[0].id;
await call('outsider','workspace/'+eid,undefined,404);
await call('brand','workspace/'+eid,{action:'submit',deliverable:'Film',files:[]},409);
await call('creator','workspace/'+eid,{action:'start'});
await call(null,'tasks/'+eid,undefined,401);await call('outsider','tasks/'+eid,undefined,404);
const task=await call('brand','tasks/'+eid,{title:'Confirm the visual direction',due:future});assert.equal((await call('creator','tasks/'+eid))[0].author,'brand');
await call('outsider','tasks/'+eid,{title:'Unauthorized task'},404);
await call('creator','tasks/'+eid,{id:task.id,title:'Confirm the visual direction',due:future,completed:true});assert.equal((await call('brand','tasks/'+eid))[0].completed,1);
await call('creator','tasks/'+eid+'/'+task.id,undefined,403,'DELETE');
await call('brand','tasks/'+eid,{title:'Invalid calendar date',due:'2026-02-31'},400);
await call('brand','review',{engagement:eid,rating:5,comment:'Thoughtful production and clear communication throughout.'},403);

await call('creator','workspace/'+eid,{action:'submit',deliverable:'Film',files:[]},400);
async function upload(user,mime,bytes){globalThis.__verificationUser={userId:user,email:user+'@invalid.local'};const f=new FormData();f.set('file',new File([bytes],'asset.'+(mime==='video/mp4'?'mp4':'png'),{type:mime}));const r=await handle(new Request(origin+'/api/upload',{method:'POST',headers:{origin},body:f}),['upload']);const b=await r.json();assert.equal(r.status,200,JSON.stringify(b));checks++;return b.id}
const media=await upload('creator','video/mp4',new Uint8Array([0,0,0,24,102,116,121,112,105,115,111,109]));
await call('outsider','files/'+media,undefined,403);
await call('creator','workspace/'+eid,{action:'submit',deliverable:'Film',message:'First version',files:[media]});
await call('brand','files/'+media);
await call('brand','workspace/'+eid,{action:'revise',message:'Adjust the final frame.'});
await call('creator','workspace/'+eid,{action:'submit',deliverable:'Film',message:'Revised version',files:[media]});
await call('brand','workspace/'+eid,{action:'revise',message:'One more revision.'},409);
await call('creator','workspace/'+eid,{action:'approve'},409);
await call('brand','workspace/'+eid,{action:'approve'});
await call('creator','workspace/'+eid,{action:'deliver'});
await call('brand','workspace/'+eid,{action:'complete'});
const completed=await call('brand','workspace/'+eid);assert.equal(completed.engagement.status,'completed');assert.equal(completed.events.filter(e=>e.type==='submit').length,2);
await call('brand','tasks/'+eid,{title:'Closed project task'},409);
await call('outsider','project-review/'+eid,undefined,404);await call('creator','review',{engagement:eid,rating:5,comment:'Thoughtful production and clear communication throughout.'},403);
await call('outsider','review',{engagement:eid,rating:5,comment:'Thoughtful production and clear communication throughout.'},403);
await call('brand','review',{engagement:eid,rating:6,comment:'Thoughtful production and clear communication throughout.'},400);
await call('brand','review',{engagement:eid,rating:5,comment:'Thoughtful production and clear communication throughout.'});assert.equal((await call(null,'reviews/creator-user')).items[0].rating,5);
await call('brand','review',{engagement:eid,rating:4,comment:'The revised delivery met our scope and agreed requirements.'});assert.equal((await call(null,'reviews/creator-user')).total,1);assert.equal((await call('creator','project-review/'+eid)).rating,4);assert.equal((await call(null,'reviews/creator-user')).average,4);
const cover=await upload('creator','image/png',new Uint8Array([137,80,78,71,13,10,26,10]));
const portfolioData={title:'Production study',description:'An original production with a documented workflow.',contentType:'AI Video',tools:['Runway'],skills:['Editing'],styles:['Cinematic'],workflow:'Generated shots then edited and refined the sequence.',contribution:'Concept and final edit',aspectRatio:'9:16',commercialUse:'Rights reviewed for the described usage.',permission:true,cover,media:[media],evidence:[cover],published:true};
const portfolio=await call('creator','portfolio',portfolioData);const gallery=await call(null,'work?type=AI%20Video&q=production');assert.equal(gallery.total,1);assert.equal(gallery.items[0].creator_name,'Creator User');assert.equal(gallery.items[0].data.evidence,undefined);assert.equal(gallery.items[0].data.permission,undefined);assert.equal((await call(null,'work?type=AI%20Image')).total,0);assert.equal((await call(null,'work?q=%25')).total,0);
await call('creator','portfolio',{...portfolioData,id:portfolio.id,published:false});assert.equal((await call(null,'work')).total,0);await call('creator','portfolio',{...portfolioData,id:portfolio.id,published:true});
await call(null,'account-export',undefined,401);const exportBrand=await call('brand','account-export');assert.equal(exportBrand.account.id,'brand');assert.equal(exportBrand.profile,null);assert.equal(exportBrand.portfolio.length,0);assert.equal(exportBrand.tasks.length,1);assert.equal(exportBrand.reviews.length,1);assert.equal(exportBrand.savedSearches.length,1);assert.ok(exportBrand.authoredEvents.every(e=>e.author==='brand'));assert.ok(exportBrand.files.every(f=>!f.owner||f.owner==='brand'));
const exportOther=await call('outsider','account-export');assert.equal(exportOther.engagements.length,0);assert.equal(exportOther.reviews.length,0);assert.equal(exportOther.tasks.length,0);assert.equal(exportOther.savedSearches.length,0);
await call('brand','tasks/'+eid+'/'+task.id,undefined,200,'DELETE');assert.equal((await call('brand','tasks/'+eid)).length,0);
await call('brand','saved-searches/'+savedSearch.id,undefined,200,'DELETE');assert.equal((await call('brand','saved-searches')).length,0);
await call('creator','evidence',{claim:'Runway workflow',description:'Workflow evidence and explanation',files:[media]});
await call('brand','admin',undefined,403);
await call('creator','ai',{idea:'A creative campaign using cinematic visuals'},403);
await call('brand','ai',{idea:'A creative campaign using cinematic visuals'},503);
const secondCampaign=await call('brand','campaign',{...c,title:'Second campaign'});
const secondInvite=await call('brand','invitation',{campaign:secondCampaign.id,creator:'creator',budget:500,message:'Please create the agreed film.',start:future,responseDeadline:future,rights:'License',revisions:1});
await call('creator','invitation/'+secondInvite.id,{action:'accept'});
const secondDash=await call('creator','dashboard');const secondId=secondDash.engagements.find(e=>e.campaign===secondCampaign.id).id;
await call('creator','workspace/'+secondId,{action:'request_cancel',message:'Unable to meet the agreed timeline.'});
await call('creator','workspace/'+secondId,{action:'confirm_cancel'},403);
await call('brand','workspace/'+secondId,{action:'resume'});
assert.equal((await call('creator','workspace/'+secondId)).engagement.status,'accepted');
await call('creator','workspace/'+secondId,{action:'request_cancel',message:'Unable to meet the agreed timeline.'});
await call('brand','workspace/'+secondId,{action:'confirm_cancel'});
assert.equal((await call('creator','workspace/'+secondId)).engagement.status,'cancelled');
await call('creator','profile',{...p,published:false});assert.equal((await call(null,'creators')).length,0);assert.equal((await call(null,'work')).total,0);await call(null,'reviews/creator-user',undefined,404);
assert.equal((await call('creator','dashboard')).engagements.length,2);
const {match,allowedTransition}=await import('../'+tmp+'/matching.mjs');assert.equal(match({...c,currency:'USD'},{published:1,data:p}),null);assert.equal(match({...c,aspectRatio:'16:9'},{published:1,data:p}),null);assert.equal(allowedTransition('brand','submitted','revise',1,1),null);
const badOriginReq=new Request(origin+'/api/account',{method:'POST',headers:{origin:'https://other.invalid'},body:'{}'});assert.equal((await handle(badOriginReq,['account'])).status,403);checks++;
await call('creator','account',undefined,200,'DELETE');assert.equal((await call('creator','me')).account,null);
assert.equal(sql.prepare('SELECT count(*) AS n FROM reviews').get().n,0);assert.equal(sql.prepare('SELECT count(*) AS n FROM project_tasks').get().n,0);
sql.close();fs.rmSync(tmp,{recursive:true});console.log(`Passed ${checks} API assertions plus matching, authorization and revision checks.`);
