import { useState } from "react";
import { useGenerateWorkoutQuery } from "../../services/querier";
import styles from "./WorkoutRecommendation.module.css";

function WorkoutRecommendation() {
  const [exerciseCount, setExerciseCount] = useState<number>(4);
  const {
    data: workout,
    error,
    isLoading,
    refetch,
  } = useGenerateWorkoutQuery(exerciseCount);

  const handleGenerateWorkout = () => {
    refetch();
  };

  const handleExerciseCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExerciseCount(Number(e.target.value));
  };

  return (
    <div className={styles.workoutRecommendation}>
      <h2>Workout Recommendation</h2>

      <div className={styles.controls}>
        <div>
          <label htmlFor="exerciseCount">
            Number of exercises: {exerciseCount}
          </label>
          <input
            type="range"
            id="exerciseCount"
            min="1"
            max="7"
            value={exerciseCount}
            onChange={handleExerciseCountChange}
          />
        </div>
        <button onClick={handleGenerateWorkout}>Refresh Workout</button>
      </div>

      {isLoading && <p>Loading workout...</p>}
      {error && <p>Error loading workout. Please try again.</p>}

      {workout && (
        <div className={styles.workoutList}>
          <h3>Recommended Exercises:</h3>
          <ul>
            {workout.exercises.map((exercise, index) => (
              <li key={index} className={styles.exerciseItem}>
                <div className={styles.exerciseName}>{exercise.name}</div>
                <div className={styles.exerciseDetails}>
                  <span className={styles.muscleGroup}>
                    Muscle Group: {exercise.muscle_group_name}
                  </span>
                  <span className={styles.lastWorkout}>
                    Last Done:{" "}
                    {exercise.recent_workout_date
                      ? new Date(
                          exercise.recent_workout_date
                        ).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WorkoutRecommendation;
