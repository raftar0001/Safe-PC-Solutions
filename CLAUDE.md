# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Safe PC Solutions is a Bengali-language (bn) static website for a computer repair shop in Keraniganj, Dhaka, Bangladesh. It allows customers to book repair services, track repair status via ticket IDs, and provides an admin dashboard for managing bookings.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (no build tools, no bundler, no framework)
- **Backend**: Firebase (Firestore, Auth, Storage) — all via CDN ES module imports from `https://www.gstatic.com/firebasejs/11.4.0/`
- **Hosting**: Firebase Hosting — the `public/` directory is the deploy root
- **Auth**: Firebase Authentication (email/password) for admin access only

## Commands

```bash
# Deploy to Firebase Hosting
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage:rules

# Local development server
firebase serve
```

No npm dependencies, no build step. The project uses browser-native ES modules.

## Architecture

### Pages (all in `public/`)

- **index.html** — Home page with a multi-step booking form (4 steps: device type → problem → optional image upload → customer info)
- **services.html** — Static services listing page
- **tracking.html** — Ticket lookup page where customers search by ticket ID (format: `SPC-YYYYMMDD-XXXX`)
- **admin.html** — Auth-gated admin dashboard for viewing/updating booking statuses
- **404.html** — Custom error page

### JavaScript Modules (in `public/js/`)

- **firebase-config.js** — Initializes Firebase app and exports `db`, `auth`, `storage`. All other JS files import from here.
- **components.js** — Injected on every page via `<script>` (not a module). Renders navbar, footer, and WhatsApp FAB at DOMContentLoaded. Exposes `window.showToast()`.
- **app.js** — Booking form logic (step navigation, validation, image upload to Firebase Storage, Firestore write). Generates ticket IDs with `SPC-{date}-{4chars}` format.
- **tracking.js** — Reads a single Firestore document by ticket ID, renders status stepper and history.
- **admin.js** — Firebase Auth login/logout, loads all bookings (ordered by `createdAt` desc), status filter dropdown, inline status update via `updateDoc`.

### Data Model (Firestore `bookings` collection)

Document ID = ticket ID (e.g., `SPC-20260222-AB12`). Fields:
- `ticketId`, `device`, `problem`, `problemDetails`, `imageUrl`, `customerName`, `customerPhone`, `customerEmail`
- `status` — one of: `received`, `inspection`, `waiting_parts`, `in_progress`, `ready`, `delivered`
- `statusHistory` — array of `{status, timestamp, note}` entries
- `createdAt`, `updatedAt` — Firestore Timestamps
- `adminNotes`

### Security Rules

- **Firestore** (`firestore.rules`): Public can create bookings (with field validation) and read single documents. Only authenticated users can list all bookings or update them. Deletes are denied.
- **Storage** (`storage.rules`): Public can upload images under `booking-images/` (max 5MB, image/* only). Auth required for update/delete.

## Key Conventions

- All user-facing text is in Bengali. Maintain Bengali for UI strings, labels, error messages, and toast notifications.
- `components.js` is loaded as a regular script (not `type="module"`) on every page; all other JS files use `type="module"`.
- CSS is a single file (`public/css/style.css`) using CSS custom properties (variables defined in `:root`). Mobile-first design.
- Firebase SDK is loaded from CDN — no local node_modules. The version is `11.4.0`.
- Firebase project ID must be configured in `.firebaserc` and `firebase-config.js` before deployment.
- Phone validation uses Bangladesh format: `01[3-9]XXXXXXXX` (11 digits).
- `STATUS_LABELS` and `STATUS_ORDER` are duplicated in both `tracking.js` and `admin.js`.
