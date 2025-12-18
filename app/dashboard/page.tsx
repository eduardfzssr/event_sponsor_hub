"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Plus, Edit, Star, TrendingUp, Calendar, ArrowRight, Loader2, Search, Bookmark, CheckCircle, XCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser, signOut } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"

interface Review {
  id: string
  eventName: string
  date: string | null
  rating: number
  status: "draft" | "published" | "pending" | "rejected"
  roi: number | null
  event_id: string
  created_at: string
}

interface Event {
  id: string
  name: string
  slug: string
  category: string | null
  start_date: string | null
  location: string | null
  city: string | null
  country: string | null
  status: string
}

interface EventToRate {
  id: string
  name: string
  slug: string
  category: string | null
  start_date: string | null
  location: string | null
  city: string | null
  country: string | null
  user_status: 'want_to_go' | 'went'
}

type EventStatus = 'want_to_go' | 'going' | 'went' | 'rated' | 'not_interested' | null

export default function DashboardPage() {
  const router = useRouter()
  const [showNewReview, setShowNewReview] = useState(false)
  const [user, setUser] = useState<{ fullName: string | null; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    reviewsWritten: 0,
    averageRating: 0,
    totalEventsSponsored: 0,
  })
  const [dataLoading, setDataLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Event[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [eventStatuses, setEventStatuses] = useState<Record<string, EventStatus>>({})
  const [showEventSearch, setShowEventSearch] = useState(false)
  const [eventsToRate, setEventsToRate] = useState<EventToRate[]>([])

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/signin")
        return
      }
      setUser({
        fullName: currentUser.fullName,
        email: currentUser.email,
      })
      setLoading(false)

      // Fetch user data from database
      await fetchDashboardData(currentUser.userId)
    }
    checkAuth()
  }, [router])

  async function fetchDashboardData(userId: string) {
    try {
      const supabase = createClient()

      // Fetch user's reviews with event information
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          event_id,
          rating,
          status,
          roi,
          created_at,
          events (
            id,
            name,
            start_date
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError)
      } else {
        const formattedReviews: Review[] = (reviews || []).map((review: any) => ({
          id: review.id,
          eventName: review.events?.name || 'Unknown Event',
          date: review.events?.start_date || review.created_at,
          rating: review.rating,
          status: review.status,
          roi: review.roi,
          event_id: review.event_id,
          created_at: review.created_at,
        }))
        setUserReviews(formattedReviews)

        // Calculate stats
        const reviewsWritten = formattedReviews.length
        const averageRating = formattedReviews.length > 0
          ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length
          : 0
        const totalEventsSponsored = new Set(formattedReviews.map(r => r.event_id)).size

        setStats({
          reviewsWritten,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          totalEventsSponsored,
        })
      }

      // Fetch user's event statuses
      const { data: statuses, error: statusesError } = await supabase
        .from('user_event_statuses')
        .select('event_id, status')
        .eq('user_id', userId)

      if (!statusesError && statuses) {
        const statusMap: Record<string, EventStatus> = {}
        statuses.forEach((s: any) => {
          statusMap[s.event_id] = s.status as EventStatus
        })
        setEventStatuses(statusMap)
      }

      // Fetch events that need to be rated (want_to_go or went, but no review)
      await fetchEventsToRate(userId)

      setDataLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setDataLoading(false)
    }
  }

  async function fetchEventsToRate(userId: string) {
    try {
      const supabase = createClient()

      // Get event IDs that user has status 'want_to_go' or 'went' for
      const { data: statuses, error: statusesError } = await supabase
        .from('user_event_statuses')
        .select('event_id, status')
        .eq('user_id', userId)
        .in('status', ['want_to_go', 'went'])

      if (statusesError || !statuses || statuses.length === 0) {
        setEventsToRate([])
        return
      }

      // Get event IDs that user has already reviewed
      const { data: reviewedEvents, error: reviewsError } = await supabase
        .from('reviews')
        .select('event_id')
        .eq('user_id', userId)

      if (reviewsError) {
        console.error('Error fetching reviewed events:', reviewsError)
        setEventsToRate([])
        return
      }

      const reviewedEventIds = new Set((reviewedEvents || []).map((r: any) => r.event_id))

      // Filter to only events that haven't been reviewed
      const eventsToRateIds = statuses
        .filter((s: any) => !reviewedEventIds.has(s.event_id))
        .map((s: any) => s.event_id)

      if (eventsToRateIds.length === 0) {
        setEventsToRate([])
        return
      }

      // Fetch event details
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, name, slug, category, start_date, location, city, country')
        .in('id', eventsToRateIds)

      if (eventsError) {
        console.error('Error fetching events to rate:', eventsError)
        setEventsToRate([])
        return
      }

      // Map events with their status
      const statusMap = new Map(statuses.map((s: any) => [s.event_id, s.status]))
      const eventsWithStatus: EventToRate[] = (events || []).map((event: any) => ({
        ...event,
        user_status: statusMap.get(event.id) as 'want_to_go' | 'went'
      }))

      setEventsToRate(eventsWithStatus)
    } catch (error) {
      console.error('Error fetching events to rate:', error)
      setEventsToRate([])
    }
  }

  async function searchEvents(query: string) {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('id, name, slug, category, start_date, location, city, country, status')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%,city.ilike.%${query}%,country.ilike.%${query}%`)
        .order('start_date', { ascending: true })
        .limit(20)

      if (error) {
        console.error('Error searching events:', error)
        setSearchResults([])
      } else {
        setSearchResults(data || [])
      }
    } catch (error) {
      console.error('Error searching events:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  async function updateEventStatus(eventId: string, status: EventStatus) {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      const supabase = createClient()

      if (status === null) {
        // Remove status
        const { error } = await supabase
          .from('user_event_statuses')
          .delete()
          .eq('user_id', currentUser.userId)
          .eq('event_id', eventId)

        if (!error) {
          setEventStatuses(prev => {
            const newStatuses = { ...prev }
            delete newStatuses[eventId]
            return newStatuses
          })
          // Refresh events to rate list
          await fetchEventsToRate(currentUser.userId)
        }
      } else {
        // Upsert status
        const { error } = await supabase
          .from('user_event_statuses')
          .upsert({
            user_id: currentUser.userId,
            event_id: eventId,
            status: status,
          }, {
            onConflict: 'user_id,event_id'
          })

        if (!error) {
          setEventStatuses(prev => ({
            ...prev,
            [eventId]: status
          }))
          // Refresh events to rate list
          await fetchEventsToRate(currentUser.userId)
        }
      }
    } catch (error) {
      console.error('Error updating event status:', error)
    }
  }

  useEffect(() => {
    if (!showEventSearch) return

    const debounceTimer = setTimeout(() => {
      searchEvents(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, showEventSearch])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

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
            <Button variant="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome Back, {user?.fullName || user?.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-lg text-muted-foreground">Track your event sponsorships and share your experiences</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowEventSearch(!showEventSearch)} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Search Section */}
      {showEventSearch && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-border">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search events by name, location, city, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            {searchLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            {!searchLoading && searchResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((event) => {
                  const currentStatus = eventStatuses[event.id] || null
                  return (
                    <div
                      key={event.id}
                      className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/50 transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            className="font-semibold text-foreground hover:text-primary transition"
                          >
                            {event.name}
                          </Link>
                          {event.category && (
                            <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                              {event.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.location}
                            </span>
                          )}
                          {event.start_date && (
                            <span>
                              {new Date(event.start_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 border border-border rounded-lg p-1 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEventStatus(event.id, 'want_to_go')}
                            className={`h-8 px-3 ${currentStatus === 'want_to_go' ? 'bg-primary/10 text-primary' : ''}`}
                          >
                            <Heart className="w-4 h-4 mr-1.5" />
                            <span className="text-xs">Want to go</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEventStatus(event.id, 'going')}
                            className={`h-8 px-3 ${currentStatus === 'going' ? 'bg-primary/10 text-primary' : ''}`}
                          >
                            <Bookmark className="w-4 h-4 mr-1.5" />
                            <span className="text-xs">Going</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEventStatus(event.id, 'went')}
                            className={`h-8 px-3 ${currentStatus === 'went' ? 'bg-primary/10 text-primary' : ''}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            <span className="text-xs">Went</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEventStatus(event.id, 'rated')}
                            className={`h-8 px-3 ${currentStatus === 'rated' ? 'bg-primary/10 text-primary' : ''}`}
                          >
                            <Star className="w-4 h-4 mr-1.5" />
                            <span className="text-xs">Rated</span>
                          </Button>
                          {currentStatus && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateEventStatus(event.id, null)}
                              className="h-8 px-3 text-muted-foreground hover:text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              <span className="text-xs">Remove</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No events found matching your search
              </div>
            )}
          </div>
        </div>
      )}

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
                  <p className="text-3xl font-bold text-primary">{stats.reviewsWritten}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-primary flex items-center gap-1">
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                    <Star className="w-6 h-6 fill-current" />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Events Sponsored</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalEventsSponsored}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Events to Rate Section */}
            {eventsToRate.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Events Waiting for Your Review
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {eventsToRate.length} {eventsToRate.length === 1 ? 'event' : 'events'}
                  </span>
                </div>
                <div className="space-y-3">
                  {eventsToRate.map((event) => (
                    <div
                      key={event.id}
                      className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            className="font-semibold text-foreground hover:text-primary transition"
                          >
                            {event.name}
                          </Link>
                          {event.category && (
                            <span className="text-xs px-2 py-1 bg-background rounded text-muted-foreground">
                              {event.category}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${event.user_status === 'want_to_go'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {event.user_status === 'want_to_go' ? 'Want to go' : 'Went'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.location}
                            </span>
                          )}
                          {event.start_date && (
                            <span>
                              {new Date(event.start_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push(`/events/${event.id}/rate`)}
                        className="ml-4"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate Event
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border">
              <h2>Your Past Events</h2>
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
                          className={`px-2 py-1 rounded text-xs font-medium ${review.status === "published"
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
                        {review.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {review.rating}/5
                        </span>
                        {review.roi && (
                          <span className="flex items-center gap-1 text-primary">
                            <TrendingUp className="w-4 h-4" />
                            ROI: {review.roi}x
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      <span className="text-xs">Edit</span>
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
