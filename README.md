<div align="center"><strong>ALB Admin Webapp</strong></div>
<div align="center">Built with the Next.js</div>
<br />
<div align="center">
<a href="https://alb-admin-webapp.vercel.app/">Live</a>
<span> · </span>
<a href="https://github.com/fnabir/ALBAdminWebApp">Repository</a>
<span>
</div>

## Overview

This is the WebApp version of ALBAdmin Android App. It is built using the following stack:

- Framework - [Next.js v15 (App Router)](https://nextjs.org)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Firebase Authentication](https://firebase.google.com/docs/auth)
- Database - [Firebase Realtime Database](https://firebase.google.com/docs/database)
- Deployment - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn UI](https://ui.shadcn.com/)

This template uses the Next.js App Router. This includes support for enhanced layouts, colocation of components, styles, component-level data fetching, and more.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Deploy on Server

This project is deployed on Vercel.

Production branch is the branch which gest build on new push and deployed automatically. Live version can be seen through [https://alb-admin-webapp.vercel.app/](https://alb-admin-webapp.vercel.app/)


## Changelog

### 1.3.0 [2025-06-19]
#### Added
- Add option to print project transaction statement.
#### Fixed
- Edit project expense wouldn't show the payment details and amount correctly.
- Some pages wouldn't show correctly for small screens.

### 1.2.0 [2025-06-05]
#### Changed
- All transctions now divided into 2 sections - expense and payment replacing filter options before.
#### Fixed
- Project Balance would cause issue in different combination of sort and filter.

### 1.1.3
#### Changed
- Upgrade Tailwind CSS v3 to v4
#### Fixed
- Fix project expense amount validation error
