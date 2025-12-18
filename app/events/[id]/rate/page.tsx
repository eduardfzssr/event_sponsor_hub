"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Star,
  MapPin,
  Calendar,
  ArrowLeft,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCurrentUser, signOut } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"
import type { Event, ReviewInsert } from "@/lib/database/types"

export default function RateEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: eventId } = use(params)
  const [user, setUser] = useState<{ userId: string; email: string; fullName: string | null; companyId: string | null; subscriptionTier: string } | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [canSubmitReview, setCanSubmitReview] = useState(true)
  const [reviewLimitMessage, setReviewLimitMessage] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [sponsorshipTier, setSponsorshipTier] = useState<string>("")
  const [sponsorshipCost, setSponsorshipCost] = useState<string>("")
  const [roi, setRoi] = useState<string>("")
  const [leadsGenerated, setLeadsGenerated] = useState<string>("")
  const [dealsClosed, setDealsClosed] = useState<string>("")
  const [recommendation, setRecommendation] = useState<"recommended" | "neutral" | "avoid" | "">("")

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function initialize() {
      try {
        // Check authentication
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push(`/signin?redirect=/events/${eventId}/rate`)
          return
        }

        setUser({
          userId: currentUser.userId,
          email: currentUser.email,
          fullName: currentUser.fullName,
          companyId: currentUser.companyId,
          subscriptionTier: currentUser.subscriptionTier,
        })

        // Check review limit
        const supabase = createClient()
        const { data: limitData, error: limitError } = await supabase.rpc('check_review_limit', {
          user_uuid: currentUser.userId
        })

        if (limitError) {
          console.error('Error checking review limit:', limitError)
        } else if (limitData === false) {
          setCanSubmitReview(false)
          const tier = currentUser.subscriptionTier || 'free'
          if (tier === 'free') {
            setReviewLimitMessage("You've reached your monthly review limit (3 reviews/month). Upgrade to Pro for unlimited reviews.")
          } else {
            setReviewLimitMessage("Unable to submit review. Please contact support.")
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
  }, [eventId, router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!title.trim()) {
      errors.title = "Review title is required"
    }

    if (!content.trim()) {
      errors.content = "Review content is required"
    }

    if (rating < 1 || rating > 5) {
      errors.rating = "Please select a rating between 1 and 5 stars"
    }

    if (sponsorshipCost && (isNaN(Number(sponsorshipCost)) || Number(sponsorshipCost) < 0)) {
      errors.sponsorshipCost = "Sponsorship cost must be a positive number"
    }

    if (roi && (isNaN(Number(roi)) || Number(roi) < 0)) {
      errors.roi = "ROI must be a positive number"
    }

    if (leadsGenerated && (isNaN(Number(leadsGenerated)) || Number(leadsGenerated) < 0)) {
      errors.leadsGenerated = "Leads generated must be a positive number"
    }

    if (dealsClosed && (isNaN(Number(dealsClosed)) || Number(dealsClosed) < 0)) {
      errors.dealsClosed = "Deals closed must be a positive number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!user || !event || !canSubmitReview) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const reviewData: ReviewInsert = {
        event_id: event.id,
        user_id: user.userId,
        company_id: user.companyId,
        title: title.trim(),
        content: content.trim(),
        rating: rating,
        sponsorship_tier: sponsorshipTier || null,
        sponsorship_cost: sponsorshipCost ? parseInt(sponsorshipCost, 10) : null,
        roi: roi ? parseFloat(roi) : null,
        leads_generated: leadsGenerated ? parseInt(leadsGenerated, 10) : null,
        deals_closed: dealsClosed ? parseInt(dealsClosed, 10) : null,
        recommendation: recommendation || null,
        status: 'draft',
        is_verified: false,
        verification_method: null,
      }

      const { error: insertError } = await supabase
        .from('reviews')
        .insert(reviewData)

      if (insertError) {
        console.error('Error submitting review:', insertError)
        setError(insertError.message || 'Failed to submit review. Please try again.')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/events/${event.id}`)
      }, 2000)
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('An unexpected error occurred. Please try again.')
      setSubmitting(false)
    }
  }

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

  if (!event) {
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

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Review Submitted!</h1>
          <p className="text-muted-foreground mb-4">Your review has been saved as a draft. Redirecting to event page...</p>
          <Button asChild>
            <Link href={`/events/${event.id}`}>Go to Event</Link>
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
        <div className="px-4 lg:px-40 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/events" className="hover:text-foreground transition-colors">
                Events
              </Link>
              <span>/</span>
              <Link href={`/events/${event.id}`} className="hover:text-foreground transition-colors">
                {event.name}
              </Link>
              <span>/</span>
              <span className="text-foreground">Write Review</span>
            </div>

            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 -ml-2"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event
            </Button>

            {/* Event Info Card */}
            <div className="rounded-xl bg-card border border-border shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Write a Review</h1>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-foreground">{event.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Limit Warning */}
            {!canSubmitReview && reviewLimitMessage && (
              <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {reviewLimitMessage}
                    </p>
                    {user?.subscriptionTier === 'free' && (
                      <Button asChild variant="link" className="p-0 h-auto mt-2 text-yellow-700 dark:text-yellow-300">
                        <Link href="/dashboard">Upgrade to Pro</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <Label htmlFor="rating" className="text-base font-semibold mb-3 block">
                  Overall Rating <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating} {rating === 1 ? "star" : "stars"}
                    </span>
                  )}
                </div>
                {validationErrors.rating && (
                  <p className="text-sm text-destructive mt-2">{validationErrors.rating}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Review Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Great event with excellent networking opportunities"
                  className="mt-2"
                  aria-invalid={!!validationErrors.title}
                />
                {validationErrors.title && (
                  <p className="text-sm text-destructive mt-2">{validationErrors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">
                  Review Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your experience sponsoring this event..."
                  className="mt-2 min-h-32"
                  aria-invalid={!!validationErrors.content}
                />
                {validationErrors.content && (
                  <p className="text-sm text-destructive mt-2">{validationErrors.content}</p>
                )}
              </div>

              {/* Recommendation */}
              <div>
                <Label htmlFor="recommendation">Would you recommend this event?</Label>
                <Select value={recommendation} onValueChange={(value) => setRecommendation(value as "recommended" | "neutral" | "avoid")}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select recommendation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sponsorship Details Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sponsorship Details (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sponsorship Tier */}
                  <div>
                    <Label htmlFor="sponsorshipTier">Sponsorship Tier</Label>
                    <Input
                      id="sponsorshipTier"
                      value={sponsorshipTier}
                      onChange={(e) => setSponsorshipTier(e.target.value)}
                      placeholder="e.g., Platinum, Gold, Silver"
                      className="mt-2"
                    />
                  </div>

                  {/* Sponsorship Cost */}
                  <div>
                    <Label htmlFor="sponsorshipCost">Sponsorship Cost (USD)</Label>
                    <Input
                      id="sponsorshipCost"
                      type="number"
                      value={sponsorshipCost}
                      onChange={(e) => setSponsorshipCost(e.target.value)}
                      placeholder="e.g., 50000"
                      className="mt-2"
                      aria-invalid={!!validationErrors.sponsorshipCost}
                    />
                    {validationErrors.sponsorshipCost && (
                      <p className="text-sm text-destructive mt-2">{validationErrors.sponsorshipCost}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ROI & Metrics Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">ROI & Metrics (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ROI */}
                  <div>
                    <Label htmlFor="roi">ROI Multiplier</Label>
                    <Input
                      id="roi"
                      type="number"
                      step="0.1"
                      value={roi}
                      onChange={(e) => setRoi(e.target.value)}
                      placeholder="e.g., 3.8"
                      className="mt-2"
                      aria-invalid={!!validationErrors.roi}
                    />
                    {validationErrors.roi && (
                      <p className="text-sm text-destructive mt-2">{validationErrors.roi}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Return on investment (e.g., 3.8x means 3.8x return)</p>
                  </div>

                  {/* Leads Generated */}
                  <div>
                    <Label htmlFor="leadsGenerated">Leads Generated</Label>
                    <Input
                      id="leadsGenerated"
                      type="number"
                      value={leadsGenerated}
                      onChange={(e) => setLeadsGenerated(e.target.value)}
                      placeholder="e.g., 520"
                      className="mt-2"
                      aria-invalid={!!validationErrors.leadsGenerated}
                    />
                    {validationErrors.leadsGenerated && (
                      <p className="text-sm text-destructive mt-2">{validationErrors.leadsGenerated}</p>
                    )}
                  </div>

                  {/* Deals Closed */}
                  <div>
                    <Label htmlFor="dealsClosed">Deals Closed</Label>
                    <Input
                      id="dealsClosed"
                      type="number"
                      value={dealsClosed}
                      onChange={(e) => setDealsClosed(e.target.value)}
                      placeholder="e.g., 12"
                      className="mt-2"
                      aria-invalid={!!validationErrors.dealsClosed}
                    />
                    {validationErrors.dealsClosed && (
                      <p className="text-sm text-destructive mt-2">{validationErrors.dealsClosed}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <Button
                  type="submit"
                  disabled={submitting || !canSubmitReview}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/events/${event.id}`)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
