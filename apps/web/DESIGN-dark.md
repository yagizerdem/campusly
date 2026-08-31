---
name: Campusly Dark
colors:
  surface: "#0e141b"
  surface-dim: "#0e141b"
  surface-bright: "#343a41"
  surface-container-lowest: "#090f15"
  surface-container-low: "#161c23"
  surface-container: "#17212B"
  surface-container-high: "#212B36"
  surface-container-highest: "#2f353d"
  on-surface: "#F5F7FA"
  on-surface-variant: "#B0B8C1"
  inverse-surface: "#dde3ed"
  inverse-on-surface: "#2b3139"
  outline: "#a98986"
  outline-variant: "#5a403e"
  surface-tint: "#ffb3ad"
  primary: "#ffb3ad"
  on-primary: "#680009"
  primary-container: "#fa5953"
  on-primary-container: "#5c0007"
  inverse-primary: "#b42628"
  secondary: "#6cd8c9"
  on-secondary: "#003731"
  secondary-container: "#2aa193"
  on-secondary-container: "#00302b"
  tertiary: "#bcc8d5"
  on-tertiary: "#27313c"
  tertiary-container: "#87929e"
  on-tertiary-container: "#202b35"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffdad6"
  primary-fixed-dim: "#ffb3ad"
  on-primary-fixed: "#410003"
  on-primary-fixed-variant: "#910613"
  secondary-fixed: "#89f5e5"
  secondary-fixed-dim: "#6cd8c9"
  on-secondary-fixed: "#00201c"
  on-secondary-fixed-variant: "#005048"
  tertiary-fixed: "#d8e4f1"
  tertiary-fixed-dim: "#bcc8d5"
  on-tertiary-fixed: "#121d26"
  on-tertiary-fixed-variant: "#3d4853"
  background: "#0e141b"
  on-background: "#dde3ed"
  surface-variant: "#2f353d"
  surface-main: "#12181F"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: "700"
    lineHeight: 48px
  h1-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
  h2-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: "700"
    lineHeight: 32px
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  h4:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
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
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  sidebar-width: 240px
  aside-width: 300px
  max-content-width: 800px
  gutter: 24px
---

## Brand & Style

The design system is a high-performance dark theme adaptation of a modern campus ecosystem. It preserves the energy and social connectivity of the original brand while pivoting to a sophisticated, eye-strain-reducing environment suitable for late-night study sessions and academic management.

The design style is **Corporate / Modern** with a focus on a **Safe** visual identity. By utilizing deep navy foundations instead of true black, the system maintains a sense of "air" and premium quality. The brand personality remains youthful and dynamic, utilizing the vibrant Coral accent to punctuate a structured, professional layout. The aesthetic avoids unnecessary "gamer" tropes, opting instead for the refined clarity found in modern developer tools and high-end fintech applications.

## Colors

The palette transitions to a deep "Ink" foundation to enhance focus and content legibility in low-light environments.

- **Primary (Coral):** The core brand color (#F0524D) is retained for high-impact actions, active states, and brand signatures. In dark mode, this color provides a striking contrast against the navy background.
- **Surface Foundations:** The system uses `#12181F` (Dark Navy) as the base background. Surfaces like cards and navigation bars use `#17212B` or `#212B36` to create depth through tonal shifts rather than shadows.
- **Typography & UI States:** Primary text is set in an off-white (`#F5F7FA`) to prevent harsh "vibrating" contrast. Secondary text and borders utilize muted grays (`#B0B8C1`) to maintain a clear hierarchy.
- **Secondary (Teal):** Used for category indicators (e.g., Academic vs. Social) and secondary interactive elements, providing a cool counterpoint to the warm Coral primary.

## Typography

This design system employs a specialized typographic pairing to balance personality with utility. **Plus Jakarta Sans** is used for headlines, providing a friendly, geometric presence that keeps the campus atmosphere feeling accessible. **Inter** is the workhorse for body text, UI labels, and data, chosen for its exceptional legibility on digital screens.

In this dark theme, font weights are carefully managed to avoid "optical glowing" on high-contrast screens. Large headlines scale down for mobile devices to prevent excessive line breaks in long titles. Tight letter-spacing is strictly avoided; labels and captions use subtle positive tracking to ensure they remain glanceable against dark backgrounds.

## Layout & Spacing

The layout philosophy relies on a **fixed grid** approach for desktop, transitioning to a fluid single-column model for mobile. A strict **8px rhythm** governs all spatial relationships.

### Desktop Composition

- **Primary Nav:** A 240px fixed left sidebar.
- **Main Feed:** A central column restricted to 800px to maintain optimal line lengths for reading thread content and news.
- **Utility Sidebar:** A 300px right column used for contextual information like "Upcoming Deadlines" or "Trending Clubs."

### Responsive Adjustments

On tablet devices, the utility sidebar collapses into a drawer. For mobile devices, the layout reflows into a single vertical stack with margins reduced from 24px to 16px. Primary navigation is typically moved to a bottom bar or a top-mounted condensed menu to prioritize thumb-reachability.

## Elevation & Depth

In this dark environment, elevation is communicated primarily through **tonal layers** rather than traditional drop shadows, which can appear muddy on deep navy backgrounds.

- **Level 0 (Base):** The #12181F background. This is the "floor" of the application.
- **Level 1 (Default Surface):** Cards, input fields, and sidebar containers use #17212B. A 1px subtle border (#2B3642) is used to define the edges clearly.
- **Level 2 (Interaction/Hover):** Surfaces lift to #212B36. A very faint, tinted ambient shadow (0px 4px 12px rgba(0, 0, 0, 0.4)) may be used to reinforce the lift.
- **Level 3 (Overlays):** Modals and dropdowns use the highest tonal value (#2C3848) to stand out against the background stack.

By using progressively lighter shades of navy, the system creates a natural sense of light hitting surfaces closer to the user.

## Shapes

The shape language is defined as **Rounded (Level 2)**, which provides a friendly and approachable feel that aligns with the "Campus" brand identity.

- **Small UI Components:** Checkboxes and tags use a 0.5rem (8px) radius.
- **Standard Containers:** Buttons, input fields, and content cards use a 1rem (16px) radius.
- **Large Layout Elements:** Banners and modals use a 1.5rem (24px) radius.

This generous rounding helps soften the technical nature of the dark theme, making the interface feel more like a social environment and less like a terminal. Circular treatments are reserved exclusively for user avatars and floating action buttons.

## Components

### Buttons

- **Primary:** Solid Coral (#F0524D) with white text. This is the highest emphasis button.
- **Secondary:** Outlined with a 1px border of Teal (#86f2e2) or a subtle ghost variant.
- **States:** Hovering over solid buttons should lighten the color by 10% to "glow." Disabled buttons are set to 30% opacity with no pointer events.

### Input Fields

- **Container:** #17212B background with a #2B3642 border.
- **Focus State:** The border transitions to Coral (#F0524D) with a subtle 2px outer ring to indicate active focus.
- **Typography:** Placeholder text uses a muted gray (#6B7682) for clear distinction from user input.

### Cards & Lists

- **Cards:** Utilize Level 1 surface coloring (#17212B) with internal padding of 24px.
- **Dividers:** Use a 1px line of #2B3642 for horizontal separation within lists. Hovering over list items should trigger a background shift to #212B36.

### Chips & Tags

- For categories like #Social or #Academic, use a 15% opacity tint of the secondary or primary color as a background, paired with the full-strength color for the text label. This ensures high legibility and color association without overwhelming the dark interface.

### Icons

- Use 2px stroke-weight icons (Lucide-style). Icons should generally adopt the "On-Surface-Variant" color unless they are being used within a Primary button or as an active status indicator.
