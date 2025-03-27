import { Button } from "@/components/ui/button"
import { Menu, Settings } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "./wallet-connect"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="relative h-9 w-9 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="h-full w-full">
                  {/* Outer circle (dark gray) */}
                  <circle cx="20" cy="20" r="18" fill="#1f2937" className="dark:fill-gray-800" />

                  {/* Moon surface (light gray with craters) */}
                  <circle cx="20" cy="20" r="16" fill="#d1d5db" className="dark:fill-gray-400" />

                  {/* Craters */}
                  <circle cx="14" cy="15" r="3" fill="#9ca3af" className="dark:fill-gray-600" />
                  <circle cx="26" cy="18" r="4" fill="#9ca3af" className="dark:fill-gray-600" />
                  <circle cx="18" cy="26" r="2.5" fill="#9ca3af" className="dark:fill-gray-600" />

                  {/* Shadow gradient */}
                  <circle cx="20" cy="20" r="16" fill="url(#moonGradient)" />

                  {/* Orbit ring */}
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    className="dark:stroke-blue-500"
                  />

                  {/* Small satellite */}
                  <circle cx="33" cy="12" r="2.5" fill="#3b82f6" className="dark:fill-blue-500" />

                  {/* Gradient definition */}
                  <defs>
                    <radialGradient id="moonGradient" cx="30%" cy="30%" r="70%" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-blue-600 dark:from-gray-300 dark:to-blue-400 bg-clip-text text-transparent font-bold tracking-tight">
                Lunarswap
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-purple-400 transition"
              >
                Swap
              </Link>
              <Link
                href="/pool"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition"
              >
                Pool
              </Link>
              <Link
                href="/charts"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-400 transition"
              >
                Charts
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <WalletConnect />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

