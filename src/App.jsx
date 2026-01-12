import React, { useEffect, useMemo, useState } from 'react';
import { computeKPIs } from './utils/kpi.js';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const STORAGE_KEY = 'workoutPlanner_v1';

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function formatWorkoutMeta(w) {
  const parts = [];
  if (w.type) parts.push(w.type);
  if (w.durationMinutes) parts.push(`${w.durationMinutes} min`);
  if (w.sets && w.reps) parts.push(`${w.sets}x${w.reps}`);
  if (w.notes) parts.push('notes');
  return parts.length ? parts.join(' • ') : 'No details';
}

export default function App() {
  // --- Core state (persisted) ---
  const [workouts, setWorkouts] = useState([]);
  const [planByDay, setPlanByDay] = useState(() =>
    Object.fromEntries(daysOfWeek.map((d) => [d, []]))
  );

  // --- Form state ---
  const [name, setName] = useState('');
  const [type, setType] = useState('Strength');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

  const [error, setError] = useState('');

  // --- Load persisted state ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed.workouts)) setWorkouts(parsed.workouts);

      if (parsed.planByDay && typeof parsed.planByDay === 'object') {
        // Ensure all days exist
        const normalized = Object.fromEntries(
          daysOfWeek.map((d) => [d, Array.isArray(parsed.planByDay[d]) ? parsed.planByDay[d] : []])
        );
        setPlanByDay(normalized);
      } else{
        setPlanByDay(Object.fromEntries(daysOfWeek.map((d) => [d, []])));
        
      }
    } catch {
      // Ignore parse errors; start fresh
    }
  }, []);

  // --- Persist state ---
  useEffect(() => {
    const payload = { workouts, planByDay };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [workouts, planByDay]);

  // --- Derived KPIs ---
  const kpis = useMemo(() => computeKPIs({ workouts, planByDay }), [workouts, planByDay]);

  // --- Handlers ---
  function addWorkout(e) {
    e.preventDefault();
    setError('');

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Workout name is required.');
      return;
    }

    const workout = {
      id: uid(),
      name: trimmed,
      type,
      durationMinutes: durationMinutes ? Number(durationMinutes) : null,
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      notes: notes.trim() || '',
      createdAt: new Date().toISOString(),
    };

    setWorkouts((prev) => [workout, ...prev]);

    // Reset parts of form
    setName('');
    setDurationMinutes('');
    setSets('');
    setReps('');
    setNotes('');
  }

  function assignWorkout(e) {
    e.preventDefault();
    setError('');

    if (!selectedWorkoutId) {
      setError('Select a workout to assign.');
      return;
    }

    const workoutExists = workouts.some((w) => w.id === selectedWorkoutId);
    if (!workoutExists) {
      setError('Selected workout no longer exists.');
      return;
    }

    setPlanByDay((prev) => {
      const dayList = prev[selectedDay] ?? [];
      return {
        ...prev,
        [selectedDay]: [...dayList, selectedWorkoutId],
      };
    });
  }

  function removeAssignment(day, index) {
    setPlanByDay((prev) => {
      const dayList = Array.isArray(prev[day]) ? [...prev[day]] : [];
      dayList.splice(index, 1);
      return { ...prev, [day]: dayList };
    });
  }

  function deleteWorkout(workoutId) {
    // Remove from workouts
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));

    // Also remove from any day assignments
    setPlanByDay((prev) => {
      const next = {};
      for (const day of daysOfWeek) {
        const list = Array.isArray(prev[day]) ? prev[day] : [];
        next[day] = list.filter((id) => id !== workoutId);
      }
      return next;
    });

    if (selectedWorkoutId === workoutId) setSelectedWorkoutId('');
  }

  function clearAll() {
    if (!confirm('Clear all workouts and the weekly plan? This cannot be undone.')) return;
    setWorkouts([]);
    setPlanByDay(Object.fromEntries(daysOfWeek.map((d) => [d, []])));
    setSelectedWorkoutId('');
    setSelectedDay(daysOfWeek[0]);
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  }

  const workoutById = useMemo(() => {
    const map = new Map();
    for (const w of workouts) map.set(w.id, w);
    return map;
  }, [workouts]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <h1 className="h1">Workout Planner</h1>
          <div className="badge">Black • Gold • Silver</div>
        </div>

        <div className="row">
          <button className="btn btnSecondary" onClick={clearAll} type="button">
            Reset Planner
          </button>
        </div>
      </div>

      <div className="grid cols-3">
        {/* --- Create Workout --- */}
        <section className="card">
          <h2 className="cardTitle">Create Workout</h2>

          <form onSubmit={addWorkout} className="stack">
            <div className="stack">
              <input
                className="input"
                placeholder="Workout name (e.g., Push Day, Legs, HIIT)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="row">
                <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option>Strength</option>
                  <option>Cardio</option>
                  <option>Mobility</option>
                  <option>Sport</option>
                  <option>Recovery</option>
                </select>

                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="Duration (min)"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>

              <div className="row">
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="Sets"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="Reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>

              <textarea
                className="textarea"
                placeholder="Notes (optional): exercises, cues, intensity, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error ? (
              <div className="pill" style={{ borderColor: 'rgba(255,90,106,0.45)', color: 'rgba(255,255,255,0.9)' }}>
                {error}
              </div>
            ) : null}

            <button className="btn" type="submit">
              Add Workout
            </button>

            <p className="footerNote">
              Tip: Create a few templates (Push/Pull/Legs, Upper/Lower, HIIT) then assign them to your week.
            </p>
          </form>
        </section>

        {/* --- Assign Workout --- */}
        <section className="card">
          <h2 className="cardTitle">Assign to Day</h2>

          <form onSubmit={assignWorkout} className="stack">
            <select
              className="select"
              value={selectedWorkoutId}
              onChange={(e) => setSelectedWorkoutId(e.target.value)}
            >
              <option value="">Select a workout…</option>
              {workouts.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <select className="select" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {error ? (
              <div className="pill" style={{ borderColor: 'rgba(255,90,106,0.45)', color: 'rgba(255,255,255,0.9)' }}>
                {error}
              </div>
            ) : null}

            <button className="btn" type="submit" disabled={!workouts.length}>
              Assign Workout
            </button>

            <hr className="hr" />

            <h3 className="cardTitle" style={{ marginTop: 0 }}>
              KPI Snapshot
            </h3>

            <div className="kpiRow">
              <div className="kpi">
                <div className="kpiLabel">Workouts created</div>
                <div className="kpiValue">{kpis.totalWorkouts}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Assignments (week)</div>
                <div className="kpiValue">{kpis.totalAssignments}</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Avg / day</div>
                <div className="kpiValue">{kpis.avgAssignmentsPerDay.toFixed(1)}</div>
              </div>
            </div>

            <p className="footerNote">
              KPIs here are lightweight “plan health” indicators. You can extend them to track volume, intensity, or
              adherence over time.
            </p>
          </form>
        </section>

        {/* --- Weekly Plan --- */}
        <section className="card">
          <h2 className="cardTitle">Weekly Plan</h2>

          <div className="stack">
            {daysOfWeek.map((day) => {
              const ids = planByDay[day] ?? [];
              return (
                <div key={day} className="stack">
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="pill">{day}</div>
                    <div className="pill">{ids.length} assigned</div>
                  </div>

                  {ids.length === 0 ? (
                    <div className="footerNote">No workouts assigned.</div>
                  ) : (
                    <div className="list">
                      {ids.map((id, idx) => {
                        const w = workoutById.get(id);
                        if (!w) {
                          return (
                            <div className="item" key={`${day}-${idx}`}>
                              <div className="itemLeft">
                                <div className="itemName">Deleted workout</div>
                                <div className="itemMeta">This entry references a workout that no longer exists.</div>
                              </div>
                              <button
                                className="btn btnDanger"
                                type="button"
                                onClick={() => removeAssignment(day, idx)}
                              >
                                Remove
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div className="item" key={`${day}-${id}-${idx}`}>
                            <div className="itemLeft">
                              <div className="itemName">{w.name}</div>
                              <div className="itemMeta">{formatWorkoutMeta(w)}</div>
                            </div>

                            <div className="row" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="btn btnSecondary"
                                type="button"
                                onClick={() => removeAssignment(day, idx)}
                              >
                                Unassign
                              </button>
                              <button className="btn btnDanger" type="button" onClick={() => deleteWorkout(w.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <hr className="hr" />
                </div>
              );
            })}
          </div>

          <p className="footerNote">
            Deleting a workout removes it from your library and also clears any weekly assignments that referenced it.
          </p>
        </section>
      </div>

      {/* --- Workout Library (optional but useful) --- */}
      <div style={{ marginTop: 14 }} className="card">
        <h2 className="cardTitle">Workout Library</h2>

        {workouts.length === 0 ? (
          <p className="footerNote">No workouts yet. Create one on the left to get started.</p>
        ) : (
          <div className="list">
            {workouts.map((w) => (
              <div className="item" key={w.id}>
                <div className="itemLeft">
                  <div className="itemName">{w.name}</div>
                  <div className="itemMeta">{formatWorkoutMeta(w)}</div>
                </div>
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn btnDanger" type="button" onClick={() => deleteWorkout(w.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="footerNote">
          Data is saved in your browser via <code>localStorage</code>. Clearing site data will reset the planner.
        </p>
      </div>
    </div>
  );
}
