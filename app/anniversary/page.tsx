'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowDown, Moon, Sparkles, Heart, MessageCircleHeart, Watch, CalendarHeart, Infinity as InfinityIcon, ScrollText, Feather } from 'lucide-react'
import { EnvelopeLetter } from '@/components/envelope-letter'
import { CustomCursor } from '@/components/custom-cursor'
import { ScrollProgressBar } from '@/components/progress-bar'
import { AnniversaryLock } from '@/components/anniversary-lock'
import anniversaryData from '@/data/anniversary.json'
import galleryData from '@/data/gallery.json'
import { isAnniversaryEntered } from '@/lib/unlock'
import { validateSections } from '@/lib/content-schema'
import type { ContentSection } from '@/lib/content-schema'

type GalleryItem = {
  id: number | string
  src: string
  caption: string
  type?: 'image' | 'video'
  poster?: string
}

function ChapterHeading({ number, eyebrow, title, detail }: { number: string; eyebrow: string; title: string; detail: string }) {
  return (
    <div className="mb-12 flex items-start justify-between gap-8 border-b border-[#D9C8B9] pb-5">
      <div className="flex items-center gap-4">
        <span className="font-jost text-xs tracking-[0.3em] text-[#E45B70]">CH {number}</span>
        <span className="h-px w-12 bg-[#E45B70]" />
        <span className="font-jost text-xs uppercase tracking-[0.3em] text-[#8B7465]">{eyebrow}</span>
      </div>
      <span className="hidden max-w-xs text-right font-jost text-[10px] uppercase tracking-[0.2em] text-[#A08B7D] sm:block">
        {detail}
      </span>
    </div>
  )
}

function CircleMedia({ item, size = 'h-28 w-28', ring = '#FFD991' }: { item: GalleryItem; size?: string; ring?: string }) {
  const isVideo = item.type === 'video' || (typeof item.src === 'string' && item.src.toLowerCase().endsWith('.mp4'))
  return (
    <div
      className={`relative overflow-hidden rounded-full ${size} shrink-0`}
      style={{ border: `2px solid ${ring}`, background: 'rgba(255,217,145,0.35)' }}
    >
      {isVideo ? (
        <video src={item.src} muted loop playsInline preload="metadata" className="absolute inset-[6%] h-[88%] w-[88%] rounded-full object-cover" />
      ) : (
        <div className="absolute inset-[6%] overflow-hidden rounded-full">
          <Image src={item.src} alt={item.caption || 'A memory of us'} fill className="object-cover" sizes="120px" />
        </div>
      )}
    </div>
  )
}

function Memory({ item, index, open }: { item: GalleryItem; index: number; open: () => void }) {
  const isVideo = item.type === 'video' || (typeof item.src === 'string' && item.src.toLowerCase().endsWith('.mp4'))
  const flip = index % 2 === 1
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className={`group w-full max-w-[430px] ${flip ? 'sm:ml-auto' : ''}`}
    >
      {isVideo ? (
        <div className="overflow-hidden rounded-[24px] border border-[#E8D5C9] bg-black shadow-[0_14px_44px_rgba(196,104,122,0.12)]">
          <video src={item.src} preload="metadata" controls playsInline className="aspect-[4/5] w-full object-contain bg-black sm:aspect-[4/5]">
            <source src={item.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          className="block w-full cursor-zoom-in overflow-hidden rounded-[24px] border border-[#E8D5C9] bg-white shadow-[0_14px_44px_rgba(196,104,122,0.12)] transition-shadow hover:shadow-[0_20px_60px_rgba(196,104,122,0.22)]"
        >
          <div className="relative aspect-[4/5] w-full">
            <div className="absolute inset-0 bg-cover bg-center blur-xl opacity-25 scale-110" style={{ backgroundImage: `url(${item.src})` }} />
            <Image src={item.src} alt={item.caption || 'A memory of us'} fill className="object-contain transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 768px) 90vw, 430px" />
          </div>
        </button>
      )}
      {item.caption ? (
        <figcaption className={`mt-4 max-w-[30ch] text-left font-dancing text-xl leading-snug text-[#C83E5B] ${flip ? 'sm:mr-auto' : 'sm:ml-auto'}`}>
          “{item.caption}”
        </figcaption>
      ) : null}
    </motion.figure>
  )
}

const GREETING_KEY = 'anniversary_opened'

function Greeting({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250)
    return () => clearTimeout(t)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[99] flex items-center justify-center bg-[#2C1A1A] px-6"
    >
      <div className="absolute right-[-6rem] top-[-6rem] h-[22rem] w-[22rem] rounded-full border border-[#E45B70]/25" />
      <div className="relative z-10 mx-auto w-full max-w-xl text-center text-[#FFF9F0]">
        <Heart size={22} className="mx-auto mb-8 text-[#E45B70]" />
        <h2 className="font-cormorant text-5xl leading-[0.85] sm:text-7xl">
          For when you
          <br />
          <span className="italic text-[#FFD991]">finally got here.</span>
        </h2>
        <div className="mx-auto my-8 h-px w-24 bg-[#E45B70]" />
        <div className="space-y-6 font-cormorant text-xl leading-relaxed text-[#F3E7DB] sm:text-2xl">
          <p>You really walked through all of that. The number. The word. The three hours. And you still said yes.</p>
          <p>
            This is the part I was nervous about &mdash; not building it, but watching you finally stand inside
            it. Everything ahead was made by my own hands, about us, from my heart.
          </p>
          <p className="italic text-[#FFD991]">Take your time. It is all yours.</p>
        </div>
        <button
          type="button"
          onClick={onEnter}
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#E45B70] px-10 py-4 font-jost text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_44px_-14px_rgba(228,91,112,0.65)] transition-all duration-300 hover:bg-[#C83E5B]"
        >
          come inside <ArrowDown size={15} className="animate-bounce" />
        </button>
        <p className="mt-6 font-dancing text-2xl text-[#E8D5A3]">&mdash; yours, from the very beginning</p>
      </div>
    </motion.div>
  )
}

export default function AnniversaryExperience() {
  const [mounted, setMounted] = useState(false)
  const [isLocked, setIsLocked] = useState(true)
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [greetingOpen, setGreetingOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)
    const checkLockStatus = () => setIsLocked(!isAnniversaryEntered())
    checkLockStatus()
    const interval = setInterval(checkLockStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isLocked && mounted && typeof window !== 'undefined') {
      try {
        if (!sessionStorage.getItem(GREETING_KEY)) setGreetingOpen(true)
      } catch {}
    }
  }, [isLocked, mounted])

  if (!mounted) return null
  if (isLocked) return <AnniversaryLock onUnlock={() => setIsLocked(false)} />

  const sections = validateSections(galleryData.anniversarySections as ContentSection[])
  const raw = (sections[0]?.items || []) as GalleryItem[]
  const imgs = raw.filter((i) => !(i.type === 'video' || (typeof i.src === 'string' && i.src.toLowerCase().endsWith('.mp4'))))
  const vids = raw.filter((i) => i.type === 'video' || (typeof i.src === 'string' && i.src.toLowerCase().endsWith('.mp4')))
  const pick = (list: GalleryItem[], from: number) => (list && list[from] ? list[from] : null)
  const letter = anniversaryData.letter
  const extraWishes = [
    'I wish the question games never stop being how we find each other.',
    'I wish I always stay the one who waits — three hours or three years.',
    'I wish the word worwor stays in our story, because it is the proof we chose this.'
  ]
  const allWishes = [...letter.wishes, ...extraWishes]

  return (
    <main className="overflow-hidden bg-[#F6F0E7] text-[#30241F] selection:bg-[#E45B70]/20">
      <CustomCursor />
      <ScrollProgressBar />
      {greetingOpen && (
        <Greeting
          onEnter={() => {
            try {
              sessionStorage.setItem(GREETING_KEY, 'true')
            } catch {}
            setGreetingOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {/* ════ COVER ════ */}
      <section className="relative flex min-h-screen items-center bg-[#E45B70] px-6 py-24 text-[#FFF9F0]">
        <div className="absolute right-[-9rem] top-[-7rem] h-[32rem] w-[32rem] rounded-full border border-[#FFD991]/40" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-[26rem] w-[26rem] rounded-full border border-[#FFD991]/25" />
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.5 0.88 C 0.22 0.7 0.08 0.52 0.08 0.34 C 0.08 0.18 0.19 0.08 0.32 0.08 C 0.41 0.08 0.47 0.13 0.5 0.18 C 0.53 0.13 0.59 0.08 0.68 0.08 C 0.81 0.08 0.92 0.18 0.92 0.34 C 0.92 0.52 0.78 0.7 0.5 0.88 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="absolute right-0 top-0 z-10 sm:right-4 sm:top-4" style={{ width: 196, height: 188, filter: 'drop-shadow(0 16px 30px rgba(196,104,122,0.45))' }}>
          <div className="relative h-full w-full" style={{ clipPath: 'url(#heart-clip)', background: 'rgba(255,217,145,0.4)' }}>
            <div className="absolute inset-[6%] overflow-hidden" style={{ clipPath: 'url(#heart-clip)' }}>
              <Image src="/gallery/gallery-026.jpeg" alt="Julia" fill className="object-cover" sizes="220px" />
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="mb-16 flex max-w-3xl items-center justify-between border-b border-[#FFD991]/50 pb-5 pr-52 font-jost text-[10px] uppercase tracking-[0.3em] text-[#FFE8B2] sm:pr-0">
              <span>One year of us</span>
              <span>26.09.2025 &rarr; 26.09.2026</span>
            </div>
            <p className="mb-9 flex items-center gap-3 font-jost text-xs uppercase tracking-[0.45em] text-[#FFE8B2]">
              <Sparkles size={15} /> The story behind the light
            </p>
            <h1 className="max-w-5xl font-cormorant text-[clamp(4rem,10vw,9.5rem)] leading-[0.8] tracking-[-0.04em]">
              Julia Helen
              <br />
              <span className="ml-[9vw] text-[#FFE19A]">Campbell</span>
              <br />
              <span className="ml-[18vw]">&amp; the year</span>
            </h1>
            <div className="mt-16 grid max-w-3xl gap-8 border-t border-[#FFD991]/50 pt-6 font-jost text-sm leading-7 text-[#FFEFE0] sm:grid-cols-3">
              <p><span className="block text-[10px] uppercase tracking-[0.25em] text-[#FFE19A]">Chapter count</span>A number, one word, one wait, one year</p>
              <p><span className="block text-[10px] uppercase tracking-[0.25em] text-[#FFE19A]">Status</span>Still choosing each other</p>
              <p><span className="block text-[10px] uppercase tracking-[0.25em] text-[#FFE19A]">Term</span>As long as it feels like home</p>
            </div>
            <div className="mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-6 sm:justify-start">
              {[pick(imgs, 5), pick(imgs, 11), pick(imgs, 5), pick(imgs, 14)].filter(Boolean).map((item, i) => (
                <CircleMedia key={`${item!.id}-${i}`} item={item!} size="h-24 w-24 sm:h-28 sm:w-28" />
              ))}
            </div>
          </motion.div>
          <motion.a href="#ch-01" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-6 left-0 flex items-center gap-3 rounded-full py-3 pr-4 font-jost text-xs uppercase tracking-[0.3em] text-[#FFE19A] sm:bottom-8">
            Turn the page <ArrowDown size={15} className="animate-bounce" />
          </motion.a>
        </div>
      </section>

      {/* ════ CH 01 — A NUMBER APPEARED ════ */}
      <section id="ch-01" className="bg-[#FFF9F0] px-6 py-28 sm:py-40">
        <div className="mx-auto max-w-6xl">
          <ChapterHeading number="01" eyebrow="The number" title="A number appeared" detail="Around 2024, out of nowhere" />
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid items-end gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-6 font-jost text-xs uppercase tracking-[0.35em] text-[#E45B70]">How it began</p>
              <h2 className="font-cormorant text-7xl leading-[0.82] sm:text-[8.5rem]">
                A number.
                <br />
                <span className="text-[#E45B70]">That was all.</span>
              </h2>
            </div>
            <div className="border-l-2 border-[#E45B70] pl-7 sm:pl-12">
              <p className="font-cormorant text-4xl leading-tight text-[#58443A] sm:text-5xl">
“Somehow, your number ended up on my phone.”
              </p>
              <p className="mt-8 max-w-lg font-jost text-sm leading-8 text-[#806B5D]">
                Around 2024, your number found its way to me. To this day I’m not completely sure
                how — a cousin, work, a link that was never fully clear. It was just a number on my
                phone. At first, I ignored it.
              </p>
              {pick(imgs, 0) ? <Memory item={pick(imgs, 0)!} index={0} open={() => setSelected(pick(imgs, 0))} /> : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════ CH 02 — THEN THEY STARTED TALKING ════ */}
      <section className="bg-[#1E3B38] px-6 py-28 text-[#FFF9F0] sm:py-40">
        <div className="mx-auto max-w-6xl">
          <ChapterHeading number="02" eyebrow="The conversation" title="Then we started talking" detail="One night, everything changed" />
          <div className="ml-auto max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Moon className="mx-auto mb-8 text-[#FFD991]" size={30} />
              <p className="font-cormorant text-6xl leading-[0.9] sm:text-8xl">
                One night,
                <br />
                <span className="italic text-[#FFD991]">we talked.</span>
              </p>
              <p className="mx-auto mt-10 max-w-xl font-jost text-base leading-8 text-[#C7DDD1]">
                The number finally spoke. And our very first real conversation was not romantic at
                all. It was loud, it was honest, it was messy &mdash; it was real.
              </p>
              {pick(imgs, 15) ? (
                <div className="mt-12 flex justify-center">
                  <CircleMedia item={pick(imgs, 15)!} size="h-40 w-40 sm:h-48 sm:w-48" ring="#FFD991" />
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════ CH 03 — WORWOR ════ */}
      <section className="bg-[#FFF9F0] px-6 py-28 text-center sm:py-44">
        <div className="mx-auto max-w-4xl">
          <ChapterHeading number="03" eyebrow="The argument" title="Worwor" detail="The word that started it" />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <p className="font-jost text-xs uppercase tracking-[0.45em] text-[#E45B70]">In Krio, it means</p>
            <h2 className="mt-6 font-cormorant text-[clamp(6rem,24vw,15rem)] leading-[0.78] tracking-tight text-[#E45B70]">
              worwor
            </h2>
<p className="mx-auto mt-12 max-w-xl font-jost text-base leading-8 text-[#806B5D]">
                In our first real conversation &mdash; which became an argument &mdash; I called you{" "}
                <span className="font-semibold text-[#C83E5B]">ugly</span>. And you gave me the exact
                same energy back, calling me ugly too. That is genuinely how we started.
              </p>
            <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-5 border-y border-[#E8D5C9] py-8">
              <Heart size={16} className="text-[#E45B70]" />
              <p className="font-cormorant text-2xl italic leading-snug text-[#58443A] sm:text-3xl">
                &ldquo;We were a fight before we were a choice.&rdquo;
              </p>
            </div>
            {pick(imgs, 16) ? (
              <div className="mt-12 flex justify-center">
                <CircleMedia item={pick(imgs, 16)!} size="h-36 w-36 sm:h-44 sm:w-44" ring="#E45B70" />
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>

      {/* ════ CH 04 — THEY KEPT TALKING ════ */}
      <section className="bg-[#F6F0E7] px-6 py-28 sm:py-40">
        <div className="mx-auto max-w-6xl">
          <ChapterHeading number="04" eyebrow="The questions" title="But we kept talking" detail="The argument was not the end" />
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="lg:order-2">
              <p className="mb-6 font-jost text-xs uppercase tracking-[0.35em] text-[#E45B70]">WhatsApp question games</p>
              <h2 className="font-cormorant text-6xl leading-[0.9] sm:text-8xl">
                Question after<br />
                <span className="italic text-[#E45B70]">question.</span>
              </h2>
              <p className="mt-8 max-w-md font-jost text-sm leading-8 text-[#806B5D]">
                Somehow, the argument didn&rsquo;t end the conversation. We kept talking. And
                eventually talking became playing question games on WhatsApp &mdash; trading questions,
                answers, and time until we actually started getting to know each other.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <span className="flex items-center gap-2 rounded-full border border-[#E45B70]/30 bg-[#FFF9F0] px-4 py-2 font-jost text-[10px] uppercase tracking-[0.2em] text-[#C83E5B]"><MessageCircleHeart size={13} /> question games</span>
                <span className="flex items-center gap-2 rounded-full border border-[#E45B70]/30 bg-[#FFF9F0] px-4 py-2 font-jost text-[10px] uppercase tracking-[0.2em] text-[#C83E5B]"><Sparkles size={13} /> getting to know each other</span>
              </div>
            </div>
            <div className="flex flex-col gap-10 lg:order-1">
              {pick(imgs, 1) ? <Memory item={pick(imgs, 1)!} index={0} open={() => setSelected(pick(imgs, 1))} /> : null}
              {pick(imgs, 2) ? <Memory item={pick(imgs, 2)!} index={1} open={() => setSelected(pick(imgs, 2))} /> : null}
            </div>
          </div>
        </div>
      </section>

      {/* ════ CH 05 — THREE HOURS ════ */}
      <section className="relative overflow-hidden bg-[#2C1A1A] px-6 py-28 text-center text-[#FFF9F0] sm:py-44">
        <div className="pointer-events-none absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23D4AF37' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10 mx-auto max-w-4xl">
          <ChapterHeading number="05" eyebrow="The first meeting" title="Three hours" detail="She was late. I stayed." />
          <Watch className="mx-auto mb-8 text-[#D4AF37]" size={30} />
          <h2 className="font-cormorant text-[clamp(5rem,18vw,12rem)] leading-none text-[#FDF8F3]">
            03:00:00
          </h2>
          <p className="mx-auto mt-12 max-w-xl font-jost text-base leading-8 text-[#E8D5A3]">
            At some point we planned to meet in person. And when that first meeting finally came,
            I waited for you for <span className="font-semibold text-[#FDF8F3]">three complete
            hours</span> because you were late.
          </p>
          <div className="mx-auto mt-12 border-t border-[#D4AF37]/40 pt-8">
            <p className="font-dancing text-4xl text-[#E8D5A3]">Three hours. And I was still there.</p>
          </div>
          {vids[2] ? (
            <div className="mt-14 flex justify-center">
              <CircleMedia item={vids[2]} size="h-40 w-40 sm:h-48 sm:w-48" ring="#D4AF37" />
            </div>
          ) : null}
        </div>
      </section>

      {/* ════ CH 06 — 26 SEPTEMBER 2025 ════ */}
      <section className="bg-[#FFF9F0] px-6 py-28 sm:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <ChapterHeading number="06" eyebrow="The official day" title="26 September 2025" detail="The date that made it official" />
          <CalendarHeart className="mx-auto mb-8 text-[#E45B70]" size={30} />
          <div className="flex items-end justify-center gap-5">
            <span className="font-cormorant text-[clamp(6rem,22vw,13rem)] leading-none text-[#E45B70]">26</span>
            <div className="pb-4 text-left font-jost text-xs uppercase leading-6 tracking-[0.25em] text-[#806B5D]">
              September<br />two thousand<br />twenty-five
            </div>
          </div>
          <p className="mx-auto mt-12 max-w-xl font-jost text-base leading-8 text-[#806B5D]">
            After the number, the argument, the WORWOR, the question games, and the three-hour wait,
            that date finally marked the beginning of our relationship &mdash; the start of the day
            we would keep celebrating every year.
          </p>
          {vids[3] ? (
            <div className="mx-auto mt-14 flex w-full max-w-xs items-center justify-center">
              <div className="w-full overflow-hidden rounded-3xl border border-[#E8D5C9] bg-white shadow-[0_14px_44px_rgba(196,104,122,0.12)]">
                <video src={vids[3].src} muted loop playsInline preload="metadata" controls className="aspect-[4/5] w-full object-cover" />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ════ CH 07 — THE YEAR OF US (MEMORIES) ════ */}
      <section className="bg-[#F6F0E7] px-6 py-28 sm:py-40">
        <div className="mx-auto max-w-6xl">
          <ChapterHeading number="07" eyebrow="The memories" title="The year of us" detail="Sparsely scattered, deeply kept" />
          <div className="mb-20 max-w-3xl">
            <p className="mb-6 font-jost text-xs uppercase tracking-[0.35em] text-[#E45B70]">One year together</p>
            <h2 className="font-cormorant text-6xl leading-[0.85] sm:text-8xl">
              We became the<br />
              <span className="italic text-[#E45B70]">beginning of us.</span>
            </h2>
            <p className="mt-8 max-w-xl font-jost text-base leading-8 text-[#806B5D]">
              Every small thing in this year &mdash; the ordinary afternoons, the quiet check-ins, the
              shared jokes, the moments that belong to no one else &mdash; became evidence that we were
              real.
            </p>
          </div>
          <div className="grid gap-14 sm:grid-cols-2 sm:gap-10">
            {raw.slice(3, 11).map((item, i) => (
              <Memory key={item.id} item={item} index={i} open={() => setSelected(item)} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ CH 08 — WISHES ════ */}
      <section className="bg-[#1E3B38] px-6 py-28 text-[#FFF9F0] sm:py-40">
        <div className="mx-auto max-w-6xl">
          <ChapterHeading number="08" eyebrow="The wishes" title="For the year ahead" detail="Made on ordinary days, kept for the rest" />
          <div className="mx-auto max-w-2xl text-center">
            <Feather className="mx-auto mb-8 text-[#FFD991]" size={28} />
            {vids[4] ? (
              <div className="mx-auto mb-8 flex justify-center">
                <CircleMedia item={vids[4]} size="h-28 w-28 sm:h-32 sm:w-32" ring="#E8B84B" />
              </div>
            ) : null}
            <h2 className="font-cormorant text-6xl leading-[0.9] sm:text-7xl">
              What I wish
              <br />
              <span className="italic text-[#FFD991]">for you.</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {allWishes.map((wish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-[#8DB3A3]/30 bg-[#1E3B38] p-8 text-center sm:p-10"
              >
                <span className="font-jost text-xs tracking-[0.3em] text-[#FFD991]">WISH {String(index + 1).padStart(2, '0')}</span>
                <p className="mt-6 font-cormorant text-2xl italic leading-relaxed text-[#C7DDD1]">&ldquo;{wish}.&rdquo;</p>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto mt-20 max-w-2xl border-t border-[#8DB3A3]/30 pt-8 text-center">
            <p className="font-dancing text-3xl text-[#FFD991]">And I pray for you quietly.</p>
            <div className="mt-6 space-y-3">
              {letter.prayers.map((prayer, i) => (
                <p key={i} className="font-jost text-sm leading-7 text-[#C7DDD1]">· {prayer}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ CH 09 — THE POEM ════ */}
      <section className="relative overflow-hidden bg-[#FFF9F0] px-6 py-36 text-center sm:py-52">
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9C8B9]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <ChapterHeading number="09" eyebrow="A poem" title="How we happened" detail="For Julia, on our first year" />
          {vids[5] ? (
            <div className="mb-12 flex justify-center">
              <CircleMedia item={vids[5]} size="h-32 w-32 sm:h-36 sm:w-36" ring="#E45B70" />
            </div>
          ) : null}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <div className="mx-auto mb-14 h-px w-28 bg-[#E45B70]" />
            <div className="space-y-7 font-cormorant text-[26px] leading-relaxed text-[#58443A] sm:text-3xl">
              <p className="italic text-[#E45B70]">A number arrived on my phone one year,</p>
              <p>no reason, no warning, no name on the back.</p>
              <p>I ignored it the way you ignore the wind —</p>
              <p className="italic">until one night it spoke, and I answered back.</p>
            </div>
            <div className="mx-auto my-12 h-px w-28 bg-[#E45B70]" />
            <div className="space-y-7 font-cormorant text-[26px] leading-relaxed text-[#58443A] sm:text-3xl">
              <p>Our first real talk was not sweet at all,</p>
              <p>we called each other ugly — <span className="italic text-[#C83E5B]">worwor</span>, the word.</p>
              <p>But the argument opened a door neither of us closed,</p>
              <p className="italic">and we both stayed when either of us could leave.</p>
            </div>
            <div className="mx-auto my-12 h-px w-28 bg-[#E45B70]" />
            <div className="space-y-7 font-cormorant text-[26px] leading-relaxed text-[#58443A] sm:text-3xl">
              <p>Question games late on a small phone screen,</p>
              <p>the slowest getting-to-know-you there ever was.</p>
              <p>Then a plan became real, and I waited for you —</p>
              <p className="italic">three full hours, still there when you came.</p>
            </div>
            <div className="mx-auto my-12 h-px w-28 bg-[#E45B70]" />
            <div className="space-y-7 font-cormorant text-[26px] leading-relaxed text-[#58443A] sm:text-3xl">
              <p>Twenty-six, September, twenty-twenty-five:</p>
              <p>the date that turned a maybe into mine.</p>
              <p>And somewhere between the fighting and joy,</p>
              <p>you stopped being a number and started being —</p>
              <p className="mt-4 font-dancing text-4xl text-[#C83E5B]">Ly Nur. My light.</p>
            </div>
            <div className="mx-auto my-12 h-px w-28 bg-[#E45B70]" />
            <div className="space-y-7 font-cormorant text-[26px] leading-relaxed text-[#58443A] sm:text-3xl">
              <p>One year now, twenty-six, September, twenty-six,</p>
              <p>and the whole thing still feels like a question in bloom:</p>
              <p>from ignored, to argued, to waited for, to loved —</p>
              <p className="italic">the smallest beginning, the brightest light.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════ CH 10 — THE NAME ════ */}
      <section className="relative overflow-hidden bg-[#F6F0E7] px-6 py-36 text-center sm:py-52">
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E45B70]/15" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <ChapterHeading number="10" eyebrow="The name inside the name" title="Ly Nur" detail="A private word, kept in the light" />
          <Heart className="mx-auto mb-8 text-[#E45B70]" size={24} />
          <p className="font-jost text-xs uppercase tracking-[0.4em] text-[#E45B70]">Somewhere between all of it, you became</p>
          <h2 className="mt-9 font-cormorant text-[clamp(5rem,16vw,13rem)] leading-[0.68] text-[#E45B70]">Ly Nur</h2>
          <p className="mx-auto mt-12 max-w-xl font-jost text-lg leading-8 text-[#695449]">
            In Arabic it means <span className="font-semibold text-[#C83E5B]">my light</span>. Not a
            decoration &mdash; a way of saying where the warmth lives. From a number, to a fight, to a
            word I now use as your name.
          </p>
          <div className="mx-auto mt-12 h-px w-24 bg-[#F1B943]" />
          <p className="mt-10 font-dancing text-4xl text-[#C83E5B]">my light, my home, my favorite person.</p>

          <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-10 sm:flex-row sm:justify-center">
            {vids.slice(0, 2).map((item, i) => (
              <Memory key={item.id} item={item} index={i} open={() => setSelected(item)} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ THE LETTER ════ */}
      <div id="letter" className="bg-[#F6F0E7] px-6 pb-24">
        <EnvelopeLetter
          opening={letter.opening}
          paragraphs={letter.paragraphs}
          prayers={letter.prayers}
          careerGoals={letter.careerGoals}
          wishes={letter.wishes}
          closing="For you, Julia — from the first day and every day after."
          href="/anniversary/letter"
          buttonText="Open the full letter"
        />
      </div>

      {/* ════ LIGHTBOX ════ */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2C1A1A]/95 p-4"
          onClick={() => setSelected(null)}
        >
          <button className="absolute right-6 top-6 text-white/50 transition-colors hover:text-white" onClick={() => setSelected(null)} aria-label="Close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {selected.type === 'video' || (typeof selected.src === 'string' && selected.src.toLowerCase().endsWith('.mp4')) ? (
            <video src={selected.src} controls playsInline autoPlay preload="metadata" className="w-auto max-h-[80vh] object-contain rounded-lg shadow-2xl">
              <source src={selected.src} type="video/mp4" />
            </video>
          ) : (
            <Image src={selected.src} alt={selected.caption || 'A memory of us'} width={1200} height={1200} className="w-auto max-h-[80vh] object-contain rounded-lg shadow-2xl" />
          )}
          {selected.caption ? <p className="mt-6 text-center font-dancing text-2xl text-white/90">{selected.caption}</p> : null}
        </motion.div>
      )}
    </main>
  )
}