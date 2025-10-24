"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, User, History, Edit2, Save, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/date-picker"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")

  const [editData, setEditData] = useState({
    name: user?.name || "",
    birthDate: user?.birthDate || "",
    gender: user?.gender || "",
    preferredAgeRange: user?.preferredAgeRange || "",
    preferredGender: user?.preferredGender || "",
  })

  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "",
        preferredAgeRange: user.preferredAgeRange || "",
        preferredGender: user.preferredGender || "",
      })
      setInterests(user.interests || [])
    }
  }, [user])

  useEffect(() => {
    const storedHistory = localStorage.getItem("wiys_history")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const handleSave = () => {
    updateProfile({
      name: editData.name,
      birthDate: editData.birthDate,
      gender: editData.gender,
      interests: interests,
      preferredAgeRange: editData.preferredAgeRange,
      preferredGender: editData.preferredGender,
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleEditClick = () => {
    const scrollY = window.scrollY
    setIsEditing(true)
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
    })
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

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Logo size="md" />
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-background/50 backdrop-blur-sm">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-6 mb-12">
          <Card className="border-2 shadow-xl" ref={cardRef}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
              </div>

              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-4xl text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {!isEditing && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="gap-2 bg-background/50 backdrop-blur-sm"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              )}

              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <DatePicker
                      date={editData.birthDate ? new Date(editData.birthDate) : undefined}
                      onDateChange={(date) => setEditData({ ...editData, birthDate: date?.toISOString() || "" })}
                      placeholder="Select your birth date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={editData.gender}
                      onValueChange={(value) => setEditData({ ...editData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Interests</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="gap-1 pr-1">
                          {interest}
                          <button
                            onClick={() => removeInterest(interest)}
                            className="ml-1 rounded-full hover:bg-background/20 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an interest"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addInterest()
                          }
                        }}
                      />
                      <Button type="button" size="icon" onClick={addInterest} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredAgeRange">Preferred Age Range</Label>
                    <Select
                      value={editData.preferredAgeRange}
                      onValueChange={(value) => setEditData({ ...editData, preferredAgeRange: value })}
                    >
                      <SelectTrigger id="preferredAgeRange">
                        <SelectValue placeholder="Select preferred age range" />
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
                    <Label htmlFor="preferredGender">Preferred Gender</Label>
                    <Select
                      value={editData.preferredGender}
                      onValueChange={(value) => setEditData({ ...editData, preferredGender: value })}
                    >
                      <SelectTrigger id="preferredGender">
                        <SelectValue placeholder="Select preferred gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    {user.birthDate && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Birth Date</span>
                        <span className="font-medium">{new Date(user.birthDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {user.gender && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Gender</span>
                        <span className="font-medium">{user.gender}</span>
                      </div>
                    )}
                    {interests.length > 0 && (
                      <div className="space-y-2 border-b pb-2">
                        <span className="text-muted-foreground">Interests</span>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, i) => (
                            <Badge key={i} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.preferredAgeRange && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Preferred Age Range</span>
                        <span className="font-medium">{user.preferredAgeRange}</span>
                      </div>
                    )}
                    {user.preferredGender && (
                      <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">Preferred Gender</span>
                        <span className="font-medium capitalize">{user.preferredGender}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent shadow-lg">
                  <History className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Your History</h2>
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No history yet. Start by generating your soulmate!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <Link key={item.id} href={`/history/${item.id}`}>
                      <Card className="overflow-hidden border hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                item.type === "generate"
                                  ? "bg-gradient-to-br from-primary to-secondary"
                                  : "bg-gradient-to-br from-secondary to-accent"
                              }`}
                            >
                              {item.type === "generate" ? (
                                <span className="text-2xl">✨</span>
                              ) : (
                                <span className="text-2xl">💕</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">
                                {item.type === "generate" ? "Soulmate Generation" : "Compatibility Check"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()} at{" "}
                                {new Date(item.createdAt).toLocaleTimeString()}
                              </p>
                              {item.type === "compatibility" && item.result && (
                                <div className="mt-2">
                                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary to-accent">
                                    {item.result.overallScore}% Match
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
