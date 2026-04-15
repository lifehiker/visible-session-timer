import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visible Session Timer – Full-Screen Visual Timer",
  description:
    "Free full-screen visual timer with large readable display, named segments, repeating intervals, and one-tap start. Works on projectors, laptops, and shared screens.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
              <Link href="/" className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
                Visible Session Timer
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/timer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Launch Timer
                </Link>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Visible Session Timer</p>
              <div className="flex items-center gap-4">
                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              </div>
            </div>
          </footer>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
