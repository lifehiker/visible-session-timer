import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export const metadata = {
  title: "Sign In \u2013 Visible Session Timer",
};

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem-5.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your saved timer templates and Pro features.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 flex flex-col gap-4">
          <GoogleSignInButton
            callbackUrl={callbackUrl ?? "/app/templates"}
            className="w-full h-11"
          />

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          No account needed to use the timer.{" "}
          <a href="/timer" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Launch free timer
          </a>
        </p>
      </div>
    </div>
  );
}
