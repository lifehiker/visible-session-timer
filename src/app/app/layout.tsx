import Link from "next/link";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      <section className="border-b border-border bg-background/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
            <h1 className="text-lg font-semibold tracking-tight">Saved Sessions</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/app/templates"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              My Templates
            </Link>
            <Link
              href="/app/account"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Account
            </Link>
            {session?.user ? (
              <SignOutButton />
            ) : (
              <GoogleSignInButton callbackUrl="/app/templates" className="h-8 px-3 text-sm" />
            )}
          </div>
        </div>
      </section>
      {children}
    </>
  );
}
