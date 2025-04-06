export interface WorkoutLogRequest {
  /**
   * Date in string format (e.g., "04 Apr 2025")
   */
  date: string;

  /**
   * Array of exercise IDs to log
   */
  exercise_ids: number[];
}
