"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserData = {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
  footprint: number | null
  actions: Action[]
  challenges: Challenge[]
  joinedDate: string
  rank: number
  targetFootprint: number
}

export type Action = {
  id: string
  title: string
  date: string
  impact: number
  category: "home" | "transport" | "food" | "consumption" | "other"
  icon: string
}

export type Challenge = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "completed"
  impact: number
}

export type FootprintData = {
  total: number
  homeEnergy: number
  transportation: number
  foodConsumption: number
  travelOther: number
  date: string
}

export type UserContextType = {
  user: UserData | null
  footprintHistory: FootprintData[]
  recommendations: Recommendation[]
  communityUsers: UserData[]
  upcomingChallenges: Challenge[]
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  saveFootprint: (data: FootprintData) => void
  addAction: (action: Omit<Action, "id" | "date">) => void
  joinChallenge: (challengeId: string) => void
  isLoading: boolean
}

export type Recommendation = {
  id: string
  title: string
  description: string
  impact: number
  cost: "low" | "medium" | "high"
  category: "home" | "transport" | "food" | "consumption" | "other"
  icon: string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [footprintHistory, setFootprintHistory] = useState<FootprintData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock recommendations
  const [recommendations] = useState<Recommendation[]>([
    {
      id: "rec1",
      title: "Install a smart thermostat",
      description: "Could reduce your home energy use by up to 15%.",
      impact: 0.3,
      cost: "medium",
      category: "home",
      icon: "home",
    },
    {
      id: "rec2",
      title: "Start composting food waste",
      description: "Reduces methane emissions from landfills.",
      impact: 0.2,
      cost: "low",
      category: "food",
      icon: "trash",
    },
    {
      id: "rec3",
      title: "Switch to LED lighting",
      description: "Replacing all bulbs with LEDs can reduce your home energy footprint by 5%.",
      impact: 0.1,
      cost: "low",
      category: "home",
      icon: "lightbulb",
    },
    {
      id: "rec4",
      title: "Reduce car usage by 20%",
      description: "Try carpooling, public transit, or biking for some trips.",
      impact: 0.7,
      cost: "low",
      category: "transport",
      icon: "car",
    },
    {
      id: "rec5",
      title: "Buy less, choose well",
      description: "Reducing new purchases by 30% could save 0.5 tons of CO₂e per year.",
      impact: 0.5,
      cost: "low",
      category: "consumption",
      icon: "shopping-bag",
    },
  ])

  // Mock community users
  const [communityUsers] = useState<UserData[]>([
    {
      id: "user1",
      name: "Emma Johnson",
      email: "emma@example.com",
      isLoggedIn: false,
      footprint: 6.8,
      actions: [],
      challenges: [],
      joinedDate: "2023-10-15",
      rank: 12,
      targetFootprint: 2.0,
    },
    {
      id: "user2",
      name: "Michael Chen",
      email: "michael@example.com",
      isLoggedIn: false,
      footprint: 5.2,
      actions: [],
      challenges: [],
      joinedDate: "2023-11-03",
      rank: 5,
      targetFootprint: 2.0,
    },
    {
      id: "user3",
      name: "Sophia Rodriguez",
      email: "sophia@example.com",
      isLoggedIn: false,
      footprint: 7.9,
      actions: [],
      challenges: [],
      joinedDate: "2023-09-22",
      rank: 28,
      targetFootprint: 2.0,
    },
  ])

  // Mock upcoming challenges
  const [upcomingChallenges] = useState<Challenge[]>([
    {
      id: "challenge1",
      title: "Meatless Monday Challenge",
      description: "Skip meat every Monday for a month.",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      impact: 0.2,
    },
    {
      id: "challenge2",
      title: "Zero Waste Week",
      description: "Minimize your waste for one week.",
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      impact: 0.15,
    },
    {
      id: "challenge3",
      title: "Car-Free Commute",
      description: "Use alternative transportation for 2 weeks.",
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      impact: 0.3,
    },
  ])

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("ecoImpactUser")
    const storedFootprintHistory = localStorage.getItem("ecoImpactFootprintHistory")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (storedFootprintHistory) {
      setFootprintHistory(JSON.parse(storedFootprintHistory))
    }

    setIsLoading(false)
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("ecoImpactUser", JSON.stringify(user))
    }
  }, [user])

  // Save footprint history to localStorage whenever it changes
  useEffect(() => {
    if (footprintHistory.length > 0) {
      localStorage.setItem("ecoImpactFootprintHistory", JSON.stringify(footprintHistory))
    }
  }, [footprintHistory])

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data
    const mockUser: UserData = {
      id: "user123",
      name: "Jane Doe",
      email,
      isLoggedIn: true,
      footprint: 8.2,
      actions: [
        {
          id: "action1",
          title: "Switched to LED lighting",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          impact: 0.1,
          category: "home",
          icon: "lightbulb",
        },
        {
          id: "action2",
          title: "Carpooled to work",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          impact: 0.05,
          category: "transport",
          icon: "car",
        },
        {
          id: "action3",
          title: "Bought second-hand furniture",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          impact: 0.2,
          category: "consumption",
          icon: "shopping-bag",
        },
      ],
      challenges: [],
      joinedDate: new Date().toISOString(),
      rank: 42,
      targetFootprint: 2.0,
    }

    // Mock footprint history
    const mockFootprintHistory: FootprintData[] = [
      {
        total: 8.2,
        homeEnergy: 2.1,
        transportation: 3.4,
        foodConsumption: 1.8,
        travelOther: 0.9,
        date: new Date().toISOString(),
      },
    ]

    setUser(mockUser)
    setFootprintHistory(mockFootprintHistory)
    setIsLoading(false)
  }

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new user
    const newUser: UserData = {
      id: `user${Date.now()}`,
      name,
      email,
      isLoggedIn: true,
      footprint: null,
      actions: [],
      challenges: [],
      joinedDate: new Date().toISOString(),
      rank: 0,
      targetFootprint: 2.0,
    }

    setUser(newUser)
    setFootprintHistory([])
    setIsLoading(false)
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("ecoImpactUser")
  }

  // Save footprint data
  const saveFootprint = (data: FootprintData) => {
    // Add to footprint history
    setFootprintHistory((prev) => [...prev, data])

    // Update user's current footprint
    if (user) {
      setUser({
        ...user,
        footprint: data.total,
      })
    }
  }

  // Add a new action
  const addAction = (action: Omit<Action, "id" | "date">) => {
    if (user) {
      const newAction: Action = {
        ...action,
        id: `action${Date.now()}`,
        date: new Date().toISOString(),
      }

      setUser({
        ...user,
        actions: [newAction, ...user.actions],
      })
    }
  }

  // Join a challenge
  const joinChallenge = (challengeId: string) => {
    if (user) {
      const challenge = upcomingChallenges.find((c) => c.id === challengeId)

      if (challenge && !user.challenges.some((c) => c.id === challengeId)) {
        setUser({
          ...user,
          challenges: [...user.challenges, challenge],
        })
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        footprintHistory,
        recommendations,
        communityUsers,
        upcomingChallenges,
        login,
        signup,
        logout,
        saveFootprint,
        addAction,
        joinChallenge,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}

