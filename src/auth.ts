import NextAuth, { type NextAuthConfig } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";

// Local testing without Azure: set AUTH_DEV_LOGIN=true. Never enabled in production builds.
export const devLoginEnabled =
  process.env.AUTH_DEV_LOGIN === "true" && process.env.NODE_ENV !== "production";

const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
  .split(",")
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export function emailAllowed(email: string) {
  if (allowedDomains.length === 0) return true;
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return allowedDomains.includes(domain);
}

// Only accounts of our own Entra tenant may sign in. The tenant id is taken from
// AUTH_MICROSOFT_ENTRA_ID_ISSUER (https://login.microsoftonline.com/<TENANT-ID>/v2.0);
// without it ("common", placeholder) every Entra sign-in is refused.
const tenantId =
  process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER?.match(
    /microsoftonline\.com\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/v2\.0/i,
  )?.[1].toLowerCase() ?? null;

// Guest (B2B) accounts invited into the tenant are refused unless explicitly allowed.
const allowGuests = process.env.ALLOW_GUEST_ACCOUNTS === "true";

if (process.env.NODE_ENV === "production") {
  if (!tenantId) console.error("[auth] AUTH_MICROSOFT_ENTRA_ID_ISSUER has no tenant id: Microsoft logins are refused.");
  if (allowedDomains.length === 0) console.warn("[auth] ALLOWED_EMAIL_DOMAINS is empty: every account of the tenant can sign in.");
}

type EntraClaims = { tid?: string; idp?: string };

export function entraAccountAllowed(profile: EntraClaims | undefined) {
  if (!tenantId || profile?.tid?.toLowerCase() !== tenantId) return false;
  // Members carry no "idp" claim (or our own tenant as idp); guests carry their home identity provider.
  const homeIdp = `https://sts.windows.net/${tenantId}/`;
  if (!allowGuests && profile.idp && profile.idp.toLowerCase() !== homeIdp) return false;
  return true;
}

const providers: NextAuthConfig["providers"] = [
  MicrosoftEntraID({
    // AUTH_MICROSOFT_ENTRA_ID_ID / _SECRET / _ISSUER are read from the environment.
    // Own profile mapping: skips the profile photo (keeps the session cookie small)
    // and falls back to the UPN when the account has no "email" claim.
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: (profile.email ?? profile.preferred_username ?? "").toLowerCase(),
      };
    },
  }),
];

if (devLoginEnabled) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Dev Login",
      credentials: { email: { label: "E-Mail" }, name: { label: "Name" } },
      authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        if (!email.includes("@")) return null;
        return { id: email, email, name: String(credentials?.name || email.split("@")[0]) };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  // Sessions expire after 24 hours, so someone who leaves the company loses access within a day.
  // With an active Microsoft login, signing in again is a single click.
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ user, account, profile }) {
      if (!user.email || !emailAllowed(user.email)) return false;
      if (account?.provider === "microsoft-entra-id") return entraAccountAllowed(profile as EntraClaims | undefined);
      return account?.provider === "dev" && devLoginEnabled;
    },
    async jwt({ token, user }) {
      // On sign-in, make sure the user exists in our DB and remember its id.
      if (user?.email) {
        const email = user.email.toLowerCase();
        const dbUser = await db.user.upsert({
          where: { email },
          update: { name: user.name ?? undefined },
          create: { email, name: user.name ?? null },
        });
        token.uid = dbUser.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
});
