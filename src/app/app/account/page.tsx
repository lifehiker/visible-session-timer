import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Account \u2013 Visible Session Timer",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/app/account");
  }

  const { upgraded } = await searchParams;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isPro: true,
      createdAt: true,
      _count: { select: { templates: true } },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Account</h1>

      {upgraded === "true" && (
        <div className="mb-6 rounded-xl border border-green-700 bg-green-950/50 px-5 py-4">
          <p className="text-sm font-medium text-green-400">
            Welcome to Pro! Your account has been upgraded. All Pro features are now active.
          </p>
        </div>
      )}

      {/* Profile */}
      <section className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "Avatar"}
              width={56}
              height={56}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-lg">{user.name ?? "Anonymous"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Plan */}
      <section className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg flex items-center gap-2">
              {user.isPro ? (
                <>
                  Pro
                  <span className="text-xs font-medium bg-white text-zinc-900 rounded-full px-2 py-0.5">
                    Active
                  </span>
                </>
              ) : (
                "Free"
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {user.isPro
                ? "Unlimited templates, all features unlocked."
                : `${user._count.templates} / 3 templates used.`}
            </p>
          </div>
          {!user.isPro && (
            <form action="/api/stripe/checkout" method="POST">
              <Button type="submit" className="bg-white text-zinc-900 hover:bg-zinc-200 font-semibold">
                Upgrade to Pro \u2014 $9
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Templates */}
      <section className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Templates</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {user._count.templates} saved template{user._count.templates !== 1 ? "s" : ""}
          </p>
          <Button variant="outline" asChild className="border-zinc-600">
            <Link href="/app/templates">View templates</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
