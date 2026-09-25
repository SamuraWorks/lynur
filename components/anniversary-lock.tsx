'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { WaxSeal } from '@/components/wax-seal'
import { saveAnniversaryEntered, isAnniversaryEntered, DEV_MODE } from '@/lib/unlock'

interface AnniversaryLockProps {
  onUnlock: () => void
}

export function AnniversaryLock({ onUnlock }: AnniversaryLockProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<'seal' | 'countdown' | 'invite'>('seal')
  const [shouldCrack, setShouldCrack] = useState(false)
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Target: September 26, 12:00 AM of the current year
  const getTargetDate = () => {
    const year = new Date().getFullYear()
    return new Date(year, 8, 26, 0, 0, 0) // Month 8 is September (0-indexed)
  }

  useEffect(() => {
    setMounted(true)
    // If the archive was already entered this session, skip straight in
    if (isAnniversaryEntered()) {
      onUnlock()
      return
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anniversary_seal_broken')
      if (saved === 'true') {
        setStep('invite')
      }
    }
  }, [onUnlock])

  useEffect(() => {
    const target = getTargetDate()

    const updateCountdown = () => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()

      if (DEV_MODE || diff <= 0) {
        // Door is ready — move to the invitation
        setStep((current) => (current === 'countdown' ? 'invite' : current))
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTime({ days, hours, minutes, seconds })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleBreakSeal = () => setShouldCrack(true)

  const handleCrackComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anniversary_seal_broken', 'true')
    }
    setStep('countdown')
  }

  const handleEnter = () => {
    saveAnniversaryEntered()
    onUnlock()
  }

  if (!mounted) return null

  const pad = (n: number) => n.toString().padStart(2, '0')

  const countdownUnits = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8E8] via-[#FFE3E8] to-[#EAF7F2] px-6 py-24">
      {/* Background photo of Julia */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/gallery/gallery-027.jpeg"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E8]/80 via-[#FFE3E8]/60 to-[#EAF7F2]/85" />
      </div>
      {/* Background Sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 7 + 13) % 100}%`,
              top: `${(i * 11 + 7) % 100}%`,
              animation: `sparkle ${5 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#E45B70" className="opacity-30">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        ))}
      </div>
      <div className="grain grain-5 pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-xl">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Wax Seal ─────────────────────────────── */}
          {step === 'seal' && (
            <motion.div
              key="seal-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <div className="flex flex-col items-center gap-6">
                <span className="text-6xl animate-hero-pulse">✨💗</span>
                <WaxSeal pulse={!shouldCrack} shouldCrack={shouldCrack} onCrack={handleCrackComplete} size={110} />
              </div>

              <div className="max-w-md space-y-4">
                <p className="font-cormorant text-[28px] italic leading-tight text-[#30241F] sm:text-[32px]">
                  &ldquo;Some stories deserve the right moment before they are reopened.&rdquo;
                </p>
                <p className="font-jost text-xs uppercase tracking-[0.18em] text-[#806F63]">
                  Julia and Suliaman&rsquo;s story is waiting behind this little door.
                </p>
                <p className="pt-2 font-dancing text-[32px] text-[#C83E5B]">
                  Ly nur &mdash; my light.
                </p>
              </div>

              <button
                onClick={handleBreakSeal}
                disabled={shouldCrack}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-[#E45B70]/40 bg-[#FFF9F0] px-8 py-3 font-jost text-xs uppercase tracking-[0.2em] text-[#C83E5B] transition-all hover:border-[#E45B70] disabled:opacity-50"
              >
                <span>🌙</span>
                <span>{shouldCrack ? 'Breaking Seal...' : 'Break The Seal'}</span>
              </button>
            </motion.div>
          )}

          {/* ── Step 2: Countdown ────────────────────────────── */}
          {step === 'countdown' && (
            <motion.div
              key="countdown-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-10 text-center"
            >
              <span className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>⏳</span>

              <div className="space-y-3">
                <h2 className="font-cormorant text-[42px] tracking-tight text-[#30241F]">The next page is close.</h2>
                <p className="mx-auto max-w-sm font-jost text-base leading-relaxed text-[#6D5B50]">
                  Something meaningful is waiting on the other side.
                  <br />
                  Every passing moment brings you closer.
                </p>
              </div>

              <div className="flex items-stretch justify-center gap-3 sm:gap-4">
                {countdownUnits.map((u) => (
                  <div
                    key={u.label}
                    className="flex min-w-[70px] flex-col items-center border border-[#D8CBBE] bg-[#FFF9F0] px-3 py-4 shadow-sm sm:min-w-[85px]"
                  >
                    <span className="font-cormorant text-4xl font-semibold tabular-nums text-[#30241F] sm:text-5xl">
                      {pad(u.value)}
                    </span>
                    <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#806F63]">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3 pt-4">
                <span className="text-3xl">💞</span>
                <p className="font-cormorant text-[24px] italic text-[#E45B70]">
                  &ldquo;The best chapters are worth waiting for.&rdquo;
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Invitation ──────────────────────────── */}
          {step === 'invite' && (
            <motion.div
              key="invite-step"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[#E45B70]/25" />
                <div className="absolute inset-3 rounded-full border border-[#E45B70]/15" />
                <span className="text-5xl animate-soft-glow">🗝️</span>
              </div>

              <p className="font-jost text-[10px] uppercase tracking-[0.4em] text-[#E45B70]">
                the archive is ready
              </p>

              <h2 className="mt-5 font-cormorant text-[52px] leading-[0.95] text-[#30241F] sm:text-[64px]">
                A whole year
                <br />
                <span className="text-[#E45B70]">is waiting inside.</span>
              </h2>

              <p className="mt-7 max-w-sm font-jost text-sm leading-7 text-[#6D5B50]">
                Photographs you haven&rsquo;t seen. The promises we made for ordinary days. The name
                only we use. And one private letter, written for you.
              </p>

              <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                {['photographs', 'promises', 'a private name', 'one letter'].map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[#E45B70]/25 bg-[#FFF9F0] px-4 py-1.5 font-jost text-[10px] uppercase tracking-[0.2em] text-[#C83E5B]"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleEnter}
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#E45B70] px-10 py-4 font-jost text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_44px_-14px_rgba(228,91,112,0.6)] transition-all hover:bg-[#C83E5B] hover:shadow-[0_24px_54px_-14px_rgba(201,63,92,0.7)] active:scale-95"
              >
                come inside
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="mt-6 font-dancing text-3xl text-[#C83E5B] opacity-90">
                it&rsquo;s all for you.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}