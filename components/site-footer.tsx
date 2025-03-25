import Link from "next/link"
import { Globe } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex gap-2 items-center text-lg font-semibold">
          <Globe className="h-5 w-5 text-primary" />
          <span>EcoImpact</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-4 text-center text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/privacy" className="hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} EcoImpact. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

