# Candyverse SCSS System

## 📁 File Structure

```
src/renderer/src/styles/
├── RESPONSIVE_SYSTEM.md         # Complete documentation
├── QUICK_REFERENCE.md           # Quick lookup cheatsheet
├── globals.scss                 # Global styles (updated)
│
├── variables/
│   ├── _index.scss              # Variables barrel export
│   ├── _breakpoints.scss        # 🆕 Responsive breakpoints
│   ├── _spacing.scss            # 🆕 Spacing scale & values
│   ├── _typography.scss         # 🆕 Typography scale
│   └── _colors-base.scss        # (existing)
│
├── utils/
│   ├── _index.scss              # 🆕 Utils barrel export
│   ├── _responsive-mixins.scss  # 🆕 Media query mixins
│   ├── _spacing-mixins.scss     # 🆕 Spacing utility mixins
│   ├── _typography-mixins.scss  # 🆕 Typography mixins
│   ├── _font-function.scss      # (existing)
│   └── _theme-function.scss     # (existing)
│
├── examples/
│   └── _responsive-examples.scss # 🆕 Usage examples
│
├── themes/
│   └── ... (existing)
│
└── fonts/
    └── ... (existing)
```

## 🚀 Quick Start

### 1. Basic Component

```scss
@use '../../styles/utils/responsive-mixins' as *;
@use '../../styles/utils/typography-mixins' as *;
@use '../../styles/variables/spacing' as *;

.my-component {
  @include card-padding;

  &__title {
    @include heading-3; // Automatically responsive!
    margin-bottom: $spacing-4;
  }

  &__content {
    @include body;
  }
}
```

### 2. Responsive Layout

```scss
.grid {
  display: grid;
  grid-template-columns: 1fr;
  @include responsive-gap('medium');

  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 3. Container with Spacing

```scss
.section {
  @include section-spacing; // Responsive vertical spacing
  @include container; // Max-width with responsive padding
}
```

## 📊 Key Features

### ✅ Responsive Breakpoints

- Based on Electron app minimum width (600px)
- 6 breakpoints: xs, sm, md, lg, xl, xxl
- Easy-to-use mixins for all scenarios

### ✅ Typography System

- Automatic responsive scaling
- 11 typography styles (h1-h6, body variants)
- Fluid typography option for smooth scaling

### ✅ Spacing System

- 8px grid-based spacing scale
- Responsive spacing mixins
- Container, section, and card utilities

### ✅ Utility Mixins

- Media queries (min, max, between, height, orientation)
- Text truncate and clamp
- Flexible and maintainable

## 🎯 Breakpoint Strategy

Based on **windowManager.ts**:

- Min window: 600px × 670px
- Default: 1280px × 720px

| Breakpoint | Size   | Purpose            |
| ---------- | ------ | ------------------ |
| xs         | 600px  | Minimum (required) |
| sm         | 768px  | Small desktop      |
| md         | 1024px | Medium desktop     |
| lg         | 1280px | Large (default)    |
| xl         | 1440px | Extra large        |
| xxl        | 1920px | Ultra wide         |

## 📝 Documentation

- **[RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md)** - Complete guide with examples
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheatsheet for quick lookup
- **[examples/\_responsive-examples.scss](./examples/_responsive-examples.scss)** - Practical code examples

## 🔧 Migration Guide

### Before

```scss
.heading {
  font-size: 7.2rem;
  margin-bottom: 3.6rem;
}
```

### After

```scss
@use '../../styles/utils/typography-mixins' as *;
@use '../../styles/variables/spacing' as *;

.heading {
  @include heading-1; // Now responsive!
  margin-bottom: $spacing-7;
}
```

## 🎨 Design Principles

1. **Mobile-First**: Start small, add breakpoints for larger screens
2. **Consistency**: Use spacing scale and typography mixins
3. **Performance**: Minimal CSS with smart breakpoints
4. **Maintainability**: Centralized system, easy updates
5. **Electron-Focused**: Desktop app considerations (no mobile views)

## 📦 What's Included

### New Files Created

- ✅ `variables/_breakpoints.scss` - Breakpoint definitions
- ✅ `variables/_spacing.scss` - Spacing scale
- ✅ `variables/_typography.scss` - Typography scale
- ✅ `variables/_index.scss` - Variables barrel
- ✅ `utils/_responsive-mixins.scss` - Media query mixins
- ✅ `utils/_spacing-mixins.scss` - Spacing utilities
- ✅ `utils/_typography-mixins.scss` - Typography utilities
- ✅ `utils/_index.scss` - Utils barrel
- ✅ `examples/_responsive-examples.scss` - Code examples

### Updated Files

- ✅ `globals.scss` - Using new responsive system
- ✅ `layouts/RootLayout/styles.module.scss` - Refactored with new system
- ✅ `components/Navigation/styles.module.scss` - Refactored with new system

## 🧪 Testing

Test your responsive layouts at these widths:

- 600px (minimum - critical!)
- 768px, 1024px, 1280px (key breakpoints)
- 1920px (ultra wide)

## 💡 Best Practices

1. **Always import what you need**

   ```scss
   @use '../../styles/utils/responsive-mixins' as *;
   ```

2. **Use typography mixins for headings**

   ```scss
   @include heading-2; // Not: font-size: 6rem;
   ```

3. **Stick to spacing scale**

   ```scss
   padding: $spacing-4; // Not: padding: 1.6rem;
   ```

4. **Mobile-first approach**

   ```scss
   @include respond-to(md) { ... }  // Not: respond-below
   ```

5. **Test at minimum width**
   - The app must work at 600px width minimum

## 🎓 Learn More

Start with:

1. Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for syntax
2. Check [examples/\_responsive-examples.scss](./examples/_responsive-examples.scss) for patterns
3. Read [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) for deep dive
