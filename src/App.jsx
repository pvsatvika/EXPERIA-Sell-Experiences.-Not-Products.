import React, { useState, useEffect } from 'react'
import GhostFibers from './components/GhostFibers'

// ============================================================================
// 3D ROTATING SPATIAL EXPERIENCE SELECTOR (CAROUSEL COMPONENT)
// ============================================================================
function SpatialCarousel({ items, onSelectExperience, onAddToCart, getBadgeClass, getRealityNatureLabel }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  // Reset carousel index when items array changes (e.g. when filter changes)
  useEffect(() => {
    setCurrentIndex(0)
  }, [items.length])

  // Subtle auto-rotation (pauses on hover or interaction)
  useEffect(() => {
    if (items.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [items.length, isHovered])

  // Keyboard left/right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (items.length <= 1) return
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [items.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  // Touch Swipe Handlers for Mobile & Tablet
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (diff > 40) {
      handleNext()
    } else if (diff < -40) {
      handlePrev()
    }
    setTouchStart(null)
  }

  if (!items || items.length === 0) return null

  return (
    <div
      className="relative w-full max-w-6xl mx-auto my-4 px-2 sm:px-6 py-6 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD Header for 3D Selector */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SPATIAL MATRIX 3D SELECTOR</span>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
          <span className="text-cyan-300 font-extrabold">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-slate-600">/</span>
          <span>{String(items.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* 3D Perspective Stage Container */}
      <div className="relative h-[440px] sm:h-[460px] flex items-center justify-center perspective-spatial">
        {items.map((item, index) => {
          let offset = index - currentIndex
          if (items.length > 1) {
            if (offset > items.length / 2) {
              offset -= items.length
            } else if (offset < -items.length / 2) {
              offset += items.length
            }
          }

          const isCenter = offset === 0
          const isLeft = offset === -1
          const isRight = offset === 1
          const isFarLeft = offset === -2
          const isFarRight = offset === 2
          const isVisible = Math.abs(offset) <= 2

          if (!isVisible) return null

          let transformStyle = ''
          let zIndex = 10
          let opacity = 0.5

          if (isCenter) {
            transformStyle = 'translateX(0%) scale(1) translateZ(0px) rotateY(0deg)'
            zIndex = 30
            opacity = 1
          } else if (isLeft) {
            transformStyle = 'translateX(-58%) scale(0.82) translateZ(-120px) rotateY(16deg)'
            zIndex = 20
            opacity = 0.7
          } else if (isRight) {
            transformStyle = 'translateX(58%) scale(0.82) translateZ(-120px) rotateY(-16deg)'
            zIndex = 20
            opacity = 0.7
          } else if (isFarLeft) {
            transformStyle = 'translateX(-100%) scale(0.68) translateZ(-220px) rotateY(28deg)'
            zIndex = 10
            opacity = 0.3
          } else if (isFarRight) {
            transformStyle = 'translateX(100%) scale(0.68) translateZ(-220px) rotateY(-28deg)'
            zIndex = 10
            opacity = 0.3
          }

          const badgeClass = getBadgeClass(item.realityType || item.category)
          const isMars = item.title?.toLowerCase().includes('mars expedition')

          return (
            <div
              key={item._id || index}
              onClick={() => {
                if (isCenter) {
                  onSelectExperience(item)
                } else {
                  setCurrentIndex(index)
                }
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                pointerEvents: 'auto'
              }}
              className={`absolute w-[88%] sm:w-[360px] md:w-[410px] h-[410px] sm:h-[430px] rounded-3xl p-5 flex flex-col justify-between transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) cursor-pointer preserve-3d ${
                isCenter
                  ? 'glass-card border-cyan-400/80 shadow-2xl shadow-cyan-500/25 ring-1 ring-cyan-400/40 bg-slate-900/90'
                  : 'glass-panel border-white/15 bg-slate-950/75 hover:border-cyan-400/50 hover:opacity-90'
              }`}
            >
              {/* Cover Image */}
              <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-white/10 shrink-0">
                <img
                  src={item.image}
                  alt={item.title || 'Experience'}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-amber-300 text-xs font-mono font-bold">
                  ★ {item.rating || 4.8}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                  {getRealityNatureLabel(item.realityType || item.category)}
                </div>
              </div>

              {/* Card Content Body */}
              <div className="flex flex-col justify-between flex-1 mt-3 min-h-0">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${badgeClass}`}>
                      {item.realityType || item.category || 'IMMERSIVE'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">⏳ {item.duration || 'Flex'}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-1 font-mono truncate">
                    📍 {item.location || 'Global Portal'}
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide truncate mb-1">
                    {item.title || 'Untitled Experience'}
                  </h3>

                  {/* Mars Simulation Warning */}
                  {isMars && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-medium mb-1 backdrop-blur-sm">
                      <span>⚠</span>
                      <span>Immersive simulation — NOT an actual trip to Mars.</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Experience Pass</span>
                    <span className="text-lg font-extrabold font-mono text-white">
                      ₹{typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : (item.price || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart(item)
                      }}
                      className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-400/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer"
                      title="Add to Cart"
                    >
                      + CART
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isCenter) {
                          onSelectExperience(item)
                        } else {
                          setCurrentIndex(index)
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isCenter
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/30 border border-cyan-300/40'
                          : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                      }`}
                    >
                      {isCenter ? 'ENTER' : 'ROTATE'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl glass-panel hover:border-cyan-400/60 text-cyan-300 hover:text-white flex items-center justify-center text-2xl font-bold transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
        title="Previous Experience (Left Arrow)"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl glass-panel hover:border-cyan-400/60 text-cyan-300 hover:text-white flex items-center justify-center text-2xl font-bold transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
        title="Next Experience (Right Arrow)"
      >
        ›
      </button>

      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
function App() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters & Controls
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Featured')

  // View Navigation State: 'marketplace' | 'cart' | 'checkout' | 'confirmation'
  const [currentView, setCurrentView] = useState('marketplace')

  // Cart State
  const [cart, setCart] = useState([])
  const [toastNotification, setToastNotification] = useState(null)

  // Customer Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [placedOrder, setPlacedOrder] = useState(null)

  // Selected Experience Detail Modal State
  const [selectedExperience, setSelectedExperience] = useState(null)

  // React Bits Glow Cursor State
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 })

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/products')
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setExperiences(result.data)
      } else {
        throw new Error(result.message || 'Failed to parse experiences data')
      }
    } catch (err) {
      console.error('Error fetching experiences:', err)
      setError('Unable to connect to the experience database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  // Glow Cursor Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // CHECKOUT PROTECTION SAFETY HOOK
  useEffect(() => {
    if (currentView === 'checkout' && cart.length === 0) {
      setCurrentView('cart')
    }
  }, [currentView, cart.length])

  // Toast Notification
  const showToast = (msg) => {
    setToastNotification(msg)
    setTimeout(() => {
      setToastNotification(null)
    }, 3000)
  }

  // Cart Management
  const handleAddToCart = (item) => {
    if (!item) return
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (cItem) => (cItem._id && cItem._id === item._id) || cItem.title === item.title
      )
      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex].quantity += 1
        return updated
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
    showToast(`Pass for "${item.title || 'Experience'}" added to EXPERIA Cart!`)
  }

  const updateCartQuantity = (idOrTitle, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === idOrTitle || item.title === idOrTitle) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const removeFromCart = (idOrTitle) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== idOrTitle && item.title !== idOrTitle))
  }

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)

  // Place Order API Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (isPlacingOrder) return // Prevent duplicate submissions
    setOrderError(null)

    if (!checkoutForm.name.trim() || !checkoutForm.email.trim() || !checkoutForm.phone.trim()) {
      setOrderError('Please complete all customer information fields (Full Name, Email, Phone Number).')
      return
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty. Please add experiences before placing an order.')
      setCurrentView('cart')
      return
    }

    try {
      setIsPlacingOrder(true)

      const payload = {
        user: {
          name: checkoutForm.name.trim(),
          email: checkoutForm.email.trim(),
          phone: checkoutForm.phone.trim()
        },
        items: cart.map((item) => ({
          product: item._id && item._id.length === 24 ? item._id : undefined,
          title: item.title || 'Experience Pass',
          price: typeof item.price === 'number' ? item.price : 0,
          quantity: item.quantity || 1
        })),
        totalAmount: cartTotal
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Server responded with HTTP ${response.status}`)
      }

      // Order success!
      setPlacedOrder(result.data)
      setCart([]) // Clear cart only after success!
      setCurrentView('confirmation')
    } catch (err) {
      console.error('Failed to create order:', err)
      setOrderError(err.message || 'Unable to communicate with order server.')
      // Keep cart intact on error!
    } finally {
      setIsPlacingOrder(false)
    }
  }

  // Reality Filter Match Helper
  const matchesRealityFilter = (item, filter) => {
    if (!item) return false
    if (filter === 'ALL') return true
    const typeStr = (item.realityType || item.category || '').toUpperCase()
    if (filter === 'REAL-WORLD') {
      return typeStr.includes('REAL') || typeStr.includes('OCEAN') || typeStr.includes('FLIGHT')
    }
    if (filter === 'IMMERSIVE') {
      return (
        typeStr.includes('IMMERSIVE') ||
        typeStr.includes('SIMULATION') ||
        typeStr.includes('RACING') ||
        typeStr.includes('ART') ||
        typeStr.includes('CITY') ||
        typeStr.includes('MARS') ||
        typeStr.includes('MOON') ||
        typeStr.includes('TIME')
      )
    }
    if (filter === 'FUTURE CONCEPT') {
      return (
        typeStr.includes('CONCEPT') ||
        typeStr.includes('FUTURE') ||
        typeStr.includes('SPACE') ||
        typeStr.includes('SUBMERGED')
      )
    }
    return true
  }

  // Filtered dataset for Carousel
  const experiencesByFilter = experiences.filter((item) => matchesRealityFilter(item, activeFilter))

  // Filtered dataset for Grid
  const filteredExperiences = experiencesByFilter.filter((item) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
  })

  // Sorted dataset for Grid
  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    if (sortBy === 'Price: Low → High') return (a.price || 0) - (b.price || 0)
    if (sortBy === 'Price: High → Low') return (b.price || 0) - (a.price || 0)
    if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  // Reality Badge Styling
  const getBadgeClass = (realityType) => {
    const typeStr = (realityType || '').toUpperCase()
    if (typeStr.includes('REAL')) return 'badge-realworld'
    if (typeStr.includes('FUTURE') || typeStr.includes('CONCEPT')) return 'badge-future'
    return 'badge-immersive'
  }

  // Reality Nature Sub-label
  const getRealityNatureLabel = (realityType) => {
    const typeStr = (realityType || '').toUpperCase()
    if (typeStr.includes('REAL')) return 'Real-World Experience'
    if (typeStr.includes('FUTURE') || typeStr.includes('CONCEPT')) return 'Future Concept Preview'
    return 'VR / AR Simulation'
  }

  return (
    <div className="min-h-screen bg-space-mesh text-slate-100 relative overflow-x-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Glow Cursor Spotlight */}
      <div
        className="glow-cursor-spotlight hidden lg:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`
        }}
      />

      {/* Ambient Lighting Background */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-indigo-600/10 rounded-full blur-[170px] pointer-events-none animate-ambient-pulse" />
      <div className="absolute top-1/2 right-5 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-5 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 glass-card px-5 py-3 rounded-2xl border border-cyan-400/60 shadow-2xl shadow-cyan-500/30 text-white text-xs font-mono font-bold flex items-center gap-3 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* HUD NAVBAR */}
      <header className="relative z-30 container mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 glass-panel mt-4 rounded-2xl">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentView('marketplace')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-xl animate-levitate">
            E
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-widest gradient-title leading-none">EXPERIA</span>
            <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase mt-1">SELL EXPERIENCES, NOT PRODUCTS</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-xs font-mono font-medium tracking-wider text-slate-300">
          <button
            onClick={() => setCurrentView('marketplace')}
            className={`hover:text-cyan-300 transition-colors uppercase cursor-pointer ${currentView === 'marketplace' ? 'text-cyan-400 font-bold border-b border-cyan-400 pb-0.5' : ''}`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setCurrentView('cart')}
            className={`hover:text-cyan-300 transition-colors uppercase cursor-pointer ${currentView === 'cart' ? 'text-cyan-400 font-bold border-b border-cyan-400 pb-0.5' : ''}`}
          >
            EXPERIA Cart ({cartCount})
          </button>
          {cart.length > 0 && (
            <button
              onClick={() => setCurrentView('checkout')}
              className={`hover:text-cyan-300 transition-colors uppercase cursor-pointer ${currentView === 'checkout' ? 'text-cyan-400 font-bold border-b border-cyan-400 pb-0.5' : ''}`}
            >
              Checkout
            </button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('cart')}
            className="glass-button px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white flex items-center gap-2 cursor-pointer border border-cyan-500/30 hover:scale-105 transition-transform"
          >
            <span>EXPERIA CART</span>
            <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-400/50 flex items-center justify-center text-[10px] font-mono text-cyan-300 font-extrabold">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* VIEW 1: MARKETPLACE */}
      {/* ==================================================================== */}
      {currentView === 'marketplace' && (
        <>
          {/* HERO — CHOOSE YOUR REALITY WITH GHOSTFIBERS ATMOSPHERE */}
          <section className="relative z-20 container mx-auto px-6 pt-12 pb-10 text-center flex flex-col items-center justify-center min-h-[320px] rounded-3xl overflow-hidden glass-panel border border-white/10 my-4 shadow-2xl">
            {/* Layer 0: Absolute Background Layer for GhostFibers */}
            <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
              <GhostFibers
                lineColor="#2563eb"
                glowColor="#38bdf8"
                speed={0.55}
                scale={1}
                rotation={0}
                rotationSpeed={0.08}
                layers={8}
                waveAmplitude={0.12}
                waveFrequency={2.5}
                waveSpeed={0.7}
                layerSpeed={0.08}
                twist={0.18}
                twistFrequency={5}
                twistSpeed={1.2}
                lineFrequency={4}
                lineSpacing={1.5}
                lineSharpness={7}
                glowFalloff={7}
                glowIntensity={1}
                brightness={1.8}
                blueBoost={1.15}
                vignette={0.65}
                grain={0}
                dpr={1.25}
                lightMode={false}
                className="w-full h-full"
              />
            </div>

            {/* Layer 1: Dedicated Contrast Overlay (Radial Darkening in Center for Readability) */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(5, 8, 25, 0.78) 0%, rgba(5, 8, 25, 0.55) 42%, rgba(5, 8, 25, 0.22) 75%, rgba(5, 8, 25, 0.08) 100%)'
              }}
            />

            {/* Layer 2: Foreground Content Layer */}
            <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto py-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-slate-900/70 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-widest mb-6 animate-levitate shadow-lg shadow-cyan-500/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                10 EXPERIENCES • 3 REALITY TYPES
              </div>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-400 bg-clip-text text-transparent max-w-5xl leading-none uppercase drop-shadow-lg"
                style={{
                  textShadow: '0 0 28px rgba(96, 165, 250, 0.28)'
                }}
              >
                CHOOSE YOUR REALITY
              </h1>

              <p
                className="text-xl md:text-2xl font-medium tracking-wide mb-3"
                style={{ color: 'rgba(226, 232, 240, 0.95)' }}
              >
                Sell Experiences. Not Products.
              </p>

              <p
                className="text-base md:text-lg max-w-2xl font-light leading-relaxed mb-4"
                style={{ color: 'rgba(203, 213, 225, 0.88)' }}
              >
                Discover extraordinary access passes across real-world journeys, immersive VR simulations and future concepts.
              </p>
            </div>
          </section>

          {/* REALITY TYPE FILTERS */}
          <section className="relative z-20 container mx-auto px-6 mb-6" id="filters">
            <div className="glass-panel p-4 sm:p-6 rounded-3xl flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {['ALL', 'REAL-WORLD', 'IMMERSIVE', 'FUTURE CONCEPT'].map((filter) => {
                const isActive = activeFilter === filter
                const count = experiences.filter((item) => matchesRealityFilter(item, filter)).length

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider cursor-pointer transition-all duration-300 border flex items-center gap-2 ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-105'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{filter}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-cyan-400 text-black font-extrabold' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ROTATING SPATIAL EXPERIENCE SELECTOR (3D CAROUSEL) */}
          <section className="relative z-20 container mx-auto px-6 mb-12" id="selector">
            {!loading && !error && (
              <SpatialCarousel
                items={experiencesByFilter}
                onSelectExperience={(exp) => setSelectedExperience(exp)}
                onAddToCart={handleAddToCart}
                getBadgeClass={getBadgeClass}
                getRealityNatureLabel={getRealityNatureLabel}
              />
            )}
          </section>

          {/* SEARCH & SORT CONTROLS */}
          <section className="relative z-20 container mx-auto px-6 mb-8">
            <div className="glass-panel p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                ALL MARKETPLACE EXPERIENCES ({sortedExperiences.length})
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                {/* Search Input */}
                <div className="relative flex-1 sm:flex-initial min-w-[220px]">
                  <input
                    type="text"
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="spatial-input w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500 text-xs">🔍</span>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="spatial-input px-4 py-2.5 rounded-xl text-xs text-slate-200 cursor-pointer focus:outline-none appearance-none pr-8 font-mono"
                  >
                    <option value="Featured" className="bg-slate-900 text-white">
                      Sort: Featured
                    </option>
                    <option value="Price: Low → High" className="bg-slate-900 text-white">
                      Price: Low → High
                    </option>
                    <option value="Price: High → Low" className="bg-slate-900 text-white">
                      Price: High → Low
                    </option>
                    <option value="Rating" className="bg-slate-900 text-white">
                      Sort by Rating
                    </option>
                  </select>
                  <span className="absolute right-3 top-3 text-slate-400 text-[10px] pointer-events-none">▼</span>
                </div>
              </div>
            </div>
          </section>

          {/* MARKETPLACE GRID */}
          <main className="relative z-20 container mx-auto px-6 mb-20 flex-1" id="marketplace">
            {/* 1. PRODUCT LOADING STATE */}
            {loading && (
              <div className="text-center my-12 py-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-sm tracking-widest uppercase animate-pulse mb-8 shadow-lg shadow-cyan-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>LOADING EXPERIENCES...</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="glass-card p-6 rounded-3xl animate-pulse h-[530px] flex flex-col justify-between border border-white/10">
                      <div className="w-full h-48 bg-white/10 rounded-2xl mb-4" />
                      <div className="h-6 bg-white/10 rounded w-2/3 mb-3" />
                      <div className="h-4 bg-white/5 rounded w-full mb-2" />
                      <div className="h-4 bg-white/5 rounded w-4/5 mb-6" />
                      <div className="h-10 bg-white/10 rounded-xl w-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. API ERROR STATE */}
            {!loading && error && (
              <div className="w-full max-w-2xl mx-auto glass-card p-8 sm:p-10 rounded-3xl border border-red-500/40 text-center my-12 shadow-2xl shadow-red-500/10">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/30">
                  ⚠️
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
                  EXPERIENCES TEMPORARILY UNAVAILABLE
                </h3>
                <p className="text-slate-400 text-sm mb-6 font-mono font-light">
                  Unable to connect to the experience database.
                </p>
                <button
                  onClick={fetchExperiences}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-indigo-600 hover:from-red-400 hover:to-indigo-500 text-white text-xs font-mono font-black uppercase tracking-wider shadow-lg cursor-pointer transition-all hover:scale-105"
                >
                  RETRY
                </button>
              </div>
            )}

            {/* 3. EMPTY SEARCH / FILTER RESULTS STATE */}
            {!loading && !error && sortedExperiences.length === 0 && (
              <div className="glass-panel p-12 rounded-3xl text-center max-w-xl mx-auto my-12 border border-white/10">
                <span className="text-5xl mb-4 block">🌌</span>
                <h3 className="text-2xl font-extrabold text-white mb-2 uppercase tracking-wide">
                  NO EXPERIENCES FOUND
                </h3>
                <p className="text-slate-400 text-sm mb-6 font-light">
                  No spatial access passes match your filter criteria or search query.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('ALL')
                    setSearchQuery('')
                  }}
                  className="px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
                >
                  CLEAR FILTERS
                </button>
              </div>
            )}

            {/* Equal-Sized Marketplace Grid */}
            {!loading && !error && sortedExperiences.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedExperiences.map((item, index) => {
                  const badgeClass = getBadgeClass(item.realityType || item.category)
                  const isMars = item.title?.toLowerCase().includes('mars expedition')

                  return (
                    <div
                      key={item._id || index}
                      onClick={() => setSelectedExperience(item)}
                      className="glass-card p-6 rounded-3xl relative flex flex-col justify-between group h-[530px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:z-20 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/60 cursor-pointer"
                    >
                      {/* Cover Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 mb-4 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title || 'Experience'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src =
                              'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-amber-300 text-xs font-bold font-mono">
                          ★ {item.rating || 4.8}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-slate-300">
                          {getRealityNatureLabel(item.realityType || item.category)}
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="flex flex-col justify-between flex-1 min-h-0">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full font-mono uppercase tracking-wider ${badgeClass}`}>
                              {item.realityType || item.category || 'IMMERSIVE'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">⏳ {item.duration || 'Flex'}</span>
                          </div>

                          <div className="text-xs text-slate-400 mb-1.5 font-mono truncate">
                            📍 {item.location || 'Global Portal'}
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 tracking-wide truncate group-hover:text-cyan-300 transition-colors">
                            {item.title || 'Untitled Experience'}
                          </h3>

                          {/* Mars Simulation Disclaimer Pill */}
                          {isMars && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-medium mb-2 backdrop-blur-sm">
                              <span>⚠</span>
                              <span>Immersive simulation — NOT an actual trip to Mars.</span>
                            </div>
                          )}

                          <p className="text-slate-400 text-sm leading-relaxed font-light line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-mono">Pass Value</span>
                            <span className="text-xl font-extrabold text-white font-mono">
                              ₹{typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : (item.price || 0)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(item)
                            }}
                            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-400/30 border border-cyan-400/40 text-xs font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-lg"
                          >
                            + ADD TO CART
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </>
      )}

      {/* VIEW 2: EXPERIA CART */}
      {currentView === 'cart' && (
        <section className="relative z-20 container mx-auto px-6 py-8 flex-1 max-w-4xl">
          {/* Breadcrumb */}
          <button
            onClick={() => setCurrentView('marketplace')}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            ← BACK TO MARKETPLACE
          </button>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8">
            <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">EXPERIA CART</h2>
                <p className="text-xs text-cyan-300 font-mono mt-1">RESERVED SPATIAL ACCESS PASSES ({cartCount})</p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* 4. EMPTY CART STATE */}
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl mb-4 block">🛒</span>
                <h3 className="text-2xl font-extrabold text-white mb-2 uppercase tracking-wide">
                  YOUR EXPERIA CART IS EMPTY
                </h3>
                <p className="text-slate-400 text-sm mb-6 font-light">
                  Explore extraordinary real-world journeys, VR simulations and future concepts to add pass reservations.
                </p>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono text-xs font-extrabold tracking-wider uppercase cursor-pointer hover:scale-105 transition-all shadow-xl shadow-cyan-500/25 border border-cyan-300/40"
                >
                  EXPLORE EXPERIENCES
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => {
                  const itemTotal = (item.price || 0) * (item.quantity || 1)
                  const idOrTitle = item._id || item.title

                  return (
                    <div
                      key={idOrTitle || idx}
                      className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.image}
                          alt={item.title || 'Experience'}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src =
                              'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider mb-1 inline-block ${getBadgeClass(item.realityType || item.category)}`}>
                            {item.realityType || item.category || 'IMMERSIVE'}
                          </span>
                          <h4 className="text-base font-bold text-white truncate">{item.title || 'Experience Pass'}</h4>
                          <span className="text-xs font-mono text-slate-400 block">
                            Unit Price: ₹{(item.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateCartQuantity(idOrTitle, -1)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm font-mono font-bold w-6 text-center text-cyan-300">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idOrTitle, 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono block">Subtotal</span>
                          <span className="text-base font-extrabold font-mono text-white">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(idOrTitle)}
                          className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-sm cursor-pointer border border-red-500/20 transition-colors"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Cart Summary */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Total Pass Value</span>
                    <span className="text-3xl font-black font-mono text-white">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentView('marketplace')}
                      className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 cursor-pointer border border-white/10"
                    >
                      CONTINUE BROWSING
                    </button>
                    <button
                      onClick={() => setCurrentView('checkout')}
                      className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-extrabold tracking-wider shadow-xl shadow-cyan-500/25 border border-cyan-300/40 cursor-pointer hover:scale-105 transition-all"
                    >
                      PROCEED TO CHECKOUT →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* VIEW 3: EXPERIA CHECKOUT */}
      {currentView === 'checkout' && (
        <section className="relative z-20 container mx-auto px-6 py-8 flex-1 max-w-5xl">
          {/* Breadcrumb */}
          <button
            onClick={() => setCurrentView('cart')}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            ← BACK TO EXPERIA CART
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Customer Information Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                <h2 className="text-2xl font-extrabold text-white mb-2 tracking-wide uppercase">1. CUSTOMER INFORMATION (EXPERIA CHECKOUT)</h2>
                <p className="text-xs text-slate-400 font-mono mb-6">Enter your explorer identity details to receive spatial passes.</p>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Vikram Sharma"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      required
                      className="spatial-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. vikram@experia.io"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      required
                      className="spatial-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      required
                      className="spatial-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="mt-6 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-mono space-y-1">
                    <span className="font-bold uppercase block text-cyan-200">⚡ HACKATHON SPATIAL VERIFICATION</span>
                    <p className="font-light text-slate-300">
                      Payment gateway integration is simulated for this hackathon prototype. Clicking "PLACE ORDER" immediately reserves your experience passes in MongoDB Atlas.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary & Place Order Button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-xl font-extrabold text-white mb-2 tracking-wide uppercase">2. ORDER SUMMARY</h2>
                  <p className="text-xs text-slate-400 font-mono mb-6">Review your reserved experiences before confirmation.</p>

                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                    {cart.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
                        <div className="pr-2">
                          <span className="font-bold text-white block">{item.title || 'Experience'}</span>
                          <span className="text-slate-400 font-mono">
                            Qty: {item.quantity || 1} × ₹{(item.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-white shrink-0">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">FINAL TOTAL</span>
                      <span className="text-2xl font-black font-mono text-cyan-300">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* 6. ORDER ERROR STATE */}
                  {orderError && (
                    <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono mb-6">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <span>⚠️</span>
                        <span>ORDER CREATION FAILED</span>
                      </div>
                      <p>{orderError}</p>
                    </div>
                  )}
                </div>

                {/* Place Order Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || cart.length === 0}
                  className={`w-full py-4 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
                    isPlacingOrder
                      ? 'bg-slate-700 text-slate-400 border border-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white shadow-cyan-500/25 border border-cyan-300/50 hover:scale-[1.02]'
                  }`}
                >
                  {isPlacingOrder ? 'Processing Order...' : 'PLACE ORDER (SECURE PASSES)'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* VIEW 4: ORDER CONFIRMATION */}
      {/* ==================================================================== */}
      {currentView === 'confirmation' && placedOrder && (
        <section className="relative z-20 container mx-auto px-6 py-12 flex-1 max-w-3xl">
          <div className="glass-card p-8 sm:p-12 rounded-3xl text-center border border-cyan-400/60 shadow-2xl shadow-cyan-500/30">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl shadow-cyan-500/40 animate-levitate">
              ✓
            </div>

            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-4 py-1.5 rounded-full border border-cyan-500/30 inline-block mb-3">
              CONFIRMATION CODE: #{placedOrder._id ? placedOrder._id.slice(-8).toUpperCase() : 'RES-2040'}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mb-2 uppercase">
              EXPERIENCE RESERVED
            </h1>

            <p className="text-slate-300 text-sm font-light mb-8 max-w-md mx-auto">
              Your spatial access passes have been successfully generated and issued to your account.
            </p>

            <div className="glass-panel p-6 rounded-2xl text-left space-y-4 mb-8 text-xs font-mono border border-white/10">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-slate-400 uppercase">Order ID</span>
                <span className="text-white font-bold">{placedOrder._id || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-slate-400 uppercase">Order Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  {placedOrder.status || 'Confirmed'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-slate-400 uppercase">Customer Name</span>
                <span className="text-white font-bold">{placedOrder.user?.name || 'Guest Explorer'}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-slate-400 uppercase">Contact Info</span>
                <span className="text-slate-200">
                  {placedOrder.user?.email || 'N/A'} • {placedOrder.user?.phone || 'N/A'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 uppercase block mb-2 font-bold">Ordered Experiences</span>
                <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
                  {placedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-200">
                      <span>
                        • {item.title || 'Experience Pass'} <span className="text-cyan-400 font-bold">(x{item.quantity || 1})</span>
                      </span>
                      <span className="font-bold text-white">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-sm font-bold">
                <span className="text-cyan-300 uppercase">Total Amount Paid</span>
                <span className="text-xl text-white font-mono">
                  ₹{typeof placedOrder.totalAmount === 'number' ? placedOrder.totalAmount.toLocaleString('en-IN') : 0}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setPlacedOrder(null)
                setCurrentView('marketplace')
              }}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-extrabold tracking-wider shadow-xl shadow-cyan-500/30 border border-cyan-300/40 cursor-pointer hover:scale-105 transition-all uppercase"
            >
              EXPLORE EXPERIENCES
            </button>
          </div>
        </section>
      )}

      {/* EXPERIENCE DETAIL MODAL */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl relative border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedExperience(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-lg font-bold border border-white/10 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6 border border-white/10">
              <img
                src={selectedExperience.image}
                alt={selectedExperience.title || 'Experience'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
                }}
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full font-mono uppercase tracking-wider ${getBadgeClass(
                    selectedExperience.realityType || selectedExperience.category
                  )}`}
                >
                  {selectedExperience.realityType || selectedExperience.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-amber-300 text-xs font-mono font-bold">
                ★ {selectedExperience.rating || 4.8}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
              <span>📍 {selectedExperience.location || 'Global Portal'}</span>
              <span>⏳ {selectedExperience.duration || 'Flex'}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {selectedExperience.title || 'Untitled Experience'}
            </h2>

            {selectedExperience.title?.toLowerCase().includes('mars expedition') && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-medium mb-4 backdrop-blur-sm">
                <span className="text-base">⚠</span>
                <span>Immersive simulation — NOT an actual trip to Mars.</span>
              </div>
            )}

            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
              {selectedExperience.description}
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono block">Pass Price</span>
                <span className="text-2xl font-extrabold text-white font-mono">
                  ₹{typeof selectedExperience.price === 'number' ? selectedExperience.price.toLocaleString('en-IN') : (selectedExperience.price || 0)}
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleAddToCart(selectedExperience)
                    setSelectedExperience(null)
                  }}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-mono font-extrabold text-white shadow-xl shadow-cyan-500/25 cursor-pointer border border-cyan-300/40 transition-all hover:scale-105"
                >
                  ADD PASS TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>EXPERIA &copy; {new Date().getFullYear()} — 2040 Spatial Experience Engine • Sell Experiences, Not Products</p>
      </footer>
    </div>
  )
}

export default App



