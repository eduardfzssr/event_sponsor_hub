"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Star,
  MapPin,
  Calendar,
  Search,
  TrendingUp,
  Users,
  Badge,
  Info,
  Handshake,
  Mail,
  ExternalLink,
  ChevronRight,
  Lock,
  Phone,
  BarChart3,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser, signOut } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"
import type { Event, Review as ReviewType } from "@/lib/database/types"

interface Review {
  id: string
  company: string
  companyLogo?: string
  tier: string
  rating: number
  date: string
  content: string
  leadsGenerated?: string
  leadsChange?: string
  brandVisibility?: string
  boothLocation?: string
  nps?: string
  verified: boolean
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: eventId } = use(params)
  const [selectedYear, setSelectedYear] = useState("2025")
  const [activeTab, setActiveTab] = useState("Sponsor Feedback")
  const [sortBy, setSortBy] = useState("Most Relevant")
  const [user, setUser] = useState<{ userId: string; fullName: string | null; email: string } | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [userReview, setUserReview] = useState<ReviewType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initialize() {
      try {
        const supabase = createClient()
        
        // Check authentication
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser({
            userId: currentUser.userId,
            fullName: currentUser.fullName,
            email: currentUser.email,
          })

          // Fetch user's review for this event
          const { data: reviewData, error: reviewError } = await supabase
            .from('reviews')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', currentUser.userId)
            .maybeSingle()

          if (!reviewError && reviewData) {
            setUserReview(reviewData)
          }
        }

        // Fetch event data
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (eventError) {
          console.error('Error fetching event:', eventError)
          setError('Event not found')
        } else {
          setEvent(eventData)
        }
      } catch (err) {
        console.error('Error initializing:', err)
        setError('An error occurred while loading the page')
      } finally {
        setLoading(false)
      }
    }
    initialize()
  }, [eventId])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  // Format event data for display
  const eventDisplay = event ? {
    id: event.id,
    name: event.name,
    location: event.location || `${event.city || ''}${event.city && event.country ? ', ' : ''}${event.country || ''}`.trim() || 'Location TBD',
    date: event.start_date && event.end_date
      ? `${new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : event.start_date
      ? new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Date TBD',
    status: event.status === 'upcoming' ? 'Upcoming' : event.status === 'past' ? 'Past Event' : 'Cancelled',
    bannerImage: event.thumbnail_url || "https://via.placeholder.com/1200x400",
    venue: {
      name: event.venue || 'Venue TBD',
      address: event.location || 'Address TBD',
      mapImage: "https://via.placeholder.com/400x200",
    },
    organizer: {
      name: event.organizer_name || 'Organizer',
      role: event.organizer_website ? `Event Organizer` : 'Event Organizer',
      avatar: "https://via.placeholder.com/56",
    },
  } : null

  const historicalData = {
    "2025": {
      avgROI: 4.2,
      roiChange: 18,
      totalAttendees: 6250,
      attendeesChange: 12,
      cLevelPresence: 45,
      cLevelChange: 5,
      reviews: 145,
      rating: 4.9,
      appAdoption: 88,
      appChange: 3,
    },
  }

  const reviews: Review[] = [
    {
      id: "1",
      company: "CloudScale Systems",
      companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaJKA2Fvsdsy5JDu8M5yg1krrmr67PcZeyKpLZ8r9IXqPDVE0xZOpOqDKDOaz0n-CiKdEcNjbjBhRurWV60k79E3CkxWDPhQ5lwQpBpGx8fjTKtRh4ck5QDPL4tzQz5eMFNqQOl5VU0Y31DVfaXVcCgJQF-q2EGtmcAi7fU1g9aA4P-NmV_Lokpgi457osibB31yWnxGoHCzx6QXKJAoiAdhc_xNmyDYU85V-Hj0VjOYztk5CRZImOonwi0H3GF6A3zUutbPXgRcI",
      tier: "Platinum Tier",
      rating: 5,
      date: "October 15, 2025",
      content:
        "This was our third year sponsoring, and easily the best. The new matchmaking AI in the app drove incredibly relevant traffic to our booth. We saw a 30% increase in qualified leads compared to 2024. The organization team has really stepped up their game.",
      leadsGenerated: "520+",
      leadsChange: "▲ 30%",
      brandVisibility: "Outstanding",
      boothLocation: "Hall B, Center",
      verified: true,
    },
    {
      id: "2",
      company: "DevOps Inc.",
      companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPLQOd45GxQsCz9JCL_Ua5ud0XKQLiHaZaua3KKm9lzi2hOHABK-UCArqvUsCHwVNFv-BgmqZPfhBl5_lCpr_9TS_L9LVqGkCfjZVuu3rjn_BlabiEkvOa5rN1WH3vrQw0Ay14dXXHzv8EEDf6tet4oCDUTIiZMM1CtPliu_JYZW_q7mrRne0VJjNLXjCMXIDZZGiv7yZacePsZVDnLyfTF43yfavuycOMBlZ3bOxxk2Lmaa0UPJodzuGl0cgQR29bn26ZPky4Kjw",
      tier: "Gold Tier",
      rating: 4.5,
      date: "October 14, 2025",
      content:
        "Solid event as always. The attendee quality remains high. We noticed a slight dip in foot traffic during the keynotes compared to last year, but the dedicated networking hours were very productive.",
      leadsGenerated: "185+",
      nps: "9/10",
      verified: true,
    },
  ]

  const ratingDistribution = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 0 },
  ]

  const packages = [
    { name: "Diamond Tier", status: "Sold Out", available: false, color: "yellow" },
    { name: "Platinum Tier", status: "1 Spot Left", available: true, color: "gray" },
    { name: "Gold Tier", status: "Available", available: true, color: "orange" },
  ]

  const currentData = historicalData[selectedYear as keyof typeof historicalData]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !event || !eventDisplay) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Event Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "The event you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
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
              <Link href="/events">Explore Events</Link>
            </Button>
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

      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="w-full">
          <div className="p-4 lg:p-8 lg:px-40">
            <div
              className="flex min-h-[320px] lg:min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-4 pb-10 lg:px-10 shadow-lg relative overflow-hidden group"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%), url("${eventDisplay.bannerImage}")`,
              }}
            >
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{eventDisplay.status}</span>
              </div>
              <div className="flex flex-col gap-2 text-left relative z-10">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] lg:text-5xl drop-shadow-md">
                    {eventDisplay.name}
                  </h1>
                  {userReview && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-white">You rated {userReview.rating}/5</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 items-center text-white/90">
                  <div className="flex items-center gap-1">
                    <MapPin className="text-[20px]" />
                    <span className="text-sm lg:text-base font-medium">{eventDisplay.location}</span>
                  </div>
                  <div className="hidden h-1 w-1 rounded-full bg-white lg:block"></div>
                  <div className="flex items-center gap-1">
                    <Calendar className="text-[20px]" />
                    <span className="text-sm lg:text-base font-medium">{eventDisplay.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button className="flex min-w-[84px] h-12 px-6 bg-primary text-primary-foreground text-base font-bold shadow-lg shadow-primary/20">
                  <span className="truncate">Download 2026 Sponsor Kit</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex min-w-[84px] h-12 px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-bold hover:bg-white/20"
                >
                  <span className="truncate">View Floor Plan</span>
                </Button>
                {user && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex min-w-[84px] h-12 px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-bold hover:bg-white/20"
                  >
                    <Link href={`/events/${eventId}/rate`}>
                      <span className="truncate">{userReview ? "Edit Review" : "Write a Review"}</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="px-4 lg:px-40 pb-20">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
            {/* Historical Performance Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-border">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-foreground">Historical Performance</h3>
                <div className="flex items-center bg-card rounded-lg p-1 border border-border shadow-sm">
                  {["2022", "2023", "2024", "2025"].map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedYear === year
                        ? "text-primary-foreground bg-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="text-[18px]" />
                <span>
                  Viewing data for <span className="font-bold text-foreground">{selectedYear} Edition</span>
                </span>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 rounded-xl bg-card p-6 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <TrendingUp className="text-6xl text-primary" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Avg ROI Multiplier</p>
                </div>
                <div className="flex items-end gap-2 relative z-10">
                  <p className="text-foreground tracking-light text-3xl font-bold leading-tight">
                    {currentData?.avgROI}x
                  </p>
                  <div className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs font-bold mb-1">
                    <TrendingUp className="text-[14px] mr-0.5" />
                    {currentData?.roiChange}% vs 2024
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on 62 post-event sponsor reports</p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-card p-6 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Users className="text-6xl text-primary" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Attendees</p>
                </div>
                <div className="flex items-end gap-2 relative z-10">
                  <p className="text-foreground tracking-light text-3xl font-bold leading-tight">
                    {currentData?.totalAttendees.toLocaleString()}
                  </p>
                  <div className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs font-bold mb-1">
                    <TrendingUp className="text-[14px] mr-0.5" />
                    {currentData?.attendeesChange}% vs 2024
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Verified ticket scans at entry</p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-card p-6 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Badge className="text-6xl text-primary" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">C-Level Presence</p>
                </div>
                <div className="flex items-end gap-2 relative z-10">
                  <p className="text-foreground tracking-light text-3xl font-bold leading-tight">
                    {currentData?.cLevelPresence}%
                  </p>
                  <div className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs font-bold mb-1">
                    <TrendingUp className="text-[14px] mr-0.5" />
                    {currentData?.cLevelChange}% vs 2024
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Decision makers (Director+)</p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="sticky top-[73px] z-40 bg-background pt-2">
              <div className="border-b border-border">
                <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto no-scrollbar">
                  {["Overview", "Agenda", "Sponsor Feedback", "Demographics"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`group flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 hover:border-muted min-w-fit transition-colors ${activeTab === tab
                        ? "border-b-primary"
                        : "border-b-transparent"
                        }`}
                    >
                      <p
                        className={`text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${activeTab === tab
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                          }`}
                      >
                        {tab}
                      </p>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Sponsor Satisfaction Card */}
                <div className="rounded-xl bg-card border border-border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">2025 Sponsor Satisfaction</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-primary text-xs font-bold px-2 py-1 rounded border border-blue-100 dark:border-blue-900/50">
                      Top 5% Rated Event
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-2">
                      <p className="text-foreground text-5xl font-black leading-tight tracking-[-0.033em]">
                        {currentData?.rating}
                      </p>
                      <div className="flex gap-0.5 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm font-normal leading-normal">
                        Based on {currentData?.reviews} verified reviews
                      </p>
                    </div>
                    <div className="grid min-w-[200px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
                      {ratingDistribution.map((dist) => (
                        <>
                          <p key={`label-${dist.stars}`} className="text-foreground text-sm font-medium">
                            {dist.stars}
                          </p>
                          <div
                            key={`bar-${dist.stars}`}
                            className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted"
                          >
                            <div
                              className="rounded-full bg-primary"
                              style={{ width: `${dist.percentage}%` }}
                            ></div>
                          </div>
                          <p key={`percent-${dist.stars}`} className="text-muted-foreground text-sm font-medium text-right">
                            {dist.percentage}%
                          </p>
                        </>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Phone className="text-primary" /> App Adoption
                      </h4>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                        +{currentData?.appChange}% vs '24
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative size-24 shrink-0 rounded-full border-[6px] border-primary border-r-transparent border-t-primary flex items-center justify-center">
                        <span className="text-xl font-bold text-foreground">{currentData?.appAdoption}%</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Active Users</p>
                        <p className="text-sm text-muted-foreground">
                          Consistent growth in attendee app usage year over year.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Handshake className="text-primary" /> Lead Quality
                      </h4>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                        Consistent
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Decision Makers</span>
                        <span className="font-bold text-foreground">High</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[88%] rounded-full bg-primary"></div>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Technical Leads</span>
                        <span className="font-bold text-foreground">Very High</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[95%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Reviews Section */}
                <div>
                  <div className="flex items-center justify-between mt-4 mb-4">
                    <h3 className="text-xl font-bold text-foreground">Detailed Reviews (2025)</h3>
                    <div className="flex items-center gap-4">
                      {user && (
                        <>
                          {userReview && (
                            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span className="text-sm font-semibold">You rated {userReview.rating}/5</span>
                            </div>
                          )}
                          <Button asChild variant="default" size="sm">
                            <Link href={`/events/${eventId}/rate`}>
                              {userReview ? "Edit Review" : "Write a Review"}
                            </Link>
                          </Button>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="bg-transparent border-none text-sm font-bold text-foreground focus:ring-0 cursor-pointer"
                        >
                          <option>Most Relevant</option>
                          <option>Highest Rated</option>
                          <option>Lowest Rated</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl bg-card border border-border p-6 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="size-12 rounded-lg bg-white border border-border flex items-center justify-center p-1 bg-contain bg-no-repeat bg-center"
                              style={{
                                backgroundImage: review.companyLogo
                                  ? `url('${review.companyLogo}')`
                                  : undefined,
                              }}
                            />
                            <div>
                              <h4 className="font-bold text-foreground text-lg">{review.company}</h4>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                                  <Star className="w-[14px] fill-primary" /> Verified Sponsor
                                </span>
                                <span className="text-muted-foreground">• {review.tier}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex text-primary gap-0.5">
                              {[...Array(5)].map((_, i) => {
                                if (i < Math.floor(review.rating)) {
                                  return <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                } else if (i === Math.floor(review.rating) && review.rating % 1 !== 0) {
                                  return (
                                    <div key={i} className="relative w-5 h-5">
                                      <Star className="w-5 h-5 text-muted absolute" />
                                      <Star
                                        className="w-5 h-5 fill-primary text-primary absolute"
                                        style={{ clipPath: "inset(0 50% 0 0)" }}
                                      />
                                    </div>
                                  )
                                } else {
                                  return <Star key={i} className="w-5 h-5 text-muted" />
                                }
                              })}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-foreground text-sm leading-relaxed mb-6">{review.content}</p>
                        <div className="flex flex-wrap gap-4 border-t border-border pt-4">
                          {review.leadsGenerated && (
                            <>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                  Leads Generated
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-foreground">{review.leadsGenerated}</span>
                                  {review.leadsChange && (
                                    <span className="text-green-600 text-[10px] font-bold bg-green-50 px-1 rounded">
                                      {review.leadsChange}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="w-px bg-border h-8 self-center"></div>
                            </>
                          )}
                          {review.brandVisibility && (
                            <>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                  Brand Visibility
                                </span>
                                <span className="font-bold text-foreground">{review.brandVisibility}</span>
                              </div>
                              <div className="w-px bg-border h-8 self-center"></div>
                            </>
                          )}
                          {review.boothLocation && (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                Booth Location
                              </span>
                              <span className="font-bold text-foreground">{review.boothLocation}</span>
                            </div>
                          )}
                          {review.nps && (
                            <>
                              {review.leadsGenerated && <div className="w-px bg-border h-8 self-center"></div>}
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                  Net Promoter Score
                                </span>
                                <span className="font-bold text-foreground">{review.nps}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="mt-4 w-full py-3 rounded-lg border border-border text-muted-foreground text-sm font-bold hover:bg-muted transition-colors"
                    >
                      Show 143 More Reviews from 2025
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1 flex flex-col gap-6 sticky top-[160px]">
                {/* Organized By Card */}
                <div className="rounded-xl bg-card border border-border shadow-sm p-6">
                  <h4 className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-4">
                    Organized By
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="size-14 rounded-full bg-cover bg-center border border-border"
                      style={{ backgroundImage: `url('${eventDisplay.organizer.avatar}')` }}
                    />
                    <div>
                      <p className="font-bold text-foreground">{eventDisplay.organizer.name}</p>
                      <p className="text-sm text-muted-foreground">{eventDisplay.organizer.role}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary text-primary px-4 py-2 text-sm font-bold hover:bg-primary/10 transition-colors"
                  >
                    <Mail className="text-[18px]" /> Contact Organizer
                  </Button>
                </div>

                {/* Location Card */}
                <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">
                  <div
                    className="h-32 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${eventDisplay.venue.mapImage}')` }}
                  />
                  <div className="p-6">
                    <h4 className="font-bold text-foreground mb-1">{eventDisplay.venue.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{eventDisplay.venue.address}</p>
                    <a
                      href="#"
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                    >
                      Get Directions <ExternalLink className="text-[16px]" />
                    </a>
                  </div>
                </div>

                {/* Available Packages Card */}
                <div className="rounded-xl bg-card border border-border shadow-sm p-6 relative">
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 rotate-12">
                    Selling Fast!
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-4">2026 Available Packages</h4>
                  <div className="flex flex-col gap-3">
                    {packages.map((pkg, idx) => (
                      <div
                        key={pkg.name}
                        className={`flex justify-between items-center p-3 rounded-lg border transition-colors cursor-pointer ${!pkg.available
                          ? "bg-muted/50 border-transparent opacity-75"
                          : idx === 1
                            ? "bg-card border-primary shadow-sm ring-1 ring-primary/20"
                            : "bg-card border-border shadow-sm"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-2 rounded-full ${pkg.color === "yellow"
                              ? "bg-yellow-500"
                              : pkg.color === "gray"
                                ? "bg-gray-400"
                                : "bg-orange-700"
                              }`}
                          />
                          <div>
                            <p className="text-sm font-bold text-foreground">{pkg.name}</p>
                            <p
                              className={`text-xs font-medium ${pkg.status === "Sold Out"
                                ? "text-red-500"
                                : pkg.status.includes("Spot Left")
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                                }`}
                            >
                              {pkg.status}
                            </p>
                          </div>
                        </div>
                        {!pkg.available ? (
                          <Lock className="text-muted-foreground text-[18px]" />
                        ) : (
                          <ChevronRight className="text-primary text-[18px]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
