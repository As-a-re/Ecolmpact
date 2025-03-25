"use client"

import { useState } from "react"
import { Award, Calendar, ChevronDown, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"

export default function CommunityPage() {
  const { user, communityUsers, upcomingChallenges, joinChallenge } = useUser()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const handleJoinChallenge = (challengeId: string) => {
    if (!user?.isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to join challenges.",
        variant: "destructive",
      })
      return
    }

    joinChallenge(challengeId)
    toast({
      title: "Challenge joined!",
      description: "You've successfully joined the challenge.",
    })
  }

  // Filter users based on search query
  const filteredUsers = communityUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              Connect with others and join challenges to reduce your impact together.
            </p>
          </div>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="rounded-lg border shadow-sm">
                <div className="flex items-center p-4 border-b">
                  <div className="w-12 text-center font-medium text-muted-foreground">#</div>
                  <div className="flex-1 font-medium">User</div>
                  <div className="w-32 text-center font-medium">Footprint</div>
                  <div className="w-32 text-center font-medium">Actions</div>
                  <div className="w-32 text-center font-medium">Progress</div>
                </div>

                {/* Current user if logged in */}
                {user?.isLoggedIn && (
                  <div className="flex items-center p-4 bg-muted/50">
                    <div className="w-12 text-center font-medium">#{user.rank}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                            {user.name.split(" ")[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name}{" "}
                            <Badge variant="outline" className="ml-2">
                              You
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Joined {new Date(user.joinedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 text-center">
                      {user.footprint || "N/A"} {user.footprint ? "tons" : ""}
                    </div>
                    <div className="w-32 text-center">{user.actions.length}</div>
                    <div className="w-32">
                      <div className="flex justify-center items-center gap-2">
                        <Progress
                          value={
                            user.footprint
                              ? Math.round(
                                  100 - ((user.footprint - user.targetFootprint) / (8.2 - user.targetFootprint)) * 100,
                                )
                              : 0
                          }
                          className="h-2 w-16"
                        />
                        <span className="text-xs">
                          {user.footprint
                            ? Math.round(
                                100 - ((user.footprint - user.targetFootprint) / (8.2 - user.targetFootprint)) * 100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other users */}
                {filteredUsers.map((communityUser) => (
                  <div key={communityUser.id} className="flex items-center p-4 border-t">
                    <div className="w-12 text-center font-medium text-muted-foreground">#{communityUser.rank}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={communityUser.name} />
                          <AvatarFallback>
                            {communityUser.name.charAt(0)}
                            {communityUser.name.split(" ")[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{communityUser.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined {new Date(communityUser.joinedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 text-center">{communityUser.footprint} tons</div>
                    <div className="w-32 text-center">-</div>
                    <div className="w-32">
                      <div className="flex justify-center items-center gap-2">
                        <Progress
                          value={Math.round(
                            100 -
                              ((communityUser.footprint - communityUser.targetFootprint) /
                                (8.2 - communityUser.targetFootprint)) *
                                100,
                          )}
                          className="h-2 w-16"
                        />
                        <span className="text-xs">
                          {Math.round(
                            100 -
                              ((communityUser.footprint - communityUser.targetFootprint) /
                                (8.2 - communityUser.targetFootprint)) *
                                100,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="mb-2">
                        {new Date(challenge.startDate) > new Date() ? "Upcoming" : "Active"}
                      </Badge>
                      <Badge variant="secondary">-{challenge.impact} tons/year</Badge>
                    </div>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">End Date:</span>
                        <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participants:</span>
                        <span>24 people</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleJoinChallenge(challenge.id)}
                      disabled={user?.challenges.some((c) => c.id === challenge.id)}
                    >
                      {user?.challenges.some((c) => c.id === challenge.id) ? "Joined" : "Join Challenge"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Create a Challenge</CardTitle>
                  <CardDescription>Invite friends to join your own sustainability challenge.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground max-w-[200px]">
                    Set goals, track progress, and make a bigger impact together.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Create Challenge
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="rounded-lg border p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Community Events Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We're working on organizing local and virtual events to help you connect with other environmentally
                conscious individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">Suggest an Event</Button>
                <Button>Get Notified</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Global Statistics</CardTitle>
                  <CardDescription>Our community's collective impact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-primary mb-1">156</div>
                    <div className="text-sm text-muted-foreground">Active Members</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-primary mb-1">42.5</div>
                    <div className="text-sm text-muted-foreground">Tons CO₂e Saved</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-primary mb-1">12</div>
                    <div className="text-sm text-muted-foreground">Active Challenges</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>Members with the biggest impact this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Michael Chen</div>
                            <div className="text-xs text-muted-foreground">Reduced footprint by 2.4 tons</div>
                          </div>
                          <Badge>1st Place</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Emma Johnson</div>
                            <div className="text-xs text-muted-foreground">Reduced footprint by 1.8 tons</div>
                          </div>
                          <Badge variant="outline">2nd Place</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Sophia Rodriguez</div>
                            <div className="text-xs text-muted-foreground">Reduced footprint by 1.5 tons</div>
                          </div>
                          <Badge variant="outline">3rd Place</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}

