# Visual Responsive Guide

## 📐 Window Sizes & Breakpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  ELECTRON APP WINDOW RESPONSIVENESS                                 │
└─────────────────────────────────────────────────────────────────────┘

Minimum Window: 600px × 670px
Default Window: 1280px × 720px

 600px        768px       1024px      1280px      1440px      1920px
   │            │            │           │           │           │
   ▼            ▼            ▼           ▼           ▼           ▼
 ┌────┐     ┌────┐      ┌────┐      ┌────┐      ┌────┐      ┌────┐
 │ XS │────▶│ SM │─────▶│ MD │─────▶│ LG │─────▶│ XL │─────▶│XXL │
 └────┘     └────┘      └────┘      └────┘      └────┘      └────┘
  MIN       SMALL       MEDIUM    DEFAULT     X-LARGE    ULTRA-WIDE
```

## 📏 Typography Scaling

```
Heading 1:
   XS (600px)     SM (768px)     MD (1024px)    LG (1280px)    XL (1440px)    XXL (1920px)
   ──────────     ──────────     ───────────    ───────────    ───────────    ────────────
    3.6rem    →    4.2rem    →     5.4rem   →     7.2rem   →     8.4rem   →     9.6rem
    (36px)         (42px)          (54px)         (72px)         (84px)         (96px)

Body Text:
   XS (600px)     SM (768px)     MD (1024px)    LG (1280px)    XL (1440px)    XXL (1920px)
   ──────────     ──────────     ───────────    ───────────    ───────────    ────────────
    1.4rem    →    1.6rem    →     1.6rem   →     1.6rem   →     1.6rem   →     1.8rem
    (14px)         (16px)          (16px)         (16px)         (16px)         (18px)
```

## 📦 Container Padding

```
Container Padding:
   XS (600px)     SM (768px)     MD (1024px)    LG (1280px)    XL (1440px)    XXL (1920px)
   ──────────     ──────────     ───────────    ───────────    ───────────    ────────────
    1.6rem    →    2.4rem    →     3.2rem   →     4.0rem   →     4.8rem   →     6.4rem
    (16px)         (24px)          (32px)         (40px)         (48px)         (64px)
```

## 🎯 Responsive Grid Layouts

### 1-Column → 2-Column → 3-Column

```
XS (600px)          SM (768px)           MD (1024px)          LG+ (1280px+)
──────────          ──────────           ───────────          ─────────────

┌─────────┐         ┌────┬────┐          ┌───┬───┬───┐        ┌──┬──┬──┬──┐
│         │         │    │    │          │   │   │   │        │  │  │  │  │
│  Card   │         │Card│Card│          │Crd│Crd│Crd│        │Cd│Cd│Cd│Cd│
│         │         │    │    │          │   │   │   │        │  │  │  │  │
├─────────┤         ├────┼────┤          ├───┼───┼───┤        ├──┼──┼──┼──┤
│         │         │    │    │          │   │   │   │        │  │  │  │  │
│  Card   │         │Card│Card│          │Crd│Crd│Crd│        │Cd│Cd│Cd│Cd│
│         │         │    │    │          │   │   │   │        │  │  │  │  │
└─────────┘         └────┴────┘          └───┴───┴───┘        └──┴──┴──┴──┘

1 Column            2 Columns            3 Columns           4 Columns
```

### SCSS Code:

```scss
.grid {
  display: grid;
  grid-template-columns: 1fr;
  @include responsive-gap('medium');

  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(md) {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## 📱 Layout Patterns

### Sidebar + Content

```
XS (600px) - Stack                MD+ (1024px+) - Side by Side
──────────────────                ───────────────────────────

┌────────────────┐                ┌─────┬────────────────┐
│                │                │     │                │
│    Content     │                │ Bar │    Content     │
│                │                │     │                │
├────────────────┤                │     │                │
│    Sidebar     │                │     │                │
└────────────────┘                └─────┴────────────────┘
```

### SCSS Code:

```scss
.layout {
  display: grid;
  grid-template-columns: 1fr;
  @include responsive-gap('large');

  @include respond-to(md) {
    grid-template-columns: 30rem 1fr;
  }
}
```

## 🎨 Component Spacing

### Card Padding

```
XS (600px)          MD (1024px)          XL (1440px)
──────────          ───────────          ───────────

┌─────────┐         ┌──────────┐         ┌───────────┐
│┌───────┐│         │┌────────┐│         │┌─────────┐│
││       ││         ││        ││         ││         ││
││Content││         ││ Content││         ││ Content ││
││       ││         ││        ││         ││         ││
│└───────┘│         │└────────┘│         │└─────────┘│
└─────────┘         └──────────┘         └───────────┘
 1.6rem              3.2rem               4.8rem
 padding             padding              padding
```

## 🔤 Text Behavior

### Text Truncate (Single Line)

```
┌──────────────────────────────────────┐
│ This is a very long text that will...│
└──────────────────────────────────────┘
```

```scss
.truncate {
  @include text-truncate;
}
```

### Text Clamp (Multi-Line)

```
┌──────────────────────────────────────┐
│ This is a longer text that spans     │
│ multiple lines but will be clamped   │
│ to exactly three lines with an...    │
└──────────────────────────────────────┘
```

```scss
.clamp {
  @include text-clamp(3); // 3 lines
}
```

## 🎯 Real-World Examples

### Navigation Sidebar

```
Collapsed (5.6rem)           Expanded (20rem)
──────────────────           ────────────────

┌──┐                         ┌──────────────┐
│🏠│                         │🏠 Home       │
│📁│                         │📁 Files      │
│⚙️│                         │⚙️ Settings   │
│❓│                         │❓ Help       │
└──┘                         └──────────────┘

Hover to expand →
```

### Titlebar (Fixed 4.8rem height)

```
┌─────────────────────────────────────────────────────────────┐
│  Logo          App Title - Current Page          ─  □  ✕   │
└─────────────────────────────────────────────────────────────┘
     16px                                           14rem width
     padding                                        controls
```

## 📊 Z-Index Hierarchy

```
Tooltip         1070  ─────────────────  Top
Popover         1060  ─────────────────
Modal           1050  ─────────────────
Modal Backdrop  1040  ─────────────────
Fixed           1030  ─────────────────  Titlebar
Sticky          1020  ─────────────────  Sidebar
Dropdown        1000  ─────────────────
Base              1   ─────────────────  Content
```

## 🔧 Common Responsive Patterns

### 1. Responsive Font Sizes

```scss
// Old way ❌
.title {
  font-size: 7.2rem;
  @media (max-width: 768px) {
    font-size: 3.6rem;
  }
}

// New way ✅
.title {
  @include heading-1; // Automatically responsive!
}
```

### 2. Responsive Spacing

```scss
// Old way ❌
.container {
  padding: 1.6rem;
  @media (min-width: 768px) {
    padding: 2.4rem;
  }
  @media (min-width: 1024px) {
    padding: 3.2rem;
  }
}

// New way ✅
.container {
  @include responsive-spacing('padding', 'container-padding');
}
```

### 3. Show/Hide Elements

```scss
.mobile-nav {
  display: block;

  @include respond-to(md) {
    display: none;
  }
}

.desktop-nav {
  display: none;

  @include respond-to(md) {
    display: flex;
  }
}
```

## 🎓 Testing Checklist

Test your components at these specific widths:

- [ ] **600px** - Minimum window (CRITICAL!)
- [ ] **768px** - Small desktop
- [ ] **1024px** - Medium desktop
- [ ] **1280px** - Default/Large (most common)
- [ ] **1440px** - Extra large
- [ ] **1920px** - Ultra wide

### How to Test

1. Use VS Code window resizing
2. Use browser DevTools device toolbar
3. Manually resize Electron window
4. Test with actual monitor sizes

## 💡 Pro Tips

1. **Start at 600px**: Always ensure your layout works at minimum size
2. **Use relative units**: rem/em scale better than px
3. **Test typography**: Ensure text is readable at all sizes
4. **Check spacing**: Elements shouldn't feel cramped or too spacious
5. **Verify interactions**: Hover states, click targets, etc.

## 🎨 Visual Hierarchy

```
Spacing Scale (8px grid)
─────────────────────────

0.4rem  ▪           $spacing-1
0.8rem  ▪▪          $spacing-2
1.2rem  ▪▪▪         $spacing-3
1.6rem  ▪▪▪▪        $spacing-4  ← Most common
2.4rem  ▪▪▪▪▪▪      $spacing-6
3.2rem  ▪▪▪▪▪▪▪▪    $spacing-8
4.8rem  ▪▪▪▪▪▪▪▪▪▪▪▪  $spacing-12
6.4rem  ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪  $spacing-16
```

---

**Use this guide as a visual reference when designing responsive components!**
