import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { deleteTemplate } from "./actions";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export const metadata = {
  title: "My Templates – Visible Session Timer",
};

export default async function TemplatesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem-5.5rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2">My Templates</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to access your saved timer templates.
          </p>
          <GoogleSignInButton callbackUrl="/app/templates" className="w-full h-11" />
        </div>
      </div>
    );
  }

  const templates = await db.timerTemplate.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const isPro = (session.user as { isPro?: boolean }).isPro ?? false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isPro
              ? "Unlimited templates with Pro."
              : `Free plan: ${templates.length}/3 templates used.`}
            {!isPro && (
              <>
                {" "}
                <Link href="/pricing" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  Upgrade to Pro
                </Link>{" "}
                for unlimited.
              </>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/timer">Launch Timer</Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 py-24 text-center">
          <p className="text-4xl mb-4">&#x23F1;</p>
          <h2 className="text-xl font-semibold mb-2">No templates yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Configure a timer session and save it as a template for quick reuse.
          </p>
          <Button asChild>
            <Link href="/timer">Create your first timer</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 flex flex-col gap-4"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-semibold leading-snug">{template.name}</h2>
                  <span className="shrink-0 text-xs bg-zinc-800 text-zinc-400 rounded px-2 py-0.5 capitalize">
                    {template.mode}
                  </span>
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" asChild className="flex-1">
                  <Link
                    href={`/timer?template=${template.id}`}
                  >
                    Launch
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteTemplate(template.id);
                  }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    type="submit"
                    className="border-zinc-600 text-zinc-400 hover:text-red-400 hover:border-red-400"
                  >
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
