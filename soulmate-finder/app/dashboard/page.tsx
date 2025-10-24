"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-balance">
            Who Is Your Soulmate?
          </h1>
          <p className="text-lg text-muted-foreground">Welcome back, {user.name}!</p>
        </header>

        <div className="space-y-6">
          <Link href="/generate" className="block">
            <Card className="group cursor-pointer overflow-hidden border-2 transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-primary">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">What does my soulmate look like?</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Let AI create a visual representation of your perfect match based on your personality and preferences
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/compatibility" className="block">
            <Card className="group cursor-pointer overflow-hidden border-2 transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-secondary">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Is this person my soulmate?</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Upload a photo and discover your compatibility score with detailed insights about your connection
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border bg-card/50 p-6 backdrop-blur">
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            Your journey to finding your soulmate starts here. Choose an option above to begin your discovery.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
