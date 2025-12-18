"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, Plus, Edit, Star, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  eventName: string
  date: string
  rating: number
  status: "draft" | "published" | "pending"
  roi: number
}

export default function DashboardPage() {
  const [showNewReview, setShowNewReview] = useState(false)

  const userReviews: Review[] = [
    {
      id: "1",
      eventName: "Web Summit 2024",
      date: "2024-11-08",
      rating: 5,
      status: "published",
      roi: 3.8,
    },
    {
      id: "2",
      eventName: "SaaS Fest Europe",
      date: "2024-10-18",
      rating: 4,
      status: "published",
      roi: 2.5,
    },
    {
      id: "3",
      eventName: "Dreamforce 2024",
      date: "2024-09-15",
      rating: 5,
      status: "draft",
      roi: 4.1,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">EventSponsorHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Sign Out</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back, Sarah</h1>
              <p className="text-lg text-muted-foreground">Track your event sponsorships and share your experiences</p>
            </div>
            <Button onClick={() => setShowNewReview(!showNewReview)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Your Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reviews Written</p>
                  <p className="text-3xl font-bold text-primary">3</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-primary flex items-center gap-1">
                    4.7
                    <Star className="w-6 h-6 fill-current" />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Events Sponsored</p>
                  <p className="text-3xl font-bold text-primary">12</p>
                </div>
              </div>
            </div>

            {/* Featured Event */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Featured Event</h3>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Dreamforce 2025</p>
                <p className="text-sm text-muted-foreground">Call for Sponsors Opening Soon</p>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border">
              {["All", "Published", "Draft", "Pending"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                    tab === "All"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {userReviews.length > 0 ? (
                userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card border border-border rounded-lg p-6 flex items-start justify-between"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{review.eventName}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            review.status === "published"
                              ? "bg-green-100 text-green-700"
                              : review.status === "draft"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {review.rating}/5
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <TrendingUp className="w-4 h-4" />
                          ROI: {review.roi}x
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-4">You haven't written any reviews yet</p>
                  <Button onClick={() => setShowNewReview(true)}>
                    Write Your First Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Review Modal */}
      {showNewReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-8 max-w-lg w-full space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Write a Review</h2>
            <p className="text-muted-foreground text-sm">
              Share your sponsorship experience to help other companies make better decisions
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Event</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm">
                  <option>-- Choose an event --</option>
                  <option>Web Summit 2024</option>
                  <option>SaaS Fest Europe</option>
                  <option>Dreamforce 2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" className="text-2xl hover:text-yellow-400">
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Summarize your experience..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
                <textarea
                  rows={4}
                  placeholder="Tell other sponsors what you experienced..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowNewReview(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">Submit Review</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
