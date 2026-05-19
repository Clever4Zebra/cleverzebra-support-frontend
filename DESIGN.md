---
name: Cognitive Clarity
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#44464f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#757780'
  outline-variant: '#c5c6d0'
  surface-tint: '#485e8e'
  primary: '#00061a'
  on-primary: '#ffffff'
  primary-container: '#001d4b'
  on-primary-container: '#7186ba'
  inverse-primary: '#b0c6fd'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#000717'
  on-tertiary: '#ffffff'
  tertiary-container: '#152031'
  on-tertiary-container: '#7c879d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6fd'
  on-primary-fixed: '#001944'
  on-primary-fixed-variant: '#2f4675'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  surface-white: '#FFFFFF'
  text-muted: '#64748B'
  border-subtle: '#E2E8F0'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  content-max: 800px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 64px
---

## Brand & Style
The design system is engineered for high-density information environments, specifically tailored for knowledge bases and documentation platforms. The brand personality is **authoritative, efficient, and transparent**. It aims to evoke a sense of structured intelligence, reducing cognitive load for users seeking specific answers.

The design style is **Corporate Modern with a Minimalist focus**. It prioritizes function over form, utilizing generous white space, a disciplined color palette, and high-quality typography to ensure that the content remains the focal point. Elements are crisp and purposeful, avoiding unnecessary decorative flourishes in favor of utility and clarity.

## Colors
The palette is rooted in a deep "Midnight Navy" primary to establish trust and institutional knowledge. A vibrant "Indigo" serves as the secondary action color, used sparingly for primary calls-to-action and interactive states. 

The background strategy utilizes a tiered white system: `#FFFFFF` for the main content area (to maximize contrast) and `#F7F9FC` for surrounding structural elements like sidebars and headers. This "cool neutral" approach keeps the interface feeling fresh and surgical. Text hierarchy relies on "Slate" for headers and "Muted Gray" for secondary metadata to guide the eye through document structures.

## Typography
This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic appearance. The type scale is optimized for long-form reading, with `body-lg` used for primary article content to ensure comfort during extended sessions. 

Headlines utilize tighter letter-spacing and heavier weights to provide clear visual anchors. For mobile views, the display and large headline sizes are reduced to prevent awkward line breaks while maintaining the same weight hierarchy. Vertical rhythm is strictly enforced via a 1.6x line-height for body copy, providing enough "breathing room" for dense technical text.

## Layout & Spacing
The layout employs a **fixed grid** strategy for the main content to preserve optimal line lengths (approximately 70-80 characters). A 12-column grid is used for the overall page structure, typically allocating 3 columns for navigation/sidebar and 9 columns for content.

On desktop, the main container is centered with a max-width of 1280px. However, the reading area within that container is further restricted to 800px to prevent eye fatigue. On mobile, margins shrink to 16px, and the sidebar collapses into a hidden drawer or a simplified top navigation. Horizontal spacing uses a base-8 rhythm to ensure consistent alignment across all UI components.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows. This maintains a "flat-professional" aesthetic that feels modern and lightweight.

- **Level 0 (Base):** Backgrounds use the neutral `#F7F9FC` color.
- **Level 1 (Content):** Main article cards and white-space containers use `#FFFFFF` with a 1px border of `#E2E8F0`.
- **Level 2 (Interaction):** Hover states and active dropdowns utilize a very soft ambient shadow (0px 4px 12px rgba(0, 29, 75, 0.05)) to suggest lift without breaking the minimalist aesthetic.
- **Level 3 (Modals):** Use a backdrop blur (8px) and a slightly more pronounced shadow to isolate urgent tasks.

## Shapes
The design system uses **Soft (0.25rem)** roundedness for standard components like input fields, buttons, and small tags. This choice balances the seriousness of the brand with a modern, approachable touch. 

Larger containers, such as article cards or search bars, use `rounded-lg` (0.5rem) to soften the overall interface. Interactive elements that require high visibility, such as "Contact Support" buttons, may occasionally use a pill-shape to distinguish them from structural content elements.

## Components

### Buttons
- **Primary:** Solid `#001D4B` background with white text. 0.25rem border radius.
- **Secondary:** Outline variant with `#6366F1` text and border.
- **Ghost:** No border or background; text turns primary navy on hover.

### Cards & Search
- **Search Bar:** Centered, large height (56px), with a subtle 1px border and a leading magnifying glass icon.
- **Topic Cards:** White background, 1px subtle border, featuring a primary-colored icon and `headline-sm` titles.

### Navigation
- **Sidebar:** Uses a "Selected" state with a left-accent border of 4px in the secondary Indigo color. Text for inactive links uses `text-muted`.
- **Breadcrumbs:** Small `label-md` text with chevron separators, helping users maintain orientation within deep hierarchies.

### Form Inputs
- Inputs use a white background and a 1px border. Focus states use a 2px Indigo ring with a slight offset to ensure accessibility and clear user feedback.

### Feedback Callouts
- **Note/Warning:** Soft tinted backgrounds (e.g., light blue or light amber) with a thick 4px left-side border to highlight critical information within articles.