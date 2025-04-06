/**
 * Interface representing an exercise in a workout.
 */
export interface Exercise {
  exercise_id: number;
  exercise_name: string;
  muscle_group_name: string;
}

/**
 * Interface representing a workout in the workout list response.
 */
export interface Workout {
  workout_id: number;
  date: string; // Format: "DD-MMM-YYYY"
  exercises: Exercise[];
}

/**
 * Interface for the workout list API response.
 */
export type WorkoutListResponse = Workout[];
