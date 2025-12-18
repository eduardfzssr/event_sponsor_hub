"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star, MapPin, Users, TrendingUp, Search, ArrowRight, Loader2, Heart, Bookmark, CheckCircle, XCircle, BarChart3, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getCurrentUser, signOut } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"

interface Event {
  id: string
  name: string
  slug: string
  category: string | null
  start_date: string | null
  location: string | null
  city: string | null
  country: string | null
  reviews: number
  rating: number | null
  avgROI: number | null
}

type EventStatus = 'want_to_go' | 'going' | 'went' | 'rated' | 'not_interested' | null

type ViewMode = 'my-events' | 'explore'

export default function EventsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>(["all"])
  const [loading, setLoading] = useState(true)
  const [eventStatuses, setEventStatuses] = useState<Record<string, EventStatus>>({})
  const [user, setUser] = useState<{ userId: string; fullName: string | null; email: string } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('explore')

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser({ 
          userId: currentUser.userId,
          fullName: currentUser.fullName,
          email: currentUser.email
        })
        await fetchEventStatuses(currentUser.userId)
      }
      await fetchEvents()
    }
    loadData()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  async function fetchEvents() {
    try {
      const supabase = createClient()
      
      // Fetch events with review stats
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          name,
          slug,
          category,
          start_date,
          location,
          city,
          country
        `)
        .order('start_date', { ascending: true })

      if (eventsError) {
        console.error('Error fetching events:', eventsError)
        setLoading(false)
        return
      }

      // Fetch review stats for each event
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('event_id, rating, roi')
        .eq('status', 'published')

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError)
      }

      // Calculate stats for each event
      const eventsWithStats: Event[] = (eventsData || []).map(event => {
        const eventReviews = (reviewsData || []).filter(r => r.event_id === event.id)
        const reviews = eventReviews.length
        const rating = reviews > 0
          ? eventReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews
          : null
        const avgROI = reviews > 0
          ? eventReviews
              .filter(r => r.roi !== null)
              .reduce((sum, r) => sum + (r.roi || 0), 0) / eventReviews.filter(r => r.roi !== null).length
          : null

        return {
          ...event,
          reviews,
          rating: rating ? Math.round(rating * 10) / 10 : null,
          avgROI: avgROI ? Math.round(avgROI * 10) / 10 : null,
        }
      })

      setEvents(eventsWithStats)

      // Extract unique categories
      const uniqueCategories = ["all", ...new Set(eventsWithStats.map(e => e.category).filter(Boolean) as string[])]
      setCategories(uniqueCategories)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching events:', error)
      setLoading(false)
    }
  }

  async function fetchEventStatuses(userId: string) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_event_statuses')
        .select('event_id, status')
        .eq('user_id', userId)

      if (!error && data) {
        const statusMap: Record<string, EventStatus> = {}
        data.forEach((s: any) => {
          statusMap[s.event_id] = s.status as EventStatus
        })
        setEventStatuses(statusMap)
      }
    } catch (error) {
      console.error('Error fetching event statuses:', error)
    }
  }

  async function updateEventStatus(eventId: string, status: EventStatus) {
    if (!user) {
      router.push('/signin')
      return
    }

    try {
      const supabase = createClient()

      if (status === null) {
        const { error } = await supabase
          .from('user_event_statuses')
          .delete()
          .eq('user_id', user.userId)
          .eq('event_id', eventId)

        if (!error) {
          setEventStatuses(prev => {
            const newStatuses = { ...prev }
            delete newStatuses[eventId]
            return newStatuses
          })
        }
      } else {
        const { error } = await supabase
          .from('user_event_statuses')
          .upsert({
            user_id: user.userId,
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
          // If user removes status and is in "my-events" view, switch to explore
          if (status === null && viewMode === 'my-events') {
            setViewMode('explore')
          }
        }
      }
    } catch (error) {
      console.error('Error updating event status:', error)
    }
  }

  const filteredEvents = events.filter((event) => {
    // Filter by view mode
    if (viewMode === 'my-events' && user) {
      const eventStatus = eventStatuses[event.id]
      // Only show events with statuses: want_to_go, going, went, rated (not not_interested or null)
      if (!eventStatus || eventStatus === 'not_interested') {
        return false
      }
    }
    
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(search.toLowerCase())) ||
      (event.city && event.city.toLowerCase().includes(search.toLowerCase())) ||
      (event.country && event.country.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = category === "all" || event.category === category
    return matchesSearch && matchesCategory
  })

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
            {user && (
              <span className="text-sm text-muted-foreground">
                {user.fullName || user.email?.split("@")[0] || "User"}
              </span>
            )}
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {user ? (
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button asChild variant="secondary">
                <Link href="/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {viewMode === 'my-events' ? 'My Events' : 'Explore Events'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {viewMode === 'my-events' 
              ? 'Events you\'ve saved or are interested in'
              : 'Discover events reviewed by sponsors like you'}
          </p>
        </div>
      </div>

      {/* View Mode Tabs */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setViewMode('my-events')}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                viewMode === 'my-events'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                My Events
              </div>
            </button>
            <button
              onClick={() => setViewMode('explore')}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                viewMode === 'explore'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Explore
              </div>
            </button>
          </div>
        </div>
      )}

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => {
                const currentStatus = eventStatuses[event.id] || null
                const location = event.location || `${event.city || ''}${event.city && event.country ? ', ' : ''}${event.country || ''}`.trim() || 'Location TBD'
                const dateStr = event.start_date
                  ? new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Date TBD'

                return (
                  <div
                    key={event.id}
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
                        {event.category && (
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{event.category}</p>
                        )}
                        <Link
                          href={`/events/${event.slug || event.id}`}
                          className="text-lg font-bold text-foreground group-hover:text-primary transition block"
                        >
                          {event.name}
                        </Link>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {location}
                        </p>
                        <p className="text-sm text-muted-foreground">{dateStr}</p>
                      </div>

                      {/* Rating & Stats */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                        <div>
                          <p className="text-2xl font-bold text-primary flex items-center gap-1">
                            {event.rating ? event.rating.toFixed(1) : 'N/A'}
                            {event.rating && <Star className="w-5 h-5 fill-current" />}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.reviews} {event.reviews === 1 ? 'review' : 'reviews'}</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{event.avgROI ? `${event.avgROI.toFixed(1)}x` : 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">Avg ROI</p>
                        </div>
                      </div>

                      {/* Status Actions */}
                      {user && (
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <div className="flex items-center gap-1 flex-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                updateEventStatus(event.id, 'want_to_go')
                              }}
                              className={`h-8 px-2 ${currentStatus === 'want_to_go' ? 'bg-primary/10 text-primary' : ''}`}
                              title="Want to go"
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                updateEventStatus(event.id, 'going')
                              }}
                              className={`h-8 px-2 ${currentStatus === 'going' ? 'bg-primary/10 text-primary' : ''}`}
                              title="Going"
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                updateEventStatus(event.id, 'went')
                              }}
                              className={`h-8 px-2 ${currentStatus === 'went' ? 'bg-primary/10 text-primary' : ''}`}
                              title="Went"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                updateEventStatus(event.id, 'rated')
                              }}
                              className={`h-8 px-2 ${currentStatus === 'rated' ? 'bg-primary/10 text-primary' : ''}`}
                              title="Rated"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                            {currentStatus && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault()
                                  updateEventStatus(event.id, null)
                                }}
                                className="h-8 px-2 text-muted-foreground hover:text-destructive"
                                title="Remove status"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <Link
                            href={`/events/${event.slug || event.id}`}
                            className="text-primary hover:text-primary/80 transition"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}

                      {/* Footer for non-authenticated users */}
                      {!user && (
                        <div className="flex items-center justify-end text-sm pt-2 border-t border-border">
                          <Link
                            href={`/events/${event.slug || event.id}`}
                            className="text-primary hover:text-primary/80 transition flex items-center gap-1"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {viewMode === 'my-events' 
                    ? 'No saved events yet. Start exploring and save events you\'re interested in!'
                    : 'No events found matching your criteria'}
                </p>
                {viewMode === 'my-events' && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setViewMode('explore')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Explore Events
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
