/*
 * KPI utilities for the Workout Planner application.
 *
 * This module exposes functions to compute simple key performance indicators
 * (KPIs) for a weekly workout plan.
 */

/**
 * Count the number of assignments per day of the week.
 *
 * @param {Object<string, Array>} planByDay - Plan keyed by day name (values: array of workout IDs).
 * @returns {Object<string, number>} - Keys are day names and values are counts.
 */
export function countAssignmentsPerDay(planByDay) {
  const result = {};
  for (const day of Object.keys(planByDay || {})) {
    const list = Array.isArray(planByDay[day]) ? planByDay[day] : [];
    result[day] = list.length;
  }
  return result;
}

/**
 * Total number of assigned workouts across the whole week.
 *
 * @param {Object<string, Array>} planByDay
 * @returns {number}
 */
export function totalAssignments(planByDay) {
  return Object.values(planByDay || {}).reduce((sum, list) => {
    const safe = Array.isArray(list) ? list : [];
    return sum + safe.length;
  }, 0);
}

/**
 * Average number of assignments per day.
 *
 * @param {Object<string, Array>} planByDay
 * @returns {number}
 */
export function averageAssignmentsPerDay(planByDay) {
  const days = Math.max(Object.keys(planByDay || {}).length, 1);
  return totalAssignments(planByDay) / days;
}

/**
 * Compute a summary of KPIs for the workout planner.
 *
 * @param {Object} args
 * @param {Array} args.workouts - Array of defined workouts (library).
 * @param {Object<string, Array>} args.planByDay - Day -> array of assigned workout IDs.
 * @returns {Object} KPI summary
 */
export function computeKPIs({ workouts = [], planByDay = {} } = {}) {
  const assignmentsPerDay = countAssignmentsPerDay(planByDay);
  const total = totalAssignments(planByDay);
  const avg = averageAssignmentsPerDay(planByDay);

  return {
    totalWorkoutsDefined: Array.isArray(workouts) ? workouts.length : 0,
    totalAssignments: total,
    avgAssignmentsPerDay: avg,
    assignmentsPerDay,
  };
}
