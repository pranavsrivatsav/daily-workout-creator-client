import WorkoutRecommendation from "../components/ui/WorkoutRecommendation";
import WorkoutLogger from "../components/ui/WorkoutLogger";
import Workouts from "../components/ui/Workouts";
import styles from "./Home.module.css";

// Page component exports will go here
function Home() {
  return (
    <div>
      <div className={styles.header}>
        <h1>Daily Workout Creator</h1>
      </div>
      <div className={styles.componentsContainer}>
        <WorkoutRecommendation />
        <WorkoutLogger />
        <Workouts />
      </div>
    </div>
  );
}

export default Home;
