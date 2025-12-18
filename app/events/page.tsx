"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, MapPin, Users, TrendingUp, Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Event {
  id: string
  name: string
  date: string
  category: string
  reviews: number
  rating: number
  sponsorCount: number
  avgROI: number
  location: string
  thumbnail?: string
}

export default function EventsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  // Mock events data
  const events: Event[] = [
    {
      id: "1",
      name: "Web Summit 2024",
      date: "Nov 4-6, 2024",
      category: "Tech Conference",
      reviews: 145,
      rating: 4.7,
      sponsorCount: 89,
      avgROI: 3.2,
      location: "Lisbon, Portugal",
    },
    {
      id: "2",
      name: "SaaS Fest Europe",
      date: "Oct 15-17, 2024",
      category: "B2B Conference",
      reviews: 92,
      rating: 4.5,
      sponsorCount: 56,
      avgROI: 2.8,
      location: "Berlin, Germany",
    },
    {
      id: "3",
      name: "Marketing Summit 2024",
      date: "Sep 20-22, 2024",
      category: "Marketing",
      reviews: 128,
      rating: 4.6,
      sponsorCount: 73,
      avgROI: 3.5,
      location: "New York, USA",
    },
    {
      id: "4",
      name: "Dreamforce 2024",
      date: "Sep 10-12, 2024",
      category: "Enterprise",
      reviews: 267,
      rating: 4.8,
      sponsorCount: 156,
      avgROI: 4.1,
      location: "San Francisco, USA",
    },
    {
      id: "5",
      name: "Collision 2024",
      date: "Jun 17-19, 2024",
      category: "Startup",
      reviews: 103,
      rating: 4.3,
      sponsorCount: 68,
      avgROI: 2.9,
      location: "Toronto, Canada",
    },
    {
      id: "6",
      name: "MoneyConf 2024",
      date: "May 22-24, 2024",
      category: "Fintech",
      reviews: 78,
      rating: 4.4,
      sponsorCount: 45,
      avgROI: 3.0,
      location: "Dublin, Ireland",
    },
  ]

  const categories = ["all", "Tech Conference", "B2B Conference", "Marketing", "Enterprise", "Startup", "Fintech"]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "all" || event.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Explore Events</h1>
          <p className="text-lg text-muted-foreground">Discover events reviewed by sponsors like you</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search events or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  category === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted text-foreground"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                {/* Event Header */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-32 relative overflow-hidden border-b border-border">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="absolute bottom-4 right-4 w-8 h-8 text-primary/50" />
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{event.category}</p>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                      {event.name}
                    </h3>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>

                  {/* Rating & Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    <div>
                      <p className="text-2xl font-bold text-primary flex items-center gap-1">
                        {event.rating}
                        <Star className="w-5 h-5 fill-current" />
                      </p>
                      <p className="text-xs text-muted-foreground">{event.reviews} reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{event.avgROI}x</p>
                      <p className="text-xs text-muted-foreground">Avg ROI</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.sponsorCount} sponsors
                    </p>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
