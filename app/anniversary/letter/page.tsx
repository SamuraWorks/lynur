'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import anniversaryData from '@/data/anniversary.json'
import { isAnniversaryEntered } from '@/lib/unlock'

export default function AnniversaryLetterPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAnniversaryEntered()) {
      router.replace('/seal')
      return
    }
    setEntered(true)
  }, [router])

  const letter = anniversaryData.letter

  if (!mounted) return null
  if (!entered) return null

  return (
    <main className="min-h-screen bg-[#F4EFE8] px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/anniversary"
          className="text-xs uppercase tracking-[0.28em] text-[#806F63] transition hover:text-[#E45B70]"
        >
          ← Back to our anniversary page
        </Link>

        <section className="mt-8 border border-[#D8CBBE] bg-[#FFF9F0] p-7 shadow-[0_24px_70px_rgba(82,58,43,0.1)] sm:p-12">
          <div className="mb-12 text-center">
            <p className="font-jost text-[#E45B70] text-xs uppercase tracking-[0.3em]">Private letter / page seven</p>
            <h1 className="mt-4 font-cormorant text-[52px] sm:text-[72px] text-[#30241F]">For our journey so far</h1>
            <p className="mt-4 max-w-2xl mx-auto text-[#806F63] text-base leading-relaxed">
              Written for you, Julia — from the first day and every day after.
            </p>
          </div>

          <div className="space-y-10">
            <div className="space-y-6 text-[#4D3C32] text-base leading-relaxed">
              <p className="font-dancing text-[24px] leading-[1.8]">{letter.opening}</p>
              {letter.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {letter.prayers && (
                <div className="border border-[#E6D9CC] bg-[#F6F0E7] p-6">
                  <h2 className="font-cormorant text-[30px] text-[#E45B70] mb-4">Prayers</h2>
                  <div className="space-y-4 text-sm leading-relaxed text-[#4D3C32]">
                    {letter.prayers.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              )}

              {letter.careerGoals && (
                <div className="border border-[#E6D9CC] bg-[#FFE4A9]/40 p-6">
                  <h2 className="font-cormorant text-[30px] text-[#C83E5B] mb-4">Career goals</h2>
                  <div className="space-y-4 text-sm leading-relaxed text-[#4D3C32]">
                    {letter.careerGoals.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              )}

              {letter.wishes && (
                <div className="border border-[#E6D9CC] bg-[#FFE3E8]/55 p-6">
                  <h2 className="font-cormorant text-[30px] text-[#E45B70] mb-4">Wishes</h2>
                  <div className="space-y-4 text-sm leading-relaxed text-[#4D3C32]">
                    {letter.wishes.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-right font-dancing text-3xl text-[#C83E5B]">Love, your person.</div>
          </div>
        </section>
      </div>
    </main>
  )
}
