'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getAnniversaryTarget, getCountdown, saveAnniversaryEntered, isAnniversaryEntered } from '@/lib/unlock'
import type { Countdown } from '@/lib/unlock'

const EMPTY: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, done: false }

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export default function CountdownPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<Countdown | null>(null)
  const [target, setTarget] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isAnniversaryEntered()) {
      router.replace('/anniversary')
      return
    }
    if (typeof window !== 'undefined' && window.localStorage.getItem('anniversary_seal_broken') !== 'true') {
      router.replace('/seal')
      return
    }
    const t = getAnniversaryTarget()
    setTarget(t)
    const tick = () => setTime(getCountdown(t))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [router])

  if (!mounted) return null

  const t = time ?? EMPTY

  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ]

  const handleEnter = () => {
    saveAnniversaryEntered()
    router.push('/anniversary')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8E8] via-[#FFE3E8] to-[#EAF7F2] px-6 py-24">
      <div className="grain grain-5 pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          key="countdown"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-10 text-center"
        >
          <span className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>⏳</span>

          <div className="space-y-3">
            <p className="font-jost text-[10px] uppercase tracking-[0.4em] text-[#E45B70]">
              the seal is broken
            </p>
            <h2 className="font-cormorant text-[42px] tracking-tight text-[#30241F]">The next page is close.</h2>
            <p className="mx-auto max-w-sm font-jost text-base leading-relaxed text-[#6D5B50]">
              Something meaningful is waiting on the other side.
              <br />
              Every passing moment brings you closer.
            </p>
          </div>

          <div className="flex items-stretch justify-center gap-3 sm:gap-4">
            {units.map((u) => (
              <div
                key={u.label}
                className="flex min-w-[70px] flex-col items-center border border-[#D8CBBE] bg-[#FFF9F0] px-3 py-4 shadow-sm sm:min-w-[85px]"
              >
                <span className="font-cormorant text-4xl font-semibold tabular-nums text-[#30241F] sm:text-5xl" suppressHydrationWarning>
                  {time ? pad(u.value) : '--'}
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

          {t.done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-5 pt-2"
            >
              <p className="font-jost text-[10px] uppercase tracking-[0.4em] text-[#E45B70]">
                the archive is ready
              </p>
              <button
                onClick={handleEnter}
                className="group inline-flex items-center gap-3 rounded-full bg-[#E45B70] px-10 py-4 font-jost text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_44px_-14px_rgba(228,91,112,0.6)] transition-all hover:bg-[#C83E5B] hover:shadow-[0_24px_54px_-14px_rgba(201,63,92,0.7)] active:scale-95"
              >
                come inside
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            <p className="font-jost text-xs uppercase tracking-[0.25em] text-[#806F63]">
              {target ? `opens ${target.getDate()} september, ${target.getMonth() === 8 ? 'before dawn breaks' : 'at midnight'}` : ''}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}