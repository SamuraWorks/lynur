'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const HER_IMG = '/gallery/gallery-006.jpeg'
const HIS_IMG = '/gallery/gallery-011.jpeg'

const JOURNEY = [
  'First, a number appeared on my phone. I still do not really know how it got there.',
  'I almost ignored it. Almost.',
  'One night it found its voice — and we fought. We said \u201cworwor\u201d at each other, and we meant it.',
  'But neither of us left. We kept talking. Question after question, night after night.',
  'Then came the day we planned to meet. I waited three complete hours. I would wait them again.',
  'Somewhere in all of that, she stopped being a number and started being mine.',
  'A whole year just passed. And I made her something she will not stop talking about.',
]

const CLUES = [
  {
    index: '01',
    glyph: '0926',
    hint: 'A date is just a date — unless it is the one that started everything.',
  },
  {
    index: '02',
    glyph: '26.09',
    hint: 'It happened once. It is about to happen again.',
  },
  {
    index: '03',
    glyph: 'worwor',
    hint: 'The word we threw at each other when we were fighting. We kept it anyway.',
  },
]

const WAIT_GAMES = [
  { ask: 'just tell me what it is', reply: 'lol. no. wait for it.' },
  { ask: 'i\u2019m serious. please?', reply: 'patience is part of the gift. trust me.' },
  { ask: 'okay\u2026 i\u2019m waiting', reply: 'good. now wait a little more.' },
  { ask: 'is this the whole surprise?', reply: 'this is not even the beginning. open your heart and wait for it.' },
  { ask: '\u2026fine. i\u2019m done waiting.', reply: 'good. because it\u2019s time.' },
]

function Clue({ clue, open, onToggle }: { clue: (typeof CLUES)[number]; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="group w-full rounded-3xl border border-rose/15 bg-card px-6 py-6 text-left shadow-[0_2px_0_rgba(232,93,117,0.06)] transition-all duration-300 hover:border-rose/30 hover:shadow-[0_18px_40px_-18px_rgba(232,93,117,0.35)]"
    >
      <div className="flex items-center gap-5">
        <span className="font-jost text-[10px] font-medium uppercase tracking-[0.35em] text-gold">
          {clue.index}
        </span>
        <span className="flex-1 text-center font-cormorant text-3xl font-semibold tracking-wide text-rose sm:text-4xl">
          {clue.glyph}
        </span>
        <span className="font-jost text-[9px] uppercase tracking-[0.3em] text-muted-foreground/70 transition-colors group-hover:text-rose">
          {open ? '\u00b7' : 'tap'}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="border-t border-rose/10 pt-4 text-center font-jost text-sm leading-relaxed text-foreground/80">
              {clue.hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [game, setGame] = useState(0)
  const [repliying, setRepliying] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [clueOpen, setClueOpen] = useState([false, false, false])
  const [answered, setAnswered] = useState(false)

  const journeyFull = step >= JOURNEY.length
  const gameDone = game >= WAIT_GAMES.length
  const canReveal = journeyFull && gameDone

  const nextStep = () => {
    setRepliying(null)
    setStep((value) => value + 1)
  }

  const pressGame = (index: number) => {
    setRepliying(index)
    setTimeout(() => {
      setGame(index + 1)
      setRepliying(null)
    }, 1200)
  }

  const toggleClue = (index: number) => {
    setClueOpen((value) => value.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <main className="grain min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between border-b border-rose/15 pb-4 font-jost text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          <span>Julia Helen Campbell</span>
          <span className="text-gold">est. 26.09</span>
        </header>

        {/* ════ HERO — two of us ════ */}
        <section className="flex flex-1 flex-col items-center justify-center pt-12 text-center sm:pt-16">
          <div className="relative mb-10 h-28 w-64">
            <div className="absolute left-0 top-0 h-28 w-28 overflow-hidden rounded-full border-2 border-gold/40 shadow-[0_10px_30px_-12px_rgba(212,175,55,0.5)]">
              <Image src={HER_IMG} alt="You" width={112} height={112} className="h-full w-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/45 to-transparent py-1.5 font-jost text-[9px] uppercase tracking-[0.3em] text-white">you</span>
            </div>
            <div className="absolute right-0 top-0 h-28 w-28 overflow-hidden rounded-full border-2 border-rose/40 shadow-[0_10px_30px_-12px_rgba(232,93,117,0.5)]">
              <Image src={HIS_IMG} alt="Me" width={112} height={112} className="h-full w-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/45 to-transparent py-1.5 font-jost text-[9px] uppercase tracking-[0.3em] text-white">me</span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-gold/30 bg-card px-3 py-1 font-dancing text-sm text-rose shadow-sm"
            >
              us
            </motion.span>
          </div>

          <p className="mb-3 font-jost text-[11px] uppercase tracking-[0.5em] text-muted-foreground">for</p>
          <h1 className="font-cormorant text-[clamp(4.5rem,19vw,8.5rem)] font-semibold leading-[0.85] tracking-[-0.02em] text-rose">
            Julia
          </h1>
          <p className="mt-5 font-jost text-[10px] uppercase tracking-[0.5em] text-muted-foreground sm:text-[11px]">
            Helen<span className="mx-2 text-gold">{'\u2022'}</span>Campbell
          </p>
          <p className="mt-8 max-w-[30ch] font-jost text-base font-light leading-relaxed text-foreground/75">
            I made something for you &mdash; and before I let you near it, I am going to make you wait, make you laugh, and make you remember.
          </p>
        </section>

        {/* ════ THE JOURNEY — step by step ════ */}
        <section className="flex flex-col items-center border-t border-rose/15 pt-14">
          <p className="font-jost text-[10px] uppercase tracking-[0.4em] text-gold">
            before you walk in &mdash; take it slowly
          </p>

          <div className="mt-8 w-full">
            <AnimatePresence mode="wait">
              {!journeyFull ? (
                <motion.div
                  key={`journey-${step}`}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl border border-rose/20 bg-card p-8 shadow-[0_2px_0_rgba(232,93,117,0.06)]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-jost text-[10px] uppercase tracking-[0.3em] text-gold">
                      step {String(step + 1).padStart(2, '0')} / {String(JOURNEY.length).padStart(2, '0')}
                    </span>
                    <span className="font-dancing text-lg text-rose">our story</span>
                  </div>
                  <p className="font-cormorant text-2xl leading-snug text-foreground sm:text-[1.7rem]">
                    {JOURNEY[step]}
                  </p>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose/30 bg-rose/5 px-6 py-3 font-jost text-xs font-semibold uppercase tracking-[0.3em] text-rose transition-colors hover:bg-rose hover:text-white"
                  >
                    next&hellip;
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : !gameDone ? (
                <motion.div
                  key={`game-${game}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-3xl border border-gold/25 bg-card p-8 text-center shadow-[0_18px_44px_-22px_rgba(212,175,55,0.35)]"
                >
                  {repliying === null && game < WAIT_GAMES.length ? (
                    <>
                      <p className="font-jost text-[10px] uppercase tracking-[0.35em] text-gold">slow down, love</p>
                      <p className="mt-4 font-cormorant text-xl italic text-foreground sm:text-2xl">
                        You really think it ends that fast?
                      </p>
                      <button
                        type="button"
                        onClick={() => pressGame(game)}
                        className="mt-6 inline-flex rounded-full bg-rose px-8 py-3 font-jost text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-deep-rose"
                      >
                        &ldquo;{WAIT_GAMES[game].ask}&rdquo;
                      </button>
                    </>
                  ) : (
                    <motion.p
                      key={`reply-${game}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-dancing text-2xl text-rose sm:text-3xl"
                    >
                      &mdash; {WAIT_GAMES[Math.min(repliying ?? game, WAIT_GAMES.length - 1)].reply}
                    </motion.p>
                  )}
                </motion.div>
              ) : !revealed ? (
                <motion.div
                  key="reveal-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-rose/25 bg-card p-8 text-center"
                >
                  <p className="font-jost text-[10px] uppercase tracking-[0.35em] text-gold">okay. for real now.</p>
                  <p className="mt-4 font-cormorant text-2xl font-semibold italic leading-snug text-foreground sm:text-3xl">
                    That was the hard part.
                    <br />
                    <span className="text-rose">Now it gets good.</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose px-6 py-3 font-jost text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-deep-rose"
                  >
                    show me
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {revealed && (
          <>
            {/* ════ THREE CLUES ════ */}
            <section className="flex flex-col items-center pt-14">
              <p className="font-jost text-[10px] uppercase tracking-[0.4em] text-gold">
                three small things &mdash; tap them slowly
              </p>
              <p className="mt-4 mb-7 max-w-[34ch] font-jost text-sm font-light leading-7 text-foreground/70">
                I skipped these earlier so you would feel them now.
              </p>
              <div className="flex w-full flex-col gap-3">
                {CLUES.map((clue, index) => (
                  <Clue key={clue.index} clue={clue} open={clueOpen[index]} onToggle={() => toggleClue(index)} />
                ))}
              </div>
              <p className="mt-8 font-cormorant text-lg italic text-muted-foreground">
                None of this made sense before. Does it now?
              </p>
            </section>

            {/* ════ THE QUESTION, FOR OLD TIMES' SAKE ════ */}
            <section className="mt-14 rounded-3xl border border-gold/25 bg-card px-6 py-8 text-center shadow-[0_18px_44px_-22px_rgba(212,175,55,0.35)]">
              <p className="font-jost text-[10px] uppercase tracking-[0.35em] text-gold">the way we talked back then</p>
              <p className="mt-5 font-cormorant text-2xl font-semibold text-foreground sm:text-[1.7rem]">
                One more question &mdash; for old times&rsquo; sake?
              </p>
              <div className="mt-7 inline-flex overflow-hidden rounded-full border border-rose/30 bg-rose/5">
                <button
                  type="button"
                  onClick={() => setAnswered(true)}
                  aria-pressed={answered}
                  className="px-10 py-3 font-jost text-xs font-semibold uppercase tracking-[0.3em] text-rose transition-colors hover:bg-rose hover:text-white"
                >
                  yes
                </button>
              </div>
              <AnimatePresence initial={false}>
                {answered && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-6 font-cormorant text-xl italic leading-snug text-rose">&ldquo;Still yes.&rdquo;</p>
                    <p className="mt-2 font-jost text-sm font-light text-foreground/70">
                      Some things never change. Which is exactly why I built this for you.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* ════ THE DOOR ════ */}
            <section className="flex flex-col items-center border-t border-rose/15 py-16 text-center">
              <p className="max-w-[34ch] font-cormorant text-2xl font-semibold italic leading-snug text-foreground">
                The whole story is one door away.
              </p>
              <p className="mt-5 max-w-[34ch] font-jost text-sm font-light leading-7 text-foreground/70">
                Everything inside was made by my own hands, from the very beginning — the number, the word, the wait — all the way until now. Go slow. That is the point.
              </p>

              <div className="mt-9">
                  <button
                    type="button"
                    onClick={() => router.push('/seal')}
                    className="group inline-flex items-center gap-3 rounded-full bg-rose px-9 py-4 font-jost text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_44px_-14px_rgba(232,93,117,0.65)] transition-all duration-300 hover:bg-deep-rose hover:shadow-[0_24px_54px_-14px_rgba(201,63,92,0.75)] active:scale-[0.98]"
                  >
                    open the door
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
              </div>

              <p className="mt-6 font-jost text-[10px] uppercase tracking-[0.35em] text-muted-foreground/80">
                first page &middot; 26.09
              </p>
            </section>
          </>
        )}

        <footer className="flex flex-col items-center gap-2 border-t border-rose/15 py-7 font-jost text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>made by hand &middot; for your eyes only</span>
          <span className="font-dancing text-base normal-case tracking-normal text-rose">&mdash; S.</span>
        </footer>
      </div>
    </main>
  )
}