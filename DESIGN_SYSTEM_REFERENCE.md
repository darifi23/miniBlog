# 🎨 miniBlog Premium Color & Design System Reference

## Color Palette Quick Reference

### Primary Colors

#### 🟨 Saffron Gold (#E8A855)
```
CSS Usage:
- bg-gold-400     (Primary button background)
- text-gold-400   (Primary text accent)
- hover:bg-gold-500
- hover:text-gold-500

Components:
- Call-to-action buttons
- Primary accents
- Hover states
- Links
- Icons

Example:
<button className="bg-gold-400 hover:bg-gold-500 text-white">
  Start Reading
</button>
```

#### 🟫 Warm Bone (#F9F7F2)
```
CSS Usage:
- bg-bone         (Body background)
- bg-bone-100     (Card backgrounds)
- dark:bg-bone-300

Components:
- Page background
- Card backgrounds
- Subtle backgrounds
- Light neutral surfaces

Example:
<div className="bg-bone dark:bg-charcoal-900">
  Content here
</div>
```

#### ⬛ Deep Charcoal (#2D2D2D)
```
CSS Usage:
- text-charcoal-900 (Dark text)
- bg-charcoal-900   (Dark background)
- dark:text-bone-100

Components:
- Body text
- Dark mode backgrounds
- Strong contrast text
- Dark mode elements

Example:
<h1 className="text-charcoal-900 dark:text-bone-100">
  Heading
</h1>
```

### Accent Colors

#### 🔶 Terracotta (#D97F69)
```
CSS Usage:
- text-terracotta-500
- bg-terracotta-100 (light background)
- hover:text-terracotta-600

Components:
- Like/heart buttons
- Secondary accents
- Warm tones
- Hover effects

Example:
<Heart className="hover:text-terracotta-500" />
```

#### 🔵 Majorelle Blue (#6659DD)
```
CSS Usage:
- text-majorelle-500
- bg-majorelle-100
- dark:bg-majorelle-900/30

Components:
- Subtle accents
- Gradients
- Secondary highlights
- Focus states

Example:
<div className="bg-gradient-to-r from-gold-50 to-majorelle-50">
  Gradient background
</div>
```

---

## Font Stack

### Display Font (Headlines)
```
font-serif
- font-family: 'Playfair Display', 'Merriweather', 'Georgia', serif
- Perfect for: h1, h2, h3, major titles
- Weight: 400-900
- Use case: Editorial feel

Example:
<h1 className="font-serif text-5xl font-bold">
  Slow Down. Simplify.
</h1>
```

### Body Font (Text)
```
font-sans
- font-family: 'Poppins', 'system-ui', sans-serif
- Perfect for: Body, paragraphs, buttons
- Weight: 300-700
- Use case: Clean, modern readability

Example:
<p className="font-sans text-lg">
  Discover intentional stories...
</p>
```

---

## Component Color Mapping

### Buttons

#### Primary Button (Gold)
```jsx
<button className="px-8 py-4 bg-gold-400 hover:bg-gold-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
  Start Reading
</button>

Colors:
- Background: gold-400 (#E8A855)
- Text: white
- Hover: gold-500 (#E0943D)
- Shadow: lg → xl
```

#### Secondary Button (Charcoal Border)
```jsx
<button className="px-8 py-4 border-2 border-charcoal-300 dark:border-bone-300 text-charcoal-900 dark:text-bone-100 font-semibold rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-800">
  Start Writing
</button>

Colors:
- Border: charcoal-300
- Text: charcoal-900
- Dark text: bone-100
- Hover bg: charcoal-50
```

### Cards

#### Post Card
```jsx
<div className="bg-white dark:bg-charcoal-800/50 border border-bone-200 dark:border-charcoal-700/50 rounded-xl">
  {/* Content */}
</div>

Colors:
- Background: white / charcoal-800
- Border: bone-200 / charcoal-700
- Text: charcoal-900 / bone-100
```

#### Newsletter Signup
```jsx
<div className="bg-gradient-to-br from-gold-50 to-bone via-majorelle-50/20 dark:from-charcoal-800 dark:to-charcoal-900 border border-gold-200 dark:border-charcoal-700">
  {/* Content */}
</div>

Colors:
- Light bg: gold-50 → bone → majorelle-50
- Dark bg: charcoal-800 → charcoal-900
- Border: gold-200 / charcoal-700
```

### Tags & Badges

#### Post Tags
```jsx
<span className="bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300 rounded-full text-xs font-semibold">
  {tag}
</span>

Colors:
- Background: gold-100 / gold-900/30
- Text: gold-700 / gold-300
```

### Input Fields

#### Text Input (Email)
```jsx
<input 
  className="bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 text-charcoal-900 dark:text-bone-100 placeholder-charcoal-400 focus:ring-2 focus:ring-gold-400"
/>

Colors:
- Background: white / charcoal-700
- Border: charcoal-200 / charcoal-600
- Text: charcoal-900 / bone-100
- Placeholder: charcoal-400
- Focus ring: gold-400
```

---

## Typography Scale

### Headlines

```
h1 - Hero Title
font-serif text-5xl sm:text-6xl lg:text-7xl font-bold
color: text-charcoal-900 dark:text-bone-100
Example: "Slow Down. Simplify. Find What Feels Good"

h2 - Section Title
font-serif text-4xl md:text-5xl font-bold
color: text-charcoal-900 dark:text-bone-100
Example: "Latest Stories"

h3 - Card Title
font-serif text-xl md:text-2xl font-bold
color: text-charcoal-900 dark:text-bone-100
Example: Post title in card
```

### Body Text

```
Large paragraph
text-lg sm:text-xl
color: text-charcoal-600 dark:text-bone-300
Example: Subtitle text

Normal paragraph
text-base
color: text-charcoal-600 dark:text-bone-300
Example: Post description

Small text
text-sm
color: text-charcoal-500 dark:text-bone-400
Example: Metadata, dates
```

---

## Spacing & Layout

### Container Widths
```
Mobile:    full width (px-4)
Tablet:    md:max-w-4xl (px-6)
Desktop:   lg:max-w-6xl (px-8)
```

### Section Spacing
```
Hero:           pt-32 pb-24
Featured:       py-20
Newsletter:     py-20
Grid:           py-20
CTA:            py-20
```

### Card Spacing
```
Internal padding:  p-6
Large padding:     p-8 md:p-12
Gaps between:      gap-8 md:gap-0
```

---

## Dark Mode Colors

### Dark Mode Mapping

```
Light Mode → Dark Mode

bg-bone                 → dark:bg-charcoal-900
text-charcoal-900      → dark:text-bone-100
bg-white               → dark:bg-charcoal-800
text-charcoal-600      → dark:text-bone-300
border-bone-200        → dark:border-charcoal-700
bg-gold-100            → dark:bg-gold-900/30

All gold colors available in dark:
- dark:text-gold-300
- dark:bg-gold-900/30
- dark:hover:text-gold-400
```

### Example Dark Mode Component
```jsx
<div className="bg-bone dark:bg-charcoal-900 text-charcoal-900 dark:text-bone-100">
  <h1 className="text-charcoal-900 dark:text-bone-100">
    Title
  </h1>
  <button className="bg-gold-400 hover:bg-gold-500 dark:bg-gold-500 dark:hover:bg-gold-600">
    Button
  </button>
</div>
```

---

## Responsive Design Grid

### Grid Breakpoints

```
Mobile (< 640px):
- Single column layout
- Full width: px-4
- Font sizes: text-4xl, text-lg
- Button height: py-4

Tablet (640px-1024px):
- 2 columns for posts: md:grid-cols-2
- Padding: px-6
- Medium spacing: gap-6

Desktop (1024px+):
- 3 columns for posts: lg:grid-cols-3
- Max width: max-w-6xl
- Large padding: px-8
- Font sizes: text-7xl
```

### Responsive Utilities

```
Text sizing:
text-4xl sm:text-5xl lg:text-7xl

Padding:
px-4 sm:px-6 lg:px-8
py-20 md:py-24

Grid:
md:grid-cols-2 lg:grid-cols-3

Display:
flex flex-col sm:flex-row
```

---

## Animation Classes

### Framer Motion Variants

```javascript
// Fade In
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.5 }}

// Slide Up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Scale
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.6 }}

// Stagger
variants={container}
initial="hidden"
animate="show"
```

### Hover Effects

```css
card-hover:
- transition-all duration-300
- hover:shadow-xl
- hover:-translate-y-1

button hover:
- bg-gold-400 → bg-gold-500
- shadow-lg → shadow-xl
- scale-100 → scale-105
```

---

## Utility Classes

### Custom Utilities (from index.css)

```css
.glass - Glass morphism background
.card-hover - Card hover state
.editorial-title - Large serif heading
.editorial-subtitle - Large body text
.gold-accent - Gold text accent
.button-primary - Primary button styling
.button-secondary - Secondary button styling
```

### Usage Examples

```jsx
<div className="glass">
  Frosted glass effect
</div>

<h1 className="editorial-title">
  Large editorial heading
</h1>

<p className="editorial-subtitle">
  Large subtitle text
</p>

<a className="gold-accent">
  Gold highlighted link
</a>

<button className="button-primary">
  Primary Action
</button>
```

---

## Color Combinations (Best Practices)

### Good Combinations

```
✅ Gold background + White text
   bg-gold-400 text-white

✅ Charcoal background + Bone text
   bg-charcoal-900 text-bone-100

✅ Bone background + Charcoal text
   bg-bone text-charcoal-900

✅ Gold text + Charcoal background
   text-gold-400 bg-charcoal-100

✅ Terracotta accent + Bone background
   text-terracotta-500 bg-bone-100
```

### Avoid

```
❌ Bone text on bone background
   (No contrast)

❌ Charcoal on charcoal
   (No contrast)

❌ Too many colors in one component
   (Stick to 2-3 colors max)
```

---

## Quick Copy-Paste Snippets

### Hero Section
```jsx
<section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-bone dark:bg-charcoal-900">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal-900 dark:text-bone-100 mb-6">
      Slow Down.
    </h1>
    <p className="text-lg sm:text-xl text-charcoal-600 dark:text-bone-300 mb-8">
      Discover intentional stories
    </p>
    <button className="px-8 py-4 bg-gold-400 hover:bg-gold-500 text-white font-semibold rounded-lg">
      Start Reading
    </button>
  </div>
</section>
```

### Card Component
```jsx
<div className="bg-white dark:bg-charcoal-800 border border-bone-200 dark:border-charcoal-700 rounded-xl p-6 hover:shadow-lg transition-all">
  <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-bone-100 mb-2">
    Card Title
  </h3>
  <p className="text-charcoal-600 dark:text-bone-300 mb-4">
    Description
  </p>
  <button className="button-primary">
    Learn More
  </button>
</div>
```

### Newsletter Signup
```jsx
<div className="bg-gradient-to-br from-gold-50 to-bone dark:from-charcoal-800 dark:to-charcoal-900 border border-gold-200 dark:border-charcoal-700 rounded-3xl p-12">
  <h2 className="font-serif text-4xl font-bold text-charcoal-900 dark:text-bone-100 mb-4">
    Slow Brew Sunday
  </h2>
  <input 
    className="w-full px-4 py-3 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg focus:ring-2 focus:ring-gold-400"
    placeholder="Enter your email"
  />
  <button className="button-primary w-full mt-4">
    Subscribe
  </button>
</div>
```

---

## Testing Checklist

- [ ] Verify gold (#E8A855) displays correctly
- [ ] Check bone background (#F9F7F2) is warm
- [ ] Test charcoal text (#2D2D2D) contrast
- [ ] Verify dark mode colors
- [ ] Test responsive on mobile/tablet/desktop
- [ ] Check all buttons are clickable
- [ ] Verify hover effects work
- [ ] Test on different browsers
- [ ] Verify font loading (Playfair/Poppins)
- [ ] Check animation smoothness

---

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Design System Version:** 1.0  
**Last Updated:** January 28, 2026  
**Status:** Ready for Production  

