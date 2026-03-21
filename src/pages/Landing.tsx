// src/pages/Landing.tsx
// REVAMPED — incorporates all features built in this session:
// Tour management, AI features, fan economy, finance tools,
// production/photo/video roles, BookScore, deal rooms, flash bidding

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── DATA ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2,400+', label: 'artists listed' },
  { value: '840+', label: 'venues onboarded' },
  { value: '12K+', label: 'shows booked' },
  { value: '$4.2M', label: 'paid to artists' },
  { value: '380+', label: 'production crews' },
  { value: '640+', label: 'photographers' },
]

const MARQUEE = [
  { init: 'DN', name: 'DJ Nexus', role: 'House · Techno', city: 'Miami, FL', color: '#C8FF3E', bookings: 142, score: 96 },
  { init: 'LP', name: 'Lena Park', role: 'Photographer', city: 'New York, NY', color: '#3EC8FF', bookings: 310, score: 99 },
  { init: 'SF', name: 'SoundForge', role: 'Sound crew', city: 'Nationwide', color: '#7B5CF0', bookings: 89, score: 94 },
  { init: 'CS', name: 'Club Space', role: 'Venue · 3,200 cap', city: 'Miami, FL', color: '#FFB83E', bookings: 204, score: 97 },
  { init: 'MV', name: 'Maya Voss', role: 'Afrobeats · R&B', city: 'Atlanta, GA', color: '#FF5C8A', bookings: 67, score: 88 },
  { init: 'RS', name: 'Ray Studios', role: 'Videographer', city: 'Los Angeles', color: '#3EFFBE', bookings: 55, score: 91 },
  { init: 'KR', name: 'K-Raze', role: 'Hip-Hop · Trap', city: 'Atlanta, GA', color: '#FFB83E', bookings: 38, score: 84 },
  { init: 'NL', name: 'Nova Lighting', role: 'Stage lighting', city: 'Miami & SE', color: '#7B5CF0', bookings: 142, score: 93 },
  { init: 'AG', name: 'Avant Gardner', role: 'Venue · 3,000 cap', city: 'Brooklyn, NY', color: '#FFB83E', bookings: 312, score: 98 },
  { init: 'VX', name: 'VisionX Media', role: 'Photo + Video', city: 'Chicago, IL', color: '#3EC8FF', bookings: 91, score: 90 },
]

const ROLES = [
  { id: 'artist', emoji: '🎵', label: 'Artists', color: '#C8FF3E', count: '2,400+',
    headline: 'get booked. get paid. on your terms.',
    perks: ['Receive structured offers with transparent net payout', 'Accept, counter, or decline in one tap', 'Auto-generated contracts on every confirmed show', 'Full tour management — itinerary, crew, budget, tasks', 'BookScore™ builds your reputation automatically', 'AI booking agent negotiates while you sleep'] },
  { id: 'promoter', emoji: '📣', label: 'Promoters', color: '#FF5C8A', count: '920+',
    headline: 'find the perfect act. close the deal fast.',
    perks: ['Browse verified artists, production, venues in one place', 'Send structured offers — no more DM negotiation', 'Deal pipeline Kanban — manage 20 acts at once', 'AI matching suggests artists you\'ll likely book', 'PromoScore builds your reputation with artists', 'Book now, pay later — financing available'] },
  { id: 'venue', emoji: '🏛', label: 'Venues', color: '#FFB83E', count: '840+',
    headline: 'fill your calendar. build your brand.',
    perks: ['List your space — get discovered by promoters', 'Manage availability with a live booking calendar', 'Digital technical rider — no more PDF back-and-forth', 'Venue capacity intelligence — real attendance data', 'Cancellation insurance on every booking', 'Analytics: revenue per night, peak seasons, top genres'] },
  { id: 'production', emoji: '🎚', label: 'Production', color: '#7B5CF0', count: '380+',
    headline: 'get hired for the shows. build your touring résumé.',
    perks: ['Get booked for sound, lighting, stage management', 'Artists assign you to specific tour stops', 'BookScore built from every confirmed gig', 'Structured contracts on every booking', 'Tour crew manifest — see your full schedule', 'Get endorsed by artists — boost your profile'] },
  { id: 'creative', emoji: '📷', label: 'Photo & Video', color: '#3EC8FF', count: '640+',
    headline: 'shoot the shows. own the content.',
    perks: ['Get booked for concert photography and videography', 'Content delivery milestones auto-track your deadlines', 'Photo marketplace — sell show photos to fans', 'Auto EPK reel built from your best clips', 'Tour packages — travel with artists all season', 'BookScore built from delivery speed and quality'] },
]

const FEATURES = [
  { icon: '📋', title: 'Structured offer system', desc: 'Forget DMs. Promoters send formal offers with guarantee, deposit terms, set length, travel coverage, and technical details — all in one structured form.', tag: 'core' },
  { icon: '💸', title: 'Live commission calculator', desc: 'Artists see their exact net payout before responding to any offer. Free: 20% fee · Pro: 10% · Agency: 5–7%. No surprises, ever.', tag: 'core' },
  { icon: '🤝', title: 'Deal rooms', desc: 'Every confirmed booking gets a private Deal Room — shared milestones, payment tracking, document vault, and a direct message thread.', tag: 'core' },
  { icon: '🗺', title: 'Tour management hub', desc: '7 panels in one: itinerary, crew manifest, budget tracker, task board, calendar, documents, and logistics. Replaces 5 different tools.', tag: 'tour' },
  { icon: '👥', title: 'Crew manifest', desc: 'Assign sound engineers, photographers, and videographers to specific tour stops. Flag unfilled critical roles automatically.', tag: 'tour' },
  { icon: '💰', title: 'Tour budget tracker', desc: 'Track artist guarantees, crew fees, travel, hotels, and transport against your budget in real time. See profit per show.', tag: 'tour' },
  { icon: '🧠', title: 'AI booking agent', desc: 'Set your rules — minimum fee, travel requirements, deposit terms. The AI negotiates incoming offers 24/7 on your behalf.', tag: 'ai' },
  { icon: '🎯', title: 'AI artist matching', desc: 'Promoters get 5 artist recommendations before they search — ranked by predicted acceptance probability based on their booking history.', tag: 'ai' },
  { icon: '⚡', title: 'Flash bidding', desc: 'Established artists enable a 24-hour bidding window on open dates. Multiple promoters compete. Highest bid wins.', tag: 'ai' },
  { icon: '🎫', title: 'Fan presale access', desc: 'Fans follow artist profiles and get exclusive presale ticket access 48 hours before public sale. Artists grow a direct fan list.', tag: 'fan' },
  { icon: '🏆', title: 'Booking bounty', desc: 'Fans in a city pool money to fund a booking. When the pot hits the threshold, the artist is notified. Crowdsourced demand.', tag: 'fan' },
  { icon: '💳', title: 'Artist advance', desc: 'Confirmed booking coming up? Get paid early. Platform fronts up to 70% of your guarantee. Repaid from promoter on show day.', tag: 'finance' },
  { icon: '⭐', title: 'BookScore™', desc: 'Trust score 0–100 built from booking history, response rate, delivery speed, and verified reviews. The reputation you can\'t take to a competitor.', tag: 'core' },
  { icon: '📊', title: 'Market rate intelligence', desc: 'Live benchmarks by genre, city, and venue size. See where your rate sits vs. the market. Never underprice yourself again.', tag: 'ai' },
  { icon: '🌍', title: 'Multi-language support', desc: 'Full platform in English, Spanish, Portuguese, and French. Opening the Latin American, Brazilian, and West African markets.', tag: 'global' },
]

const TAGS = ['all', 'core', 'tour', 'ai', 'fan', 'finance', 'global']

const HOW = [
  { n: '01', icon: '🔍', title: 'find the right talent', desc: 'Search artists, production crews, photographers, and venues in one directory. Filter by genre, city, budget, and availability.' },
  { n: '02', icon: '📋', title: 'send a structured offer', desc: 'Fill a 6-step offer form. The recipient sees their exact net payout after fees before they respond. No hidden numbers.' },
  { n: '03', icon: '✅', title: 'close the deal', desc: 'Accept, counter, or decline in one click. Contract auto-generates. Deal Room opens with milestones, payments, and messaging.' },
  { n: '04', icon: '🗺', title: 'manage the whole thing', desc: 'Run your entire tour or event from the platform. Crew, budget, tasks, logistics, documents — one operating system.' },
]

const PRICING = [
  { name: 'free', price: '$0', billing: 'forever', commission: '20%', features: ['3 incoming offers/mo', 'Basic profile', 'Directory listing', 'Standard deal room'], cta: 'start free', highlight: false },
  { name: 'pro artist', price: '$29', billing: '/month', commission: '10%', features: ['Unlimited offers', 'Smart EPK builder', 'Verified badge ✓', 'AI booking agent', 'Full analytics', 'Tour management hub', 'Market rate intelligence', 'Tax export'], cta: 'start 7-day trial', highlight: true },
  { name: 'agency', price: '$99', billing: '/month', commission: '5–7%', features: ['25 artist profiles', '5 team seats', 'White-label links', 'API + CRM integration', 'Dedicated account manager', 'Custom contracts'], cta: 'contact us', highlight: false },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Landing() {
  const [activeRole, setActiveRole] = useState(0)
  const [activeTag, setActiveTag] = useState('all')
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const doubled = [...MARQUEE, ...MARQUEE]

  // Intersection observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, e.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const filteredFeatures = FEATURES.filter(f => activeTag === 'all' || f.tag === activeTag)
  const role = ROLES[activeRole]

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F2F7] overflow-x-hidden">

      {/* ── GLOBAL STYLES ─────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-slow { 0%,100%{opacity:1} 50%{opacity:.4} }
        .reveal { opacity:0; transform:translateY(20px); transition:opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .marquee-track { animation: marquee 40s linear infinite; width:max-content; display:flex; gap:12px; }
        .marquee-track:hover { animation-play-state:paused; }
        .hero-word { display:inline-block; animation:fadeUp .6s ease both; }
        .grid-bg { background-image: linear-gradient(rgba(200,255,62,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(200,255,62,0.03) 1px,transparent 1px); background-size:60px 60px; }
        .glow-green { box-shadow:0 0 60px rgba(200,255,62,0.08); }
        .tab-active { background:#C8FF3E; color:#080C14; border-color:transparent; }
      `}</style>

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-xl" style={{background:'rgba(8,12,20,0.85)'}}>
        <div className="font-syne font-black text-[19px] tracking-tight">
          Get<span className="text-[#C8FF3E]">Booked</span>.Live
        </div>
        <div className="hidden md:flex items-center gap-1">
          {['browse','pricing','for artists','for promoters'].map(l => (
            <Link key={l} to={l==='browse'?'/directory':l==='pricing'?'/pricing':'/auth?mode=signup'}
              className="px-3 py-2 text-[13px] text-[#8892A4] hover:text-white rounded-lg hover:bg-white/[0.05] transition-all capitalize">
              {l}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth?mode=login" className="text-[13px] text-[#8892A4] hover:text-white px-3 py-2 transition-colors">sign in</Link>
          <Link to="/auth?mode=signup" className="px-4 py-2.5 bg-[#C8FF3E] text-[#080C14] rounded-xl text-[13px] font-bold hover:opacity-90 transition-opacity">
            start free
          </Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative grid-bg min-h-[88vh] flex flex-col items-center justify-center px-6 pt-16 pb-20 text-center overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{background:'radial-gradient(circle,rgba(200,255,62,0.06) 0%,transparent 70%)'}} />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C8FF3E]/8 border border-[#C8FF3E]/25 rounded-full text-[11px] text-[#C8FF3E] font-medium mb-8"
          style={{animation:'fadeUp .5s ease both'}}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF3E]" style={{animation:'pulse-slow 2s infinite'}} />
          the operating system for live music — artists, venues, crews, and more
        </div>

        <h1 className="font-syne font-black leading-[1.02] tracking-tight mb-6 max-w-4xl relative z-10">
          <span className="hero-word text-[52px] md:text-[68px]" style={{animationDelay:'.1s'}}>the </span>
          <span className="hero-word text-[52px] md:text-[68px] text-[#C8FF3E]" style={{animationDelay:'.18s'}}>all-in-one </span>
          <br className="hidden md:block"/>
          <span className="hero-word text-[52px] md:text-[68px]" style={{animationDelay:'.26s'}}>booking platform </span>
          <br className="hidden md:block"/>
          <span className="hero-word text-[52px] md:text-[68px]" style={{animationDelay:'.34s'}}>for </span>
          <span className="hero-word text-[52px] md:text-[68px] text-[#C8FF3E]" style={{animationDelay:'.42s'}}>live music</span>
        </h1>

        <p className="text-[#8892A4] text-[17px] max-w-2xl mx-auto mb-10 leading-relaxed" style={{animation:'fadeUp .6s .5s ease both',opacity:0}}>
          artists. promoters. venues. production crews. photographers. all in one place.
          structured offers, auto-contracts, tour management, AI matching, fan economy — and payments that actually work.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-14" style={{animation:'fadeUp .6s .65s ease both',opacity:0}}>
          <Link to="/auth?mode=signup"
            className="px-8 py-4 bg-[#C8FF3E] text-[#080C14] rounded-2xl text-[15px] font-black hover:opacity-90 transition-opacity">
            get started free →
          </Link>
          <Link to="/directory"
            className="px-8 py-4 bg-[#0E1420] border border-white/10 rounded-2xl text-[15px] font-medium hover:bg-white/5 transition-colors">
            browse talent
          </Link>
        </div>

        {/* Stats strip */}
        <div className="flex items-center justify-center gap-8 flex-wrap" style={{animation:'fadeUp .6s .8s ease both',opacity:0}}>
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-syne font-black text-[22px] text-[#C8FF3E]">{s.value}</div>
              <div className="text-[11px] text-[#5A6478] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────── */}
      <section className="py-12 overflow-hidden border-y border-white/[0.04]">
        <p className="text-center text-[10px] text-[#5A6478] uppercase tracking-[.15em] font-medium mb-8">
          this could be your profile
        </p>
        <div className="marquee-track">
          {doubled.map((p, i) => (
            <div key={i} className="flex-shrink-0 w-56 bg-[#0E1420] border border-white/[0.06] rounded-2xl p-4 hover:border-white/15 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-black text-[13px] flex-shrink-0"
                  style={{background:`${p.color}18`,color:p.color}}>
                  {p.init}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[13px] font-semibold truncate">{p.name}</p>
                  <p className="text-[11px] text-[#8892A4] truncate">{p.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#5A6478]">{p.city}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]" style={{color:p.color}}>★ {p.score}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3EFFBE]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────────────────────── */}
      <section id="roles" data-reveal className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] text-[#5A6478] uppercase tracking-[.15em] font-medium mb-3">built for everyone in the room</p>
          <h2 className="font-syne font-black text-[38px] leading-tight">five roles. one platform.</h2>
        </div>

        {/* Role selector */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {ROLES.map((r, i) => (
            <button key={r.id} onClick={() => setActiveRole(i)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all ${
                activeRole === i ? 'font-bold' : 'border-white/10 text-[#8892A4] hover:text-white bg-transparent'
              }`}
              style={activeRole === i ? {background:r.color,color:'#080C14',border:'none'} : {}}>
              {r.emoji} {r.label}
            </button>
          ))}
        </div>

        {/* Role detail card */}
        <div className="max-w-3xl mx-auto bg-[#0E1420] border rounded-3xl p-8 md:p-10 transition-all glow-green"
          style={{borderColor:`${role.color}30`}}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[42px] mb-4">{role.emoji}</div>
              <h3 className="font-syne font-black text-[28px] mb-2" style={{color:role.color}}>{role.label}</h3>
              <p className="text-[#8892A4] text-[15px] italic mb-6">"{role.headline}"</p>
              <div className="flex items-center gap-3">
                <Link to="/auth?mode=signup"
                  className="px-5 py-3 rounded-xl text-[13px] font-bold hover:opacity-90 transition-opacity"
                  style={{background:role.color,color:'#080C14'}}>
                  join as {role.label.toLowerCase()} →
                </Link>
                <span className="text-[12px] text-[#5A6478]">{role.count} already listed</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {role.perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-3 text-[13px]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{background:`${role.color}18`}}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{background:role.color}} />
                  </div>
                  <span className="text-[#D0D4DC] leading-relaxed">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ────────────────────────────────────────── */}
      <section id="features" data-reveal className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-[10px] text-[#5A6478] uppercase tracking-[.15em] font-medium mb-3">everything in one place</p>
          <h2 className="font-syne font-black text-[38px] leading-tight mb-4">no more WhatsApp chains</h2>
          <p className="text-[#8892A4] text-[15px] max-w-lg mx-auto">15 features that replace the 8 different tools you're currently using to run a show</p>
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {TAGS.map(t => (
            <button key={t} onClick={() => setActiveTag(t)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-all capitalize ${
                activeTag === t ? 'tab-active' : 'border-white/10 text-[#8892A4] hover:text-white bg-transparent'
              }`}>
              {t === 'all' ? 'all features' : t === 'ai' ? '🤖 AI' : t === 'fan' ? '🎫 fan economy' : t === 'tour' ? '🗺 touring' : t === 'finance' ? '💳 finance' : t === 'global' ? '🌍 global' : t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeatures.map((f, i) => (
            <div key={i} className="bg-[#0E1420] border border-white/[0.06] rounded-2xl p-5 hover:border-white/12 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="text-[22px]">{f.icon}</div>
                <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-[#5A6478] capitalize">{f.tag}</span>
              </div>
              <h4 className="font-syne font-bold text-[14px] mb-2">{f.title}</h4>
              <p className="text-[12px] text-[#8892A4] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how" data-reveal className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] text-[#5A6478] uppercase tracking-[.15em] font-medium mb-3">see how it works</p>
          <h2 className="font-syne font-black text-[38px]">from search to showtime</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW.map((h, i) => (
            <div key={i} className="relative bg-[#0E1420] border border-white/[0.06] rounded-2xl p-6 overflow-hidden">
              <div className="font-syne font-black text-[80px] opacity-[0.04] absolute -bottom-4 -right-2 leading-none select-none">{h.n}</div>
              <div className="text-[28px] mb-5">{h.icon}</div>
              <div className="font-syne font-black text-[11px] text-[#C8FF3E] mb-2">{h.n}</div>
              <h3 className="font-syne font-bold text-[15px] mb-3">{h.title}</h3>
              <p className="text-[12px] text-[#8892A4] leading-relaxed">{h.desc}</p>
              {i < HOW.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#C8FF3E] text-[20px]">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TOUR MANAGEMENT SPOTLIGHT ─────────────────────────────── */}
      <section id="tour" data-reveal className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-[#0E1420] border border-[#7B5CF0]/25 rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{background:'radial-gradient(circle,rgba(123,92,240,0.08) 0%,transparent 70%)'}} />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7B5CF0]/12 border border-[#7B5CF0]/25 rounded-full text-[11px] text-[#A48EF7] font-medium mb-6">
                🗺 tour & production hub
              </div>
              <h2 className="font-syne font-black text-[34px] leading-tight mb-4">
                replace every<br /><span className="text-[#A48EF7]">spreadsheet you own</span>
              </h2>
              <p className="text-[#8892A4] text-[15px] leading-relaxed mb-8">
                7 panels in one page. Plan your entire tour without leaving the platform — from the first confirmed date to the final payment.
              </p>
              <Link to="/auth?mode=signup"
                className="inline-block px-6 py-3 bg-[#7B5CF0] text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition-opacity">
                start managing your tour →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:'📍','label':'Itinerary','sub':'City timeline + routing gaps'},
                { icon:'👥','label':'Crew manifest','sub':'Assign crew per stop'},
                { icon:'💸','label':'Budget tracker','sub':'Spend vs budgeted live'},
                { icon:'✅','label':'Task board','sub':'Pre-show checklist'},
                { icon:'📅','label':'Calendar','sub':'Show nights + travel days'},
                { icon:'📄','label':'Documents','sub':'Contracts + riders + more'},
                { icon:'✈️','label':'Logistics','sub':'Hotels, flights, transport'},
                { icon:'🔔','label':'Crew gaps','sub':'Unfilled roles flagged red'},
              ].map((item, i) => (
                <div key={i} className="bg-[#141B28] border border-[#7B5CF0]/15 rounded-xl p-3">
                  <div className="text-[18px] mb-1.5">{item.icon}</div>
                  <div className="text-[12px] font-semibold text-[#A48EF7]">{item.label}</div>
                  <div className="text-[10px] text-[#5A6478] mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SPOTLIGHT ──────────────────────────────────────────── */}
      <section id="ai" data-reveal className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-[#0E1420] border border-[#C8FF3E]/15 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{background:'radial-gradient(circle,rgba(200,255,62,0.05) 0%,transparent 70%)'}} />
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C8FF3E]/8 border border-[#C8FF3E]/25 rounded-full text-[11px] text-[#C8FF3E] font-medium mb-6">
              🤖 AI-powered features
            </div>
            <h2 className="font-syne font-black text-[34px] leading-tight mb-4">
              the platform that works<br /><span className="text-[#C8FF3E]">while you sleep</span>
            </h2>
            <p className="text-[#8892A4] text-[15px] max-w-xl mx-auto">
              AI doesn't replace the industry — it removes the parts nobody likes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon:'🧠', title:'AI booking agent', desc:'Set your rules. The agent evaluates every incoming offer, auto-accepts matches, and sends natural counter-offers for the rest — while you\'re on stage.', badge:'Pro+' },
              { icon:'🎯', title:'Smart artist matching', desc:'Before a promoter searches, the platform surfaces 5 artists ranked by predicted acceptance probability. "You\'ll likely book this one — 78% match."', badge:'Pro Promoter' },
              { icon:'⚡', title:'Flash bidding', desc:'Open a 24-hour bidding window on a date. Multiple promoters compete. The highest bid wins automatically. Let the market price your value.', badge:'Established+' },
              { icon:'🗺', title:'AI tour routing', desc:'Confirmed Chicago and NYC but nothing in between? AI finds open promoter bids in Detroit, Cleveland, and Pittsburgh and surfaces fill-in options.', badge:'Pro+' },
              { icon:'📊', title:'Market rate intelligence', desc:'Real-time benchmark data by genre, city, and venue size. "House DJs in Miami averaged $4,200 this month — up 18% vs last year."', badge:'Pro' },
              { icon:'📝', title:'Contract intelligence', desc:'AI reviews every contract before you sign. Flags unusual clauses, suggests missing protections, and gives a contract health score out of 100.', badge:'All plans' },
            ].map((f, i) => (
              <div key={i} className="bg-[#141B28] border border-[#C8FF3E]/10 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-[22px]">{f.icon}</div>
                  <span className="text-[10px] px-2 py-1 bg-[#C8FF3E]/8 text-[#C8FF3E] rounded-full border border-[#C8FF3E]/20">{f.badge}</span>
                </div>
                <h4 className="font-syne font-bold text-[13px] mb-2">{f.title}</h4>
                <p className="text-[12px] text-[#8892A4] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAN ECONOMY SPOTLIGHT ─────────────────────────────────── */}
      <section id="fan" data-reveal className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-[#0E1420] border border-[#FF5C8A]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{background:'radial-gradient(circle,rgba(255,92,138,0.07) 0%,transparent 70%)'}} />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF5C8A]/10 border border-[#FF5C8A]/25 rounded-full text-[11px] text-[#FF5C8A] font-medium mb-6">
                🎫 fan economy
              </div>
              <h2 className="font-syne font-black text-[34px] leading-tight mb-4">
                your fans become<br /><span className="text-[#FF5C8A]">your growth engine</span>
              </h2>
              <p className="text-[#8892A4] text-[15px] leading-relaxed mb-4">
                GetBooked.Live isn't just B2B. Fans follow your profile, fund your bookings, and buy presale tickets — turning every artist page into a fan acquisition channel.
              </p>
              <Link to="/auth?mode=signup"
                className="inline-block px-6 py-3 bg-[#FF5C8A]/15 border border-[#FF5C8A]/30 text-[#FF5C8A] rounded-xl text-[13px] font-bold hover:bg-[#FF5C8A]/20 transition-all">
                start building your fanbase →
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon:'🎫', title:'Fan presale access', desc:'Fans follow your profile. Get 48-hour early access to show tickets before they go public.' },
                { icon:'💸', title:'Live show tipping', desc:'On show night, your profile goes live. Fans send tips in real time. Artist sees a live total backstage.' },
                { icon:'🏆', title:'Booking bounty', desc:'Fans in a city pool money to fund your appearance. Hit the threshold, get notified, book the show.' },
                { icon:'🎟', title:'Superfan passes', desc:'Monthly fan subscriptions from $5–$25. Exclusive content, presale, and a monthly voice note.' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4 bg-[#141B28] border border-[#FF5C8A]/10 rounded-xl p-4">
                  <div className="text-[22px] flex-shrink-0">{f.icon}</div>
                  <div>
                    <div className="text-[13px] font-semibold mb-1 text-[#FF9CB8]">{f.title}</div>
                    <div className="text-[12px] text-[#8892A4] leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" data-reveal className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-[10px] text-[#5A6478] uppercase tracking-[.15em] font-medium mb-3">pricing</p>
          <h2 className="font-syne font-black text-[38px] mb-3">free to join. pro pays for itself.</h2>
          <p className="text-[#8892A4] text-[15px] max-w-md mx-auto mb-8">
            one booking covers the cost of pro. every booking after that is pure saving.
          </p>
          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-[#0E1420] border border-white/[0.06] rounded-full px-4 py-2">
            <button onClick={() => setBilling('monthly')}
              className={`text-[13px] font-medium px-3 py-1 rounded-full transition-all ${billing==='monthly'?'bg-[#C8FF3E] text-[#080C14]':'text-[#8892A4]'}`}>
              monthly
            </button>
            <button onClick={() => setBilling('yearly')}
              className={`text-[13px] font-medium px-3 py-1 rounded-full transition-all ${billing==='yearly'?'bg-[#C8FF3E] text-[#080C14]':'text-[#8892A4]'}`}>
              yearly <span className="text-[10px] opacity-70">save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING.map((p, i) => (
            <div key={i} className={`rounded-3xl p-6 relative ${p.highlight ? 'glow-green' : ''}`}
              style={{
                background: p.highlight ? 'rgba(200,255,62,0.03)' : '#0E1420',
                border: p.highlight ? '1.5px solid rgba(200,255,62,0.35)' : '0.5px solid rgba(255,255,255,0.07)',
              }}>
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C8FF3E] text-[#080C14] text-[11px] font-black rounded-full whitespace-nowrap">
                  most popular
                </div>
              )}
              <p className="text-[12px] text-[#8892A4] capitalize mb-2">{p.name}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-syne font-black text-[34px]" style={{color:p.highlight?'#C8FF3E':'#F0F2F7'}}>
                  {billing==='yearly' && p.name==='pro artist' ? '$23' : billing==='yearly' && p.name==='agency' ? '$79' : p.price}
                </span>
                <span className="text-[13px] text-[#8892A4] pb-1">{p.billing}</span>
              </div>
              <p className="text-[12px] text-[#8892A4] mb-5">platform fee: <span className={p.highlight?'text-[#C8FF3E] font-semibold':'text-[#F0F2F7]'}>{p.commission}</span></p>
              <div className="space-y-2.5 mb-6">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2.5 text-[12px]">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:p.highlight?'rgba(200,255,62,0.15)':'rgba(255,255,255,0.05)'}}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{background:p.highlight?'#C8FF3E':'#3EFFBE'}} />
                    </div>
                    <span className="text-[#C0C6D0]">{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/auth?mode=signup"
                className="block text-center py-3 rounded-xl text-[13px] font-bold transition-all"
                style={p.highlight
                  ? {background:'#C8FF3E',color:'#080C14'}
                  : {background:'transparent',border:'0.5px solid rgba(255,255,255,0.1)',color:'#F0F2F7'}}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOOKSCORE SOCIAL PROOF ────────────────────────────────── */}
      <section id="trust" data-reveal className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-[#0E1420] border border-[#FFB83E]/20 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <p className="text-[10px] text-[#5A6478] uppercase tracking-[.15em] font-medium mb-3">bookscore™</p>
            <h2 className="font-syne font-black text-[34px] mb-3">your reputation.<br /><span className="text-[#FFB83E]">your most valuable asset.</span></h2>
            <p className="text-[#8892A4] text-[15px] max-w-lg mx-auto">
              BookScore is built from every booking, every review, every response time — and it lives only on GetBooked.Live.
              Artists with higher scores get more offers, better rates, and first-look at premium dates.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {label:'Response rate',val:'98%',sub:'respond within 4hrs'},
              {label:'Acceptance rate',val:'74%',sub:'of offers accepted'},
              {label:'Booking history',val:'142',sub:'confirmed shows'},
              {label:'BookScore™',val:'96',sub:'out of 100'},
            ].map((s, i) => (
              <div key={i} className="text-center bg-[#141B28] border border-[#FFB83E]/12 rounded-2xl p-5">
                <div className="font-syne font-black text-[28px] text-[#FFB83E]">{s.val}</div>
                <div className="text-[12px] font-medium mt-1 text-[#F0F2F7]">{s.label}</div>
                <div className="text-[11px] text-[#5A6478] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section id="cta" data-reveal className="max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="relative grid-bg rounded-3xl border border-white/[0.06] p-12 md:p-16 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{background:'radial-gradient(circle,rgba(200,255,62,0.07) 0%,transparent 70%)'}} />
          <div className="relative z-10">
            <h2 className="font-syne font-black text-[42px] md:text-[52px] leading-tight mb-5">
              ready to get<br /><span className="text-[#C8FF3E]">booked?</span>
            </h2>
            <p className="text-[#8892A4] text-[16px] mb-10 max-w-md mx-auto">
              free to join. first booking takes minutes. no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/auth?mode=signup"
                className="px-10 py-4 bg-[#C8FF3E] text-[#080C14] rounded-2xl text-[15px] font-black hover:opacity-90 transition-opacity">
                create free account →
              </Link>
              <Link to="/directory"
                className="px-8 py-4 bg-transparent border border-white/15 rounded-2xl text-[15px] font-medium hover:bg-white/5 transition-colors">
                browse the platform
              </Link>
            </div>
            <p className="text-[12px] text-[#5A6478] mt-8">
              5 user roles · AI-powered · Tour management · Fan economy · Multi-language
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="font-syne font-black text-[20px] mb-2">Get<span className="text-[#C8FF3E]">Booked</span>.Live</div>
              <p className="text-[13px] text-[#5A6478] max-w-xs leading-relaxed">the operating system for live music. connecting every role in the industry on one platform.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
              {[
                { head:'platform', links:['browse artists','browse venues','for promoters','pricing'] },
                { head:'features', links:['tour management','AI features','fan economy','finance tools'] },
                { head:'company', links:['about','blog','careers','press'] },
                { head:'legal', links:['terms','privacy','cookies','dmca'] },
              ].map(col => (
                <div key={col.head}>
                  <p className="text-[11px] text-[#5A6478] uppercase tracking-wider font-medium mb-3">{col.head}</p>
                  {col.links.map(l => (
                    <Link key={l} to="/auth?mode=signup" className="block text-[#8892A4] hover:text-white transition-colors mb-2 capitalize">{l}</Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-[#5A6478]">© 2026 GetBooked.Live · All rights reserved</p>
            <p className="text-[12px] text-[#5A6478]">
              available in 🇺🇸 English · 🇪🇸 Español · 🇧🇷 Português · 🇫🇷 Français
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll reveal logic */}
      <script dangerouslySetInnerHTML={{__html:`
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') })
        }, {threshold:.08})
        document.querySelectorAll('[data-reveal]').forEach(el => {
          el.classList.add('reveal')
          obs.observe(el)
        })
      `}} />
    </div>
  )
}
