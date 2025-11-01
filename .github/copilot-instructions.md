# GitHub Copilot Instructions for Candyverse

## Project Overview

Candyverse is an Electron desktop application built with React, TypeScript, and SCSS. The app uses a custom responsive design system tailored for desktop window sizes (minimum 600px width).

## Technology Stack

- **Framework**: Electron with Vite
- **Frontend**: React 18 with TypeScript
- **Styling**: SCSS Modules with custom responsive system
- **Router**: React Router v6
- **Icons**: Phosphor Icons React
- **Build**: electron-vite, electron-builder

---

## Import Statement Organization

### Import Order (Mandatory)

Organize imports in the following order with blank lines between groups:

```typescript
// 1. Core Libraries (React)
import { useState, useEffect } from 'react'

// 2. Third-Party Libraries
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { HomeIcon } from '@phosphor-icons/react'

// 3. @ based imports (path aliases)
import { Navigation, ThemeSwitcher, Card } from '@renderer/components'
import { useCurrentRoute } from '@renderer/hooks/useCurrentRoute'
import type { RouteConfig } from '@renderer/types'

// 4. ./ or ../ based imports (relative imports)
import RootLayout from '../layouts/RootLayout/RootLayout'
import styles from './styles.module.scss'
```

### Import Best Practices

1. **Use barrel exports** for components:

   ```typescript
   // ✅ Correct
   import { Navigation, ThemeSwitcher } from '@renderer/components'

   // ❌ Avoid
   import Navigation from '@renderer/components/Navigation/Navigation'
   ```

2. **Deep imports for single items, named imports for multiple**:

   ```typescript
   // ✅ Correct - Single icon, use deep import
   import HomeIcon from '@phosphor-icons/react/HomeIcon'

   // ✅ Correct - Multiple icons, use named imports
   import { HomeIcon, SettingsIcon, UserIcon } from '@phosphor-icons/react'

   // ❌ Avoid - Single icon with named import (larger bundle)
   import { HomeIcon } from '@phosphor-icons/react'
   ```

3. **Use path aliases**:

   - `@renderer/*` - Renderer process files
   - `@main/*` - Main process files
   - `@common/*` - Shared constants and utilities

4. **Group related imports**:

   ```typescript
   // ✅ Multiple items from same package
   import { HomeIcon, SettingsIcon, UserIcon } from '@phosphor-icons/react'
   ```

5. **Type imports**:
   ```typescript
   // Use 'type' keyword for type-only imports
   import type { FC, ReactNode } from 'react'
   import type { RouteObject } from 'react-router-dom'
   ```

---

## Code Style Guidelines

### TypeScript

1. **Use functional components with TypeScript**:

   ```typescript
   interface ComponentProps {
     title: string
     children?: ReactNode
     onClose?: () => void
   }

   const Component: FC<ComponentProps> = ({ title, children, onClose }) => {
     return <div>{title}</div>
   }

   export default Component
   ```

2. **Define interfaces before components**:

   ```typescript
   interface CardProps {
     variant?: 'default' | 'outlined'
     color?: 'primary' | 'secondary'
   }

   const Card: FC<CardProps> = ({ variant = 'default', color = 'primary' }) => {
     // Component implementation
   }
   ```

3. **Use explicit return types for functions**:
   ```typescript
   const calculateTotal = (items: number[]): number => {
     return items.reduce((sum, item) => sum + item, 0)
   }
   ```

### React Patterns

1. **Use named exports for utilities, default for components**:

   ```typescript
   // Component (default export)
   const Button: FC<ButtonProps> = () => {
     /* ... */
   }
   export default Button

   // Utility (named export)
   export const formatDate = (date: Date): string => {
     /* ... */
   }
   ```

2. **Destructure props in function signature**:

   ```typescript
   // ✅ Correct
   const Card: FC<CardProps> = ({ title, children }) => {

   // ❌ Avoid
   const Card: FC<CardProps> = (props) => {
     const { title, children } = props
   ```

3. **Use custom hooks for reusable logic**:
   ```typescript
   const useWindowSize = () => {
     const [size, setSize] = useState({ width: 0, height: 0 })
     // Hook implementation
     return size
   }
   ```

---

## SCSS Responsive System

### Always Use Responsive Mixins

1. **Import required SCSS modules at the top**:

   ```scss
   @use '../../styles/utils/responsive-mixins' as *;
   @use '../../styles/utils/typography-mixins' as *;
   @use '../../styles/utils/spacing-mixins' as *;
   @use '../../styles/variables/spacing' as *;
   ```

2. **Use typography mixins instead of hardcoded sizes**:

   ```scss
   // ✅ Correct - Automatically responsive
   .title {
     @include heading-3;
     margin-bottom: $spacing-4;
   }

   // ❌ Avoid - Not responsive
   .title {
     font-size: 3.6rem;
     margin-bottom: 1.6rem;
   }
   ```

3. **Use spacing scale variables**:

   ```scss
   // ✅ Correct
   .container {
     padding: $spacing-4;
     margin-bottom: $spacing-6;
     gap: $spacing-3;
   }

   // ❌ Avoid magic numbers
   .container {
     padding: 1.6rem;
     margin-bottom: 2.4rem;
     gap: 1.2rem;
   }
   ```

4. **Use responsive breakpoints (mobile-first)**:

   ```scss
   .grid {
     display: grid;
     grid-template-columns: 1fr;
     @include responsive-gap('medium');

     @include respond-to(md) {
       grid-template-columns: repeat(2, 1fr);
     }

     @include respond-to(lg) {
       grid-template-columns: repeat(3, 1fr);
     }
   }
   ```

5. **Use CSS custom properties for colors, fonts, and theme values**:

   ```scss
   // ✅ Correct - Works with theme switching
   .button {
     background-color: var(--color-primary);
     color: var(--color-text-primary);
     border: 1px solid var(--color-border-primary);
     font-weight: var(--font-weight-semibold);
   }

   .card {
     background-color: var(--color-card-primary-bg);
     border: 1px solid var(--color-card-primary-border);

     &:hover {
       background-color: var(--color-card-primary-hover);
     }
   }

   // ❌ Avoid SCSS color/font variables - they don't support theme switching
   .button {
     background-color: $color-primary-500;
     color: $color-text-primary;
     font-weight: $font-weight-semibold;
   }
   ```

   **Example CSS Variables:**

   - **Colors**: `--color-primary`, `--color-secondary`, `--color-success`, `--color-error`, `--color-warning`, `--color-info`
   - **Backgrounds**: `--color-background-primary`, `--color-background-secondary`, `--color-background-tertiary`
   - **Surfaces**: `--color-surface`, `--color-surface-hover`, `--color-surface-active`
   - **Text**: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-disabled`
   - **Borders**: `--color-border-primary`, `--color-border-secondary`, `--color-border-divider`
   - **Buttons**: `--color-button-primary-bg`, `--color-button-primary-hover`, `--color-button-primary-text`
   - **Inputs**: `--color-input-bg`, `--color-input-border`, `--color-input-border-focus`
   - **Fonts**: `--font-family`, `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`

### Available SCSS Utilities

**Typography Mixins**:

- `@include heading-1` through `@include heading-6`
- `@include body`, `@include body-large`, `@include body-small`
- `@include caption`, `@include overline`
- `@include text-truncate`, `@include text-clamp(3)`

**Spacing Mixins**:

- `@include container` - Responsive container with padding
- `@include section-spacing` - Responsive vertical spacing
- `@include card-padding` - Responsive card padding
- `@include responsive-gap('small' | 'medium' | 'large')`

**Responsive Mixins**:

- `@include respond-to(xs | sm | md | lg | xl | xxl)`
- `@include respond-below(breakpoint)`
- `@include respond-between(min, max)`

**Spacing Variables**:

- `$spacing-0` through `$spacing-32` (8px grid system)
- `$radius-sm`, `$radius-md`, `$radius-lg`, `$radius-xl`, `$radius-full`
- `$z-index-dropdown`, `$z-index-modal`, etc.

**Breakpoints**:

- `xs: 600px` (minimum window)
- `sm: 768px`, `md: 1024px`, `lg: 1280px` (default)
- `xl: 1440px`, `xxl: 1920px`

---

## Component Structure

### File Organization

```
ComponentName/
├── ComponentName.tsx       # Component logic
└── styles.module.scss      # Component styles (optional)

# OR for simple components
ComponentName.tsx           # Single file component
```

### Component Template

```typescript
import React from 'react'
import styles from '@renderer/styles/components/ComponentName.module.scss'

interface ComponentNameProps {
  title: string
  children?: React.ReactNode
  variant?: 'default' | 'outlined'
  onAction?: () => void
}

const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  children,
  variant = 'default',
  onAction
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </div>
  )
}

export default ComponentName
```

### SCSS Module Template

```scss
@use '../../styles/utils/responsive-mixins' as *;
@use '../../styles/utils/typography-mixins' as *;
@use '../../styles/variables/spacing' as *;

.container {
  @include card-padding;
  background-color: var(--color-background-secondary);
  border-radius: $radius-lg;

  @include respond-to(md) {
    // Responsive adjustments
  }
}

.title {
  @include heading-4;
  color: var(--color-text-primary);
  margin-bottom: $spacing-4;
}
```

---

## Naming Conventions

### Files

- **Components**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Utilities/Hooks**: camelCase (`useAuth.ts`, `formatDate.ts`)
- **SCSS Modules**: PascalCase with `.module.scss` (`Button.module.scss`)
- **SCSS Partials**: Underscore prefix (`_variables.scss`, `_mixins.scss`)

### Code

- **Components**: PascalCase (`UserProfile`, `NavigationMenu`)
- **Variables/Functions**: camelCase (`userName`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- **Interfaces/Types**: PascalCase with descriptive suffix (`UserProps`, `RouteConfig`)
- **CSS Classes**: kebab-case in SCSS, camelCase in TypeScript

### SCSS

```scss
// BEM-like naming in SCSS modules
.component {
  // Base styles

  &__element {
    // Element styles
  }

  &--modifier {
    // Modifier styles
  }

  &--is-active {
    // State modifier
  }
}
```

---

## Electron-Specific Guidelines

### Main Process

- Use `@main` path alias
- Handle IPC communication in dedicated handlers
- Keep window management separate in `windowManager.ts`

### Renderer Process

- Use `@renderer` path alias
- Access Electron APIs through preload bridge (`window.titlebar`, `window.app`)
- Never import Electron directly in renderer

### IPC Pattern

```typescript
// Main process handler
ipcMain.handle('channel-name', async (event, data) => {
  // Handle request
  return result
})

// Preload bridge
contextBridge.exposeInMainWorld('api', {
  methodName: (data) => ipcRenderer.invoke('channel-name', data)
})

// Renderer usage
const result = await window.api.methodName(data)
```

---

## Testing Requirements

- Test at minimum window size (600px × 670px)
- Verify responsive layouts at all breakpoints
- Test theme switching (light/dark)
- Ensure proper TypeScript types
- No console errors or warnings

---

## Common Patterns

### Conditional Styling with clsx

```typescript
import clsx from 'clsx'

<div className={clsx(
  styles.button,
  isActive && styles['button--active'],
  variant === 'primary' && styles['button--primary']
)} />
```

### Custom Hooks

```typescript
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Theme logic
  }, [])

  return { theme, setTheme }
}
```

### Route Configuration

```typescript
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home',
    icon: HomeIcon
  }
]
```

---

## What NOT to Do

❌ **Don't** use inline styles (use SCSS modules)
❌ **Don't** use hardcoded font sizes (use typography mixins)
❌ **Don't** use hardcoded font-weight values (use `var(--font-weight-*)`)
❌ **Don't** use magic numbers for spacing (use spacing scale)
❌ **Don't** import Electron in renderer process
❌ **Don't** use default exports for utilities
❌ **Don't** use SCSS color/font variables like `$color-primary-500` or `$font-weight-bold` (use CSS custom properties like `var(--color-primary)` and `var(--font-weight-bold)`)
❌ **Don't** use desktop-first media queries (use mobile-first)
❌ **Don't** create global CSS classes (use modules)
❌ **Don't** forget to test at 600px minimum width

---

## Quick Reference

### Creating a Component

```bash
./utilities/create-component.sh ComponentName
```

### Responsive SCSS

```scss
@use '../../styles/utils/responsive-mixins' as *;
@use '../../styles/utils/typography-mixins' as *;
@use '../../styles/variables/spacing' as *;

.component {
  @include card-padding;

  &__title {
    @include heading-3;
    margin-bottom: $spacing-4;
  }

  @include respond-to(md) {
    // Medium screens and up
  }
}
```

### Component with Props

```typescript
interface Props {
  title: string
  variant?: 'default' | 'outlined'
}

const Component: FC<Props> = ({ title, variant = 'default' }) => {
  return <div className={styles[variant]}>{title}</div>
}

export default Component
```

---

## Documentation References

- **Responsive System**: `/src/renderer/src/styles/RESPONSIVE_SYSTEM.md`
- **Quick Reference**: `/src/renderer/src/styles/QUICK_REFERENCE.md`
- **Visual Guide**: `/src/renderer/src/styles/VISUAL_GUIDE.md`

---

**Follow these guidelines to maintain consistency and quality across the Candyverse codebase.**
