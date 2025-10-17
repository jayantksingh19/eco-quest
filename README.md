<h1 align="center">ECO-QUEST</h1>
<p align="center"><em>Empowering Change Through Eco-Conscious Action and Learning</em></p>
<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-today-2e2e2e?style=for-the-badge&labelColor=2e2e2e&color=1d9bf0" alt="last commit today badge">
  <img src="https://img.shields.io/badge/typescript-81.8%25-2e2e2e?style=for-the-badge&labelColor=2e2e2e&color=3b82f6" alt="TypeScript share badge">
  <img src="https://img.shields.io/badge/languages-4-2e2e2e?style=for-the-badge&labelColor=2e2e2e&color=9ca3af" alt="Languages badge">
</p>
<p align="center">Built with the tools and technologies:</p>
<p align="center">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/JSON-5E5E5E?style=for-the-badge&logo=json&logoColor=white" alt="JSON">
  <img src="https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="Markdown">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/Autoprefixer-DD0031?style=for-the-badge&logo=autoprefixer&logoColor=white" alt="Autoprefixer">
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose">
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS">
  <img src="https://img.shields.io/badge/.env-2D3748?style=for-the-badge&logo=dotenv&logoColor=white" alt="dotenv">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000" alt="JavaScript">
  <br />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logoColor=white" alt="Zod">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
  <img src="https://img.shields.io/badge/date--fns-3EAF7C?style=for-the-badge&logo=date-fns&logoColor=white" alt="date-fns">
  <img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form">
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio">
</p>

EcoQuest is a gamified learning platform that pairs interactive classes with real-world eco-missions so students can learn, act, and earn EcoPoints. The front-end is built with React, TypeScript, Vite, Tailwind CSS, and Radix UI primitives.

## Tech Stack
- React 18 + Vite for a fast TypeScript-first SPA workflow
- Tailwind CSS with Radix UI primitives for accessible, themeable components
- React Router for client-side routing across dashboards, classes, and tasks
- React Hook Form + Zod for robust form handling and validation
- TanStack Query for data fetching patterns and caching
- Date-fns, Recharts, Embla Carousel, and Lucide icons for rich UI details

## Contents
- Tech Stack
- Overview
- UI Pages (localhost previews)
- Frontend (how to run)
- Project structure
- Development notes
- No backend included
- Git / Ignored files

## Overview
This repository contains the front-end application for EcoQuest. It's a single-page React app using Vite for development and bundling, TypeScript for types, and Tailwind CSS for styling. The UI uses Radix primitives and a set of reusable components located under `src/components`.

## UI Pages (localhost previews)

All routes are available once you run `npm run dev`, which boots the app on `http://localhost:5173`. Drop the PNG/JPG previews you captured into `docs/screenshots/` using the filenames below to surface them directly in the README.

### Landing — `http://localhost:5173/`
![EcoQuest Landing](https://ik.imagekit.io/o8amnm7li/localhost_5173_%20(1).png)

### Auth — `http://localhost:5173/auth`
![EcoQuest Auth](https://ik.imagekit.io/o8amnm7li/localhost_5173_classes%20(1).png)

### Dashboard — `http://localhost:5173/dashboard`
![EcoQuest Dashboard](https://ik.imagekit.io/o8amnm7li/localhost_5173_classes%20(4).png)

### Tasks — `http://localhost:5173/tasks/outdoor`
![EcoQuest Tasks](https://ik.imagekit.io/o8amnm7li/localhost_5173_classes%20(5).png)

### Report Hazard — `http://localhost:5173/report`
![Report Hazard](https://ik.imagekit.io/o8amnm7li/localhost_5173_classes%20(3).png)

### Classes — `http://localhost:5173/classes`
![EcoQuest Classes](https://ik.imagekit.io/o8amnm7li/localhost_5173_classes.png)

### Leaderboard — `http://localhost:5173/leaderboard`
![EcoQuest Leaderboard](https://ik.imagekit.io/o8amnm7li/localhost_5173_classes%20(2).png)

## Frontend — quick start
Requirements:
- Node.js (>=16 recommended)
- npm (or yarn/pnpm)

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

Linting:

```bash
npm run lint
```

## What’s included
- Vite + React + TypeScript
- Tailwind CSS
- Radix UI components
- Sample curriculum data in `src/data`

## Project structure (high level)
```
EcoQuest/
  src/
    components/       # Reusable UI components and pages
    data/             # Curriculum and sample data (`classesData.ts`, `environmentCurriculum.ts`)
    pages/            # Page components (Classes, Dashboard, etc.)
    assets/           # Static assets (images, icons, svg)
  public/             # Public files (favicon, robots)
  package.json        # Scripts and deps
  vite.config.ts
  tsconfig.*
```

## Backend
This repository does not include a backend implementation. If you plan to connect to an API, typical steps are:
- Create an API server (Node/Express, Fastify, or any backend)
- Add endpoints for user auth, progress/points, quizzes, and tasks
- Use `@tanstack/react-query` or fetch to communicate with the API

## Git / Ignored files
The repository's `.gitignore` already includes the `PWF/` folder and `assets/`. If you want more specific rules for `PWF` subfolders or file types, add them here.

## Notes
- Data for classes and curriculum lives in `src/data`.
- If you need help wiring quiz logic end-to-end, I can inspect `QuizComponent` and related components and fix type mismatches.

---

If you want, I can also:
- Add a small CONTRIBUTING.md
- Add a local run script for environment variables
- Wire up a minimal mock API server for local testing