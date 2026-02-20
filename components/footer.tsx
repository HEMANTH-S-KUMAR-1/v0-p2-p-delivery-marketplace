import Link from "next/link"
import { Package } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-mono text-lg font-bold text-foreground">RouteDrop</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/send" className="transition-colors hover:text-foreground">Send</Link>
          <Link href="/travel" className="transition-colors hover:text-foreground">Travel</Link>
          <Link href="/track" className="transition-colors hover:text-foreground">Track</Link>
          <span className="cursor-default">Support</span>
          <span className="cursor-default">Privacy</span>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; 2026 RouteDrop. Delivering across India.
        </p>
      </div>
    </footer>
  )
}
