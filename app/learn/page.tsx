"use client"

import { useState } from "react"
import Link from "next/link"
import { Book, BookOpen, ChevronRight, FileText, Lightbulb, Search, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const articles = [
    {
      id: "article1",
      title: "Understanding Your Carbon Footprint",
      description: "Learn what makes up your carbon footprint and why it matters.",
      category: "basics",
      readTime: "5 min read",
      type: "article",
    },
    {
      id: "article2",
      title: "The Impact of Diet on Climate Change",
      description: "How your food choices affect greenhouse gas emissions.",
      category: "food",
      readTime: "8 min read",
      type: "article",
    },
    {
      id: "article3",
      title: "Home Energy Efficiency Guide",
      description: "Simple ways to reduce energy consumption at home.",
      category: "home",
      readTime: "10 min read",
      type: "guide",
    },
    {
      id: "article4",
      title: "Sustainable Transportation Options",
      description: "Exploring greener ways to get around.",
      category: "transport",
      readTime: "7 min read",
      type: "article",
    },
    {
      id: "article5",
      title: "The Problem with Fast Fashion",
      description: "Environmental impacts of clothing production and consumption.",
      category: "consumption",
      readTime: "6 min read",
      type: "article",
    },
    {
      id: "article6",
      title: "Introduction to Carbon Offsets",
      description: "What they are and how they work.",
      category: "basics",
      readTime: "4 min read",
      type: "guide",
    },
  ]

  const videos = [
    {
      id: "video1",
      title: "Climate Change Explained",
      description: "A simple explanation of the science behind climate change.",
      duration: "12:34",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "video2",
      title: "How to Calculate Your Carbon Footprint",
      description: "Step-by-step guide to understanding your environmental impact.",
      duration: "8:21",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "video3",
      title: "Sustainable Living Tips",
      description: "Practical ways to reduce your environmental impact.",
      duration: "15:47",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  // Filter content based on search query
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
            <p className="text-muted-foreground">
              Educational resources to help you understand climate change and sustainability.
            </p>
          </div>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles, guides, and videos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles
                .filter((article) => article.type === "article")
                .map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">
                          {article.category}
                        </Badge>
                        <Badge variant="secondary">{article.readTime}</Badge>
                      </div>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-3">
                      <Button variant="ghost" className="w-full justify-between" asChild>
                        <Link href={`/learn/articles/${article.id}`}>
                          Read Article
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>

            {filteredArticles.filter((article) => article.type === "article").length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No articles found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or browse our guides instead.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-3">
                    <Button variant="ghost" className="w-full justify-between" asChild>
                      <Link href={`/learn/videos/${video.id}`}>
                        Watch Video
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No videos found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or browse our articles instead.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles
                .filter((article) => article.type === "guide")
                .map((guide) => (
                  <Card key={guide.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">
                          {guide.category}
                        </Badge>
                        <Badge variant="secondary">{guide.readTime}</Badge>
                      </div>
                      <CardTitle>{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-3">
                      <Button variant="ghost" className="w-full justify-between" asChild>
                        <Link href={`/learn/guides/${guide.id}`}>
                          View Guide
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Suggest a Topic</CardTitle>
                  <CardDescription>Is there something you'd like to learn more about?</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground max-w-[200px]">
                    Submit your ideas for new educational content.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Suggest Topic
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {filteredArticles.filter((article) => article.type === "guide").length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No guides found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or browse our articles instead.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 rounded-lg border p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <Badge className="mb-4">Featured Resource</Badge>
              <h2 className="text-2xl font-bold mb-2">The Complete Guide to Sustainable Living</h2>
              <p className="text-muted-foreground mb-6">
                Our comprehensive e-book covers everything from reducing your carbon footprint to sustainable shopping
                practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button>Download Free E-Book</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/40 blur"></div>
                <div className="relative bg-background rounded-lg p-6">
                  <Book className="h-24 w-24 text-primary mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

