import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
fs.mkdirSync('work/test-modules',{recursive:true});
for(const name of ['data','model','reminder-time']){
 let js=ts.transpileModule(fs.readFileSync(`app/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText.replace('"./data"','"./data.mjs"').replace('"./model"','"./model.mjs"');
 fs.writeFileSync(`work/test-modules/${name}.mjs`,js);
}
const {tasks,actionLinks,sources}=await import('../work/test-modules/data.mjs');
const m=await import('../work/test-modules/model.mjs');
const task=id=>tasks.find(t=>t.id===id);
const state={...m.emptyState,profile:{...m.defaultProfile,term:'Fall',year:'2026',stage:0,arrival:'2026-08-10'}};
assert.equal(new Set(tasks.map(t=>t.id)).size,tasks.length);
for(const t of tasks){assert(t.action);assert(actionLinks[t.action.action]);assert(t.steps.length<=4,`${t.id} too many steps`);for(const s of t.sources)assert(sources[s]);for(const d of t.dependencies||[])assert(task(d));}
assert.equal(m.schedule(task('health-submit'),state).date,'2026-07-15');
assert.equal(m.schedule(task('checkin'),state).date,'2026-08-12');
assert.equal(m.schedule(task('checkin'),state).source,'orientationUndergrad');
const future={...state,profile:{...state.profile,year:'2027',programStart:'2027-08-15'}};
assert.equal(m.schedule(task('health-submit'),future).date,'');
assert.equal(m.schedule(task('orientation-inperson'),future).date,'');
assert.equal(m.schedule(task('checkin'),future).date,'2027-09-14');
assert.equal(m.schedule(task('checkin'),future).source,'status');
assert.equal(m.nextTask(state,'2026-09-22').id,'health-submit');
assert(!m.actionable(task('i94'),state.profile));
let completed=m.changeStatus(state,'health-submit','Completed');
assert.equal(m.progress(completed).completed,1);
assert.equal(m.nextTask(completed,'2026-09-22').id,'orientation');
const withReminder={...state,reminders:[{id:'r',taskId:'health-submit',date:'2026-10-01',time:'09:00'}]};
assert.equal(m.changeStatus(withReminder,'health-submit','Completed').reminders.length,0);
const excluded=m.changeStatus(state,'ssn','Not Applicable');assert.equal(m.progress(excluded).total,tasks.length-1);
assert.equal(m.schedule(task('health-submit'),{...state,targets:{'health-submit':'2026-10-01'}}).date,'2026-07-15');
const address={...future,profile:{...future.profile,stage:3,addressChanged:'2027-09-01'}};
assert.equal(m.schedule(task('maintain-status'),address).date,'2027-09-11');
assert.equal(m.nextTask(address,'2027-09-12').id,'maintain-status');
const corrupt=m.decodeState(JSON.stringify({...state,statuses:{ssn:'Not Applicable',xyz:'Completed'},targets:{ssn:'2026-02-30'},reminders:[{bad:true}],reports:[{bad:true}]}));
assert.equal(corrupt.statuses.xyz,undefined);assert.equal(corrupt.targets.ssn,undefined);assert.equal(corrupt.reminders.length,0);assert.equal(corrupt.reports.length,0);
const {wallTimeToUTC}=await import('../work/test-modules/reminder-time.mjs');assert.equal(wallTimeToUTC('2026-09-23','09:00','America/Chicago'),'2026-09-23T14:00:00.000Z');
console.log('PASS: 32 task actions, dependencies, cohort deadlines, deadline priority, stage gating, progress, reminder cancellation, state recovery, Chicago timezone.');
