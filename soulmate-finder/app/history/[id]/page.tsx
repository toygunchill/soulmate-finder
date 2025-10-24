"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Share2, Download, Sparkles, Heart } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function HistoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<any>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("wiys_history") || "[]")
    const foundItem = history.find((h: any) => h.id === params.id)

    if (foundItem) {
      setItem(foundItem)
    } else {
      router.push("/profile")
    }
  }, [params.id, router])

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const shareToTwitter = () => {
    const text =
      item.type === "generate"
        ? "Check out what my soulmate looks like! 💕 Create yours at WIYS!"
        : `My compatibility score${item.data.name ? ` with ${item.data.name}` : ""}: ${item.result.overallScore}%! 💕 Check yours at WIYS!`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`
    window.open(url, "_blank")
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`
    window.open(url, "_blank")
  }

  const shareToWhatsApp = () => {
    const text =
      item.type === "generate"
        ? "Check out what my soulmate looks like! 💕 Create yours at WIYS!"
        : `My compatibility score${item.data.name ? ` with ${item.data.name}` : ""}: ${item.result.overallScore}%! 💕 Check yours at WIYS!`
    const url = `https://wa.me/?text=${encodeURIComponent(text + " " + window.location.origin)}`
    window.open(url, "_blank")
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`
    window.open(url, "_blank")
  }

  const copyLink = async () => {
    const text =
      item.type === "generate"
        ? `Check out what my soulmate looks like! 💕\n\nCreate yours at ${window.location.origin}`
        : `My compatibility score${item.data.name ? ` with ${item.data.name}` : ""}: ${item.result.overallScore}%! 💕\n\nCheck yours at ${window.location.origin}`

    try {
      await navigator.clipboard.writeText(text)
      alert("Link copied to clipboard!")
      setShowShareDialog(false)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = () => {
    window.print()
  }

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

  if (!item) {
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
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 no-print" />

        <div className="relative mx-auto max-w-2xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between no-print">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Profile
            </Link>
            <Logo size="sm" />
          </div>

          <div className="mb-8 text-center print-content">
            <h1 className="mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-4xl font-bold text-transparent">
              {item.type === "generate" ? "Your Soulmate Generation" : "Compatibility Analysis"}
            </h1>
            <p className="text-muted-foreground">
              {item.type === "generate" ? "Created" : "Checked"} on {new Date(item.createdAt).toLocaleDateString()} at{" "}
              {new Date(item.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="print-content">
            {item.type === "generate" ? (
              <Card className="overflow-hidden border-2 shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <div className="overflow-hidden rounded-2xl border-4 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                    <img src={item.image || "/placeholder.svg"} alt="Your Soulmate" className="h-auto w-full" />
                  </div>

                  <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Your Preferences
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {item.data.age && (
                        <div className="flex justify-between border-b pb-2">
                          <span>Age Range:</span>
                          <span className="font-medium text-foreground">{item.data.age}</span>
                        </div>
                      )}
                      {item.data.gender && (
                        <div className="flex justify-between border-b pb-2">
                          <span>Gender:</span>
                          <span className="font-medium text-foreground">{item.data.gender}</span>
                        </div>
                      )}
                      {item.data.personality && (
                        <div className="border-b pb-2">
                          <span className="block mb-1">Personality:</span>
                          <span className="font-medium text-foreground">{item.data.personality}</span>
                        </div>
                      )}
                      {item.data.interests && (
                        <div className="border-b pb-2">
                          <span className="block mb-1">Interests:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.data.interests.split(",").map((interest: string, i: number) => (
                              <Badge key={i} variant="secondary">
                                {interest.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.data.physicalTraits && (
                        <div className="border-b pb-2">
                          <span className="block mb-1">Physical Traits:</span>
                          <span className="font-medium text-foreground">{item.data.physicalTraits}</span>
                        </div>
                      )}
                      {item.data.values && (
                        <div className="pt-2">
                          <span className="block mb-1">Values:</span>
                          <span className="font-medium text-foreground">{item.data.values}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 no-print">
                    <Button
                      onClick={handleShare}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary"
                      size="lg"
                    >
                      <Share2 className="mr-2 h-5 w-5" />
                      Share
                    </Button>
                    <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1 bg-transparent">
                      <Download className="mr-2 h-5 w-5" />
                      Save PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden border-2 shadow-xl">
                <CardContent className="space-y-6 p-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent shadow-lg">
                      <span className="text-5xl font-bold text-white">{item.result.overallScore}%</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${getScoreColor(item.result.overallScore)}`}>
                      {getScoreLabel(item.result.overallScore)}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.data.name ? `with ${item.data.name}` : "Overall Compatibility"}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Heart className="h-5 w-5 text-secondary" />
                      Their Information
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {item.data.name && (
                        <div className="flex justify-between border-b pb-2">
                          <span>Name:</span>
                          <span className="font-medium text-foreground">{item.data.name}</span>
                        </div>
                      )}
                      {item.data.age && (
                        <div className="flex justify-between border-b pb-2">
                          <span>Age Range:</span>
                          <span className="font-medium text-foreground">{item.data.age}</span>
                        </div>
                      )}
                      {item.data.personality && (
                        <div className="border-b pb-2">
                          <span className="block mb-1">Personality:</span>
                          <span className="font-medium text-foreground">{item.data.personality}</span>
                        </div>
                      )}
                      {item.data.interests && (
                        <div className="border-b pb-2">
                          <span className="block mb-1">Interests:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.data.interests.split(",").map((interest: string, i: number) => (
                              <Badge key={i} variant="secondary">
                                {interest.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.data.values && (
                        <div className="pt-2">
                          <span className="block mb-1">Values:</span>
                          <span className="font-medium text-foreground">{item.data.values}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl bg-muted/50 p-4">
                    <h4 className="font-semibold">Compatibility Breakdown</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>Personality</span>
                          <span className="font-semibold">{item.result.personality}%</span>
                        </div>
                        <Progress value={item.result.personality} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>Values</span>
                          <span className="font-semibold">{item.result.values}%</span>
                        </div>
                        <Progress value={item.result.values} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>Interests</span>
                          <span className="font-semibold">{item.result.interests}%</span>
                        </div>
                        <Progress value={item.result.interests} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>Lifestyle</span>
                          <span className="font-semibold">{item.result.lifestyle}%</span>
                        </div>
                        <Progress value={item.result.lifestyle} className="h-2" />
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
                        {item.result.insights.map((insight: string, i: number) => (
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
                        {item.result.strengths.map((strength: string, i: number) => (
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
                        {item.result.challenges.map((challenge: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-orange-600">!</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 no-print">
                    <Button
                      onClick={handleShare}
                      className="flex-1 bg-gradient-to-r from-secondary to-accent"
                      size="lg"
                    >
                      <Share2 className="mr-2 h-5 w-5" />
                      Share
                    </Button>
                    <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1 bg-transparent">
                      <Download className="mr-2 h-5 w-5" />
                      Save PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Result</DialogTitle>
              <DialogDescription>
                Share your {item?.type === "generate" ? "soulmate generation" : "compatibility score"} with friends
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={shareToTwitter} variant="outline" className="gap-2 bg-transparent">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </Button>
              <Button onClick={shareToFacebook} variant="outline" className="gap-2 bg-transparent">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
              <Button onClick={shareToWhatsApp} variant="outline" className="gap-2 bg-transparent">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </Button>
              <Button onClick={shareToLinkedIn} variant="outline" className="gap-2 bg-transparent">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </Button>
              <Button onClick={copyLink} variant="outline" className="col-span-2 gap-2 bg-transparent">
                <Share2 className="h-5 w-5" />
                Copy Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
