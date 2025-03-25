"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Car, Home, Plane, ShoppingBag, Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { useUser } from "@/context/user-context"

export default function CalculatorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, saveFootprint, addAction } = useUser()

  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(20)
  const [footprint, setFootprint] = useState<number | null>(null)

  // Form state
  const [homeType, setHomeType] = useState("apartment")
  const [householdSize, setHouseholdSize] = useState(2)
  const [electricityUsage, setElectricityUsage] = useState(300)
  const [transportMode, setTransportMode] = useState("car")
  const [milesDriven, setMilesDriven] = useState(150)
  const [mpg, setMpg] = useState(25)
  const [diet, setDiet] = useState("mixed")
  const [monthlySpending, setMonthlySpending] = useState(200)
  const [secondHand, setSecondHand] = useState("sometimes")
  const [shortFlights, setShortFlights] = useState(1)
  const [longFlights, setLongFlights] = useState(0)
  const [offsetEmissions, setOffsetEmissions] = useState("no")
  const [lifestyle, setLifestyle] = useState("average")

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
      setProgress((step + 1) * 25)
    } else {
      calculateFootprint()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress((step - 1) * 25)
    }
  }

  const calculateFootprint = () => {
    // This is a simplified calculation for demo purposes
    // In a real app, this would use more sophisticated formulas

    // Home energy calculation
    let homeEnergy = electricityUsage * 0.007
    if (homeType === "house") homeEnergy *= 1.5
    homeEnergy = homeEnergy / householdSize

    // Transportation calculation
    let transportation = 0
    if (transportMode === "car") {
      transportation = ((milesDriven * 52) / mpg) * 0.008
    } else if (transportMode === "public") {
      transportation = milesDriven * 52 * 0.003
    } else {
      transportation = milesDriven * 52 * 0.0005
    }

    // Food and consumption
    let foodConsumption = 0
    if (diet === "meat") {
      foodConsumption = 2.5
    } else if (diet === "mixed") {
      foodConsumption = 1.8
    } else {
      foodConsumption = 1.2
    }

    // Adjust for consumption habits
    if (secondHand === "often") {
      foodConsumption -= 0.3
    } else if (secondHand === "rarely") {
      foodConsumption += 0.3
    }

    // Travel and other
    let travelOther = shortFlights * 0.3 + longFlights * 1.2

    // Adjust for carbon offsets
    if (offsetEmissions === "yes") {
      travelOther *= 0.7
    } else if (offsetEmissions === "sometimes") {
      travelOther *= 0.85
    }

    // Lifestyle adjustment
    let lifestyleMultiplier = 1
    if (lifestyle === "minimal") {
      lifestyleMultiplier = 0.8
    } else if (lifestyle === "luxury") {
      lifestyleMultiplier = 1.3
    }

    // Calculate total (rounded to 1 decimal place)
    const total = Number.parseFloat(
      ((homeEnergy + transportation + foodConsumption + travelOther) * lifestyleMultiplier).toFixed(1),
    )

    // Save footprint data if user is logged in
    if (user?.isLoggedIn) {
      saveFootprint({
        total,
        homeEnergy,
        transportation,
        foodConsumption,
        travelOther,
        date: new Date().toISOString(),
      })

      toast({
        title: "Footprint saved!",
        description: "Your carbon footprint has been calculated and saved to your profile.",
      })
    }

    setFootprint(total)
  }

  const handleGetActionPlan = () => {
    if (user?.isLoggedIn) {
      router.push("/dashboard")
    } else {
      toast({
        title: "Login required",
        description: "Please login or create an account to get a personalized action plan.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }

  const handleAddAction = (
    title: string,
    impact: number,
    category: "home" | "transport" | "food" | "consumption" | "other",
    icon: string,
  ) => {
    if (user?.isLoggedIn) {
      addAction({
        title,
        impact,
        category,
        icon,
      })

      toast({
        title: "Action added!",
        description: `"${title}" has been added to your actions.`,
      })
    } else {
      toast({
        title: "Login required",
        description: "Please login or create an account to track your actions.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container max-w-4xl py-12 flex-1">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Carbon Footprint Calculator</h1>
          <p className="text-muted-foreground">
            Answer a few questions about your lifestyle to calculate your carbon footprint.
          </p>
        </div>

        {!footprint ? (
          <Card>
            <CardHeader>
              <CardTitle>Step {step} of 4</CardTitle>
              <CardDescription>
                {step === 1 && "Let's start with your home energy usage"}
                {step === 2 && "Now let's look at your transportation habits"}
                {step === 3 && "Tell us about your diet and consumption"}
                {step === 4 && "Finally, let's consider your travel and other activities"}
              </CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="home-type">What type of home do you live in?</Label>
                    <RadioGroup
                      value={homeType}
                      onValueChange={setHomeType}
                      id="home-type"
                      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                    >
                      <Label
                        htmlFor="apartment"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="apartment" id="apartment" className="sr-only" />
                        <Home className="mb-3 h-6 w-6" />
                        <span className="text-center">Apartment</span>
                      </Label>
                      <Label
                        htmlFor="house"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="house" id="house" className="sr-only" />
                        <Home className="mb-3 h-6 w-6" />
                        <span className="text-center">House</span>
                      </Label>
                      <Label
                        htmlFor="other"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="other" id="other" className="sr-only" />
                        <Home className="mb-3 h-6 w-6" />
                        <span className="text-center">Other</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>How many people live in your household?</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        min="1"
                        value={householdSize}
                        onChange={(e) => setHouseholdSize(Number.parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">people</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Monthly electricity usage</Label>
                      <span className="text-sm text-muted-foreground">{electricityUsage} kWh</span>
                    </div>
                    <Slider
                      value={[electricityUsage]}
                      onValueChange={(value) => setElectricityUsage(value[0])}
                      max={1000}
                      step={10}
                      className="py-4"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="transportation">Primary mode of transportation</Label>
                    <RadioGroup
                      value={transportMode}
                      onValueChange={setTransportMode}
                      id="transportation"
                      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                    >
                      <Label
                        htmlFor="car"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="car" id="car" className="sr-only" />
                        <Car className="mb-3 h-6 w-6" />
                        <span className="text-center">Car</span>
                      </Label>
                      <Label
                        htmlFor="public"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="public" id="public" className="sr-only" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M7 10h10" />
                          <path d="M7 14h10" />
                          <circle cx="8" cy="18" r="1" />
                          <circle cx="16" cy="18" r="1" />
                          <path d="M9 3v3" />
                          <path d="M15 3v3" />
                        </svg>
                        <span className="text-center">Public Transit</span>
                      </Label>
                      <Label
                        htmlFor="bike"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="bike" id="bike" className="sr-only" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <circle cx="5.5" cy="17.5" r="3.5" />
                          <circle cx="18.5" cy="17.5" r="3.5" />
                          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                        </svg>
                        <span className="text-center">Bike/Walk</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Weekly miles driven</Label>
                      <span className="text-sm text-muted-foreground">{milesDriven} miles</span>
                    </div>
                    <Slider
                      value={[milesDriven]}
                      onValueChange={(value) => setMilesDriven(value[0])}
                      max={500}
                      step={10}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle fuel efficiency (MPG)</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        min="1"
                        value={mpg}
                        onChange={(e) => setMpg(Number.parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">MPG</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="diet">What best describes your diet?</Label>
                    <RadioGroup
                      value={diet}
                      onValueChange={setDiet}
                      id="diet"
                      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                    >
                      <Label
                        htmlFor="meat"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="meat" id="meat" className="sr-only" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <path d="M15.5 2H12a10 10 0 0 0 0 20h8a2 2 0 0 0 2-2V6.5L15.5 2Z" />
                          <path d="M22 6.5h-4.5V2" />
                        </svg>
                        <span className="text-center">Meat Heavy</span>
                      </Label>
                      <Label
                        htmlFor="mixed"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="mixed" id="mixed" className="sr-only" />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
                        </svg>
                        <span className="text-center">Mixed Diet</span>
                      </Label>
                      <Label
                        htmlFor="veg"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="veg" id="veg" className="sr-only" />
                        <Leaf className="mb-3 h-6 w-6" />
                        <span className="text-center">Vegetarian/Vegan</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Monthly spending on new goods</Label>
                      <span className="text-sm text-muted-foreground">${monthlySpending}</span>
                    </div>
                    <Slider
                      value={[monthlySpending]}
                      onValueChange={(value) => setMonthlySpending(value[0])}
                      max={1000}
                      step={50}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>How often do you buy second-hand or repair items?</Label>
                    <RadioGroup value={secondHand} onValueChange={setSecondHand}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id="rarely" />
                        <Label htmlFor="rarely">Rarely</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sometimes" id="sometimes" />
                        <Label htmlFor="sometimes">Sometimes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="often" id="often" />
                        <Label htmlFor="often">Often</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>How many flights do you take per year?</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="short-flights" className="text-sm">
                          Short flights ({"<"}3 hours)
                        </Label>
                        <Input
                          id="short-flights"
                          type="number"
                          min="0"
                          value={shortFlights}
                          onChange={(e) => setShortFlights(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="long-flights" className="text-sm">
                          Long flights ({">"}3 hours)
                        </Label>
                        <Input
                          id="long-flights"
                          type="number"
                          min="0"
                          value={longFlights}
                          onChange={(e) => setLongFlights(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Do you offset your carbon emissions?</Label>
                    <RadioGroup value={offsetEmissions} onValueChange={setOffsetEmissions}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sometimes" id="sometimes-offset" />
                        <Label htmlFor="sometimes-offset">Sometimes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>How would you describe your overall lifestyle?</Label>
                    <RadioGroup value={lifestyle} onValueChange={setLifestyle}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal">Minimalist</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="average" id="average" />
                        <Label htmlFor="average">Average Consumer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="luxury" id="luxury" />
                        <Label htmlFor="luxury">Luxury Consumer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {step < 4 ? (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Calculate Footprint"
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Carbon Footprint Results</CardTitle>
                <CardDescription>
                  Based on your responses, we've calculated your estimated carbon footprint.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary">
                    <span className="text-4xl font-bold">{footprint}</span>
                    <span className="text-xl">tons</span>
                    <span className="absolute bottom-0 text-sm text-muted-foreground">CO₂e per year</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      Your footprint is <span className="text-amber-500 font-bold">slightly above</span> the global
                      average of 7.5 tons.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A sustainable footprint is around 2 tons per person per year.
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="breakdown">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  </TabsList>
                  <TabsContent value="breakdown" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Home Energy</span>
                        <span className="font-medium">2.1 tons</span>
                      </div>
                      <Progress value={26} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Transportation</span>
                        <span className="font-medium">3.4 tons</span>
                      </div>
                      <Progress value={41} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Food & Consumption</span>
                        <span className="font-medium">1.8 tons</span>
                      </div>
                      <Progress value={22} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Travel & Other</span>
                        <span className="font-medium">0.9 tons</span>
                      </div>
                      <Progress value={11} className="h-2" />
                    </div>
                  </TabsContent>
                  <TabsContent value="recommendations" className="space-y-4 pt-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Car className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Reduce car usage by 20%</h4>
                          <p className="text-sm text-muted-foreground">
                            Try carpooling, public transit, or biking for some trips. This could save 0.7 tons of CO₂e
                            per year.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleAddAction("Reduce car usage by 20%", 0.7, "transport", "car")}
                          >
                            Add to My Actions
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Home className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Switch to LED lighting</h4>
                          <p className="text-sm text-muted-foreground">
                            Replacing all bulbs with LEDs can reduce your home energy footprint by 5%. Savings: 0.1 tons
                            of CO₂e per year.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleAddAction("Switch to LED lighting", 0.1, "home", "lightbulb")}
                          >
                            Add to My Actions
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <ShoppingBag className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Buy less, choose well</h4>
                          <p className="text-sm text-muted-foreground">
                            Reducing new purchases by 30% could save 0.5 tons of CO₂e per year. Focus on quality items
                            that last longer.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleAddAction("Buy less, choose well", 0.5, "consumption", "shopping-bag")}
                          >
                            Add to My Actions
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Plane className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Offset your flights</h4>
                          <p className="text-sm text-muted-foreground">
                            Consider carbon offsets for your air travel. This won't reduce emissions but helps fund
                            climate projects.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleAddAction("Offset your flights", 0.3, "other", "plane")}
                          >
                            Add to My Actions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="comparison" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-green-500"></div>
                          <span>Sustainable Target</span>
                        </div>
                        <span className="font-medium">2.0 tons</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <span>Global Average</span>
                        </div>
                        <span className="font-medium">7.5 tons</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                          <span>Your Footprint</span>
                        </div>
                        <span className="font-medium">{footprint} tons</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-red-500"></div>
                          <span>US Average</span>
                        </div>
                        <span className="font-medium">16.0 tons</span>
                      </div>

                      <div className="relative mt-8 h-8 w-full rounded-full bg-gray-200">
                        <div className="absolute left-0 top-0 h-full w-[12.5%] rounded-l-full bg-green-500"></div>
                        <div className="absolute left-[12.5%] top-0 h-full w-[34.4%] bg-blue-500"></div>
                        <div className="absolute left-[46.9%] top-0 h-full w-[4.4%] bg-amber-500"></div>
                        <div className="absolute left-[51.3%] top-0 h-full w-[48.7%] rounded-r-full bg-red-500"></div>

                        <div className="absolute left-[12.5%] top-[-24px] text-xs font-medium">2.0</div>
                        <div className="absolute left-[46.9%] top-[-24px] text-xs font-medium">7.5</div>
                        <div className="absolute left-[51.3%] top-[-24px] text-xs font-medium">{footprint}</div>
                        <div className="absolute right-0 top-[-24px] text-xs font-medium">16.0</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" onClick={handleGetActionPlan}>
                    Get Detailed Action Plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share Results
                  </Button>
                </div>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Return to Home
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}

