import Link from "next/link"
import { ArrowRight, BarChart3, Star, Users, TrendingUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
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
          </div>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium hover:text-primary transition">
              Explore
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
              Dashboard
            </Link>
            <Button asChild variant="default">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">Sponsorship Transparency</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Know Your Event Before You Sponsor
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Stop making sponsorship decisions in the dark. Get honest feedback from past sponsors and make
                  data-driven choices with EventSponsorHub.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/events">
                    Explore Events
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Events Reviewed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">2.5K+</p>
                  <p className="text-sm text-muted-foreground">Sponsor Reviews</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">$50M+</p>
                  <p className="text-sm text-muted-foreground">Sponsorship Data</p>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border flex items-center justify-center">
              <div className="text-center space-y-4">
                <BarChart3 className="w-24 h-24 text-primary/40 mx-auto" />
                <p className="text-muted-foreground">Real ROI Data at Your Fingertips</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Why EventSponsorHub</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Everything You Need to Make Smart Sponsorship Decisions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive insights from sponsors who have been through it before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Verified Reviews",
                description: "Read honest feedback from verified past sponsors with proof of participation.",
              },
              {
                icon: TrendingUp,
                title: "ROI Benchmarks",
                description: "Compare expected ROI metrics across similar events and industries.",
              },
              {
                icon: Users,
                title: "Attendee Insights",
                description: "Understand attendee engagement, app usage, and networking opportunities.",
              },
              {
                icon: BarChart3,
                title: "Event Analytics",
                description: "Access aggregated data on sponsor performance and attendee demographics.",
              },
              {
                icon: CheckCircle,
                title: "Quality Assurance",
                description: "All reviews are moderated and verified to ensure authenticity.",
              },
              {
                icon: TrendingUp,
                title: "Market Reports",
                description: "Annual reports on sponsorship trends and industry benchmarks.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-background rounded-xl border border-border p-8 space-y-4 hover:border-primary/50 transition"
              >
                <feature.icon className="w-10 h-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider mb-2">The Problem</h3>
                <h2 className="text-3xl font-bold text-foreground mb-4">Flying Blind With Event Sponsorships</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  First-time sponsors face a critical challenge: there's no reliable source of information about event
                  quality, attendee engagement, or real ROI. Event organizers control all the narrative, and critical
                  data about sponsor experience remains hidden.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "65% of sponsors don't measure ROI at all",
                    "No transparency on attendee app usage",
                    "Uncertain event management quality",
                    "Missing historical sponsor feedback",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 text-center space-y-4">
              <p className="text-5xl font-bold text-primary">4%</p>
              <p className="text-lg text-foreground">
                of marketers are satisfied with their ability to measure sponsorship ROI
              </p>
              <p className="text-sm text-muted-foreground">Source: Industry Research 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Make Smarter Sponsorship Decisions?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join sponsors who use EventSponsorHub to discover real insights and maximize their sponsorship ROI.
          </p>
          <Button asChild variant="secondary" size="lg" className="mx-auto">
            <Link href="/dashboard">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EventSponsorHub. Bringing transparency to event sponsorship.</p>
        </div>
      </footer>
    </div>
  )
}
