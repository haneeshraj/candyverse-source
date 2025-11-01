# SCSS Responsive System - Quick Reference

## Import Statements

```scss
// Media queries
@use '../../styles/utils/responsive-mixins' as *;

// Typography
@use '../../styles/utils/typography-mixins' as *;

// Spacing utilities
@use '../../styles/utils/spacing-mixins' as *;

// Variables only
@use '../../styles/variables/spacing' as *;
@use '../../styles/variables/breakpoints' as *;
@use '../../styles/variables/typography' as *;
```

## Breakpoints

| Name  | Size   | Use Case                  |
| ----- | ------ | ------------------------- |
| `xs`  | 600px  | Minimum window (required) |
| `sm`  | 768px  | Small desktop             |
| `md`  | 1024px | Medium desktop            |
| `lg`  | 1280px | Large (default window)    |
| `xl`  | 1440px | Extra large               |
| `xxl` | 1920px | Ultra wide                |

## Media Query Mixins

```scss
// Min-width (mobile-first) ✅ Recommended
@include respond-to(md) { ... }

// Max-width (desktop-first)
@include respond-below(lg) { ... }

// Between breakpoints
@include respond-between(sm, lg) { ... }

// Custom width
@include respond-min(900px) { ... }
@include respond-max(1100px) { ... }

// Height-based
@include respond-height-min(800px) { ... }
@include respond-height-max(900px) { ... }

// Orientation
@include landscape { ... }
@include portrait { ... }
```

## Typography Mixins

```scss
// Headings (automatically responsive)
@include heading-1; // 3.6rem → 7.2rem → 9.6rem
@include heading-2; // 3rem → 6rem → 8.4rem
@include heading-3; // 2.4rem → 4.8rem → 7.2rem
@include heading-4; // 2rem → 3.6rem → 6rem
@include heading-5; // 1.8rem → 3rem → 4.8rem
@include heading-6; // 1.6rem → 2.4rem → 3.6rem

// Body text
@include body-large; // 1.6rem → 2rem → 2.4rem
@include body; // 1.4rem → 1.6rem → 1.8rem
@include body-small; // 1.2rem → 1.4rem → 1.6rem
@include caption; // 1.2rem (all)
@include overline; // 1rem uppercase

// Fluid typography (smooth scaling)
@include fluid-font(3.6rem, 9.6rem);

// Text utilities
@include text-truncate; // Single line ellipsis
@include text-clamp(3); // 3-line clamp
```

## Spacing Variables

```scss
// Scale (8px grid)
$spacing-0: 0;
$spacing-1: 0.4rem; // 4px
$spacing-2: 0.8rem; // 8px
$spacing-3: 1.2rem; // 12px
$spacing-4: 1.6rem; // 16px
$spacing-5: 2rem; // 20px
$spacing-6: 2.4rem; // 24px
$spacing-8: 3.2rem; // 32px
$spacing-10: 4rem; // 40px
$spacing-12: 4.8rem; // 48px
$spacing-16: 6.4rem; // 64px
$spacing-20: 8rem; // 80px
$spacing-24: 9.6rem; // 96px
$spacing-32: 12.8rem; // 128px

// Border radius
$radius-sm: 0.4rem;
$radius-md: 0.8rem;
$radius-lg: 1.2rem;
$radius-xl: 1.6rem;
$radius-full: 9999px;

// Z-index
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
```

## Spacing Mixins

```scss
// Container with responsive padding
@include container; // Default max-width
@include container($container-xl); // Custom max-width

// Section spacing (vertical)
@include section-spacing; // padding top & bottom

// Card padding
@include card-padding; // Responsive padding

// Responsive gap (flex/grid)
@include responsive-gap('small'); // 0.8rem → 1.6rem
@include responsive-gap('medium'); // 1.6rem → 3.2rem
@include responsive-gap('large'); // 2.4rem → 4.8rem

// Manual responsive spacing
@include responsive-spacing('padding', 'container-padding');
@include responsive-spacing('margin-top', 'section-spacing');
```

## Common Patterns

### Card Component

```scss
.card {
  @include card-padding;
  background-color: var(--color-background-secondary);
  border-radius: $radius-lg;

  &__title {
    @include heading-4;
    margin-bottom: $spacing-4;
  }

  &__content {
    @include body;
    @include text-clamp(3);
  }
}
```

### Responsive Grid

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

### Section with Container

```scss
.section {
  @include section-spacing;
  @include container;

  &__title {
    @include heading-2;
    margin-bottom: $spacing-8;
  }
}
```

### Responsive Hide/Show

```scss
.mobile-only {
  display: block;

  @include respond-to(md) {
    display: none;
  }
}

.desktop-only {
  display: none;

  @include respond-to(md) {
    display: block;
  }
}
```

## Font Sizes (Direct Usage)

```scss
$font-size-xs: 1rem; // 10px
$font-size-sm: 1.2rem; // 12px
$font-size-base: 1.4rem; // 14px
$font-size-md: 1.6rem; // 16px
$font-size-lg: 1.8rem; // 18px
$font-size-xl: 2rem; // 20px
$font-size-2xl: 2.4rem; // 24px
$font-size-3xl: 3rem; // 30px
$font-size-4xl: 3.6rem; // 36px
```

## Font Weights

```scss
$font-weight-light: 300;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-extrabold: 800;
```

## Line Heights

```scss
$line-height-tight: 1.2;
$line-height-normal: 1.5;
$line-height-relaxed: 1.6;
$line-height-loose: 2;
```

## Pro Tips

1. **Always use mixins for responsive typography** - They handle all breakpoints automatically
2. **Stick to spacing scale** - Maintains visual consistency
3. **Mobile-first approach** - Use `respond-to()` over `respond-below()`
4. **Test at minimum width** - 600px is the smallest supported size
5. **Use CSS custom properties** - For colors and theme values
6. **Leverage z-index scale** - Prevents z-index conflicts

## Component Template

```scss
@use '../../styles/utils/responsive-mixins' as *;
@use '../../styles/utils/typography-mixins' as *;
@use '../../styles/utils/spacing-mixins' as *;
@use '../../styles/variables/spacing' as *;

.component {
  @include card-padding;

  &__title {
    @include heading-3;
    margin-bottom: $spacing-4;

    @include respond-to(md) {
      margin-bottom: $spacing-6;
    }
  }

  &__content {
    @include body;
    color: var(--color-text-primary);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    @include responsive-gap('medium');

    @include respond-to(md) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
```
