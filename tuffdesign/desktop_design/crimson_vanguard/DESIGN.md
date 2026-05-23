# Design System Strategy: The Relational Architect

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Relational Architect."** 

Leadership and interpersonal growth are not linear; they are structural, nuanced, and deeply human. This design system moves away from the rigid, "boxed-in" layout of traditional SaaS platforms. Instead, it adopts a **High-End Editorial** aesthetic—utilizing expansive whitespace, intentional asymmetry, and tonal depth to create an environment that feels both authoritative and breathing. 

We break the "template" look by treating the screen like a gallery wall. Elements should feel curated, not just placed. We use overlapping components and a "floating" surface logic to convey the idea that relational practice is a layered, ongoing process.

---

## 2. Colors: Tonal Authority
The palette is anchored by the high-contrast tension between `primary` (#9e001a) and the sophisticated neutrals.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning or containment. Structural boundaries must be defined exclusively through background color shifts.
*   **Example:** A `surface-container-low` (#eff4ff) section sitting directly on a `surface` (#f8f9ff) background creates a soft, modern boundary that feels architectural rather than "computational."

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
*   **Level 0 (Foundation):** `surface` (#f8f9ff).
*   **Level 1 (Sectioning):** `surface-container-low` (#eff4ff) for large content areas.
*   **Level 2 (Interaction):** `surface-container-highest` (#d9e3f6) for cards or active elements.
By nesting these tiers, we create a sense of "Natural Depth" without the clutter of lines.

### The "Glass & Gradient" Rule
To inject visual "soul" into the professional environment:
*   **Glassmorphism:** Use semi-transparent versions of `surface-container-lowest` (#ffffff) with a `backdrop-filter: blur(20px)` for floating navigation bars or modal overlays.
*   **Signature Textures:** Main CTAs or Hero sections should utilize a subtle linear gradient (135deg) transitioning from `primary` (#9e001a) to `primary-container` (#c3212d). This provides a rich, tactile feel that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Impact
We utilize **Inter** as our typographic workhorse, but we treat it with the discipline of a fashion magazine.

*   **Display Scale (`display-lg` to `display-sm`):** Reserved for core brand pillars and high-impact leadership quotes. Use `-0.02em` letter-spacing to create a "tight," professional look.
*   **Headline Scale (`headline-lg` to `headline-sm`):** These are your anchors. Use bold weights to establish an immediate hierarchy.
*   **Body Scale (`body-lg` to `body-sm`):** Prioritize legibility. `body-lg` (1rem) is the default for relational practice content to reduce cognitive load during training.
*   **The Hierarchy Logic:** By pairing a massive `display-lg` headline with a quiet `label-md` eyebrow text, we create "visual tension" that feels premium and intentional.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor layout. In this design system, depth is achieved through **Tonal Layering**.

### The Layering Principle
Stack containers to create lift. Place a `surface-container-lowest` card on a `surface-container-low` section. The slight shift from #ffffff to #eff4ff creates a soft, natural lift.

### Ambient Shadows
If a floating effect is required (e.g., for a "Relational Practice" modal):
*   **Blur:** 40px to 60px.
*   **Opacity:** 4%–8%.
*   **Color:** Use a tinted shadow—derive it from `on-surface` (#121c2a) rather than pure black to keep the light feeling natural.

### The "Ghost Border" Fallback
If a border is legally or functionally required for accessibility:
*   Use the `outline-variant` (#e4bebb) token at **15% opacity**.
*   **Prohibited:** 100% opaque, high-contrast borders are strictly forbidden.

---

## 5. Components

### Buttons: The Action Anchors
*   **Primary:** Gradient of `primary` to `primary-container`. `lg` roundedness (0.5rem). No border. White text.
*   **Secondary:** `surface-container-highest` background with `on-surface` text.
*   **Tertiary:** No background. Bold `primary` text. Use for low-emphasis actions like "Cancel."

### Input Fields: Sophisticated Input
*   **Default State:** `surface-container-low` background with a `ghost-border` at the bottom only. 
*   **Focus State:** Background shifts to `surface-container-lowest`, bottom border becomes `primary` at 2px.
*   **Error State:** Text and bottom border shift to `error` (#ba1a1a).

### Cards & Lists: The No-Divider Rule
*   **Cards:** Never use borders. Use `surface-container-lowest` (#ffffff) on a `surface-container-low` (#eff4ff) background.
*   **Lists:** Forbid divider lines. Use **Vertical White Space** (24px to 32px) to separate list items. The "Relational Architect" relies on the eye's ability to group elements through proximity, not lines.

### Chips: Relational Tags
*   **Selection Chips:** Use `secondary-container` (#d6e0f3) with `on-secondary-container` (#596373) text. Use `full` roundedness (9999px) for a soft, human feel.

---

## 6. Do's and Don'ts

### Do
*   **Do** embrace asymmetry. In a leadership dashboard, allow a "Growth Summary" card to overlap a background container by 20px to create depth.
*   **Do** use high-quality, candid professional imagery. Photos should focus on eye contact and active listening.
*   **Do** prioritize the "Primary" red (#9e001a) for moments of decision and growth.

### Don't
*   **Don't** use 1px dividers to separate content. Use background color blocks.
*   **Don't** use standard drop shadows. If it looks like a "shadow," it's too dark. It should look like "atmosphere."
*   **Don't** crowd the layout. If a screen feels busy, increase the padding between sections by 2x. Leadership requires room to think.