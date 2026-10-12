import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn, devLoginEnabled } from "@/auth";
import { getCurrentUser } from "@/lib/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  const redirectTo = safeRedirect(callbackUrl);
  if (await getCurrentUser()) redirect(redirectTo);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Image src="/logo.png" alt="Touchdown" width={540} height={390} className="mx-auto h-auto w-60" priority />
          <h1 className="sr-only">Touchdown</h1>
          <p className="mt-2 text-sm text-gray-500">Nightstop-Tipps von Crew für Crew</p>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error === "AccessDenied"
              ? "Zugriff verweigert. Bitte melde dich mit deiner Firmen-E-Mail an."
              : "Anmeldung fehlgeschlagen. Bitte versuche es erneut."}
          </p>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo });
          }}
        >
          <button className="flex w-full items-center justify-center gap-3 rounded-md bg-[#2f2f2f] px-4 py-3 font-medium text-white hover:bg-black">
            <MicrosoftLogo />
            Mit Firmen-Account anmelden
          </button>
        </form>

        {devLoginEnabled && (
          <form
            className="mt-6 space-y-2 border-t pt-6"
            action={async (formData: FormData) => {
              "use server";
              await signIn("dev", {
                email: formData.get("email"),
                name: formData.get("name"),
                redirectTo,
              });
            }}
          >
            <p className="text-xs font-semibold uppercase text-amber-700">Dev-Login (nur lokal)</p>
            <input name="email" type="email" required placeholder="name@firma.ch" className="w-full rounded-md border px-3 py-2 text-sm" />
            <input name="name" placeholder="Name" className="w-full rounded-md border px-3 py-2 text-sm" />
            <button className="w-full rounded-md border border-amber-600 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50">
              Als Testuser anmelden
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

// Only same-site paths like "/LJU", never "https://evil" or "//evil" (open redirect).
function safeRedirect(url?: string) {
  return url && /^\/(?![\/\\])[^\s\\]*$/.test(url) ? url : "/";
}

function MicrosoftLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}
