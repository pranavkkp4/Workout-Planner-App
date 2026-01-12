import React, { useState, useEffect } from 'react';
import { computeKPIs } from './utils/kpi.js';

// Define the days of the week for the workout planner.
const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Main application component for the Workout Planner.
 *
 * Users can create a catalogue of workouts and assign them to different days of
 * the week. All data is persisted to localStorage so that refreshing the page
 * or closing the browser does not result in losing your plan. The component
 * also calculates basic KPIs for the current workout plan using helper
 * functions defined in utils/kpi.js.
 */
export default function App() {
  // Initialise workouts and plan from local storage or defaults.
  const [workouts, setWorkouts] = useState(() => {
    const stored = localStorage.getItem('workouts');
    return stored ? JSON.parse(stored) : [];
  });

  const [plan, setPlan] = useState(() => {
    const stored = localStorage.getItem('plan');
    if (stored) return JSON.parse(stored);
    // initialise plan with empty arrays for each day
    const initial = {};
    daysOfWeek.forEach((day) => {
      initial[day] = [];
    });
    return initial;
  });

  // Form state for creating a new workout
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    sets: '',
    reps: '',
  });

  // State for assigning an existing workout to a day
  const [assignment, setAssignment] = useState({
    day: daysOfWeek[0],
    workoutId: '',
  });

  // Persist workouts and plan to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('plan', JSON.stringify(plan));
  }, [plan]);

  /**
   * Handle input changes for the workout creation form.
   * @param {Event} e - The input change event.
   */
  function handleWorkoutChange(e) {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Create a new workout and add it to the workouts list.
   */
  function addWorkout() {
    // Validate required fields
    if (!newWorkout.name.trim()) return;
    const workout = {
      id: Date.now().toString(),
      name: newWorkout.name.trim(),
      description: newWorkout.description.trim(),
      sets: newWorkout.sets ? parseInt(newWorkout.sets, 10) : null,
      reps: newWorkout.reps ? parseInt(newWorkout.reps, 10) : null,
    };
    setWorkouts((prev) => [...prev, workout]);
    // Reset form
    setNewWorkout({ name: '', description: '', sets: '', reps: '' });
  }

  /**
   * Handle changes for the assignment form fields.
   * @param {Event} e - The input change event.
   */
  function handleAssignmentChange(e) {
    const { name, value } = e.target;
    setAssignment((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Assign the selected workout to the chosen day.
   */
  function assignWorkout() {
    const { day, workoutId } = assignment;
    if (!workoutId) return;
    setPlan((prev) => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = [];
      // prevent duplicates
      updated[day] = [...updated[day], workoutId];
      return updated;
    });
    // reset only the workout selection (not the day)
    setAssignment((prev) => ({ ...prev, workoutId: '' }));
  }

  /**
   * Remove a workout from a specific day by index.
   * @param {string} day - The day of the week.
   * @param {number} index - Index of the workout in that day's array.
   */
  function removeFromDay(day, index) {
    setPlan((prev) => {
      const updated = { ...prev };
      updated[day] = updated[day].filter((_, i) => i !== index);
      return updated;
    });
  }

  // Compute KPI metrics based on the current workouts and plan
  const kpis = computeKPIs(workouts, plan);

  return (
    <div className="container">
      <h1>Workout Planner</h1>

      {/* KPI display */}
      <div className="card">
        <h2>Plan Summary</h2>
        <div className="kpi-list">
          <div className="kpi">
            <strong>Total defined exercises</strong>
            <div>{kpis.totalDefinedExercises}</div>
          </div>
          <div className="kpi">
            <strong>Total workouts assigned</strong>
            <div>{kpis.totalWorkouts}</div>
          </div>
          <div className="kpi">
            <strong>Average workouts/day</strong>
            <div>{kpis.averageWorkoutsPerDay}</div>
          </div>
        </div>
      </div>

      {/* Form to add a new workout */}
      <div className="card">
        <h2>Add a New Workout</h2>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={newWorkout.name}
          onChange={handleWorkoutChange}
          placeholder="e.g., Bench Press"
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={newWorkout.description}
          onChange={handleWorkoutChange}
          placeholder="Describe the workout"
          rows={3}
        />
        <label htmlFor="sets">Sets (optional)</label>
        <input
          id="sets"
          name="sets"
          type="number"
          value={newWorkout.sets}
          onChange={handleWorkoutChange}
          placeholder="e.g., 3"
        />
        <label htmlFor="reps">Reps per set (optional)</label>
        <input
          id="reps"
          name="reps"
          type="number"
          value={newWorkout.reps}
          onChange={handleWorkoutChange}
          placeholder="e.g., 10"
        />
        <button onClick={addWorkout}>Add Workout</button>
      </div>

      {/* Form to assign a workout to a day */}
      <div className="card">
        <h2>Assign Workout to Day</h2>
        {workouts.length === 0 ? (
          <p>Please add at least one workout first.</p>
        ) : (
          <>
            <label htmlFor="day">Day</label>
            <select name="day" id="day" value={assignment.day} onChange={handleAssignmentChange}>
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <label htmlFor="workoutId">Workout</label>
            <select
              name="workoutId"
              id="workoutId"
              value={assignment.workoutId}
              onChange={handleAssignmentChange}
            >
              <option value="">-- Select a workout --</option>
              {workouts.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <button onClick={assignWorkout}>Assign</button>
          </>
        )}
      </div>

      {/* Display the workout plan by day */}
      <div className="card">
        <h2>Weekly Plan</h2>
        {daysOfWeek.map((day) => (
          <div key={day} className="plan-day">
            <h3>{day}</h3>
            {plan[day] && plan[day].length > 0 ? (
              plan[day].map((workoutId, idx) => {
                const workout = workouts.find((w) => w.id === workoutId);
                return (
                  <div key={`${workoutId}-${idx}`} className="workout-item">
                    <div>
                      <strong>{workout?.name || 'Unknown'}</strong>
                      {workout?.sets && workout?.reps ? (
                        <span>
                          {' '}( {workout.sets} × {workout.reps} )
                        </span>
                      ) : null}
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {workout?.description}
                      </div>
                    </div>
                    <button onClick={() => removeFromDay(day, idx)} style={{ background: 'var(--accent-color)' }}>
                      Remove
                    </button>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#888', margin: 0 }}>No workouts assigned.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}