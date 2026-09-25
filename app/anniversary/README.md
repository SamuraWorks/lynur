# 💖 Anniversary Section Documentation

A mobile-first romantic anniversary webpage that serves as a memory archive and emotional reflection of love over time.

## 🌙 Overview

The anniversary section is designed as a reflective journey through a shared relationship:

1. **Landing Screen** - Immersive hero with CTA button
2. **Countdown Card** - Shows time remaining or anniversary message
3. **Emotional Anchor** - Poetic reflection to set the tone
4. **Anniversary Letter** - Main emotional content with paragraphs
5. **Memory Wall** - Milestone moments with captions
6. **Journey Timeline** - Growth and challenges timeline
7. **Music Control** - Button to play background music
8. **Private Love Message** - Revealable intimate message
9. **Reflection Message** - Centered reflection on shared growth
10. **Final Line** - Closing statement

## 📁 File Structure

```
/app/anniversary/
  page.tsx                        # Main page component

/components/
  anniversary-hero.tsx            # Full-screen opening
  anniversary-countdown-card.tsx  # Countdown or celebration message
  anniversary-letter.tsx          # Multi-paragraph love letter
  anniversary-timeline.tsx        # Journey timeline
  memory-wall.tsx                 # Milestone memories
  private-love-message.tsx        # Revealable message
  anniversary-closing.tsx         # Reflection and closing lines

/data/
  anniversary.json                # All content data
```

## 🎨 Bright Anniversary Design

### Anniversary-Specific Design
- **Colors**: Coral, citrus, cream, and mint accents
- **Animations**: Gentle movement that keeps the page feeling alive
- **Pacing**: Spacious sections for photographs, videos, and reflection
- **Focus**: The bright shared story of Julia Helen Campbell and Suliaman Wahid Kallon
- **Typography**: Elegant serif titles paired with a clean sans-serif body

### Color Palette
- **Background**: Warm cream with blush, citrus, and mint gradients
- **Accents**: Coral and sunny gold
- **Borders**: Light coral and champagne lines
- **Hover States**: Bright, gentle lift with soft color glow

## 🔧 Customization

### Change Content
Edit `/data/anniversary.json`:
- Update hero text
- Modify letter paragraphs
- Add/remove memory wall items
- Update timeline events

### Change Anniversary Date
Update `anniversaryDate` in `anniversary.json` to change the countdown target.

### Styling
All components use Tailwind CSS with custom color tokens:
- `bg-gold`, `text-gold` - Primary accent
- `text-foreground` - Warm dark body text
- `border-gold-soft/20` - Subtle borders

## 📱 Mobile Optimization

- Full responsive design (sm, md breakpoints)
- Touch-friendly buttons with subtle hover states
- Optimized typography sizes
- Smooth scroll behavior
- Slow, intentional animations

## ✨ Key Features

1. **Scroll-triggered reveals** - Content fades in as you scroll
2. **Memory breathing** - Subtle scale animation for nostalgic feel
3. **Soft motion effects** - Background glow and scroll reveals keep the story alive
4. **Personal touches** - Custom names and terms of endearment
5. **Reflective depth** - Focuses on growth and survival rather than celebration
6. **Minimal UI** - Maximum emotional impact through simplicity
7. **Accessible** - ARIA labels, semantic HTML

## 🎵 Music Setup

The `MusicControl` component is ready for audio integration:

```typescript
// Recommended: Soft piano + nostalgic strings
// BPM: ~60-70 (slower and more meditative)
// Duration: 3-4 minutes for the full scroll experience
```

## 🚀 Access the Page

Navigate to `/anniversary` route:
```
http://localhost:3000/anniversary
```

## 💡 Content Philosophy

**Our anniversary** = "We keep becoming something bright and real together"

The key is a joyful acknowledgment of Julia and Suliaman's shared journey.
