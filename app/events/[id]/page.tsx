"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, MapPin, Users, TrendingUp, MessageSquare, ThumbsUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  author: string
  company: string
  role: string
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  verified: boolean
  roi: number
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [sortBy, setSortBy] = useState<"helpful" | "recent">("helpful")

  // Mock event data
  const event = {
    id: params.id,
    name: "Web Summit 2024",
    date: "Nov 4-6, 2024",
    location: "Lisbon, Portugal",
    category: "Tech Conference",
    reviews: 145,
    rating: 4.7,
    sponsorCount: 89,
    avgROI: 3.2,
    description: "The world's largest web conference bringing together the best of web and tech innovation.",
    attendees: 45000,
    sponsors: 89,
    appUsageRate: 78,
  }

  const reviews: Review[] = [
    {
      id: "1",
      author: "Sarah Chen",
      company: "TechFlow Inc",
      role: "Marketing Director",
      rating: 5,
      title: "Excellent ROI and great attendee engagement",
      content:
        "Web Summit exceeded our expectations. The attendees were highly engaged, 78% used the event app, and we generated 23 qualified leads. The networking opportunities were outstanding and our booth attracted consistent traffic throughout the event.",
      date: "2024-11-08",
      helpful: 124,
      verified: true,
      roi: 3.8,
    },
    {
      id: "2",
      author: "Marcus Johnson",
      company: "CloudScale Solutions",
      role: "VP Business Development",
      rating: 4,
      title: "Good opportunity but expensive sponsorship tier",
      content:
        "Great event with quality attendees. However, the sponsorship packages are premium-priced. We saw solid ROI of 2.9x but had to commit significant budget. The organization was excellent and all logistics ran smoothly.",
      date: "2024-11-07",
      helpful: 98,
      verified: true,
      roi: 2.9,
    },
    {
      id: "3",
      author: "Elena Rodriguez",
      company: "StartupHub Europe",
      role: "Partnerships Manager",
      rating: 5,
      title: "First-time sponsor experience was perfect",
      content:
        "As a first-time sponsor, we were impressed by the organization and support from the event team. The attendee quality was exceptional, and we established partnerships with 3 major clients during the conference. Highly recommend for B2B companies.",
      date: "2024-11-06",
      helpful: 145,
      verified: true,
      roi: 4.2,
    },
  ]

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/events"
            className="text-primary hover:text-primary/80 text-sm font-medium mb-6 inline-flex items-center gap-1"
          >
            ← Back to Events
          </Link>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{event.category}</p>
              <h1 className="text-4xl font-bold text-foreground">{event.name}</h1>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {event.attendees.toLocaleString()} attendees
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1 mb-1">
                  {event.rating}
                  <Star className="w-5 h-5 fill-current" />
                </p>
                <p className="text-xs text-muted-foreground">{event.reviews} Reviews</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary mb-1">{event.avgROI}x</p>
                <p className="text-xs text-muted-foreground">Average ROI</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary mb-1">{event.appUsageRate}%</p>
                <p className="text-xs text-muted-foreground">App Usage</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Sponsor Reviews
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "helpful" | "recent")}
                  className="px-3 py-2 rounded-lg border border-border text-sm font-medium"
                >
                  <option value="helpful">Most Helpful</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>

              {sortedReviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-lg p-6 space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-foreground">{review.author}</p>
                        {review.verified && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.role} at {review.company}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Title & Content */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{review.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                  </div>

                  {/* ROI Info */}
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      ROI: <span className="text-primary">{review.roi}x</span>
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Summary Card */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-20">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Sponsors</p>
                  <p className="text-2xl font-bold text-foreground">{event.sponsors}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">App Usage</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-primary">{event.appUsageRate}%</p>
                    <p className="text-sm text-muted-foreground">of attendees</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">Leave a Review</Button>

              {/* Additional Info */}
              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Next Year</p>
                  <p className="text-muted-foreground">Web Summit 2025 - Expected Nov 2025</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Sponsorship Tiers</p>
                  <p className="text-muted-foreground">Platinum, Gold, Silver, Bronze</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
