---
name: Nexus Intelligence
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for high-density cognitive work, establishing a "Command Center" atmosphere that feels both authoritative and infinitely capable. The brand personality is rooted in professional sophistication, blending high-tech precision with a minimalist aesthetic.

The visual style utilizes **Glassmorphism** and **Modern Corporate** influences. Surfaces are deep, layered, and semi-translucent, suggesting depth and data complexity without overwhelming the user. The emotional response should be one of "calm control"—an environment where complex AI agents can be orchestrated through a clean, high-fidelity interface. Heavy use of whitespace is avoided in favor of "structured density," where information is packed efficiently but separated by precise, luminous borders and subtle depth cues.

## Colors
The palette is centered on a "Deep Space" foundation. The primary background uses a near-black navy to maximize contrast for data visualization and neon accents. 

- **Primary & Secondary:** Used for action states, AI "thinking" indicators, and active command paths. These colors should often be applied as subtle outer glows or linear gradients rather than solid blocks.
- **Accents:** A tertiary cyan-blue is used for success states and telemetry data.
- **Surface Strategy:** Layers are defined by hex steps rather than shadows. Level 0 is the void (#020617), Level 1 is the workspace (#0f172a), and Level 2 is the active glass pane.
- **Transparency:** Use 40-60% opacity on surface colors when backed by background blurs to achieve the glass effect.

## Typography
This design system utilizes **Hanken Grotesk** for its sharp, contemporary geometry and exceptional legibility at small scales. 

- **Scale:** High contrast between display titles and functional labels. Labels often use uppercase with slight tracking to evoke a technical, "readout" feel.
- **Weight:** Use SemiBold (600) for interactive elements and Regular (400) for research content. Bold (700) is reserved for primary headers and data highlights.
- **Color:** Primary text is High-Emphasis White (90%). Secondary data and metadata should use Mid-Emphasis Slate (60%).

## Layout & Spacing
The layout follows a **Fluid Grid** model designed for multi-pane orchestration. The system uses a 4px baseline rhythm to ensure mathematical precision in tight, information-rich views.

- **Desktop (1440px+):** 12-column grid. Sidebars for agent control are fixed-width (280px), while the central "Research Canvas" is fluid.
- **Panels:** Content is organized into modular "Glass Panes." Spacing between panes is a consistent 16px (gutter).
- **Density:** Provide a "Compact" and "Standard" mode. Compact reduces internal padding from 16px to 8px for data-heavy monitoring dashboards.
- **Mobile:** Elements reflow to a single column, with the agent control bar transforming into a bottom-anchored floating action menu.

## Elevation & Depth
Depth in this design system is created through **Luminance and Blur**, not traditional shadows. 

1.  **Base Layer:** The darkest surface (#020617).
2.  **Floating Panes:** 60% opacity surfaces with a 20px Backdrop Blur.
3.  **Borders:** Use 1px "Inner Glow" borders. Apply a linear gradient (Top-Left to Bottom-Right) from `white/15%` to `white/5%`.
4.  **Active State:** When an agent or panel is active, apply a subtle outer bloom using the primary color (`#3b82f6`) with a 15px blur and very low (10%) opacity.

## Shapes
The shape language is "Softly Technical." We avoid the aggressive sharpness of pure brutalism to maintain a premium, approachable feel.

- **Cards/Panes:** 12px to 16px corner radius.
- **Buttons/Inputs:** 8px corner radius for a tighter, more precise look.
- **Status Indicators:** Fully circular (pill-shaped) for high visibility.
- **Icons:** Use 2px stroke weight with slightly rounded terminals to match the typography.

## Components
- **Buttons:** 
  - *Primary:* Solid blue to purple gradient with white text. Subtle 4px outer glow on hover.
  - *Ghost:* Transparent with a 1px border. Background fills to 10% white on hover.
- **Glass Cards:** The primary container. Features a subtle 1px border and backdrop blur. Title areas are separated by a 1px horizontal line.
- **Input Fields:** Darker than the card surface. On focus, the border transitions from slate to primary blue with a 2px outer glow.
- **AI Agent Chips:** Compact, pill-shaped indicators showing agent status (Active, Idle, Error). Include a 4px pulsing dot for "Thinking" states.
- **Terminal/Log:** A specialized component using a monospaced variant of the font for real-time AI thought-streams, housed in a recessed, dark-tiled container.
- **Command Bar:** A floating, centered search/command input with high backdrop blur and a distinct purple-to-blue border gradient.