// These settings are supplied by the operator after Tulane IT approves an IdP.
// Email domains and client-submitted user IDs are never access-control inputs.
export function ssoMode(env: Record<string, string | undefined>) {
  if (env.NEXTSTEP_SSO_MODE === "azure") return "azure";
  if (env.NEXTSTEP_SSO_MODE === "saml" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(env.NEXTSTEP_SAML_PROVIDER_ID || "")) return "saml";
  return null;
}

export function safeAuthRedirect(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Invalid identity-provider redirect");
  }
  return url.href;
}
