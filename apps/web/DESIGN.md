---
name: Campusly
colors:
  surface: "#fff8f7"
  surface-dim: "#efd4d1"
  surface-bright: "#fff8f7"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#fff0ef"
  surface-container: "#ffe9e7"
  surface-container-high: "#fde2df"
  surface-container-highest: "#f7dcda"
  on-surface: "#261817"
  on-surface-variant: "#5a403e"
  inverse-surface: "#3d2c2b"
  inverse-on-surface: "#ffedeb"
  outline: "#8e706d"
  outline-variant: "#e2bebb"
  surface-tint: "#b42628"
  primary: "#b12326"
  on-primary: "#ffffff"
  primary-container: "#d33d3b"
  on-primary-container: "#fffbff"
  inverse-primary: "#ffb3ad"
  secondary: "#006a60"
  on-secondary: "#ffffff"
  secondary-container: "#86f2e2"
  on-secondary-container: "#006f64"
  tertiary: "#535d69"
  on-tertiary: "#ffffff"
  tertiary-container: "#6b7682"
  on-tertiary-container: "#fdfcff"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdad6"
  primary-fixed-dim: "#ffb3ad"
  on-primary-fixed: "#410003"
  on-primary-fixed-variant: "#910613"
  secondary-fixed: "#89f5e5"
  secondary-fixed-dim: "#6bd8c9"
  on-secondary-fixed: "#00201c"
  on-secondary-fixed-variant: "#005048"
  tertiary-fixed: "#d9e3f1"
  tertiary-fixed-dim: "#bdc7d5"
  on-tertiary-fixed: "#121c26"
  on-tertiary-fixed-variant: "#3e4853"
  background: "#fff8f7"
  on-background: "#261817"
  surface-variant: "#f7dcda"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: "700"
    lineHeight: 48px
    letterSpacing: "0"
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: "0"
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: "0"
  h4:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: "0"
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
    letterSpacing: "0"
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
    letterSpacing: "0"
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: "0"
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.04em
  h1-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
  h2-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: "700"
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  sidebar_width: 240px
  content_max_width: 800px
  aside_width: 300px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a modern campus ecosystem, bridging the gap between social connectivity and academic professionalism. The brand personality is young and dynamic without sacrificing reliability, avoiding the "gamified" aesthetic in favor of a sophisticated, content-first approach.

Drawing inspiration from the clarity of professional networking platforms and the visual energy of modern event discovery tools, the style is **Corporate / Modern**. It utilizes a "Safe" visual identity: a highly readable, familiar layout that feels approachable yet grounded. The interface prioritizes high-quality white space, crisp line work, and purposeful motion to facilitate social engagement and information density simultaneously.

## Colors

The palette is built on a foundation of high-contrast neutrals and vibrant functional accents.

- **Primary (Coral):** Used for primary actions, highlights, and brand moments. It provides energy and warmth.
- **Secondary (Teal):** Used for secondary actions, categories, or differentiating academic vs. social content.
- **Ink (Neutral/Text):** The core of the typography system, ensuring deep legibility and a professional weight.
- **Surface & Background:** A subtle distinction between the off-white page background and pure white surfaces creates a clear "layered" hierarchy for cards and feeds.
- **Semantic Colors:** Success, Warning, and Error tones are calibrated for accessibility against both white and off-white backgrounds.

## Typography

The typography system uses a pairing of **Plus Jakarta Sans** for headlines and **Inter** for body text.

Plus Jakarta Sans brings a contemporary, geometric warmth to the interface, making titles feel welcoming. Inter is utilized for all functional text, ensuring maximum readability at small sizes for notifications, thread replies, and data-heavy sidebars.

Strictly avoid negative letter-spacing; instead, labels and captions use slight positive tracking to improve glanceability. Headlines scale down on mobile devices to ensure long titles do not break the layout flow.

## Layout & Spacing

The design system follows a strict **8px grid system** to maintain vertical and horizontal rhythm.

### Desktop Layout

The desktop experience is a structured three-column layout:

1.  **Left Navigation:** A 240px fixed sidebar for primary platform navigation.
2.  **Main Feed:** A centered column ranging between 760px and 820px (optimized at 800px) for the primary content flow.
3.  **Right Sidebar:** A 300px column for secondary information like "Trending Events," "Suggested Clubs," or "Upcoming Deadlines."

### Responsive Behavior

- **Tablet:** The right sidebar collapses into an expandable drawer or moves below the main content. The main column fluidly expands.
- **Mobile:** A single-column flow. The 240px sidebar is replaced by a bottom navigation bar or a top-level hamburger menu. Margins reduce from 24px to 16px.

## Elevation & Depth

This design system uses a combination of **low-contrast outlines** and **ambient shadows** to create a clean, layered feel.

- **Level 0 (Background):** #F7F8F5. No shadows.
- **Level 1 (Cards/Feed Items):** White background, 1px border (#DFE3E6). This is the default state for content containers.
- **Level 2 (Hover/Active Surfaces):** A very subtle, diffused shadow (0px 4px 12px rgba(23, 33, 43, 0.05)) to indicate interactivity.
- **Level 3 (Modals/Popovers):** Deeper shadows (0px 12px 32px rgba(23, 33, 43, 0.12)) and no border to emphasize separation from the main content plane.

Surfaces should feel light and physical, avoiding heavy dark shadows in favor of tinted grays that match the primary Ink color.

## Shapes

The shape language is defined as **Soft (Level 1)**.

- **Small elements:** (Checkboxes, small tags) use 4px (0.25rem) radius.
- **Standard elements:** (Buttons, Input fields, Cards) use 8px (0.5rem) radius.
- **Large elements:** (Modals, Featured banners) use 12px (0.75rem) radius.

This subtle rounding maintains a professional and organized look while feeling more modern and accessible than sharp corners. Circular shapes are reserved exclusively for user avatars and icon buttons.

## Components

### Buttons

- **Primary:** Solid Coral (#F0524D) with white text. High emphasis.
- **Secondary:** Outlined Teal (#1B998B) or light Teal background with Teal text.
- **Ghost:** No background/border; Ink text. Used for less prominent actions.
- **Destructive:** Solid Error Red (#C83E3E) or Outlined.
- **States:** Hover states should darken the background by 10%. Disabled states use a 30% opacity with a "not-allowed" cursor.

### Input Fields

- **Style:** 1px border (#DFE3E6), 8px radius, Inter 16px text.
- **Focus:** 2px border in Coral (#F0524D) or a soft Coral glow.
- **Validation:** Error states use Error Red (#C83E3E) for borders and helper text.

### Cards & Lists

- **Cards:** White background, 1px border, 8px radius. Content is padded at 16px or 24px.
- **Lists:** Horizontal separators use 1px #DFE3E6. Hovering over a list item should apply a #F7F8F5 background tint.

### Chips & Tags

- Used for categories (e.g., #Academic, #Social). Use a light version of the Teal or Coral palette (10% opacity) with the full-color text for high legibility and a soft look.

### Icons

- Use Lucide-style icons. Thin, consistent 2px stroke weight. Icons should be sized at 20px for standard UI and 24px for navigation.
