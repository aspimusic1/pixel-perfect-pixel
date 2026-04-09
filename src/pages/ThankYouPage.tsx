import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import logoColor from "@/assets/logo-color.png";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-foreground flex items-center justify-center px-4 py-16">
      <SEO
        title="Thank You | GetBooked.Live"
        description="Thanks for signing up for GetBooked.Live. Your account or waitlist spot has been confirmed."
      />

      <div className="w-full max-w-2xl rounded-[32px] border border-white/[0.08] bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm p-8 md:p-12 text-center">
        <img
            src={logoColor}

          alt="GetBooked.Live"
            className="h-7 mx-auto mb-8 opacity-100"

          loading="eager"
        />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C8FF3E]/12 border border-[#C8FF3E]/25 mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#C8FF3E]" aria-hidden="true" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 lowercase">
          you're on the list
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-8 max-w-xl mx-auto mb-10">
          Thanks for signing up for <span className="text-foreground font-medium">GetBooked.Live</span>.
          We’ve got your details and we’ll be in touch as soon as your next step is ready.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-10 text-left">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-2">What happens next</p>
            <p className="text-sm leading-6 text-foreground/90">
              We’ll email you with updates, launch news, and access details when it’s your turn.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-2">Stay connected</p>
            <p className="text-sm leading-6 text-foreground/90">
              Follow along as we roll out new features for artists, promoters, venues, and crews.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="h-12 px-6 font-display font-semibold lowercase bg-[#C8FF3E] text-[#080C14] hover:bg-[#C8FF3E]/90">
            <a href="https://www.instagram.com/getbooked.live/" target="_blank" rel="noreferrer">
              follow on instagram
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6 font-display font-semibold lowercase border-white/15 bg-transparent text-foreground hover:bg-white/[0.04]">
            <Link to="/">back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
