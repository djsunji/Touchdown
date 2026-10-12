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

function emailAllowed(email: string) {
  if (allowedDomains.length === 0) return true;
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return allowedDomains.includes(domain);
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
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ user }) {
      return !!user.email && emailAllowed(user.email);
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
