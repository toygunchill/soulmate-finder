"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"

interface OAuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: "google" | "apple"
  onComplete: (data: { email: string; name: string; birthDate: string }) => void
}

export function OAuthModal({ open, onOpenChange, provider, onComplete }: OAuthModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onComplete({ email, name, birthDate: birthDate?.toISOString() || "" })
    setIsLoading(false)
    onOpenChange(false)
    setEmail("")
    setName("")
    setBirthDate(undefined)
  }

  const providerName = provider === "google" ? "Google" : "Apple"
  const providerColor = provider === "google" ? "from-blue-500 to-blue-600" : "from-gray-800 to-black"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${providerColor}`}
          >
            {provider === "google" ? (
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            )}
          </div>
          <DialogTitle className="text-center text-2xl">Sign in with {providerName}</DialogTitle>
          <DialogDescription className="text-center">
            Enter your {providerName} account details to continue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{providerName} Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={provider === "google" ? "you@gmail.com" : "you@icloud.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <DatePicker
              date={birthDate}
              onDateChange={setBirthDate}
              placeholder="Select your birth date"
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            className={`h-11 w-full bg-gradient-to-r ${providerColor} text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : `Continue with ${providerName}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
