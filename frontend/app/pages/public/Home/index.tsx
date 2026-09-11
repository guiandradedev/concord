import { Link } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { ArrowUpRight, Check, MessageCircle, Radio, Users } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";

export function HomeScreen() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-svh overflow-hidden bg-[var(--signal-ink)] text-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--signal-mint)] text-[var(--signal-ink)]">
            <MessageCircle aria-hidden="true" className="size-5" />
          </span>
          Concord
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/app" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Open workspace <ArrowUpRight data-icon="inline-end" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                Sign in
              </Link>
              <Link to="/signup" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Start talking <ArrowUpRight data-icon="inline-end" />
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="signal-grid relative mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-20">
        <div className="relative z-10 max-w-xl">
          <div className="mb-7 flex items-center gap-2 text-sm text-[var(--signal-mint)]">
            <span className="flex size-7 items-center justify-center rounded-full border border-[var(--signal-mint)]/30 bg-[var(--signal-mint)]/10">
              <Radio aria-hidden="true" className="size-4" />
            </span>
            Your people, in sync
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-balance sm:text-7xl">
            Conversations that keep their signal.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-white/65">
            Concord brings your teams and close circles into one calm place to talk, share, and move together in real time.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to={isAuthenticated ? "/app" : "/signup"} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {isAuthenticated ? "Open your workspace" : "Create your account"}
              <ArrowUpRight data-icon="inline-end" />
            </Link>
            <span className="text-sm text-white/45">No noise. Just the people you need.</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem]">
          <div className="absolute -left-6 top-10 size-24 rounded-full bg-[var(--signal-mint)]/15 blur-2xl" />
          <div className="absolute -bottom-8 -right-8 size-40 rounded-full bg-[var(--signal-coral)]/20 blur-3xl" />
          <div className="signal-glow relative rounded-[2rem] border border-white/15 bg-[var(--signal-paper)] p-3 text-[var(--signal-ink)]">
            <div className="rounded-[1.4rem] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-[var(--signal-ink)]/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--signal-ink)] text-[var(--signal-mint)]">
                    <Users aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Launch room</p>
                    <p className="text-xs text-[var(--signal-ink)]/45">7 people · live now</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--signal-active)]">
                  <span className="size-2 rounded-full bg-[var(--signal-green)]" /> Active
                </span>
              </div>
              <div className="flex flex-col gap-4 py-6">
                <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-[var(--signal-cloud)] px-4 py-3 text-sm leading-6">
                  The new flow feels much clearer. I can finally see what needs my attention.
                  <p className="mt-1 text-[11px] text-[var(--signal-ink)]/40">Maya · 09:41</p>
                </div>
                <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-[var(--signal-ink)] px-4 py-3 text-sm leading-6 text-white">
                  Perfect. I’ll bring the final notes here before stand-up.
                  <p className="mt-1 text-[11px] text-white/45">You · 09:42</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--signal-ink)]/45">
                  <span className="flex gap-1">
                    <span className="size-5 rounded-full border-2 border-white bg-[var(--signal-coral)]" />
                    <span className="size-5 rounded-full border-2 border-white bg-[var(--signal-mint)]" />
                    <span className="size-5 rounded-full border-2 border-white bg-[var(--signal-lilac)]" />
                  </span>
                  Ari is typing...
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--signal-ink)]/10 bg-[var(--signal-input)] px-3 py-2.5 text-sm text-[var(--signal-ink)]/35">
                <span className="flex-1">Write a message...</span>
                <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--signal-mint)] text-[var(--signal-ink)]">
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-white/10 px-6 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>Built for the moments between “thinking” and “done”.</p>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2"><Check className="size-4 text-[var(--signal-mint)]" /> Real-time by default</span>
          <span className="hidden sm:inline">© Concord</span>
        </div>
      </section>
    </main>
  );
}
