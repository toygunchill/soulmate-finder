"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Download, Share2, X, Plus } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function GeneratePage() {
  const { user, isLoading, updateProfile } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<"form" | "generating" | "result">("form")
  const [generatedImage, setGeneratedImage] = useState<string>("")
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    personality: "",
    physicalTraits: "",
    values: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.interests && user.interests.length > 0) {
      setInterests(user.interests)
    }
    if (user?.preferredAgeRange) {
      setFormData((prev) => ({ ...prev, age: user.preferredAgeRange || "" }))
    }
    if (user?.preferredGender) {
      setFormData((prev) => ({ ...prev, gender: user.preferredGender || "" }))
    }
  }, [user])

  const handleGenerate = async () => {
    setStep("generating")

    updateProfile({
      interests: interests,
      preferredAgeRange: formData.age,
      preferredGender: formData.gender,
    })

    await new Promise((resolve) => setTimeout(resolve, 4500))

    const genderQuery = formData.gender ? `${formData.gender} ` : ""
    const physicalQuery = formData.physicalTraits ? `${formData.physicalTraits} ` : ""
    const personalityQuery = formData.personality ? `with ${formData.personality} personality ` : ""

    const imageQuery = `beautiful ${genderQuery}portrait ${physicalQuery}${personalityQuery}romantic soulmate illustration`
    const imageUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(imageQuery)}`

    setGeneratedImage(imageUrl)
    setStep("result")

    const history = JSON.parse(localStorage.getItem("wiys_history") || "[]")
    history.unshift({
      id: Date.now().toString(),
      type: "generate",
      image: imageUrl,
      data: { ...formData, interests: interests.join(", ") },
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("wiys_history", JSON.stringify(history.slice(0, 20)))
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Soulmate - WIYS",
          text: "Check out what my soulmate looks like! 💕\n\nCreate yours at WIYS!",
          url: window.location.origin,
        })
      } else {
        handleDownload()
      }
    } catch (err) {
      console.log("Share cancelled or failed:", err)

      if (confirm("Share not available. Would you like to download the image instead?")) {
        handleDownload()
      }
    }
  }

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = generatedImage
    a.download = "my-soulmate.png"
    a.click()
  }

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()]
      setInterests(updatedInterests)
      setNewInterest("")

      const existingInterests = user?.interests || []
      if (!existingInterests.includes(newInterest.trim())) {
        updateProfile({ interests: [...existingInterests, newInterest.trim()] })
      }
    }
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter((i) => i !== interestToRemove)
    setInterests(updatedInterests)
    updateProfile({ interests: updatedInterests })
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

  if (step === "generating") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-pulse" />
        <Card className="relative w-full max-w-md border-2 shadow-xl">
          <CardContent className="flex flex-col items-center gap-6 p-12">
            <div className="relative">
              <div className="h-24 w-24 animate-spin rounded-full border-8 border-primary/20 border-t-primary" />
              <Sparkles className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">Creating Your Soulmate...</h2>
              <p className="text-muted-foreground">
                AI is analyzing your preferences and generating a unique visualization
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "result") {
    return (
      <div className="min-h-screen pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

        <div className="relative mx-auto max-w-2xl px-4 py-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <Card className="overflow-hidden border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardContent className="p-6">
              <div className="mb-6 overflow-hidden rounded-2xl border-4 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                <img
                  src={generatedImage || "/placeholder.svg"}
                  alt="Your Soulmate"
                  className="h-auto w-full animate-in fade-in zoom-in-95 duration-1000"
                />
              </div>

              <div className="mb-6 space-y-3 rounded-xl bg-muted/50 p-4">
                <h3 className="font-semibold">Based on your preferences:</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {formData.personality && <p>✨ Personality: {formData.personality}</p>}
                  {interests.length > 0 && <p>💫 Interests: {interests.join(", ")}</p>}
                  {formData.physicalTraits && <p>👤 Physical Traits: {formData.physicalTraits}</p>}
                  {formData.values && <p>💝 Values: {formData.values}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleShare} className="flex-1 bg-gradient-to-r from-primary to-secondary" size="lg">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
                <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Download className="mr-2 h-5 w-5" />
                  Save
                </Button>
              </div>

              <Button
                onClick={() => {
                  setStep("form")
                  setGeneratedImage("")
                  setFormData({
                    age: "",
                    gender: "",
                    personality: "",
                    physicalTraits: "",
                    values: "",
                  })
                  setInterests(user?.interests || [])
                }}
                variant="ghost"
                className="mt-4 w-full"
              >
                Generate Another
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 text-center">
          <Link href="/dashboard" className="inline-block mb-4">
            <Logo size="md" />
          </Link>
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-balance">
            What Does My Soulmate Look Like?
          </h1>
          <p className="text-lg text-muted-foreground">Welcome back, {user.name}!</p>
        </header>

        <Card className="border-2 shadow-xl">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="age">Preferred Age Range</Label>
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
              <Label htmlFor="gender">Gender Preference</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Personality Traits</Label>
              <Textarea
                id="personality"
                placeholder="e.g., Kind, adventurous, funny, intelligent..."
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
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
                Your profile interests are pre-filled. Add more or remove as needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalTraits">Physical Traits (Optional)</Label>
              <Textarea
                id="physicalTraits"
                placeholder="e.g., Tall, athletic, dark hair, warm smile..."
                value={formData.physicalTraits}
                onChange={(e) => setFormData({ ...formData, physicalTraits: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values">Core Values</Label>
              <Textarea
                id="values"
                placeholder="e.g., Family-oriented, ambitious, honest, compassionate..."
                value={formData.values}
                onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-primary to-secondary font-semibold"
              size="lg"
              disabled={!formData.personality || interests.length === 0}
            >
              <Sparkles className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="text-balance">Generate My Soulmate</span>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Fill in at least personality traits and interests to generate
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
