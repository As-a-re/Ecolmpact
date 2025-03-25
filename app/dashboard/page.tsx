"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUp,
  BarChart3,
  Calendar,
  Leaf,
  LineChart,
  Target,
  Users,
  Car,
  ShoppingBag,
  Home,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, footprintHistory, recommendations, upcomingChallenges, joinChallenge } = useUser()
  const [period, setPeriod] = useState("month")

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user?.isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to view your dashboard.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user?.isLoggedIn, router, toast])

  if (!user?.isLoggedIn) {
    return null
  }

  const getIconComponent = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "home":
        return Home
      case "car":
        return Car
      case "shopping-bag":
        return ShoppingBag
      case "leaf":
        return Leaf
      default:
        return Leaf
    }
  }

  const handleJoinChallenge = (challengeId: string) => {
    joinChallenge(challengeId)
    toast({
      title: "Challenge joined!",
      description: "You've successfully joined the challenge.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and impact over time.</p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs defaultValue={period} onValueChange={setPeriod} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Footprint</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.footprint || "N/A"} {user.footprint ? "tons" : ""}
              </div>
              <p className="text-xs text-muted-foreground">CO₂e per year</p>
              <div className="mt-4 flex items-center gap-2">
                {user.footprint ? (
                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    +4%
                  </Badge>
                ) : (
                  <Badge variant="outline">No data yet</Badge>
                )}
                <span className="text-xs text-muted-foreground">from last {period}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reduction Target</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.targetFootprint} tons</div>
              <p className="text-xs text-muted-foreground">by 2030</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>
                    {user.footprint
                      ? Math.round(100 - ((user.footprint - user.targetFootprint) / (8.2 - user.targetFootprint)) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    user.footprint
                      ? Math.round(100 - ((user.footprint - user.targetFootprint) / (8.2 - user.targetFootprint)) * 100)
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions Completed</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.actions.length}</div>
              <p className="text-xs text-muted-foreground">sustainable actions</p>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                  <ArrowUp className="mr-1 h-3 w-3" />+{user.actions.length > 0 ? user.actions.length : 0}
                </Badge>
                <span className="text-xs text-muted-foreground">from last {period}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{user.rank || "N/A"}</div>
              <p className="text-xs text-muted-foreground">of 156 users</p>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +5
                </Badge>
                <span className="text-xs text-muted-foreground">positions this {period}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7 mt-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Footprint Trends</CardTitle>
              <CardDescription>Your carbon footprint over time</CardDescription>
            </CardHeader>
            <CardContent>
              {footprintHistory.length > 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Chart visualization would go here</span>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center">
                  <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No data yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Complete the carbon footprint calculator to see your trends over time.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/calculator">Calculate Your Footprint</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Challenges</CardTitle>
              <CardDescription>Join these challenges to reduce your impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingChallenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description} Starts in{" "}
                        {Math.ceil((new Date(challenge.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}{" "}
                        days.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleJoinChallenge(challenge.id)}
                        disabled={user.challenges.some((c) => c.id === challenge.id)}
                      >
                        {user.challenges.some((c) => c.id === challenge.id) ? "Joined" : "Join Challenge"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
              <CardDescription>Your latest sustainable activities</CardDescription>
            </CardHeader>
            <CardContent>
              {user.actions.length > 0 ? (
                <div className="space-y-4">
                  {user.actions.slice(0, 3).map((action) => {
                    const IconComponent = getIconComponent(action.icon)
                    return (
                      <div key={action.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{action.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(action.date).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge>-{action.impact} tons/year</Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No actions yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Start adding sustainable actions to track your progress.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/calculator">Get Recommendations</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {user.actions.length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Actions
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Recommendations</CardTitle>
              <CardDescription>Personalized suggestions for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.slice(0, 2).map((recommendation) => {
                  const IconComponent = getIconComponent(recommendation.icon)
                  return (
                    <div key={recommendation.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">{recommendation.title}</h4>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary">
                              {recommendation.impact >= 0.5 ? "High" : recommendation.impact >= 0.2 ? "Medium" : "Low"}{" "}
                              Impact
                            </Badge>
                            <Badge variant="outline">
                              {recommendation.cost.charAt(0).toUpperCase() + recommendation.cost.slice(1)} Cost
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Full Action Plan</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

