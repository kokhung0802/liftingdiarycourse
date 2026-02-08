# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation First

**IMPORTANT**: Before generating any code, ALWAYS first read and refer to the relevant documentation files within the `/docs` directory. These docs contain project-specific patterns, conventions, and implementation details that must be followed.

- /docs/ui.md
- /docs/data-fetching.md

## Project Overview

This is a Next.js 16 application with TypeScript and Tailwind CSS v4, using the App Router pattern.

## Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (uses flat config format with Next.js Core Web Vitals and TypeScript rules)

## Architecture

- **Framework**: Next.js 16 with App Router (`src/app/` directory)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with PostCSS

### Path Aliases

Use `@/*` to import from the `src/` directory (configured in tsconfig.json).

### Key Files

- `src/app/layout.tsx` - Root layout with metadata and Geist font configuration
- `src/app/page.tsx` - Home page
- `src/app/globals.css` - Global styles with Tailwind and CSS custom properties for theming

### Adding Routes

Create new routes as directories in `src/app/` with a `page.tsx` file. The directory name becomes the URL path.
