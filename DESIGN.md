# Arden Design System

The **homepage** (`app/page.tsx`) is the source of truth. All values below live in `tailwind.config.ts` — change them there, not in components.

## Palette
| Token   | Hex       | Use                                  |
|---------|-----------|--------------------------------------|
| `bone`  | `#faf9f6` | Default page/section background      |
| `ink`   | `#1a1a1a` | Primary text; dark section background |
| `gold`  | `#c9a54a` | Accent, hover states, eyebrow gold   |
| `cream` | `#f5f0e8` | Alternate section background         |

Never write hex codes in components. Use `bg-bone`, `text-ink`, `text-ink/60`, `text-gold`, `bg-cream`.

## Type scale
Use Tailwind's `text-*` classes — they carry size, letter-spacing, line-height, and weight together:

| Token         | Where                                        |
|---------------|----------------------------------------------|
| `text-display`| Page hero H1 (homepage "Legacy in every…")   |
| `text-h1`     | Section H1 on inner pages                    |
| `text-h2`     | Standard section heading                     |
| `text-h3`     | Card titles, sub-heads                       |
| `text-stat`   | Big numeric stats                            |
| `text-body-lg`| Editorial paragraph (20px, leading 2)        |
| `text-body`   | Default body (15px)                          |
| `text-body-sm`| Meta text (14px)                             |
| `text-eyebrow-sm` / `text-eyebrow` / `text-eyebrow-lg` | Small uppercase labels — use the `<Eyebrow>` primitive |

## Layout
- Horizontal edge padding: `px-edge` (== `px-[7.5%]`). Applied automatically by `<Section>`.
- Nav offset for hero: `pt-nav-offset` (== `pt-[140px]`).
- Section rhythm: use `<Section rhythm="default | compact | loose | flush">`.

## Primitives (`app/components/ui/`)
- **`<Section tone rhythm edge>`** — wraps a `<section>` with background, vertical rhythm, and edge padding.
- **`<Eyebrow size tone>`** — the uppercase spaced label used above headings, in captions, and inline links.
- **`<Tag variant>`** / **`<FilterChip active>`** — every badge/pill routes through these.
- **`<FadeIn delay y>`** — the shared scroll-in animation (do not re-declare per page).

## Rules
1. No hex codes in components — use color tokens.
2. No `style={{ fontSize / letterSpacing / lineHeight }}` for headings — use the `text-*` token.
3. Never redeclare `FadeIn` in a page file. Import from `components/ui`.
4. When you need a new eyebrow color or chip variant, **add it to the primitive**, don't recreate inline.
5. When building a new page, open this file first.
