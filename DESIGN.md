---
version: alpha
name: UstodAI Neutral
description: Design system for UstodAI, a Tajik-first language tutor. shadcn/ui (radix-nova style, neutral base color), Geist, monochrome surfaces, colour only for meaning.
colors:
  primary: "#171717"
  on-primary: "#FAFAFA"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  surface-muted: "#F5F5F5"
  on-surface: "#0A0A0A"
  on-surface-muted: "#737373"
  outline: "#E5E5E5"
  ring: "#A1A1A1"
  error: "#E7000B"
  success: "#009966"
  warning: "#E17100"
  dark-neutral: "#0A0A0A"
  dark-surface: "#171717"
  dark-surface-muted: "#262626"
  dark-on-surface: "#FAFAFA"
  dark-on-surface-muted: "#A1A1A1"
  dark-primary: "#E5E5E5"
  dark-on-primary: "#171717"
typography:
  headline-display:
    fontFamily: Geist
    fontSize: 52px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  title:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
  word:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.025em
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  full: 9999px
spacing:
  base: 4px
  gutter: 16px
  section: 112px
  max-width: 1152px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 36px
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: 16px
  badge:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    height: 36px
---

# UstodAI Neutral

## Overview

Built on **shadcn/ui** (`radix-nova` style, `neutral` base colour). The interface is monochrome and quiet so that the content — an English word and its Tajik translation — is the only thing that stands out. Premium comes from restraint: precise spacing, hairline borders, consistent radii, real data. No 3D emoji, glows, floating chips, gradients or decorative icons.

Components live in `web/src/components/ui` and are added with `npx shadcn@latest add <name>`. Tokens are the shadcn CSS variables in `web/src/app/globals.css`.

## Colors

- **Neutral scale** (oklch, zero chroma) for everything: background, card, muted, border, text.
- **Primary** is near-black in light mode and near-white in dark mode.
- Colour carries meaning only: `destructive`, `success`, `warning` appear as 6px dots on the four FSRS rating buttons (Again, Hard, Good, Easy) and as status icons. Never as backgrounds or decoration.
- Dark mode via `next-themes` (`class` strategy, system default) with a toggle in every header.

## Typography

- **Geist** for everything, including the word on a lesson card. Checked for full Tajik Cyrillic (ғ ӣ қ ӯ ҳ ҷ).
- Headings 600 weight with slight negative tracking; body 14–18px; muted text for secondary information.
- No monospace for IPA (Geist Mono lacks some IPA glyphs); `Kbd` for keyboard shortcuts.

## Layout

- Max width 1152px (landing), 896px (app), 512px (lesson). Gutter 16px / 24px from 640px.
- Sections separated by a top border and 80–112px of vertical space.
- Grids of features and steps use a 1px border grid (`gap-px bg-border`) instead of separate shadowed cards.

## Elevation & Depth

Flat. Depth comes from `ring-1 ring-foreground/10` on cards and 1px borders. At most `shadow-sm` on the lesson preview.

## Shapes

`--radius: 0.625rem`: buttons and inputs `lg` (10px), cards `xl` (14px), badges and avatars `full`.

## Components

- **Button:** `default`, `outline`, `ghost`; landing CTAs `h-10`, app actions `h-9`.
- **Card:** header + content + optional muted footer.
- **Lesson card:** badge (Калимаи нав / Такрор), word, IPA, translation revealed after recall, example in a muted bordered box; four outline rating buttons with interval and `Kbd` 1–4.
- **Auth:** centred card on `bg-muted/40`, inline `Alert` for errors.
- **User menu:** `Avatar` + `DropdownMenu` with name, email, sign out.

## Motion

`motion/react` with `MotionConfig reducedMotion="user"`; CSS effects stop under `prefers-reduced-motion`. Tokens in `web/src/lib/motion.ts` (fast 150ms, base 240ms, slow 420ms, out-quint).

- **Hero:** text appears in a short staggered sequence with a blur-to-sharp fade (once, on load). The word «тоҷикӣ» has a slow shine. Dot-grid background fades to the edges.
- **Interactive lesson demo:** visitors reveal the translation and rate the word right on the landing page; the card tilts slightly in 3D after the cursor and a thin beam runs along its border.
- **Scroll:** section headings and grid cells reveal once as they enter the viewport; feature grid has a cursor spotlight.
- **Numbers** count up from zero (NumberTicker); the forgetting-curve chart draws its line.
- **Lesson:** the card cross-fades between words; rating buttons scale on press; a completed session ends with a short confetti burst in the brand palette.

## Avatars

Generative "marble" gradient avatars (`boring-avatars`) seeded by the user id, in the Tajik palette (lapis, turquoise, saffron, pomegranate). Never initials.

## Do's and Don'ts

- Do use shadcn components and tokens instead of custom colours.
- Do keep colour for meaning only.
- Don't use emoji, 3D icons or decorative gradients; motion must answer an action or happen once.
- Don't put an icon in a box on every card.
- Don't show invented statistics. Every number is computed from real data.
