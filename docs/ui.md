# UI Coding Standards

## Component Library

**ONLY use [shadcn/ui](https://ui.shadcn.com/) components for all UI elements.**

- Do NOT create custom UI components
- Do NOT use other component libraries
- If a component doesn't exist in shadcn/ui, compose it from existing shadcn/ui primitives

### Installing Components

```bash
npx shadcn@latest add [component-name]
```

## Date Formatting

Use `date-fns` for all date formatting operations.

### Standard Date Format

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th June 2024
```

### Implementation

```typescript
import { format } from "date-fns";

// Use 'do' for ordinal day, 'MMM' for abbreviated month, 'yyyy' for full year
const formattedDate = format(date, "do MMM yyyy");
```

### Format Tokens

| Token | Output | Description |
|-------|--------|-------------|
| `do` | 1st, 2nd, 3rd, 4th... | Day of month with ordinal |
| `MMM` | Jan, Feb, Mar... | Abbreviated month name |
| `yyyy` | 2025 | Full year |
