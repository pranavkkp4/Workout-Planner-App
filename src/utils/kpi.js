/*
 * KPI utilities for the Workout Planner application.
 *
 * This module exposes functions to compute simple key performance indicators
 * (KPIs) for a weekly workout plan. While these KPIs are not directly
 * related to agile software development, they mirror the concept of measuring
 * and tracking performance. You can expand these functions to track
 * additional metrics relevant to your domain.
 */

/**
 * Count the number of workouts assigned to each day of the week.
 *
 * @param {Object} plan - The workout plan keyed by day names.
 * @returns {Object} - An object where keys are day names and values are counts.
 */
export function countWorkoutsPerDay(plan) {
  const result = {};
  for (const day of Object.keys(plan)) {
    result[day] = plan[day].length;
  }
  return result;
}

/**
 * Calculate the total number of assigned workouts in the plan.
 *
 * @param {Object} plan - The workout plan keyed by day names.
 * @returns {number} - The total number of workouts across all days.
 */
export function totalWorkouts(plan) {
  return Object.values(plan).reduce((sum, list) => sum + list.length, 0);
}

/**
 * Compute the average number of workouts per day.
 *
 * @param {Object} plan - The workout plan.
 * @returns {number} - The average number of workouts per day.
 */
export function averageWorkoutsPerDay(plan) {
  const total = totalWorkouts(plan);
  const days = Object.keys(plan).length || 1;
  return total / days;
}

/**
 * Compute a summary of KPIs for the workout planner.
 *
 * @param {Array} workouts - Array of all defined workouts.
 * @param {Object} plan - The current workout plan.
 * @returns {Object} - An object with aggregated KPI metrics.
 */
export function computeKPIs(workouts, plan) {
  return {
    totalWorkouts: totalWorkouts(plan),
    workoutsPerDay: countWorkoutsPerDay(plan),
    averageWorkoutsPerDay: averageWorkoutsPerDay(plan).toFixed(2),
    totalDefinedExercises: workouts.length,
  };
}