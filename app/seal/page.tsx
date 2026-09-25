'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { WaxSeal } from '@/components/wax-seal'

export default function SealPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [shouldCrack, setShouldCrack] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleBreakSeal = () => setShouldCrack(true)

  const handleCrackComplete = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('anniversary_seal_broken', 'true')
    }
    router.push('/countdown')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8E8] via-[#FFE3E8] to-[#EAF7F2] px-6 py-24">
      {/* Background photo of Julia */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/gallery/gallery-027.jpeg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8E8]/40 via-transparent to-[#EAF7F2]/60" />
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
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 mx-[-3rem] rounded-[3rem] bg-[#FFF8E8]/55 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col items-center gap-6">
            <span className="text-6xl animate-hero-pulse">✨💗</span>
            <WaxSeal pulse={!shouldCrack} shouldCrack={shouldCrack} onCrack={handleCrackComplete} size={110} />
          </div>

          <div className="relative max-w-md space-y-5">
            <p className="font-cormorant text-[28px] italic leading-tight text-[#FFF9F0] [text-shadow:0_2px_14px_rgba(48,36,31,0.55),0_1px_3px_rgba(48,36,31,0.4)] sm:text-[32px]">
              &ldquo;Some stories deserve the right moment before they are reopened.&rdquo;
            </p>
            <p className="font-jost text-xs uppercase tracking-[0.18em] text-[#FFF9F0]/95 [text-shadow:0_1px_8px_rgba(48,36,31,0.5)]">
              Julia and Suliaman&rsquo;s story is waiting behind this little door.
            </p>
            <p className="pt-1 font-dancing text-[32px] text-[#FFE3D6] [text-shadow:0_2px_12px_rgba(48,36,31,0.5)]">
              Ly nur &mdash; my light.
            </p>
          </div>

          <button
            onClick={handleBreakSeal}
            disabled={shouldCrack}
            className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-[#E45B70]/40 bg-[#FFF9F0]/95 px-8 py-3 font-jost text-xs uppercase tracking-[0.2em] text-[#C83E5B] transition-all hover:border-[#E45B70] disabled:opacity-50 shadow-[0_10px_30px_-10px_rgba(48,36,31,0.4)]"
          >
            <span>🌙</span>
            <span>{shouldCrack ? 'Breaking Seal...' : 'Break The Seal'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}