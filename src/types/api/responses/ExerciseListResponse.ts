export interface ExerciseItem {
  exercise_name: string;
  exercise_id: number;
  muscle_group_name: string;
  muscle_group_id: number;
}

export type ExerciseListResponse = ExerciseItem[];
