"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Award, Calendar, Edit, Save, Trash2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useUser()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user?.isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to view your profile.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user?.isLoggedIn, router, toast])

  if (!user?.isLoggedIn) {
    return null
  }

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user's profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  // Calculate days since joined
  const daysSinceJoined = Math.floor((Date.now() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your sustainability achievements.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0)}
                      {user.name.split(" ")[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member since:</span>
                  <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days active:</span>
                  <span>{daysSinceJoined}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Community rank:</span>
                  <span>#{user.rank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current footprint:</span>
                  <span>{user.footprint ? `${user.footprint} tons` : "Not calculated"}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Edit your personal information below."
                        : "View and manage your personal information."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-6">
                          <div className="flex items-start gap-4">
                            <User className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-medium">Personal Information</h4>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Name:</span>
                                  <span>{user.name}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span>{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-medium">Account Information</h4>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Member since:</span>
                                  <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Account status:</span>
                                  <span className="text-green-500">Active</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>Track your sustainability milestones and accomplishments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.actions.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4 flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">First Steps</h4>
                            <p className="text-sm text-muted-foreground">Completed your first sustainable action</p>
                          </div>
                        </div>

                        {user.actions.length >= 3 && (
                          <div className="rounded-lg border p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Getting Started</h4>
                              <p className="text-sm text-muted-foreground">Completed 3 sustainable actions</p>
                            </div>
                          </div>
                        )}

                        {user.footprint && (
                          <div className="rounded-lg border p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Self-Aware</h4>
                              <p className="text-sm text-muted-foreground">Calculated your carbon footprint</p>
                            </div>
                          </div>
                        )}

                        {user.challenges.length > 0 && (
                          <div className="rounded-lg border p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Challenger</h4>
                              <p className="text-sm text-muted-foreground">Joined your first community challenge</p>
                            </div>
                          </div>
                        )}

                        <div className="rounded-lg border p-4 flex items-center gap-4 border-dashed">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Award className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">Eco Warrior</h4>
                            <p className="text-sm text-muted-foreground">Reduce your footprint by 20%</p>
                            <Badge variant="outline" className="mt-1">
                              In progress
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                          Start your sustainability journey by calculating your carbon footprint and taking actions to
                          reduce it.
                        </p>
                        <Button asChild>
                          <Link href="/calculator">Calculate Your Footprint</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences and settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Email Notifications</h3>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p>Weekly progress updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive a summary of your sustainability progress
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="weekly-updates" className="sr-only">
                            Weekly updates
                          </Label>
                          <input type="checkbox" id="weekly-updates" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p>Challenge notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified about new challenges</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="challenge-notifications" className="sr-only">
                            Challenge notifications
                          </Label>
                          <input type="checkbox" id="challenge-notifications" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pb-2">
                        <div>
                          <p>Tips and recommendations</p>
                          <p className="text-sm text-muted-foreground">Receive personalized sustainability tips</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="tips-recommendations" className="sr-only">
                            Tips and recommendations
                          </Label>
                          <input type="checkbox" id="tips-recommendations" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Privacy Settings</h3>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p>Profile visibility</p>
                          <p className="text-sm text-muted-foreground">Allow other users to see your profile</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="profile-visibility" className="sr-only">
                            Profile visibility
                          </Label>
                          <input type="checkbox" id="profile-visibility" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pb-2">
                        <div>
                          <p>Share progress on leaderboard</p>
                          <p className="text-sm text-muted-foreground">
                            Show your sustainability progress on community leaderboards
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="share-progress" className="sr-only">
                            Share progress
                          </Label>
                          <input type="checkbox" id="share-progress" className="h-4 w-4" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="ml-auto">Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

