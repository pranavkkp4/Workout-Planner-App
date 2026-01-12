export function countAssignmentsPerDay(planByDay) {
  const safePlan = planByDay && typeof planByDay === 'object' ? planByDay : {};
  const result = {};
  for (const day of Object.keys(safePlan)) {
    const list = Array.isArray(safePlan[day]) ? safePlan[day] : [];
    result[day] = list.length;
  }
  return result;
}

export function totalAssignments(planByDay) {
  const safePlan = planByDay && typeof planByDay === 'object' ? planByDay : {};
  return Object.values(safePlan).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
}

export function averageAssignmentsPerDay(planByDay) {
  const safePlan = planByDay && typeof planByDay === 'object' ? planByDay : {};
  const days = Math.max(Object.keys(safePlan).length, 1);
  return totalAssignments(safePlan) / days;
}

export function computeKPIs({ workouts = [], planByDay } = {}) {
  const safePlan = planByDay && typeof planByDay === 'object' ? planByDay : {};
  const safeWorkouts = Array.isArray(workouts) ? workouts : [];

  return {
    totalWorkoutsDefined: safeWorkouts.length,
    totalAssignments: totalAssignments(safePlan),
    avgAssignmentsPerDay: averageAssignmentsPerDay(safePlan),
    assignmentsPerDay: countAssignmentsPerDay(safePlan),
  };
}
