"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, AlertCircle, CheckCircle, XCircle, Flag, Eye, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PendingReview {
  id: string
  author: string
  company: string
  eventName: string
  rating: number
  title: string
  content: string
  roi: number
  submittedAt: string
  status: "pending" | "flagged" | "approved"
  flags: string[]
  verificationScore: number
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "flagged" | "approved">("pending")
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const pendingReviews: PendingReview[] = [
    {
      id: "1",
      author: "James Wilson",
      company: "DataViz Corp",
      eventName: "Web Summit 2024",
      rating: 5,
      title: "Outstanding event with massive lead generation",
      content:
        "Best event we've ever sponsored. Generated 50+ qualified leads and made 3 major partnerships. The organization was flawless.",
      roi: 5.2,
      submittedAt: "2024-11-12T10:30:00Z",
      status: "pending",
      flags: [],
      verificationScore: 92,
    },
    {
      id: "2",
      author: "Unknown User",
      company: "TechStart Inc",
      eventName: "SaaS Fest Europe",
      rating: 1,
      title: "Worst event ever - SCAM",
      content:
        "This event is a total scam. Nobody came to our booth. All attendees are fake. Do not sponsor this event!!!",
      roi: 0.1,
      submittedAt: "2024-11-11T16:45:00Z",
      status: "flagged",
      flags: ["Unverified account", "Extreme language", "Suspicious ROI claim", "Potential competitor sabotage"],
      verificationScore: 18,
    },
    {
      id: "3",
      author: "Maria Garcia",
      company: "CloudScale Solutions",
      eventName: "Dreamforce 2024",
      rating: 4,
      title: "Good ROI but expensive sponsorship package",
      content:
        "Solid event with quality attendees. Generated 15 leads and 2 partnerships. However, sponsorship tier was premium-priced at $45K. ROI was 2.8x after accounting for costs.",
      roi: 2.8,
      submittedAt: "2024-11-10T14:20:00Z",
      status: "pending",
      flags: [],
      verificationScore: 88,
    },
    {
      id: "4",
      author: "Robert Chen",
      company: "Stripe-approved Partner",
      eventName: "Tech Summit Asia",
      rating: 5,
      title: "Best conference ever!!!",
      content: "Amazing event. 10/10 would recommend. Best place to find partners.",
      roi: 4.5,
      submittedAt: "2024-11-09T09:15:00Z",
      status: "flagged",
      flags: ["Generic content", "No specific details", "Possible spam account"],
      verificationScore: 35,
    },
  ]

  const filteredReviews = pendingReviews.filter((r) => {
    if (activeTab === "pending") return r.status === "pending"
    if (activeTab === "flagged") return r.status === "flagged"
    return r.status === "approved"
  })

  const handleApprove = (id: string) => {
    console.log("Approved review:", id)
  }

  const handleReject = (id: string) => {
    console.log("Rejected review:", id)
  }

  const getVerificationColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">EventSponsorHub</span>
            <span className="ml-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/">Exit Admin</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Admin Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Review Moderation</h1>
          <p className="text-lg text-muted-foreground">
            Verify and manage sponsor reviews to maintain platform integrity
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Pending Reviews</p>
              <p className="text-4xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Awaiting moderation</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Flagged Reviews</p>
              <p className="text-4xl font-bold text-destructive">4</p>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Approved Today</p>
              <p className="text-4xl font-bold text-green-600">8</p>
              <p className="text-xs text-muted-foreground">Published to platform</p>
            </div>
          </div>

          {/* Main Moderation Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-border">
              {[
                { id: "pending", label: "Pending", count: 12 },
                { id: "flagged", label: "Flagged", count: 4 },
                { id: "approved", label: "Approved", count: 24 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span className="px-2 py-0.5 bg-muted text-xs rounded">{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card border border-border rounded-lg p-6 space-y-4 hover:border-primary/50 transition"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{review.title}</h3>
                          {review.status === "flagged" && (
                            <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded flex items-center gap-1">
                              <Flag className="w-3 h-3" />
                              Flagged
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {review.author} • {review.company} • {review.eventName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(review.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-500 mb-1">★ {review.rating}/5</p>
                        <p className={`text-sm font-semibold ${getVerificationColor(review.verificationScore)}`}>
                          {review.verificationScore}% verified
                        </p>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground leading-relaxed">
                      {review.content}
                    </div>

                    {/* Flags Alert (if any) */}
                    {review.flags.length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-semibold text-destructive flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Moderation Flags
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {review.flags.map((flag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-destructive/20 text-destructive text-xs rounded">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border text-sm">
                      <div>
                        <p className="text-muted-foreground">Reported ROI</p>
                        <p className="font-semibold text-primary">{review.roi}x</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Verification Status</p>
                        <p className={`font-semibold ${getVerificationColor(review.verificationScore)}`}>
                          {review.verificationScore >= 85
                            ? "High Confidence"
                            : review.verificationScore >= 60
                              ? "Medium Confidence"
                              : "Low Confidence"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <div className="flex gap-3">
                        {review.status !== "approved" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive border-destructive hover:border-destructive bg-transparent"
                              onClick={() => handleReject(review.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(review.id)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </>
                        )}
                        {review.status === "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive border-destructive hover:border-destructive bg-transparent"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-foreground font-medium">All caught up!</p>
                  <p className="text-muted-foreground text-sm">No reviews to moderate in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 p-8">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold text-foreground">Review Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            {/* Reviewer Info */}
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Reviewer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{selectedReview.author}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium text-foreground">{selectedReview.company}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium text-foreground">{new Date(selectedReview.submittedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verification Score</p>
                  <p className={`font-semibold ${getVerificationColor(selectedReview.verificationScore)}`}>
                    {selectedReview.verificationScore}%
                  </p>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Review Content</h3>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Title</p>
                <p className="font-medium text-foreground">{selectedReview.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Content</p>
                <p className="text-foreground leading-relaxed">{selectedReview.content}</p>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Verification Checklist</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Account Age > 30 days", status: true },
                  { label: "Verified Email Domain", status: true },
                  { label: "Linked LinkedIn Profile", status: false },
                  { label: "No Previous Violations", status: true },
                  { label: "ROI Claim Reasonable", status: true },
                  { label: "Content Specificity Score", status: true },
                ].map((check, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {check.status ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    )}
                    <span className="text-foreground">{check.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive border-destructive hover:border-destructive bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
