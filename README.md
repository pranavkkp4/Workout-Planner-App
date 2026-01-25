# Workout Planner App

This repository contains a single-page **Workout Planner** application built with **React** and **Vite**. The app allows users to create a catalog of workouts, assign them to specific days of the week, and view summary KPIs. Data is persisted in the browser using `localStorage`, and the application is deployed via **GitHub Pages**.

The project has been enhanced as a **front-end flagship**, demonstrating UI polish, animation, and real-world automation integrations.

---

## Features

- **Workout management** – Create custom workouts with a name, description, and optional sets/reps.
- **Weekly planner** – Assign workouts to one or more days of the week to build a training schedule.
- **KPI dashboard** – Displays summary metrics such as:
  - Total defined workouts
  - Total assigned workouts
  - Average workouts per day
- **Persistent state** – All data is stored in browser `localStorage`.
- **GSAP animations** – Subtle entrance animations and UI transitions improve perceived performance and UX polish.
- **Zapier automation (webhooks)** – Workout lifecycle events (create, assign, delete, reset) are emitted via webhooks and logged to Google Sheets.
- **Production deployment** – Built with Vite and deployed to GitHub Pages using GitHub Actions with environment-based configuration.

---

## Recent Enhancements

### UI & Interaction
- Integrated **GSAP** to add micro-interactions and entrance animations.
- Animations are scoped to key UI elements to enhance clarity without impacting performance.

### Automation & Integrations
- Implemented **Zapier webhooks** to emit event-driven data for workout lifecycle actions.
- Events are logged to **Google Sheets** as a lightweight automation and analytics pipeline.
- Webhook URLs are injected at build time via GitHub Actions secrets.

### Deployment
- Continuous deployment via **GitHub Actions**.
- Environment variables managed securely using repository secrets.
- Hosted on **GitHub Pages**.

---

## Repository Structure

