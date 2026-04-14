import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem-5.5rem)] px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6">
          Full-Screen
          <br />
          <span className="text-muted-foreground">Visible Timer</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
          Large readable display for classrooms, presentations, therapy sessions, and coaching. Start in one tap. No login required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg h-14 px-8">
            <Link href="/timer">Launch Timer</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8">
            <Link href="/pricing">Get Pro</Link>
          </Button>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Classroom Ready</h3>
            <p className="text-muted-foreground text-sm">Designed for projectors and large screens. Readable from the back of the room.</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Named Segments</h3>
            <p className="text-muted-foreground text-sm">Create multi-segment sessions with labels like Warm-up, Work, and Discussion.</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Shareable Links</h3>
            <p className="text-muted-foreground text-sm">Generate a URL with your timer preset. Share it or bookmark it for instant reuse.</p>
          </div>
        </div>
      </div>
    </div>
  );
}