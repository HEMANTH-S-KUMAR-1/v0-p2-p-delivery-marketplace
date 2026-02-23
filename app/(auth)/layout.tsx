import Link from "next/link"
import { Package } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <Package className="h-5 w-5 text-secondary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-primary-foreground font-mono">
          RouteDrop
        </span>
      </Link>
      {children}
    </div>
  )
}
