import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Heart,
  Menu,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Wifi,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const MTN_LOGO =
  'https://onlinecms.mtn.co.za/sites/default/files/design-system%2C%20vivid%2C%20images%2C%20icons/brand/mtn_logo_lg-sunshine.svg'
const MTN_PROMOTIONS_URL = 'https://www.mtn.co.za/shop/deals/promotions'
const MTN_PLANS_URL = 'https://www.mtn.co.za/shop/deals/plans'
const MTN_PHONES_URL = 'https://www.mtn.co.za/shop/deals/devices/contract/phones'
const MTN_HOME_URL = 'https://www.mtn.co.za/home/'
const MTN_BUSINESS_URL = 'https://business.mtn.co.za/'

type CatalogFreebie = {
  id?: string
  name?: string
  description?: string
  imageUrl?: string
  price?: number | string | null
}

type CatalogPromotion = {
  id?: string | number
  offerId?: string | number
  name?: string | null
  brand?: string | null
  model?: string | null
  storage?: string | null
  storageUom?: string | null
  categoryName?: string | null
  type?: string | null
  serviceType?: string | null
  currencyCode?: string | null
  price?: number | string | null
  offerPrice?: number | string | null
  leastPrice?: number | string | null
  previousLeastOfferPrice?: number | string | null
  defaultDuration?: string | number | null
  duration?: string | number | null
  totalData?: number | string | null
  totalDataUom?: string | null
  totalMinutes?: number | string | null
  totalMinutesUom?: string | null
  totalAirtime?: number | string | null
  totalAirtimeUom?: string | null
  promotionTag?: string | null
  offerCategory?: string | null
  deviceType?: string | null
  compositeImage?: string | null
  specs?: Array<{ image?: string | null }> | null
  freebies?: CatalogFreebie[] | null
  planFreebies?: CatalogFreebie[] | null
  callouts?: string[] | null
  productDetails?: string | null
  deviceTerms?: string | null
  planTerms?: string | null
}

type CatalogCategory = {
  dealType?: string | null
  categoryType?: string | null
  promotions?: CatalogPromotion[] | null
}

type CatalogPayload = {
  promotions?: { promotionCategories?: CatalogCategory[] | null } | null
  refreshedAt?: string
  error?: { code?: string; message?: string }
}

type Deal = CatalogPromotion & {
  key: string
  category: string
  dealType: string
}

type FeedState = 'loading' | 'ready' | 'error'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Devices', href: '#promotions' },
  { label: 'Deals', href: '#promotions' },
  { label: 'Contracts', href: MTN_PLANS_URL, external: true },
  { label: 'Prepaid', href: MTN_PLANS_URL, external: true },
  { label: 'Data', href: MTN_PLANS_URL, external: true },
  { label: 'Fibre', href: '#fibre' },
  { label: '5G', href: '#connectivity' },
  { label: 'Business', href: '#business' },
  { label: 'Support', href: '#support' },
]

const quickLinks = [
  {
    title: 'Yellow Plans',
    detail: 'Find current plan options and terms on MTN’s official shop.',
    href: MTN_PLANS_URL,
    label: 'View plans',
  },
  {
    title: 'Mega Flex',
    detail: 'Explore available flexible offers and their current inclusions.',
    href: MTN_PLANS_URL,
    label: 'Explore Mega Flex',
  },
  {
    title: 'Mobile Internet',
    detail: 'Browse data-only offers, routers and mobile internet devices.',
    href: MTN_PLANS_URL,
    label: 'Browse offers',
  },
  {
    title: 'Fibre & home internet',
    detail: 'Check MTN home connectivity options and availability.',
    href: MTN_HOME_URL,
    label: 'Check availability',
  },
]

const videoPoster = 'https://assets.mixkit.co/videos/49878/49878-thumb-720-0.jpg'

function asAmount(value: number | string | null | undefined): number | undefined {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined
  if (typeof value === 'string' && !value.trim()) return undefined
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : undefined
}

function formatCurrency(value: number, currencyCode?: string | null): string {
  const currency = currencyCode && /^[A-Z]{3}$/.test(currencyCode) ? currencyCode : 'ZAR'
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${currency} ${value}`
  }
}

function officialImageUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined
  try {
    const url = new URL(value, 'https://www.mtn.co.za')
    return url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function getDealImage(deal: Deal): string | undefined {
  return officialImageUrl(deal.compositeImage) ?? officialImageUrl(deal.specs?.[0]?.image)
}

function getDealName(deal: Deal): string {
  return [deal.brand, deal.model].filter(Boolean).join(' ') || deal.name || 'MTN offer'
}

function getDealPrice(deal: Deal): number | undefined {
  return asAmount(deal.offerPrice) ?? asAmount(deal.leastPrice) ?? asAmount(deal.price)
}

function getDealDuration(deal: Deal): string | undefined {
  const duration = deal.defaultDuration ?? deal.duration
  if (duration === null || duration === undefined || `${duration}`.trim() === '') return undefined
  return `${duration}`
}

function getFeedOffers(payload: CatalogPayload): Deal[] {
  return (payload.promotions?.promotionCategories ?? []).flatMap((category, categoryIndex) =>
    (category.promotions ?? [])
      .filter((promotion) => Boolean((promotion.brand?.trim() && promotion.model?.trim()) || promotion.name?.trim()))
      .map((promotion, promotionIndex) => ({
        ...promotion,
        category: category.categoryType?.trim() || 'Device offers',
        dealType: category.dealType?.trim() || '',
        key: [
          promotion.offerId ?? promotion.id ?? `${categoryIndex}-${promotionIndex}`,
          promotion.brand,
          promotion.model,
          promotion.storage,
        ].join('-'),
      })),
  )
}

function ProductImage({ deal }: { deal: Deal }) {
  const [failed, setFailed] = useState(false)
  const image = getDealImage(deal)

  if (!image || failed) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center bg-[#ffcc00] text-black">
        {deal.brand ? <Smartphone aria-hidden="true" size={76} strokeWidth={1.2} /> : <Wifi aria-hidden="true" size={76} strokeWidth={1.2} />}
      </div>
    )
  }

  return (
    <img
      src={image}
      alt={`${getDealName(deal)} product`}
      className="h-full min-h-64 w-full object-contain bg-[#f7f6f2] p-8 transition-transform duration-500 group-hover:scale-[1.04]"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function App() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [feedState, setFeedState] = useState<FeedState>('loading')
  const [feedError, setFeedError] = useState('')
  const [refreshedAt, setRefreshedAt] = useState<string>()
  const [retryCount, setRetryCount] = useState(0)
  const [selectedBrand, setSelectedBrand] = useState('All brands')
  const [sortMode, setSortMode] = useState('featured')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadCatalog = async () => {
      try {
        const response = await fetch('/api/mtn/promotions', { signal: controller.signal })
        const payload = (await response.json()) as CatalogPayload
        if (!response.ok) {
          if (payload.error?.code === 'catalog_not_configured') {
            setFeedError(payload.error.message || 'MTN catalogue access is not configured on this server.')
            setFeedState('error')
            return
          }
          throw new Error(payload.error?.message || `MTN catalogue request failed (${response.status}).`)
        }

        const catalogDeals = getFeedOffers(payload)
        setDeals(catalogDeals)
        setRefreshedAt(payload.refreshedAt)
        setFeedState('ready')
      } catch (error) {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'The MTN catalogue could not be loaded.'
        console.error('Unable to load the MTN promotions catalogue:', error)
        setFeedError(message)
        setFeedState('error')
      }
    }

    void loadCatalog()
    return () => controller.abort()
  }, [retryCount])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setVideoPlaying(true)
      setVideoFailed(false)
    }
    const handlePause = () => setVideoPlaying(false)
    const handleError = () => setVideoFailed(true)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const brands = useMemo(
    () => [...new Set(deals.map((deal) => deal.brand?.trim()).filter((brand): brand is string => Boolean(brand)))].sort(),
    [deals],
  )

  const visibleDeals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const results = deals.filter((deal) => {
      const matchesBrand = selectedBrand === 'All brands' || deal.brand === selectedBrand
      const searchableText = [
        getDealName(deal),
        deal.storage,
        deal.category,
        deal.dealType,
        deal.categoryName,
        deal.serviceType,
        deal.promotionTag,
        ...(deal.callouts ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesBrand && (!query || searchableText.includes(query))
    })

    if (sortMode === 'low') {
      results.sort((first, second) => (getDealPrice(first) ?? Number.MAX_VALUE) - (getDealPrice(second) ?? Number.MAX_VALUE))
    } else if (sortMode === 'high') {
      results.sort((first, second) => (getDealPrice(second) ?? -1) - (getDealPrice(first) ?? -1))
    }

    return results
  }, [deals, searchQuery, selectedBrand, sortMode])

  const toggleWishlist = (key: string) => {
    setWishlist((current) => (current.includes(key) ? current.filter((value) => value !== key) : [...current, key]))
  }

  const toggleCompare = (key: string) => {
    setCompare((current) => {
      if (current.includes(key)) return current.filter((value) => value !== key)
      if (current.length >= 3) return current
      return [...current, key]
    })
  }

  const toggleVideo = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
      } catch (error) {
        console.error('The hero video could not be played:', error)
        setVideoFailed(true)
      }
    } else {
      video.pause()
    }
  }

  const openMenuLink = () => setMenuOpen(false)

  return (
    <div className="min-h-screen bg-white text-[#101010]">
      <div className="bg-[#ffcc00] px-4 py-2 text-center text-xs font-bold tracking-wide text-black sm:text-sm">
        MTN South Africa <span className="mx-2 opacity-50">|</span> Everything you need. Connected.
      </div>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-4 py-3 sm:px-7 lg:px-10">
          <a href="#home" aria-label="MTN South Africa home" className="shrink-0">
            <img src={MTN_LOGO} alt="MTN" className="h-10 w-auto sm:h-12" />
          </a>

          <div className="hidden items-center gap-5 xl:flex">
            {navLinks.map((item, index) => (
              <div key={item.label} className="group relative">
                <a
                  href={item.href}
                  onClick={item.external ? undefined : openMenuLink}
                  className="inline-flex items-center gap-1 py-3 text-[13px] font-semibold text-black transition-colors hover:text-[#806500]"
                >
                  {item.label}
                  {index === 1 || index === 2 || index === 9 ? <ChevronDown size={13} aria-hidden="true" /> : null}
                </a>
                {(index === 1 || index === 2 || index === 9) && (
                  <div className="invisible absolute left-0 top-full min-w-48 translate-y-1 border-t-2 border-[#ffcc00] bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <a href={index === 9 ? '#support' : MTN_PROMOTIONS_URL} className="block px-3 py-2 text-sm font-medium hover:bg-[#fff7d6]">
                      {index === 9 ? 'Help & support' : 'Shop all offers'}
                    </a>
                    <a href={index === 9 ? MTN_HOME_URL : MTN_PHONES_URL} className="block px-3 py-2 text-sm font-medium hover:bg-[#fff7d6]">
                      {index === 9 ? 'Contact MTN' : 'Phones & devices'}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#fff7d6]"
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>
            <a
              href="https://www.mtn.co.za/"
              className="hidden rounded-full bg-[#ffcc00] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#f2bd00] md:inline-flex"
            >
              MyMTN
            </a>
            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#fff7d6] xl:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-black/10 bg-white">
            <label className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-4 sm:px-7 lg:px-10">
              <Search size={18} className="shrink-0 text-black/50" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    setSearchOpen(false)
                    document.getElementById('promotions')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                aria-label="Search MTN deals"
                placeholder="Search MTN deals and devices"
                className="w-full border-0 bg-transparent text-base outline-none placeholder:text-black/40"
              />
              <a href="#promotions" onClick={() => setSearchOpen(false)} className="text-sm font-bold underline decoration-[#ffcc00] decoration-2 underline-offset-4">
                View deals
              </a>
            </label>
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-black/10 bg-white xl:hidden">
            <div className="mx-auto grid max-w-[1440px] gap-1 px-4 py-3 sm:grid-cols-2 sm:px-7">
              {navLinks.map((item) => (
                <a key={item.label} href={item.href} onClick={openMenuLink} className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-[#fff7d6]">
                  {item.label}
                </a>
              ))}
              <a href="https://www.mtn.co.za/" onClick={openMenuLink} className="mt-1 rounded-full bg-[#ffcc00] px-4 py-2.5 text-center text-sm font-bold sm:col-span-2">
                MyMTN
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative isolate min-h-[620px] overflow-hidden bg-black md:min-h-[690px]">
          <img
            src={videoPoster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={videoPoster}
            onError={() => setVideoFailed(true)}
          >
            <source src="https://assets.mixkit.co/videos/49878/49878-720.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

          <div className="relative mx-auto flex min-h-[620px] max-w-[1440px] items-center px-5 py-16 sm:px-8 md:min-h-[690px] lg:px-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[740px] text-white"
            >
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffcc00] sm:text-sm">
                <span className="h-1 w-8 bg-[#ffcc00]" />
                MTN South Africa
              </p>
              <h1 className="max-w-[720px] text-5xl font-extrabold uppercase leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[88px]">
                Everything you need. <span className="text-[#ffcc00]">Connected.</span>
              </h1>
              <p className="mt-6 max-w-[570px] text-base leading-7 text-white/85 sm:text-lg">
                Discover MTN devices, connectivity and offers from the official catalogue—made for the way South Africa connects.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#promotions"
                  className="inline-flex items-center gap-3 rounded-full bg-[#ffcc00] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-white"
                >
                  Explore deals <ArrowRight size={17} />
                </a>
                <a
                  href="#connectivity"
                  className="inline-flex items-center gap-3 rounded-full border border-white/60 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#ffcc00] hover:bg-[#ffcc00] hover:text-black"
                >
                  Discover MTN 5G <ArrowRight size={17} />
                </a>
              </div>
            </motion.div>
          </div>

          <button
            type="button"
            aria-label={videoPlaying ? 'Pause hero video' : 'Play hero video'}
            onClick={() => void toggleVideo()}
            className="absolute bottom-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-black/50 text-white transition hover:scale-105 hover:border-[#ffcc00] hover:text-[#ffcc00] sm:bottom-8 sm:right-8"
          >
            {videoPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          {videoFailed && (
            <p className="absolute bottom-6 left-5 text-xs text-white/75 sm:bottom-9 sm:left-8">
              Video preview unavailable. Showing the poster image.
            </p>
          )}
        </section>

        <section aria-label="MTN shopping links" className="border-b border-black/10 bg-[#ffcc00]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-black/15 sm:grid-cols-4">
            {[
              ['Shop devices', MTN_PHONES_URL],
              ['Promotions', MTN_PROMOTIONS_URL],
              ['Plans', MTN_PLANS_URL],
              ['Home internet', MTN_HOME_URL],
            ].map(([label, href]) => (
              <a key={label} href={href} className="flex items-center justify-between gap-2 px-4 py-4 text-sm font-bold transition hover:bg-black/5 sm:px-7">
                {label}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section id="promotions" className="scroll-mt-24 bg-white px-4 py-16 sm:px-7 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex flex-col gap-5 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#786000]">The MTN shop</p>
                <h2 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Deals worth a closer look.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">
                  Device and plan offers are loaded from MTN’s promotions catalogue. Check MTN’s official shop for full terms and eligibility.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {refreshedAt && feedState === 'ready' && (
                  <span className="text-xs text-black/55">
                    MTN catalogue · Updated {new Date(refreshedAt).toLocaleString('en-ZA')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFeedState('loading')
                    setFeedError('')
                    setRetryCount((count) => count + 1)
                  }}
                  disabled={feedState === 'loading'}
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm font-bold transition hover:border-black disabled:cursor-wait disabled:opacity-50"
                >
                  <RefreshCw size={15} className={feedState === 'loading' ? 'animate-spin' : ''} />
                  Refresh offers
                </button>
              </div>
            </div>

            {feedState === 'ready' && (
              <div className="mb-7 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="brand-filter">Filter by brand</label>
                <select
                  id="brand-filter"
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                  className="min-w-44 rounded-full border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold"
                >
                  <option>All brands</option>
                  {brands.map((brand) => <option key={brand}>{brand}</option>)}
                </select>
                <label className="sr-only" htmlFor="deal-sort">Sort offers</label>
                <select
                  id="deal-sort"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                  className="min-w-48 rounded-full border border-black/20 bg-white px-4 py-2.5 text-sm font-semibold"
                >
                  <option value="featured">MTN catalogue order</option>
                  <option value="low">Offer price: low to high</option>
                  <option value="high">Offer price: high to low</option>
                </select>
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="rounded-full px-3 py-2 text-sm font-semibold underline decoration-[#ffcc00] decoration-2 underline-offset-4">
                    Clear search “{searchQuery}”
                  </button>
                )}
              </div>
            )}

            {feedState === 'loading' && (
              <div role="status" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="animate-pulse border border-black/10 bg-[#f7f6f2]">
                    <div className="h-64 bg-black/5" />
                    <div className="space-y-3 p-5">
                      <div className="h-3 w-1/3 bg-black/10" />
                      <div className="h-6 w-3/4 bg-black/10" />
                      <div className="h-4 w-1/2 bg-black/10" />
                    </div>
                  </div>
                ))}
                <span className="sr-only">Loading offers from MTN’s catalogue.</span>
              </div>
            )}

            {feedState === 'error' && (
              <div role="status" className="grid gap-6 border border-black/15 bg-[#f7f6f2] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#786000]">Official catalogue</p>
                  <h3 className="mt-2 text-2xl font-extrabold">Live offers aren’t available in this preview.</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-black/65">
                    {feedError} No sample prices or products are shown in its place. You can still browse current offers on MTN’s website.
                  </p>
                </div>
                <a
                  href={MTN_PROMOTIONS_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffcc00] px-5 py-3 text-sm font-bold transition hover:bg-black hover:text-white"
                >
                  Visit MTN promotions <ExternalLink size={16} />
                </a>
              </div>
            )}

            {feedState === 'ready' && visibleDeals.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {visibleDeals.map((deal, index) => {
                  const amount = getDealPrice(deal)
                  const duration = getDealDuration(deal)
                  const isWishlisted = wishlist.includes(deal.key)
                  const isCompared = compare.includes(deal.key)

                  return (
                    <motion.article
                      key={deal.key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                      className="group flex flex-col border border-black/10 bg-white transition hover:border-black/35 hover:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.5)]"
                    >
                      <div className="relative h-64 overflow-hidden bg-[#f7f6f2]">
                        <ProductImage deal={deal} />
                        {(deal.promotionTag || deal.category) && (
                          <span className="absolute left-3 top-3 max-w-[75%] truncate bg-[#ffcc00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-black">
                            {deal.promotionTag || deal.category}
                          </span>
                        )}
                        <div className="absolute right-3 top-3 flex gap-2">
                          <button
                            type="button"
                            aria-label={isWishlisted ? `Remove ${getDealName(deal)} from wishlist` : `Add ${getDealName(deal)} to wishlist`}
                            aria-pressed={isWishlisted}
                            onClick={() => toggleWishlist(deal.key)}
                            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${isWishlisted ? 'bg-[#ffcc00] text-black' : 'bg-white/90 text-black hover:bg-[#ffcc00]'}`}
                          >
                            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            type="button"
                            aria-label={isCompared ? `Remove ${getDealName(deal)} from comparison` : `Compare ${getDealName(deal)}`}
                            aria-pressed={isCompared}
                            disabled={!isCompared && compare.length >= 3}
                            onClick={() => toggleCompare(deal.key)}
                            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${isCompared ? 'bg-black text-white' : 'bg-white/90 text-black hover:bg-[#ffcc00]'}`}
                          >
                            {isCompared ? <Check size={16} /> : <Plus size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/55">
                          {deal.brand || deal.categoryName || deal.category}
                          {deal.storage ? ` · ${deal.storage} ${deal.storageUom ?? ''}` : ''}
                        </p>
                        <h3 className="mt-2 text-xl font-extrabold leading-tight">{deal.model || deal.name}</h3>

                        {(deal.totalData || deal.totalMinutes || deal.totalAirtime) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {deal.totalData && <span className="bg-[#f5f4ef] px-2.5 py-1 text-[11px] font-semibold">Data: {deal.totalData} {deal.totalDataUom}</span>}
                            {deal.totalMinutes && <span className="bg-[#f5f4ef] px-2.5 py-1 text-[11px] font-semibold">Minutes: {deal.totalMinutes} {deal.totalMinutesUom}</span>}
                            {deal.totalAirtime && <span className="bg-[#f5f4ef] px-2.5 py-1 text-[11px] font-semibold">Airtime: {deal.totalAirtime} {deal.totalAirtimeUom}</span>}
                          </div>
                        )}

                        <div className="mt-5 min-h-16 border-y border-black/10 py-3">
                          {amount !== undefined ? (
                            <>
                              <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black/55">MTN offer price</span>
                              <p className="text-2xl font-extrabold tracking-tight">{formatCurrency(amount, deal.currencyCode)}</p>
                            </>
                          ) : (
                            <p className="text-sm font-semibold text-black/70">See current price on MTN</p>
                          )}
                          {duration && <p className="mt-1 text-xs text-black/55">Contract term: {duration}</p>}
                        </div>

                        {deal.callouts && deal.callouts.length > 0 && (
                          <ul className="mt-4 space-y-2 text-xs leading-5 text-black/70">
                            {deal.callouts.slice(0, 2).map((callout, calloutIndex) => (
                              <li key={`${deal.key}-callout-${calloutIndex}`} className="flex gap-2">
                                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ffcc00] text-black">
                                  <Check size={10} />
                                </span>
                                {callout}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-auto flex gap-2 pt-5">
                          <button
                            type="button"
                            onClick={() => setSelectedDeal(deal)}
                            className="flex-1 rounded-full bg-[#ffcc00] px-4 py-2.5 text-sm font-bold transition hover:bg-black hover:text-white"
                          >
                            View offer
                          </button>
                          <a
                            href={MTN_PROMOTIONS_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${getDealName(deal)} on MTN`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition hover:border-black"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}

            {feedState === 'ready' && visibleDeals.length === 0 && (
              <div className="border border-black/10 bg-[#f7f6f2] px-6 py-14 text-center">
                <h3 className="text-xl font-extrabold">No matching device offers</h3>
                <p className="mt-2 text-sm text-black/60">Try another brand or search term, or view the full catalogue on MTN.</p>
                <a href={MTN_PROMOTIONS_URL} className="mt-5 inline-flex items-center gap-2 text-sm font-bold underline decoration-[#ffcc00] decoration-2 underline-offset-4">
                  Browse all MTN offers <ArrowRight size={16} />
                </a>
              </div>
            )}

            {feedState === 'ready' && (
              <p className="mt-6 text-xs leading-5 text-black/50">
                Offer availability, pricing, contract terms and eligibility are set by MTN and may change. Confirm the full details on the official offer page.
              </p>
            )}
          </div>
        </section>

        <section className="bg-[#ffcc00] px-4 py-14 sm:px-7 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/65">More from MTN</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                More reasons to stay connected.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-black/70">
                Explore current promotions, device offers and plans directly from MTN. Live availability and terms are confirmed on MTN’s shop.
              </p>
            </div>
            <a
              href={MTN_PROMOTIONS_URL}
              className="group flex min-h-48 items-end justify-between bg-black p-6 text-white transition hover:bg-[#191919] sm:p-8"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#ffcc00]">The official catalogue</span>
                <span className="mt-3 block max-w-xs text-2xl font-extrabold">See every current promotion.</span>
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffcc00] text-black transition group-hover:translate-x-1">
                <ArrowRight size={20} />
              </span>
            </a>
          </div>
        </section>

        <section id="plans" className="px-4 py-16 sm:px-7 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#786000]">Choose your connection</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Made to fit your world.</h2>
              <p className="mt-3 text-sm leading-6 text-black/60">See MTN’s latest plan and home internet options, with current prices and terms on the official site.</p>
            </div>
            <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-4">
              {quickLinks.map((link, index) => (
                <a key={link.title} href={link.href} className="group flex min-h-64 flex-col bg-white p-6 transition hover:bg-[#fff9df] sm:p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffcc00] text-black">
                    {index === 3 ? <Wifi size={21} /> : <Smartphone size={21} />}
                  </span>
                  <h3 className="mt-7 text-2xl font-extrabold">{link.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/60">{link.detail}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold">
                    {link.label} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="connectivity" className="scroll-mt-24 bg-[#f5f4ef] px-4 py-16 sm:px-7 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#786000]">MTN 5G</p>
              <h2 className="mt-3 max-w-xl text-4xl font-extrabold uppercase leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                The future is already here.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-black/65">
                Discover MTN 5G devices and connectivity. Coverage and service availability vary by location; check MTN’s coverage information before choosing a service.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={MTN_PHONES_URL} className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-5 py-3 text-sm font-bold transition hover:bg-black hover:text-white">
                  Find 5G devices <ArrowRight size={16} />
                </a>
                <a href="https://www.mtn.co.za/" className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-3 text-sm font-bold transition hover:border-black">
                  Check coverage <ExternalLink size={15} />
                </a>
              </div>
            </div>

            <div className="relative flex min-h-[330px] items-center justify-center overflow-hidden bg-black p-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,204,0,0.2),_transparent_60%)]" />
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-[#ffcc00]/30">
                <div className="absolute inset-6 rounded-full border border-[#ffcc00]/45" />
                <div className="absolute inset-12 rounded-full border border-[#ffcc00]/60" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#ffcc00] text-black">
                  <Wifi size={35} strokeWidth={1.6} />
                </div>
                <span className="absolute -right-4 top-12 h-2.5 w-2.5 rounded-full bg-[#ffcc00]" />
                <span className="absolute -left-2 bottom-16 h-2 w-2 rounded-full bg-white" />
              </div>
              <div className="absolute bottom-5 left-5 flex items-center gap-2 text-xs font-semibold text-white/80">
                <ShieldCheck size={16} className="text-[#ffcc00]" />
                Coverage depends on location and device
              </div>
            </div>
          </div>
        </section>

        <section id="fibre" className="scroll-mt-24 px-4 py-16 sm:px-7 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 border-y border-black/15 py-8 md:grid-cols-[1fr_auto] md:items-center md:py-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#786000]">Home connectivity</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">A better connection starts at home.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
                Explore MTN fibre and home internet options. Check availability and installation details through MTN’s official service.
              </p>
            </div>
            <a href={MTN_HOME_URL} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffcc00] px-6 py-3 text-sm font-bold transition hover:bg-black hover:text-white">
              Check availability <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section id="business" className="scroll-mt-24 bg-black px-4 py-16 text-white sm:px-7 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffcc00]">MTN Business</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl">Business moves better connected.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
                Explore MTN Business connectivity and digital solutions for organisations of every size.
              </p>
            </div>
            <a href={MTN_BUSINESS_URL} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffcc00] px-6 py-3 text-sm font-bold text-black transition hover:bg-white">
              Visit MTN Business <ExternalLink size={16} />
            </a>
          </div>
        </section>

        <section id="support" className="scroll-mt-24 bg-[#f5f4ef] px-4 py-14 sm:px-7 lg:px-10">
          <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#786000]">MyMTN & support</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em]">Here when you need us.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
                Manage your account or find help through MTN’s official digital channels. This showcase does not collect account details.
              </p>
            </div>
            <a href="https://www.mtn.co.za/" className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3 text-sm font-bold transition hover:border-black">
              Go to MyMTN <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-black px-4 py-12 text-white sm:px-7 lg:px-10">
        <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#home" aria-label="MTN South Africa home">
              <img src={MTN_LOGO} alt="MTN" className="h-12 w-auto" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">MTN South Africa. Everything you need. Connected.</p>
          </div>
          {[
            { title: 'Shop', links: [['Devices', MTN_PHONES_URL], ['Promotions', MTN_PROMOTIONS_URL], ['Plans', MTN_PLANS_URL]] },
            { title: 'Discover', links: [['MTN 5G', '#connectivity'], ['Fibre & home internet', MTN_HOME_URL], ['MTN Business', MTN_BUSINESS_URL]] },
            { title: 'Support', links: [['MyMTN', 'https://www.mtn.co.za/'], ['Contact MTN', 'https://www.mtn.co.za/'], ['Privacy & terms', 'https://www.mtn.co.za/']] },
          ].map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ffcc00]">{column.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="transition hover:text-[#ffcc00]">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-[1440px] border-t border-white/15 pt-5 text-xs text-white/45">
          Product information and availability are provided by MTN and may change. Always confirm offer details and terms on the official MTN website.
          <p className="mt-3">
            Hero footage: “Big city at night from an aerial shot”, made available under the{' '}
            <a className="underline" href="https://mixkit.co/license/#videoFree" target="_blank" rel="noreferrer">Mixkit Stock Video Free License</a>.
            {' '}<a className="underline" href="https://mixkit.co/free-stock-video/big-city-at-night-from-an-aerial-shot-49878/" target="_blank" rel="noreferrer">Video and poster source</a>.
          </p>
        </div>
      </footer>

      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-extrabold">Compare offers ({compare.length}/3)</span>
              {compare.map((key) => {
                const deal = deals.find((item) => item.key === key)
                return deal ? (
                  <span key={key} className="rounded-full bg-[#f5f4ef] px-3 py-1 text-xs font-semibold">{getDealName(deal)}</span>
                ) : null
              })}
            </div>
            <button type="button" onClick={() => setCompare([])} className="text-sm font-bold underline decoration-[#ffcc00] decoration-2 underline-offset-4">
              Clear comparison
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedDeal(null)
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="deal-dialog-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white"
            >
              <button
                type="button"
                aria-label="Close offer details"
                onClick={() => setSelectedDeal(null)}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
              >
                <X size={19} />
              </button>
              <div className="group relative h-64 overflow-hidden bg-[#f7f6f2] sm:h-80">
                <ProductImage deal={selectedDeal} />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#786000]">{selectedDeal.brand || selectedDeal.categoryName || selectedDeal.category}</p>
                <h2 id="deal-dialog-title" className="mt-2 text-3xl font-extrabold">{selectedDeal.model || selectedDeal.name}</h2>
                <p className="mt-2 text-sm text-black/55">
                  {[selectedDeal.storage, selectedDeal.storageUom, selectedDeal.deviceType, selectedDeal.serviceType].filter(Boolean).join(' · ')}
                </p>
                <div className="mt-5 border-y border-black/10 py-4">
                  {getDealPrice(selectedDeal) !== undefined ? (
                    <>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black/55">MTN offer price</p>
                      <p className="mt-1 text-3xl font-extrabold">{formatCurrency(getDealPrice(selectedDeal)!, selectedDeal.currencyCode)}</p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold">See current price on MTN.</p>
                  )}
                  {getDealDuration(selectedDeal) && <p className="mt-1 text-sm text-black/60">Contract term: {getDealDuration(selectedDeal)}</p>}
                </div>
                {selectedDeal.productDetails && <p className="mt-5 whitespace-pre-line text-sm leading-6 text-black/70">{selectedDeal.productDetails}</p>}
                {(selectedDeal.deviceTerms || selectedDeal.planTerms) && (
                  <p className="mt-4 whitespace-pre-line text-xs leading-5 text-black/55">{selectedDeal.deviceTerms || selectedDeal.planTerms}</p>
                )}
                {[...(selectedDeal.freebies ?? []), ...(selectedDeal.planFreebies ?? [])].length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-extrabold">Included with this offer</h3>
                    <ul className="mt-2 space-y-2">
                      {[...(selectedDeal.freebies ?? []), ...(selectedDeal.planFreebies ?? [])].map((freebie, index) => (
                        <li key={freebie.id ?? `${freebie.name}-${index}`} className="flex gap-2 text-sm text-black/70">
                          <Check size={16} className="mt-0.5 shrink-0 text-[#806500]" />
                          <span>{freebie.name}{freebie.description ? ` — ${freebie.description}` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={MTN_PROMOTIONS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-5 py-3 text-sm font-bold transition hover:bg-black hover:text-white">
                    View on MTN <ExternalLink size={15} />
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(selectedDeal.key)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-bold transition hover:border-black"
                  >
                    <Heart size={15} fill={wishlist.includes(selectedDeal.key) ? 'currentColor' : 'none'} />
                    {wishlist.includes(selectedDeal.key) ? 'Saved' : 'Save offer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
