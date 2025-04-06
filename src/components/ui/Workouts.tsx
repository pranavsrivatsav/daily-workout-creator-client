import { useGetWorkoutsQuery } from "../../services/querier";
import styles from "./Workouts.module.css";
import { useState, useEffect, useRef } from "react";

function Workouts() {
  const { data: workouts, error, isLoading } = useGetWorkoutsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Update itemsPerView based on container width
  useEffect(() => {
    const updateItemsPerView = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newItemsPerView = Math.max(1, Math.floor(containerWidth / 300)); // Assuming 300px per card with margins
        setItemsPerView(newItemsPerView);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const handlePrevClick = () => {
    if (sliderRef.current) {
      const cardWidth =
        sliderRef.current.querySelector<HTMLElement>(`.${styles.workoutCard}`)
          ?.offsetWidth || 300;
      const scrollAmount = (cardWidth + 16) * itemsPerView; // scroll by itemsPerView cards at once

      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      // Update the current index for pagination display, move back by itemsPerView
      setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
    }
  };

  const handleNextClick = () => {
    if (workouts && sliderRef.current) {
      const cardWidth =
        sliderRef.current.querySelector<HTMLElement>(`.${styles.workoutCard}`)
          ?.offsetWidth || 300;
      const scrollAmount = (cardWidth + 16) * itemsPerView; // scroll by itemsPerView cards at once

      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Update the current index for pagination display, move forward by itemsPerView
      setCurrentIndex((prev) =>
        Math.min(prev + itemsPerView, workouts.length - itemsPerView)
      );
    }
  };

  if (isLoading) return <div>Loading workouts...</div>;
  if (error) return <div>Error loading workouts</div>;
  if (!workouts || workouts.length === 0) return <div>No workouts found</div>;

  const canGoBack = currentIndex > 0;
  const canGoForward =
    workouts && currentIndex < workouts.length - itemsPerView;

  return (
    <div className={styles.workoutsContainer} ref={containerRef}>
      <h1>Your Workouts</h1>

      <div className={styles.carouselContainer}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={handlePrevClick}
          disabled={!canGoBack}
        >
          &lt;
        </button>

        <div className={styles.workoutsSlider} ref={sliderRef}>
          {workouts.map((workout) => (
            <div key={workout.workout_id} className={styles.workoutCard}>
              <h2>{workout.date}</h2>
              <div className={styles.exercisesList}>
                <h3>Exercises:</h3>
                {workout.exercises.map((exercise) => (
                  <div
                    key={exercise.exercise_id}
                    className={styles.exerciseItem}
                  >
                    <span className={styles.exerciseName}>
                      {exercise.exercise_name}
                    </span>
                    <span className={styles.muscleGroup}>
                      ({exercise.muscle_group_name})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={handleNextClick}
          disabled={!canGoForward}
        >
          &gt;
        </button>
      </div>

      <div className={styles.paginationIndicator}>
        {workouts.length > itemsPerView && (
          <span>
            {currentIndex + 1}-
            {Math.min(currentIndex + itemsPerView, workouts.length)} of{" "}
            {workouts.length}
          </span>
        )}
      </div>
    </div>
  );
}

export default Workouts;
