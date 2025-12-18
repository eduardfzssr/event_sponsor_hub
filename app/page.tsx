import Link from "next/link"
import { 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Star, 
  Users, 
  Eye, 
  Handshake, 
  ArrowRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground font-display antialiased overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 dark:bg-background/90 backdrop-blur-md">
        <div className="px-4 md:px-10 py-3 max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-4 text-foreground cursor-pointer group">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">EventSponsorHub</h2>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#sponsors" className="text-sm font-medium hover:text-primary transition-colors">
              For Sponsors
            </Link>
            <Link href="#organizers" className="text-sm font-medium hover:text-primary transition-colors">
              For Organizers
            </Link>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button variant="outline" size="default" className="h-9" asChild>
              <Link href="/signin">
                <span className="truncate">Log In</span>
              </Link>
            </Button>
            <Button size="default" className="h-9" asChild>
              <Link href="/signup">
                <span className="truncate">Get Started</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Layout Container */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-[1280px] px-4 md:px-10 py-12 md:py-20">
          <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-center">
            {/* Hero Content */}
            <div className="flex flex-col gap-6 flex-1 max-w-[600px]">
              <div className="flex flex-col gap-3 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">Maximize your ROI</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] text-foreground">
                  Stop Guessing.<br />
                  <span className="text-primary">Start Investing.</span>
                </h1>
                <h2 className="text-lg text-muted-foreground font-normal leading-relaxed max-w-[540px]">
                  Access verified feedback from past sponsors. Don't fly blind—get the data you need before signing the contract.
                </h2>
              </div>
              {/* Search Component */}
              <div className="flex flex-col w-full max-w-[500px] mt-2">
                <div className="relative flex items-center w-full h-14 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none bg-card dark:bg-slate-800 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
                  <div className="pl-4 text-muted-foreground flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <Input 
                    className="h-full w-full border-none bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:ring-0 text-base" 
                    placeholder="Search events like 'TechCrunch Disrupt'..."
                  />
                  <div className="pr-2">
                    <Button className="h-10 px-5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors" asChild>
                      <Link href="/events">Search</Link>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 pl-1">Popular: SXSW, CES, Web Summit, Dreamforce</p>
              </div>
            </div>
            {/* Hero Image */}
            <div className="flex-1 w-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl bg-slate-200 dark:bg-slate-800 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 z-20 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold">4.8/5 Rating</span>
                  </div>
                  <p className="font-bold text-lg">Tech Innovators Summit 2024</p>
                  <p className="text-sm opacity-90">"Exceptional lead generation opportunities."</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Business professionals networking at a conference"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="w-full border-y border-border bg-card dark:bg-slate-900/50 py-10">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center">
            <h4 className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-8">Trusted by sponsorship teams at</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="h-8 flex items-center gap-2">
                <div className="size-6 bg-foreground dark:bg-slate-200 rounded-full"></div>
                <span className="font-bold text-xl text-foreground dark:text-slate-200 font-display">AcmeCorp</span>
              </div>
              <div className="h-8 flex items-center gap-2">
                <div className="size-6 bg-foreground dark:bg-slate-200 rotate-45"></div>
                <span className="font-bold text-xl text-foreground dark:text-slate-200 font-display">Vertex</span>
              </div>
              <div className="h-8 flex items-center gap-2">
                <div className="size-6 bg-foreground dark:bg-slate-200 rounded-sm"></div>
                <span className="font-bold text-xl text-foreground dark:text-slate-200 font-display">GlobalFlow</span>
              </div>
              <div className="h-8 flex items-center gap-2">
                <div className="size-6 border-4 border-foreground dark:border-slate-200 rounded-full"></div>
                <span className="font-bold text-xl text-foreground dark:text-slate-200 font-display">Orbit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-[1280px] px-4 md:px-10 py-20">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="flex flex-col gap-6 md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Why Choose <span className="text-primary">EventSponsorHub?</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We bring transparency to the $65B event sponsorship industry through verified data and community feedback.
              </p>
              <Link href="#sponsors" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-2">
                Learn more about our data <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:w-2/3">
              {/* Feature 1 */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="size-12 rounded-lg bg-primary/10 dark:bg-primary/30 flex items-center justify-center text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Verified ROI Data</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    See real return-on-investment figures reported by verified past sponsors.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="size-12 rounded-lg bg-primary/10 dark:bg-primary/30 flex items-center justify-center text-primary">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Organizer Ratings</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Rate event management on communication, logistics, and promise delivery.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow">
                <div className="size-12 rounded-lg bg-primary/10 dark:bg-primary/30 flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Audience Insights</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Understand who actually attends the event—seniority, industry, and intent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Break / Images Grid */}
        <section className="w-full bg-card dark:bg-slate-900 py-20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="flex flex-col items-center mb-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">Discover top-tier events</h3>
              <p className="text-muted-foreground mt-2">Browse thousands of events with verified feedback.</p>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 h-[400px]">
              {/* Large Left Image */}
              <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Modern tech conference stage with large screens and audience"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-white/90 text-foreground text-xs font-bold px-2 py-1 rounded">Tech & SaaS</span>
                </div>
              </div>
              {/* Top Middle */}
              <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="People networking at a trade show booth"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Top Right */}
              <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Abstract colorful stage lighting at a concert event"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Bottom Wide */}
              <div className="col-span-2 row-span-1 relative group overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Formal dinner event with round tables"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 z-20">
                  <span className="bg-white/90 text-foreground text-xs font-bold px-2 py-1 rounded">Gala & Networking</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials / Recent Reviews */}
        <section id="sponsors" className="w-full max-w-[1280px] px-4 md:px-10 py-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Recent Sponsor Reviews</h2>
              <p className="text-muted-foreground mt-2">See what companies are saying about recent events.</p>
            </div>
            <Button variant="link" className="text-primary font-bold hover:text-primary/80 transition-colors p-0">
              View all reviews
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review Card 1 */}
            <div className="flex flex-col gap-4 p-6 rounded-xl bg-card dark:bg-slate-800 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-foreground/80 dark:text-slate-300 text-sm leading-relaxed italic">
                "The foot traffic at <span className="font-bold not-italic text-foreground">FutureFin Expo</span> was incredible. We collected 300+ qualified leads in two days. The organizers were very responsive to our booth needs."
              </p>
              <div className="mt-auto pt-4 border-t border-border flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">JD</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">Jane Doe</span>
                  <span className="text-xs text-muted-foreground">CMO at FinTechStart</span>
                </div>
              </div>
            </div>
            {/* Review Card 2 */}
            <div className="flex flex-col gap-4 p-6 rounded-xl bg-card dark:bg-slate-800 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(2)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400" />
                  ))}
                  {[...Array(3)].map((_, i) => (
                    <Star key={i + 2} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-bold bg-muted text-muted-foreground px-2 py-1 rounded-full">Avoid</span>
              </div>
              <p className="text-foreground/80 dark:text-slate-300 text-sm leading-relaxed italic">
                "Disappointing experience at <span className="font-bold not-italic text-foreground">CloudConnect 2023</span>. Attendance was half of what was promised in the pitch deck. ROI was negative."
              </p>
              <div className="mt-auto pt-4 border-t border-border flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">MS</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">Mark Smith</span>
                  <span className="text-xs text-muted-foreground">VP Marketing at CloudScale</span>
                </div>
              </div>
            </div>
            {/* Review Card 3 */}
            <div className="flex flex-col gap-4 p-6 rounded-xl bg-card dark:bg-slate-800 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400" />
                  ))}
                  <Star className="w-5 h-5 fill-yellow-400 fill-opacity-50" />
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-foreground/80 dark:text-slate-300 text-sm leading-relaxed italic">
                "Great branding exposure at <span className="font-bold not-italic text-foreground">DesignWeek</span>. Not huge on direct leads, but brand awareness lift was significant. Good value for money."
              </p>
              <div className="mt-auto pt-4 border-t border-border flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">AL</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">Ana Lee</span>
                  <span className="text-xs text-muted-foreground">Brand Manager at Studio X</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="organizers" className="w-full bg-card dark:bg-slate-900 border-t border-border py-20">
          <div className="max-w-[1000px] mx-auto px-4 md:px-10 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
            <div className="flex flex-col md:flex-row gap-8 w-full relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-border -z-0"></div>
              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center text-center gap-4 z-10">
                <div className="size-16 rounded-full bg-card dark:bg-slate-800 border-2 border-primary flex items-center justify-center text-primary shadow-lg">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">1. Search Event</h3>
                <p className="text-sm text-muted-foreground px-4">Find the event you are considering in our database of 50k+ global events.</p>
              </div>
              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center text-center gap-4 z-10">
                <div className="size-16 rounded-full bg-card dark:bg-slate-800 border-2 border-primary flex items-center justify-center text-primary shadow-lg">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">2. Check Data</h3>
                <p className="text-sm text-muted-foreground px-4">Unlock verified reviews, audience demographics, and past ROI stats.</p>
              </div>
              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center text-center gap-4 z-10">
                <div className="size-16 rounded-full bg-card dark:bg-slate-800 border-2 border-primary flex items-center justify-center text-primary shadow-lg">
                  <Handshake className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">3. Sponsor Safely</h3>
                <p className="text-sm text-muted-foreground px-4">Make an informed decision and negotiate better terms with confidence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="w-full bg-primary/5 dark:bg-primary/10 py-20">
          <div className="max-w-[800px] mx-auto px-4 text-center flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Ready to find your next winning event?</h2>
            <p className="text-lg text-muted-foreground">Join 10,000+ marketers making data-driven sponsorship decisions.</p>
            <div className="flex gap-4 mt-4">
              <Button size="lg" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-card dark:bg-slate-800 text-foreground border border-border rounded-lg font-bold text-lg hover:bg-muted dark:hover:bg-slate-700 transition-colors" asChild>
                <Link href="/events">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-card dark:bg-slate-900 border-t border-border pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-foreground">
                <div className="size-6 bg-primary rounded flex items-center justify-center text-primary-foreground">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">EventSponsorHub</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-[300px]">
                The world's largest database of event sponsorship reviews and ROI data. Stop guessing, start investing.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-foreground">Platform</h4>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-primary">Search Events</Link>
              <Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary">Write a Review</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-foreground">Resources</h4>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link>
              <Link href="/calculator" className="text-sm text-muted-foreground hover:text-primary">ROI Calculator</Link>
              <Link href="/guide" className="text-sm text-muted-foreground hover:text-primary">Sponsorship Guide</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-foreground">Company</h4>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2024 EventSponsorHub Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
