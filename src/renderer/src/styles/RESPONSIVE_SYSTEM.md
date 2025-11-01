# SCSS Responsive System Documentation

## Overview

This responsive system is specifically designed for the Candyverse Electron app. Since this is a desktop application, the system focuses on window resizing rather than mobile responsiveness.

## Breakpoints

Based on the minimum window size (600px x 670px) defined in `windowManager.ts`:

- **xs**: 600px (minimum window width)
- **sm**: 768px (small screens)
- **md**: 1024px (medium screens)
- **lg**: 1280px (large screens - default window width)
- **xl**: 1440px (extra large screens)
- **xxl**: 1920px (ultra wide screens)

## File Structure

```
styles/
├── variables/
│   ├── _index.scss              # Variables barrel export
│   ├── _breakpoints.scss        # Responsive breakpoints
│   ├── _spacing.scss            # Spacing scale and values
│   ├── _typography.scss         # Typography scale
│   └── _colors-base.scss        # (existing)
├── utils/
│   ├── _index.scss              # Utils barrel export
│   ├── _responsive-mixins.scss  # Media query mixins
│   ├── _spacing-mixins.scss     # Spacing utility mixins
│   ├── _typography-mixins.scss  # Typography mixins
│   ├── _font-function.scss      # (existing)
│   └── _theme-function.scss     # (existing)
```

## Usage Examples

### 1. Responsive Media Queries

```scss
@use '../styles/utils/responsive-mixins' as *;

.component {
  width: 100%;

  // Min-width (mobile-first)
  @include respond-to(md) {
    width: 80%;
  }

  // Max-width (desktop-first)
  @include respond-below(lg) {
    padding: 1.6rem;
  }

  // Between breakpoints
  @include respond-between(sm, lg) {
    font-size: 1.4rem;
  }

  // Custom width
  @include respond-min(900px) {
    display: flex;
  }

  // Height-based queries
  @include respond-height-min(800px) {
    padding-top: 4rem;
  }
}
```

### 2. Responsive Typography

```scss
@use '../styles/utils/typography-mixins' as *;

.title {
  @include heading-1; // Automatically responsive
  color: var(--color-text-primary);
}

.subtitle {
  @include heading-3;
}

.description {
  @include body;
}

.caption {
  @include caption;
}

// Fluid typography (scales smoothly)
.hero-title {
  @include fluid-font(3.6rem, 9.6rem);
}

// Text utilities
.truncate {
  @include text-truncate;
}

.clamp {
  @include text-clamp(3); // 3 lines
}
```

### 3. Responsive Spacing

```scss
@use '../styles/utils/spacing-mixins' as *;

.container {
  @include container; // Max-width container with responsive padding
}

.container-wide {
  @include container($container-xl);
}

.section {
  @include section-spacing; // Responsive vertical spacing
}

.card {
  @include card-padding; // Responsive padding
}

.grid {
  display: grid;
  @include responsive-gap('large'); // Responsive gap
}

// Manual spacing
.element {
  @include responsive-spacing('padding', 'container-padding');
  @include responsive-spacing('margin-bottom', 'section-spacing');
}
```

### 4. Direct Variable Usage

```scss
@use '../styles/variables/spacing' as *;
@use '../styles/variables/breakpoints' as *;

.custom-component {
  padding: $spacing-4;
  margin-bottom: $spacing-8;
  border-radius: $radius-md;

  // Use z-index scale
  z-index: $z-index-modal;
}

.sidebar {
  width: $sidebar-collapsed;
  transition: width 300ms;

  &:hover {
    width: $sidebar-expanded;
  }
}
```

## Spacing Scale

Based on 8px grid system (0.8rem with 62.5% base font-size):

- `$spacing-0`: 0
- `$spacing-1`: 0.4rem (4px)
- `$spacing-2`: 0.8rem (8px)
- `$spacing-3`: 1.2rem (12px)
- `$spacing-4`: 1.6rem (16px)
- `$spacing-5`: 2.0rem (20px)
- `$spacing-6`: 2.4rem (24px)
- `$spacing-8`: 3.2rem (32px)
- `$spacing-10`: 4.0rem (40px)
- `$spacing-12`: 4.8rem (48px)
- `$spacing-16`: 6.4rem (64px)
- `$spacing-20`: 8.0rem (80px)
- `$spacing-24`: 9.6rem (96px)
- `$spacing-32`: 12.8rem (128px)

## Typography Scale

Responsive font sizes for each breakpoint (automatically applied with mixins):

### Headings

- `heading-1`: 3.6rem (xs) → 7.2rem (lg) → 9.6rem (xxl)
- `heading-2`: 3rem (xs) → 6rem (lg) → 8.4rem (xxl)
- `heading-3`: 2.4rem (xs) → 4.8rem (lg) → 7.2rem (xxl)
- `heading-4`: 2rem (xs) → 3.6rem (lg) → 6rem (xxl)
- `heading-5`: 1.8rem (xs) → 3rem (lg) → 4.8rem (xxl)
- `heading-6`: 1.6rem (xs) → 2.4rem (lg) → 3.6rem (xxl)

### Body Text

- `body-large`: 1.6rem (xs) → 2rem (lg) → 2.4rem (xxl)
- `body`: 1.4rem (xs) → 1.6rem (lg) → 1.8rem (xxl)
- `body-small`: 1.2rem (xs) → 1.4rem (lg) → 1.6rem (xxl)
- `caption`: 1.2rem (all breakpoints)
- `overline`: 1rem (all breakpoints)

## Best Practices

1. **Use mixins over raw media queries**: Ensures consistency
2. **Mobile-first approach**: Start with smallest sizes, add breakpoints for larger screens
3. **Test at minimum window size**: 600px × 670px
4. **Use spacing scale**: Maintain visual rhythm with the 8px grid
5. **Leverage existing CSS custom properties**: For colors and theme values
6. **Apply responsive typography**: Use provided mixins for automatic scaling

## Integration with Existing Code

Update your component SCSS files:

```scss
// Before
.main-heading {
  font-size: 7.2rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: 3.6rem;
}

// After
@use '../styles/utils/typography-mixins' as *;
@use '../styles/variables/spacing' as *;

.main-heading {
  @include heading-1; // Now responsive!
  margin-bottom: $spacing-7;
}
```

## Example: Complete Component

```scss
@use '../../styles/utils/responsive-mixins' as *;
@use '../../styles/utils/typography-mixins' as *;
@use '../../styles/utils/spacing-mixins' as *;
@use '../../styles/variables/spacing' as *;

.hero {
  @include section-spacing;
  @include container;

  &__title {
    @include heading-1;
    margin-bottom: $spacing-6;

    @include respond-to(lg) {
      margin-bottom: $spacing-8;
    }
  }

  &__description {
    @include body-large;
    color: var(--color-text-secondary);
    @include text-clamp(3);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    @include responsive-gap('medium');

    @include respond-to(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(xl) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

## Testing

Test your responsive layouts at these key widths:

- 600px (minimum)
- 768px (small)
- 1024px (medium)
- 1280px (default/large)
- 1920px (ultra wide)

Use VS Code's extension to resize the Electron window for testing.
