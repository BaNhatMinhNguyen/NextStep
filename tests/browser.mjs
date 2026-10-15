import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import {mockSupabase,A,B} from './mock-supabase.mjs';
const origin='http://localhost:3001';
const mock=await mockSupabase();
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3001'],{env:{...process.env,NEXTSTEP_APP_ORIGIN:origin,SUPABASE_URL:'http://127.0.0.1:4545',SUPABASE_PUBLISHABLE_KEY:'test-publishable-key',NEXTSTEP_SSO_MODE:'azure'},stdio:['ignore','pipe','pipe']});
let browser,log='',checks=0;app.stdout.on('data',x=>log+=x);app.stderr.on('data',x=>log+=x);
fs.mkdirSync('work/screenshots',{recursive:true});
const sample={version:2,profile:{level:'First-year undergraduate',visa:'F-1',term:'Spring',year:'2027',arrival:'2027-01-05',departure:'2027-01-04',moveIn:'2027-01-06',stage:3,submitted:'',programStart:'2027-01-08',addressChanged:''},statuses:{},targets:{},reminders:[],reports:[]};
try{
  for(let i=0;i<80;i++){try{if((await fetch(origin)).ok)break;}catch{}if(i===79)throw Error('Server not ready');await new Promise(r=>setTimeout(r,250));}
  const bundled=process.env.NEXTSTEP_BUNDLED_CHROMIUM==='true'?(await import('@sparticuz/chromium')).default:null;
  const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(bundled?await bundled.executablePath():undefined);
  browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--no-zygote'],...(executablePath?{executablePath}:{})});
  const guest=await browser.newContext(),ga=await guest.newPage(),errors=[];ga.on('pageerror',e=>errors.push(e.message));
  await ga.goto(origin);await ga.getByRole('button',{name:'Sign in with Tulane',exact:true}).waitFor();assert.equal(await ga.locator('input[type=password]').count(),0);checks++;
  assert.equal((await guest.request.get(origin+'/api/checklist')).status(),401);checks++;
  await ga.goto(origin+'/dashboard');assert.match(ga.url(),/error=session/);checks++;
  for(const url of ['/api/registration','/api/registrations/export','/students']){assert.equal((await guest.request.get(origin+url)).status(),404);checks++;}
  const badCallback=await guest.request.get(origin+'/auth/callback?code=forged&next=https://evil.example',{maxRedirects:0});assert.equal(badCallback.status(),303);assert.equal(badCallback.headers().location,origin+'/?error=signin');checks++;
  await ga.goto(origin+'/demo');await ga.getByRole('button',{name:'SIGN IN',exact:true}).click();await ga.getByRole('region',{name:'Recommended next task'}).waitFor();
  for(const width of [320,390,768,1280,1440]){await ga.setViewportSize({width,height:900});assert(await ga.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;}
  await ga.setViewportSize({width:1440,height:1000});await ga.screenshot({path:'work/screenshots/demo-desktop.png',fullPage:true});
  await ga.locator('.next-focus').getByRole('button',{name:'Mark complete',exact:true}).click();await ga.getByRole('button',{name:'Undo',exact:true}).click();checks++;
  const ca=await browser.newContext({viewport:{width:1440,height:1000}}),cb=await browser.newContext();await ca.addCookies(await mock.cookiesFor(A));await cb.addCookies(await mock.cookiesFor(B));
  async function read(c){const r=await c.request.get(origin+'/api/checklist');assert.equal(r.status(),200);return r.json();}
  async function save(c,state,revision){return c.request.put(origin+'/api/checklist',{headers:{Origin:origin},data:{revision,state}});}
  assert.equal((await save(ca,sample,0)).status(),200);checks++;
  assert.equal((await ca.request.put(origin+'/api/checklist',{headers:{Origin:'https://evil.example'},data:{revision:1,state:sample}})).status(),403);checks++;
  assert.equal((await ca.request.put(origin+'/api/checklist',{headers:{Origin:origin},data:{revision:1,state:sample,user_id:B}})).status(),400);checks++;
  const pa=await ca.newPage();pa.on('pageerror',e=>errors.push(e.message));await pa.goto(origin+'/dashboard');await pa.getByRole('region',{name:'Recommended next task'}).waitFor();
  assert.equal(await pa.locator('.cloud-save').innerText(),'Saved');
  const title=await pa.locator('.next-title').innerText();await pa.locator('.next-focus').getByRole('button',{name:'Mark complete',exact:true}).click();await pa.waitForFunction(()=>document.querySelector('.cloud-save')?.textContent==='Saved');
  let stateA=await read(ca);assert.equal(Object.values(stateA.state.statuses).filter(x=>x==='Completed').length,1);assert.deepEqual((await read(cb)).state.statuses,{});checks++;
  await pa.reload();await pa.getByRole('region',{name:'Recommended next task'}).waitFor();assert.notEqual(await pa.locator('.next-title').innerText(),title);checks++;
  assert(!Object.keys(await pa.evaluate(()=>({...localStorage}))).some(x=>x.includes(A)));checks++;
  await pa.getByRole('button',{name:'Profile & dates',exact:true}).click();await pa.getByLabel('Entry semester').click();assert.equal(await pa.getByRole('option',{name:'Summer',exact:true}).count(),0);assert.equal(await pa.getByRole('option',{name:'Fall',exact:true}).count(),1);assert.equal(await pa.getByRole('option',{name:'Spring',exact:true}).count(),1);await pa.getByRole('option',{name:'Spring',exact:true}).click();await pa.locator('.dates-dialog').getByRole('button',{name:'Close',exact:true}).click();await pa.locator('.dates-dialog').waitFor({state:'detached'});checks++;
  await pa.setViewportSize({width:390,height:844});assert(await pa.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await pa.screenshot({path:'work/screenshots/online-mobile.png',fullPage:true});checks++;
  await pa.setViewportSize({width:1440,height:1000});await pa.getByRole('button',{name:'View steps',exact:true}).click();await pa.getByRole('button',{name:'Report outdated information',exact:true}).click();await pa.getByLabel('A short note (optional)').fill('Test report');await pa.getByRole('button',{name:'Save report',exact:true}).click();await pa.waitForFunction(()=>document.querySelector('.cloud-save')?.textContent==='Saved');assert.equal((await read(ca)).state.reports.length,1);checks++;
  await pa.locator('.task-sheet').getByRole('button',{name:'Close',exact:true}).click();await pa.locator('.task-sheet').waitFor({state:'detached'});
  // Retry after a simulated network outage; success must not be displayed early.
  await pa.route('**/api/checklist',route=>route.request().method()==='PUT'?route.abort('failed'):route.continue());
  await pa.locator('.next-focus').getByRole('button',{name:'Mark complete',exact:true}).click();await pa.getByRole('button',{name:'Retry save',exact:true}).waitFor();assert.equal(await pa.locator('.cloud-save').innerText(),'Not saved');checks++;
  await pa.unroute('**/api/checklist');await pa.getByRole('button',{name:'Retry save',exact:true}).click();await pa.waitForFunction(()=>document.querySelector('.cloud-save')?.textContent==='Saved');checks++;
  // A second device writes first. A stale save is rejected, not silently overwritten.
  stateA=await read(ca);assert.equal((await save(ca,{...stateA.state,targets:{...stateA.state.targets,ssn:'2027-03-01'}},stateA.revision)).status(),200);
  await pa.locator('.next-focus').getByRole('button',{name:'Mark complete',exact:true}).click();await pa.getByRole('button',{name:'Reload saved version',exact:true}).waitFor();assert.equal((await read(ca)).state.targets.ssn,'2027-03-01');checks++;
  await pa.screenshot({path:'work/screenshots/conflict-desktop.png',fullPage:true});pa.on('dialog',d=>d.accept());await pa.getByRole('button',{name:'Reload saved version',exact:true}).click();await pa.getByRole('region',{name:'Recommended next task'}).waitFor();
  // Reset deletes only this user's stored profile/progress/reports.
  await save(cb,{...sample,statuses:{i94:'Completed'}},0);await pa.getByRole('button',{name:'Sources & about',exact:true}).click();await pa.getByText('Saved in your account',{exact:true}).click();await pa.getByRole('button',{name:'Reset checklist',exact:true}).click();await pa.getByRole('alertdialog').getByRole('button',{name:'Reset checklist',exact:true}).click();await pa.waitForFunction(()=>document.querySelector('.cloud-save')?.textContent==='Saved');assert.deepEqual((await read(ca)).state.statuses,{});assert.equal((await read(cb)).state.statuses.i94,'Completed');checks++;
  await pa.goto(origin+'/account');await pa.getByRole('button',{name:'Sign out',exact:true}).click();await pa.getByRole('button',{name:'Sign in with Tulane',exact:true}).waitFor();assert.equal((await ca.request.get(origin+'/api/checklist')).status(),401);checks++;
  assert.deepEqual(errors,[]);console.log(`PASS ${checks} browser/API checks. Online Auth is a test adapter; migrations/RLS are real embedded PostgreSQL. Tulane IdP and hosted Supabase were not exercised.`);
}catch(error){console.error('BROWSER TEST FAILED',error.stack);if(browser){for(const [i,c] of browser.contexts().entries()){for(const [j,p] of c.pages().entries()){console.error('Page',i,j,p.url(),(await p.locator('body').innerText().catch(()=>'' )).slice(0,500));await p.screenshot({path:`work/screenshots/failure-${i}-${j}.png`}).catch(()=>{});}}}console.error(log.slice(-1500));process.exitCode=1;}finally{await browser?.close();app.kill('SIGTERM');await mock.close();}
