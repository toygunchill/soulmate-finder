"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, Sparkles, X, Plus } from "lucide-react"
import Link from "next/link"

interface CompatibilityResult {
  overallScore: number
  personality: number
  values: number
  interests: number
  lifestyle: number
  insights: string[]
  strengths: string[]
  challenges: string[]
}

export default function CompatibilityPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<"form" | "analyzing" | "result">("form")
  const [uploadedImage, setUploadedImage] = useState<string>("")
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    personality: "",
    values: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove))
  }

  const handleAnalyze = async () => {
    setStep("analyzing")

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockResult: CompatibilityResult = {
      overallScore: Math.floor(Math.random() * 30) + 70,
      personality: Math.floor(Math.random() * 30) + 70,
      values: Math.floor(Math.random() * 30) + 70,
      interests: Math.floor(Math.random() * 30) + 70,
      lifestyle: Math.floor(Math.random() * 30) + 70,
      insights: [
        "You both share a deep appreciation for meaningful conversations",
        "Your communication styles complement each other well",
        "Similar life goals and aspirations create strong alignment",
      ],
      strengths: [
        "Emotional intelligence and empathy",
        "Shared values around family and relationships",
        "Compatible energy levels and social preferences",
      ],
      challenges: [
        "Different approaches to conflict resolution",
        "May need to work on balancing independence and togetherness",
      ],
    }

    setResult(mockResult)
    setStep("result")

    const history = JSON.parse(localStorage.getItem("wiys_history") || "[]")
    history.unshift({
      id: Date.now().toString(),
      type: "compatibility",
      data: { ...formData, interests: interests.join(", ") },
      result: mockResult,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("wiys_history", JSON.stringify(history.slice(0, 20)))
  }

  const handleShare = async () => {
    if (!result) return

    try {
      const shareText = `My compatibility score${formData.name ? ` with ${formData.name}` : ""}: ${result.overallScore}%! 💕\n\nCheck yours at WIYS!`

      if (navigator.share) {
        await navigator.share({
          title: "Compatibility Score - WIYS",
          text: shareText,
          url: window.location.origin,
        })
      } else {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText + "\n" + window.location.origin)
          alert("Result copied to clipboard!")
        } else {
          alert("Sharing not supported on this device")
        }
      }
    } catch (err) {
      console.log("Share cancelled or failed:", err)
    }
  }

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

  if (step === "analyzing") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 animate-pulse" />
        <Card className="relative w-full max-w-md border-2 shadow-xl">
          <CardContent className="flex flex-col items-center gap-6 p-12">
            <div className="relative">
              <div className="h-24 w-24 animate-spin rounded-full border-8 border-secondary/20 border-t-secondary" />
              <Heart className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-secondary animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">Analyzing Compatibility...</h2>
              <p className="text-muted-foreground">AI is evaluating your connection and generating insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "result" && result) {
    const getScoreColor = (score: number) => {
      if (score >= 85) return "text-green-600"
      if (score >= 70) return "text-yellow-600"
      return "text-orange-600"
    }

    const getScoreLabel = (score: number) => {
      if (score >= 90) return "Exceptional Match"
      if (score >= 80) return "Great Match"
      if (score >= 70) return "Good Match"
      return "Moderate Match"
    }

    return (
      <div className="min-h-screen pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5" />

        <div className="relative mx-auto max-w-2xl px-4 py-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <Card className="overflow-hidden border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
              <CardTitle className="text-center text-2xl">Compatibility Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent shadow-lg">
                  <span className={`text-5xl font-bold text-white`}>{result.overallScore}%</span>
                </div>
                <h3 className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {getScoreLabel(result.overallScore)}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {formData.name ? `with ${formData.name}` : "Overall Compatibility"}
                </p>
              </div>

              <div className="space-y-4 rounded-xl bg-muted/50 p-4">
                <h4 className="font-semibold">Compatibility Breakdown</h4>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Personality</span>
                      <span className="font-semibold">{result.personality}%</span>
                    </div>
                    <Progress value={result.personality} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Values</span>
                      <span className="font-semibold">{result.values}%</span>
                    </div>
                    <Progress value={result.values} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Interests</span>
                      <span className="font-semibold">{result.interests}%</span>
                    </div>
                    <Progress value={result.interests} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Lifestyle</span>
                      <span className="font-semibold">{result.lifestyle}%</span>
                    </div>
                    <Progress value={result.lifestyle} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border bg-card p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Key Insights
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.insights.map((insight, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-green-600">
                    <Heart className="h-5 w-5" />
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.strengths.map((strength, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <h4 className="mb-3 font-semibold text-orange-600">Areas to Navigate</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.challenges.map((challenge, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-orange-600">!</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleShare} className="flex-1 bg-gradient-to-r from-secondary to-accent" size="lg">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Result
                </Button>
              </div>

              <Button
                onClick={() => {
                  setStep("form")
                  setFormData({
                    name: "",
                    age: "",
                    personality: "",
                    values: "",
                  })
                  setInterests([])
                  setUploadedImage("")
                }}
                variant="ghost"
                className="w-full"
              >
                Check Another Person
              </Button>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5" />

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 text-center">
          <Link href="/dashboard" className="inline-block mb-4">
            <Logo size="md" />
          </Link>
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent text-balance">
            Who Is Your Soulmate?
          </h1>
          <p className="text-lg text-muted-foreground">Welcome back, {user.name}!</p>
        </header>

        <Card className="border-2 shadow-xl">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="photo">Upload Photo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input id="photo" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                {uploadedImage && (
                  <div className="h-16 w-16 overflow-hidden rounded-lg border-2">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Upload a photo for visual analysis</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Their Name</Label>
              <Input
                id="name"
                placeholder="e.g., Alex"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Their Age Range</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger id="age">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-22">18-22</SelectItem>
                  <SelectItem value="22-27">22-27</SelectItem>
                  <SelectItem value="27-35">27-35</SelectItem>
                  <SelectItem value="35-40">35-40</SelectItem>
                  <SelectItem value="40-45">40-45</SelectItem>
                  <SelectItem value="45-50">45-50</SelectItem>
                  <SelectItem value="50-70">50-70</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Their Personality</Label>
              <Textarea
                id="personality"
                placeholder="Describe their personality traits..."
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Their Interests</Label>
              <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3 min-h-[60px]">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="gap-1 pr-1">
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 rounded-full hover:bg-background/50 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {interests.length === 0 && (
                  <span className="text-sm text-muted-foreground">No interests added yet</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  id="interests"
                  placeholder="Add an interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddInterest()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddInterest} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add the interests of the person you want to check compatibility with
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="values">Their Values</Label>
              <Textarea
                id="values"
                placeholder="What's important to them?"
                value={formData.values}
                onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                rows={3}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              className="w-full bg-gradient-to-r from-secondary to-accent text-lg font-semibold"
              size="lg"
              disabled={!formData.personality || interests.length === 0}
            >
              <Heart className="mr-2 h-5 w-5" />
              Analyze Compatibility
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Fill in at least personality and interests to analyze
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
