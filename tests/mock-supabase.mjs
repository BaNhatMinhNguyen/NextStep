// Test-only HTTP adapter. Never imported by application code or deployed as a route.
// It models Auth responses; SQL/RLS executes in actual embedded PostgreSQL.
import http from 'node:http';
import fs from 'node:fs';
import {randomBytes,createHmac} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {createServerClient} from '@supabase/ssr';
export const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002';
export async function mockSupabase(){
  const db=new PGlite(),tokens=new Map(),secret=randomBytes(32);
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`);
  for(const file of fs.readdirSync('supabase/migrations').filter(f=>f.endsWith('.sql')).sort())await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
  for(const id of [A,B]){await db.query('insert into auth.users(id) values($1)',[id]);await db.query("insert into private.pilot_members(user_id,expires_at) values($1,now()+interval '30 days')",[id]);}
  function tokenFor(id){const body=Buffer.from(JSON.stringify({sub:id,aud:'authenticated',role:'authenticated',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');const value=Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')+'.'+body;const token=value+'.'+createHmac('sha256',secret).update(value).digest('base64url');tokens.set(token,id);return token;}
  const server=http.createServer(async(req,res)=>{
    const respond=(body,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(body));};
    const id=tokens.get((req.headers.authorization||'').replace(/^Bearer /,''));
    if(!id)return respond({message:'Invalid token'},401);
    if(req.url==='/auth/v1/user')return respond({id,aud:'authenticated',role:'authenticated',email:(id===A?'student-a':'student-b')+'@example.test',email_confirmed_at:'2026-10-01T00:00:00Z',app_metadata:{provider:'azure'},user_metadata:{full_name:id===A?'Student A':'Student B'},identities:[],created_at:'2026-10-01T00:00:00Z'});
    if(req.url.startsWith('/auth/v1/logout'))return respond({});
    if(!req.url.startsWith('/rest/v1/rpc/'))return respond({message:'Not found'},404);
    let body='';for await(const chunk of req)body+=chunk;
    try{
      const args=body?JSON.parse(body):{};
      const value=await db.transaction(async tx=>{
        await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[id]);await tx.exec('set local role authenticated');
        const name=req.url.split('/').pop();
        if(name==='has_pilot_access')return (await tx.query('select public.has_pilot_access() as value')).rows[0].value;
        if(name==='load_checklist')return (await tx.query('select public.load_checklist() as value')).rows[0].value;
        if(name==='save_checklist')return (await tx.query('select public.save_checklist($1,$2::jsonb) as value',[args.expected_revision,JSON.stringify(args.payload)])).rows[0].value;
        throw Error('Unknown test RPC');
      });respond(value);
    }catch(e){respond({message:e.message,code:e.code},e.code==='40001'?409:400);}
  });
  await new Promise(r=>server.listen(4545,'127.0.0.1',r));
  async function cookiesFor(id){let items=[];const client=createServerClient('http://127.0.0.1:4545','test-publishable-key',{cookies:{getAll:()=>items,setAll:x=>items=x},cookieOptions:{httpOnly:true,secure:false,sameSite:'lax',path:'/'}});const {error}=await client.auth.setSession({access_token:tokenFor(id),refresh_token:'test-refresh-'+id});if(error)throw error;return items.map(x=>({name:x.name,value:x.value,domain:'localhost',path:'/',httpOnly:true,secure:false,sameSite:'Lax'}));}
  return {db,server,cookiesFor,close:async()=>{await new Promise(r=>server.close(r));await db.close();}};
}
