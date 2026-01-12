# Workout Planner App

This repository contains a simple single–page application built with **React** and **Vite**.  It allows you to create a catalogue of workouts and assign them to specific days of the week.  The app persists your data in `localStorage` so that your workout plans are preserved when you refresh the page or close your browser.

## Features

- **Add workouts** – Create custom workouts with a name, description, and optional number of sets and reps.
- **Assign to days** – Add each workout to one or more days of the week to build your weekly training plan.
- **KPI dashboard** – A small dashboard summarises the total number of defined exercises, the total number of assigned workouts, and the average number of workouts per day.  These metrics reflect the concept of key performance indicators (KPIs) applied to your own fitness routine.
- **Persisted data** – All workouts and plans are stored in your browser’s `localStorage`.
- **Clean, portfolio–ready structure** – The project uses the modern Vite build tool and follows a logical directory structure suitable for deployment on GitHub Pages.

## Repository Structure

```
workout-planner-app/
├── README.md             # Project overview and build instructions
├── package.json          # Node.js package manifest with dependencies and scripts
├── vite.config.js        # Vite configuration for React and GitHub Pages deployment
├── index.html            # Main HTML entry point
├── src/
│   ├── App.jsx          # Root React component implementing the planner
│   ├── main.jsx         # Bootstraps the React application
│   ├── index.css        # Global styles and CSS variables
│   └── utils/
│       └── kpi.js       # Helper functions to calculate KPIs for the workout plan
└── docs/
    └── report.tex        # LaTeX report on Agile, Scrum, and KPI programming (see below)
```

## Getting Started

1. **Install dependencies**

   Make sure you have [Node.js](https://nodejs.org/) installed.  Then install dependencies:

   ```bash
   npm install
   ```

2. **Run the development server**

   Start the local development server.  Vite will open the app at `http://localhost:5173` by default.

   ```bash
   npm run dev
   ```

3. **Build for production**

   Build the application for production.  The compiled files will be output to the `dist` folder.

   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages**

   To deploy the app from a GitHub repository, set the `base` option in `vite.config.js` to the repository name prefaced with a slash (already configured in this project).  Then push your code to GitHub and enable GitHub Pages from the `dist` directory via the repository settings.

## Documentation

The `docs/report.pdf` file in this repository contains a PDF report that explains the concepts of **KPI programming** and **Agile/Scrum** development.  It also includes diagrams illustrating the Scrum workflow and examples of how KPIs can be visualised.  

## License

This project is licensed under the MIT License.  See the [LICENSE](LICENSE) file for details.
