interface Exercise {
  name: string;
  id: number;
  muscle_group_id: number;
  muscle_group_name: string;
  recent_workout_date: string;
  recommend_flag: boolean;
}

interface MuscleGroupCount {
  muscle_group_id: string;
  muscle_group_name: string;
  count: number;
}

export interface WorkoutResponse {
  date: string;
  exercises: Exercise[];
  exercise_ids: number[];
  muscleGroupCount: MuscleGroupCount[];
}
