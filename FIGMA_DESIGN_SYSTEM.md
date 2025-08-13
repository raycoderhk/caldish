# 🎨 Caldish Design System for Figma

This document extracts the design system from your `prototype.html` to make Figma recreation easier.

## 🎯 **Color Palette**

### Primary Colors
```css
Primary Green: #22C55E    /* Main brand color */
Green Dark:   #16A34A    /* Hover states, emphasis */
Green Light:  #DCFCE7    /* Backgrounds, highlights */
```

### Accent Colors
```css
Blue Primary: #3B82F6    /* Links, interactive elements */
Blue Light:   #EFF6FF    /* Backgrounds, info states */
Blue Dark:    #1D4ED8    /* Active states */
```

### Semantic Colors
```css
Success:      #10B981    /* Positive feedback */
Warning:      #F59E0B    /* Caution, medium confidence */
Error:        #EF4444    /* Errors, low confidence */
Info:         #3B82F6    /* Information, neutral */
```

### Neutral Scale
```css
Gray 50:      #F9FAFB    /* Page background */
Gray 100:     #F3F4F6    /* Card backgrounds */
Gray 200:     #E5E7EB    /* Borders, dividers */
Gray 300:     #D1D5DB    /* Input borders */
Gray 400:     #9CA3AF    /* Placeholder text */
Gray 500:     #6B7280    /* Secondary text */
Gray 600:     #4B5563    /* Body text */
Gray 700:     #374151    /* Headings */
Gray 800:     #1F2937    /* Dark headings */
Gray 900:     #111827    /* Primary text */
White:        #FFFFFF    /* Cards, overlays */
```

## 📝 **Typography System**

### Font Family
```css
Primary: Inter (system font)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Text Styles
```css
/* Display Text */
Display Large:   48px / 1.2 / Bold      /* Hero sections */
Display Medium:  36px / 1.2 / Bold      /* Page titles */
Display Small:   30px / 1.2 / Bold      /* Section headers */

/* Headings */
Heading 1:       24px / 1.3 / Bold      /* Card titles */
Heading 2:       20px / 1.3 / Bold      /* Subsection titles */
Heading 3:       18px / 1.4 / Semibold  /* Component titles */
Heading 4:       16px / 1.4 / Semibold  /* Small titles */

/* Body Text */
Body Large:      16px / 1.6 / Regular   /* Primary body text */
Body Medium:     14px / 1.5 / Regular   /* Secondary text */
Body Small:      12px / 1.4 / Regular   /* Captions, labels */

/* Specialized */
Caption:         11px / 1.3 / Regular   /* Fine print */
Overline:        12px / 1.3 / Semibold  /* Category labels */
Button:          14px / 1.0 / Semibold  /* Button text */
```

## 🔧 **Spacing System**

### Spacing Scale (8px base)
```css
xs:    4px     /* Tight spacing */
sm:    8px     /* Small gaps */
md:    12px    /* Default spacing */
lg:    16px    /* Section spacing */
xl:    24px    /* Large gaps */
2xl:   32px    /* Section dividers */
3xl:   48px    /* Major sections */
4xl:   64px    /* Page sections */
```

### Component Spacing
```css
Card Padding:        24px
Button Padding:      12px 24px
Input Padding:       12px 16px
Form Gap:           16px
Grid Gap:           16px
```

## 📐 **Layout System**

### Container Widths
```css
Max Width:      1024px   /* Main content container */
Card Width:     800px    /* Upload area, results */
Mobile:         100%     /* Full width on mobile */
```

### Breakpoints
```css
Mobile:         < 768px
Tablet:         768px - 1024px
Desktop:        > 1024px
```

### Grid System
```css
Columns:        12 (on desktop)
Gutter:         16px
Margin:         16px (mobile) / 24px (desktop)
```

## 🎨 **Component Specifications**

### Buttons
```css
Primary Button:
  Background: #22C55E
  Text: White, 14px, Semibold
  Padding: 12px 24px
  Border Radius: 6px
  Hover: #16A34A

Secondary Button:
  Background: White
  Border: 1px solid #D1D5DB
  Text: #374151, 14px, Semibold
  Padding: 12px 24px
  Border Radius: 6px
  Hover: #F9FAFB
```

### Cards
```css
Default Card:
  Background: White
  Border Radius: 12px
  Shadow: 0 1px 3px rgba(0,0,0,0.1)
  Padding: 24px

Result Card:
  Background: White
  Border Radius: 12px
  Shadow: 0 1px 3px rgba(0,0,0,0.1)
  Padding: 24px
  Border: 1px solid #E5E7EB
```

### Upload Area
```css
Upload Zone:
  Background: White
  Border: 2px dashed #D1D5DB
  Border Radius: 12px
  Padding: 48px 24px
  Text Align: Center

Upload Active:
  Border: 2px solid #3B82F6
  Background: #EFF6FF
```

### Form Elements
```css
Input Field:
  Background: White
  Border: 1px solid #D1D5DB
  Border Radius: 6px
  Padding: 12px 16px
  Font: 16px Regular
  Focus: Border #3B82F6, Ring 2px #3B82F6 20%
```

### Icons
```css
Size Small:     16px
Size Medium:    20px
Size Large:     24px
Size XL:        32px

Colors:
  Primary: #6B7280 (gray-500)
  Active: #22C55E (green-500)
  Disabled: #D1D5DB (gray-300)
```

## 📊 **Data Visualization**

### Charts
```css
Donut Chart:
  Size: 200x200px (desktop) / 150x150px (mobile)
  Stroke Width: 20px
  Colors: Green (#22C55E), Blue (#3B82F6), Yellow (#F59E0B)

Progress Bars:
  Height: 6px
  Background: #E5E7EB
  Fill Colors:
    - Protein: #22C55E
    - Carbohydrates: #3B82F6
    - Fat: #F59E0B
    - Over 100%: #EF4444
```

### Confidence Indicators
```css
High Confidence (>85%):   Green dot (#10B981)
Medium Confidence (65-85%): Yellow dot (#F59E0B)
Low Confidence (<65%):    Red dot (#EF4444)
Size: 12px circle
```

## 🎭 **Animation & States**

### Hover States
```css
Buttons:        Background color change (0.2s ease)
Cards:          Subtle scale (1.02) + shadow increase
Links:          Color change to primary green
Icons:          Color change + slight scale (1.1)
```

### Loading States
```css
Spinner:
  Size: 40px
  Border: 3px solid #F3F4F6
  Border Top: 3px solid #3B82F6
  Animation: Rotate 1s linear infinite

Progress Bar:
  Background: #E5E7EB
  Fill: #3B82F6
  Animation: Width transition 0.3s ease
```

### Transitions
```css
Default:        0.2s ease
Slow:          0.3s ease
Fast:          0.1s ease
```

## 🌟 **Usage Guidelines**

### Color Usage
- **Primary Green**: Main actions, success states, branding
- **Blue**: Secondary actions, information, links
- **Gray Scale**: Text hierarchy, borders, backgrounds
- **Semantic**: Status indicators, feedback

### Typography Usage
- **Display**: Hero sections, landing pages
- **Headings**: Content hierarchy, section titles
- **Body**: Readable content, descriptions
- **Small**: Captions, fine print, metadata

### Spacing Usage
- **Consistent**: Use 8px increments
- **Breathing Room**: Don't crowd elements
- **Visual Hierarchy**: More space = more importance
- **Mobile**: Reduce spacing by 25-50%

## 🎯 **Figma Implementation Tips**

### Create Styles First
1. **Colors**: Save each color as a style
2. **Typography**: Create text styles for each size
3. **Effects**: Save shadows and other effects
4. **Grid**: Set up layout grids

### Component Strategy
1. **Atoms**: Buttons, inputs, icons
2. **Molecules**: Cards, form groups
3. **Organisms**: Upload area, results section
4. **Templates**: Full page layouts

### Naming Convention
```
Components:     Button/Primary, Card/Default
Text Styles:    Heading/H1, Body/Large
Colors:         Primary/Green-500, Gray/100
Effects:        Shadow/Card, Shadow/Button
```

---

**This design system ensures consistency across your Figma recreation and future design work!** 🎨
