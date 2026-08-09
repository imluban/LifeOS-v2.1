export function calculateExecutionScore(
  completedTasks: number,
  totalTasks: number
) {
  if (totalTasks === 0) return 0;

  return Math.round(
    (completedTasks / totalTasks) * 100
  );
}