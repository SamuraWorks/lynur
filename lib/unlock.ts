// Client-side unlock logic. No backend.
// September 26 -> anniversary page (/anniversary)
//
// DEV_MODE: when true, ALL routes are open regardless of date.
// Set this to false to re-enable date-based locking after content upload + testing.
export const DEV_MODE = true

// ─── Session gate ─────────────────────────────────────────────────────────────
// The archive is entered once per tab through the seal + invitation flow.
// Stored in sessionStorage so it persists across page navigations in the
// same tab but is cleared when the tab closes.
const ANNIVERSARY_ENTERED_KEY = 'anniversary_entered'

export function isAnniversaryEntered(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(ANNIVERSARY_ENTERED_KEY) === 'true'
}

export function saveAnniversaryEntered(): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(ANNIVERSARY_ENTERED_KEY, 'true')
}

const YEAR = new Date().getFullYear()

// Month is 0-indexed: 8 = September
export const ANNIVERSARY_UNLOCK = new Date(YEAR, 8, 26, 0, 0, 0)

export function getAnniversaryTarget(now: Date = new Date()): Date {
  // Countdown always targets the next upcoming September 26.
  const target = new Date(now.getFullYear(), 8, 26, 0, 0, 0)
  if (now.getTime() >= target.getTime()) {
    return new Date(now.getFullYear() + 1, 8, 26, 0, 0, 0)
  }
  return target
}

export function isAnniversaryUnlocked(now: Date = new Date()): boolean {
  if (DEV_MODE) return true
  return now.getMonth() > 8 || (now.getMonth() === 8 && now.getDate() >= 26)
}

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function getCountdown(target: Date, now: Date = new Date()): Countdown {
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, done: false }
}
