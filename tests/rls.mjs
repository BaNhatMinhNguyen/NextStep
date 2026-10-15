import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
let checks=0;
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002',C='00000000-0000-4000-8000-000000000003';
const initial={version:2,profile:{level:'First-year undergraduate',visa:'F-1',term:'Fall',year:'2026',arrival:'',departure:'',moveIn:'',stage:0,submitted:'',programStart:'',addressChanged:''},statuses:{checkin:'Completed'},targets:{checkin:'2026-10-10'},reports:[],reminders:[]};
async function as(user,role='authenticated'){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user||'']);await db.exec('set role '+role);}
async function deny(sql,params=[]){await assert.rejects(()=>db.query(sql,params));checks++;}
async function load(){return (await db.query('select public.load_checklist() as value')).rows[0].value;}
async function save(revision,state){return (await db.query('select public.save_checklist($1,$2::jsonb) as revision',[revision,JSON.stringify(state)])).rows[0].revision;}
try{
  await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;`);
  for(const file of fs.readdirSync('supabase/migrations').filter(f=>f.endsWith('.sql')).sort())await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
  assert.equal((await db.query("select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef")).rows.length,0);checks++;
  assert.equal((await db.query("select count(*)::int as n from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity")).rows[0].n,0);checks++;
  for(const id of [A,B,C])await db.query('insert into auth.users(id) values($1)',[id]);
  for(const id of [A,B])await db.query("insert into private.pilot_members(user_id,expires_at) values($1,now()+interval '30 days')",[id]);
  await as(null,'anon');await deny('select * from public.user_tasks');await deny('select public.load_checklist()');await deny('select public.save_checklist(0,$1::jsonb)',[JSON.stringify(initial)]);
  await deny('select private.has_pilot_access()');
  await as(C);await deny('select public.load_checklist()');await deny('insert into private.pilot_members(user_id,expires_at) values($1,now())',[C]);await deny('select * from private.pilot_members');
  await as(A);assert.equal((await load()).revision,0);assert.equal(await save(0,initial),1);checks++;
  assert.equal((await load()).state.statuses.checkin,'Completed');checks++;
  await as(B);assert.equal((await load()).state.statuses.checkin,undefined);checks++;
  assert.equal((await db.query('select * from public.user_tasks where user_id=$1',[A])).rows.length,0);checks++;
  assert.equal((await db.query("update public.user_tasks set status='Not Started' where user_id=$1 returning *",[A])).rows.length,0);checks++;
  assert.equal((await db.query('delete from public.user_tasks where user_id=$1 returning *',[A])).rows.length,0);checks++;
  await deny("insert into public.user_tasks(user_id,task_id,status) values($1,'i94','Completed')",[A]);
  await deny("insert into public.user_checklists(user_id,profile) values($1,'{}')",[B]);
  assert.equal(await save(0,{...initial,statuses:{i94:'Completed'},targets:{}}),1);checks++;
  await deny('update public.user_tasks set user_id=$1 where user_id=$2',[A,B]);
  await deny("update public.task_catalog set title='hacked' where id='checkin'");
  await deny('select public.save_checklist(1,$1::jsonb)',[JSON.stringify({...initial,user_id:A})]);
  await as(A);assert.equal((await load()).state.statuses.checkin,'Completed');checks++;
  await deny('select public.save_checklist(0,$1::jsonb)',[JSON.stringify(initial)]);
  assert.equal((await load()).revision,1);checks++;
  await deny('select public.save_checklist(1,$1::jsonb)',[JSON.stringify({...initial,statuses:{unknown:'Completed'}})]);
  await deny('select public.save_checklist(1,$1::jsonb)',[JSON.stringify({...initial,profile:{...initial.profile,stage:'0'}})]);
  assert.equal((await load()).revision,1);assert.equal((await load()).state.statuses.checkin,'Completed');checks++;
  await deny("update public.user_tasks set status='Not Applicable' where task_id='checkin'");
  const reports=[{id:crypto.randomUUID(),taskId:'checkin',reason:'Other',note:'Example only',created:'2026-10-08T12:00:00.000Z'}];
  assert.equal(await save(1,{...initial,reports}),2);assert.equal((await load()).state.reports.length,1);checks++;
  await as(B);assert.equal((await db.query('select * from public.information_reports')).rows.length,0);checks++;
  await as(A);assert.equal(await save(2,{version:2,profile:null,statuses:{},targets:{},reports:[],reminders:[]}),3);assert.equal((await load()).state.reports.length,0);assert.deepEqual((await load()).state.statuses,{});checks++;
  await as(B);assert.equal((await load()).state.statuses.i94,'Completed');checks++;
  await db.exec('reset role');await db.query('update private.pilot_members set enabled=false where user_id=$1',[B]);await as(B);await deny('select public.load_checklist()');assert.equal((await db.query('select * from public.user_tasks')).rows.length,0);checks++;
  await db.exec('reset role');await db.query("update private.pilot_members set expires_at=now()-interval '1 minute' where user_id=$1",[A]);await as(A);await deny('select public.load_checklist()');
  await db.exec('reset role');await db.query('delete from auth.users where id=$1',[B]);
  for(const table of ['user_checklists','user_tasks','information_reports']){assert.equal((await db.query('select * from public.'+table+' where user_id=$1',[B])).rows.length,0);checks++;}
  console.log(`PASS ${checks} PostgreSQL checks: migrations, RLS, anonymous denial, A/B isolation, owner spoofing, private membership, revocation/expiry, revisions, rollback, reset, reports.`);
}catch(error){console.error("RLS test failed:",error.message,error.code||"");process.exitCode=1;}finally{await db.close();}
