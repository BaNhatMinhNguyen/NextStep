import {test} from "node:test";
import assert from "node:assert/strict";
import {saveSchema,isSameOrigin,safeOrigin} from "../lib/validation";
import {emptyState,defaultProfile} from "../app/model";
const valid={revision:0,state:{...emptyState,profile:defaultProfile}};
test("valid state and Fall/Spring only",()=>{assert(saveSchema.safeParse(valid).success);assert(saveSchema.safeParse({...valid,state:{...valid.state,profile:{...defaultProfile,term:"Spring"}}}).success);assert(!saveSchema.safeParse({...valid,state:{...valid.state,profile:{...defaultProfile,term:"Summer"}}}).success);});
test("no owner injection, unknown tasks or arbitrary statuses",()=>{
  for(const bad of [{...valid,user_id:"victim"},{...valid,state:{...valid.state,user_id:"victim"}},{...valid,state:{...valid.state,statuses:{madeup:"Completed"}}},{...valid,state:{...valid.state,statuses:{checkin:"admin"}}}])assert(!saveSchema.safeParse(bad).success);
});
test("required tasks cannot be excluded; dates must exist",()=>{
  assert(!saveSchema.safeParse({...valid,state:{...valid.state,statuses:{checkin:"Not Applicable"}}}).success);
  assert(!saveSchema.safeParse({...valid,state:{...valid.state,targets:{checkin:"2026-02-30"}}}).success);
  assert(!saveSchema.safeParse({...valid,state:{...valid.state,profile:{...defaultProfile,arrival:"2026-09-01",departure:"2026-09-02"}}}).success);
});
test("report and payload limits",()=>{assert(!saveSchema.safeParse({...valid,state:{...valid.state,reports:[{id:crypto.randomUUID(),taskId:"checkin",reason:"Other",note:"x".repeat(501),created:new Date().toISOString()}]}}).success);assert(!saveSchema.safeParse({...valid,revision:-1}).success);});
test("mutation origin validation",()=>{
  const origin="https://nextstep.example";
  assert(isSameOrigin(new Request(origin,{headers:{Origin:origin}}),origin));
  for(const headers of [{},{Origin:"https://evil.example"},{Origin:origin,"Sec-Fetch-Site":"cross-site"}] as Record<string,string>[])assert(!isSameOrigin(new Request(origin,{headers}),origin));
});
test("canonical origin cannot become an open redirect",()=>{assert.equal(safeOrigin("https://nextstep.example/"),"https://nextstep.example");assert.equal(safeOrigin("http://localhost:3000"),"http://localhost:3000");for(const value of [undefined,"javascript:alert(1)","http://example.com","https://user:password@example.com","https://example.com/path","https://example.com/?next=https://evil.test"])assert.throws(()=>safeOrigin(value));});
