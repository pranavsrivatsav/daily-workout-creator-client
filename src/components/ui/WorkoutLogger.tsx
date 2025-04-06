import React, { useState, useEffect, useRef } from "react";
import {
  useGetExercisesQuery,
  useLogWorkoutMutation,
} from "../../services/querier";
import { WorkoutLogRequest } from "../../types/api/requests/workoutLogRequest";
import styles from "./WorkoutLogger.module.css";
import moment from "moment";

const defaultDate = new Date().toISOString().slice(0, 10); // Default date to today

const WorkoutLogger: React.FC = () => {
  const { data: exercisesData, isLoading, error } = useGetExercisesQuery();
  const [
    getLogWorkoutMutation,
    {
      isError: logWorkoutFailure,
      isLoading: isLoggingWorkout,
      isSuccess: logWorkoutSuccess,
    },
  ] = useLogWorkoutMutation();
  const showLogWorkoutSuccessRef = useRef<boolean>(false);
  const [date, setDate] = useState<string>(defaultDate);
  const [exerciseInput, setExerciseInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [addButtonEnabled, setAddButtonEnabled] = useState<boolean>(false);
  const [selectedExercises, setSelectedExercises] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle debounced search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(exerciseInput);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [exerciseInput]);

  // Search exercises based on debounced input
  useEffect(() => {
    if (debouncedSearchTerm && exercisesData && exercisesData.length > 0) {
      const filteredExercises = exercisesData
        .filter((exercise) =>
          exercise.exercise_name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
        .slice(0, 10) // Limit to 10 results for performance
        .map((exercise) => ({
          id: exercise.exercise_id,
          name: exercise.exercise_name,
        }));

      setSearchResults(filteredExercises);
      setIsSearchOpen(filteredExercises.length > 0);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [debouncedSearchTerm, exercisesData]);

  // Check if exercise input exactly matches an exercise name
  useEffect(() => {
    if (exercisesData && exercisesData.length > 0) {
      const exactMatch = exercisesData.find(
        (exercise) =>
          exercise.exercise_name.toLowerCase() === exerciseInput.toLowerCase()
      );
      setAddButtonEnabled(!!exactMatch);
    }
  }, [exerciseInput, exercisesData]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (logWorkoutSuccess && !showLogWorkoutSuccessRef.current) {
      showLogWorkoutSuccessRef.current = true;
    }

    setTimeout(() => {
      showLogWorkoutSuccessRef.current = false;
    }, 3000); // Reset after 3 seconds
  }, [logWorkoutSuccess]);

  const handleExerciseInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExerciseInput(e.target.value);
    if (e.target.value) {
      setIsSearchOpen(true);
    }
  };

  const handleSelectExercise = (exercise: { id: number; name: string }) => {
    setExerciseInput(exercise.name);
    setIsSearchOpen(false);
  };

  const handleAddExercise = () => {
    if (addButtonEnabled && exercisesData && exercisesData?.length > 0) {
      const exerciseToAdd = exercisesData.find(
        (exercise) =>
          exercise.exercise_name.toLowerCase() === exerciseInput.toLowerCase()
      );

      if (
        exerciseToAdd &&
        !selectedExercises.some((e) => e.id === exerciseToAdd.exercise_id)
      ) {
        setSelectedExercises([
          ...selectedExercises,
          { id: exerciseToAdd.exercise_id, name: exerciseToAdd.exercise_name },
        ]);
      }

      setExerciseInput("");
      setAddButtonEnabled(false);
    }
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises(
      selectedExercises.filter((exercise) => exercise.id !== id)
    );
  };

  const formatDateForRequest = (dateString: string) => {
    const date = moment(dateString, "YYYY-MM-DD");
    const formattedDate = date.format("DD MMM YYYY");

    return formattedDate; // Format: "DD-MMM-YYYY"
  };

  const handleSubmit = () => {
    const workoutLogRequest: WorkoutLogRequest = {
      date: formatDateForRequest(date),
      exercise_ids: selectedExercises.map((exercise) => exercise.id),
    };

    console.log("Workout Log Request:", workoutLogRequest);
    getLogWorkoutMutation(workoutLogRequest);

    setSelectedExercises([]); // Clear selected exercises after submission
    setDate(defaultDate); // Reset date to today
    setExerciseInput(""); // Clear exercise input
  };

  if (isLoading) return <div>Loading exercises...</div>;
  if (error) return <div>Error loading exercises</div>;
  if (isLoggingWorkout) return <div>Logging workout...</div>;
  if (logWorkoutFailure) return <div>Error logging workout</div>;
  if (showLogWorkoutSuccessRef.current) {
    return <div>Workout logged successfully!</div>;
  }

  return (
    <div className={styles.workoutLoggerContainer}>
      <h2>Log Your Workout</h2>

      <div className={styles.formGroup}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.selectedExercises}>
        <h3>Selected Exercises</h3>
        {selectedExercises.length === 0 ? (
          <p>No exercises selected yet</p>
        ) : (
          <ul>
            {selectedExercises.map((exercise) => (
              <li key={exercise.id}>
                {exercise.name}
                <button
                  className={styles.removeExerciseBtn}
                  onClick={() => handleRemoveExercise(exercise.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className={`${styles.formGroup} ${styles.exerciseSearch}`}
        ref={searchContainerRef}
      >
        <label>Add Exercise:</label>
        <div className={styles.exerciseSearchContainer}>
          <input
            type="text"
            value={exerciseInput}
            onChange={handleExerciseInputChange}
            placeholder="Type to search exercises"
            className={styles.exerciseInput}
          />
          <button
            onClick={handleAddExercise}
            disabled={!addButtonEnabled}
            className={styles.addExerciseBtn}
          >
            Add
          </button>
        </div>

        {isSearchOpen && (
          <div className={styles.searchResults}>
            {searchResults.map((exercise) => (
              <div
                key={exercise.id}
                className={styles.searchItem}
                onClick={() => handleSelectExercise(exercise)}
              >
                {exercise.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedExercises.length === 0}
        className={styles.submitBtn}
      >
        Log Workout
      </button>
    </div>
  );
};

export default WorkoutLogger;
