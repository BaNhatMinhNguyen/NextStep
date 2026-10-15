import {test} from "node:test";
import assert from "node:assert/strict";
import {ssoMode,safeAuthRedirect} from "../lib/sso";

test("SSO stays disabled for missing or unsupported provider settings",()=>{
  assert.equal(ssoMode({}),null);
  assert.equal(ssoMode({NEXTSTEP_SSO_MODE:"password"}),null);
  assert.equal(ssoMode({NEXTSTEP_SSO_MODE:"saml"}),null);
  assert.equal(ssoMode({NEXTSTEP_SSO_MODE:"saml",NEXTSTEP_SAML_PROVIDER_ID:"tulane.edu"}),null);
});
test("only configured Azure or an exact SAML provider ID is accepted",()=>{
  assert.equal(ssoMode({NEXTSTEP_SSO_MODE:"azure"}),"azure");
  assert.equal(ssoMode({NEXTSTEP_SSO_MODE:"saml",NEXTSTEP_SAML_PROVIDER_ID:"00000000-0000-4000-8000-000000000001"}),"saml");
});
test("Auth redirect requires HTTPS and cannot embed credentials",()=>{
  assert.equal(safeAuthRedirect("https://login.example.test/sso?state=test"),"https://login.example.test/sso?state=test");
  for(const value of ["javascript:alert(1)","//login.example.test","http://login.example.test","https://user:secret@login.example.test","/dashboard"]){assert.throws(()=>safeAuthRedirect(value));}
});
