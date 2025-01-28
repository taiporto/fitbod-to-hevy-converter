import { CSVtoJSON } from "../utils/parsers/CSVtoJSON";
import { fitbodDataToGeneralExercises } from "../utils/parsers/fitbodToHevyExersises";
import { WorkoutBuilder } from "../main/hevy/workoutBuilder";
import { WorkoutPublisher } from "../main/hevy/workoutPublisher";

export async function convert(filePath: string) {
  const csvContent = await Bun.file(filePath).text();

  const exerciseData = fitbodDataToGeneralExercises(CSVtoJSON(csvContent));

  const workoutBuilder = new WorkoutBuilder(exerciseData);

  const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();

  Bun.file("hevy-workouts.json").write(JSON.stringify(workouts, null, 2));
  console.log(
    "Your Fitbod exercises have been converted and saved to hevy-workouts.json"
  );
}

export async function publish(filePath: string) {
  const publisher = new WorkoutPublisher();
  const workout = JSON.parse(await Bun.file(filePath).text());

  try {
    await publisher.publishOneWorkout(workout);
    console.log("Workout has been published to your Hevy account");
  } catch (error) {
    console.error("Error publishing workout", error);
  }
}

export async function bulkPublish(filePath: string) {
  const publisher = new WorkoutPublisher();
  const workouts = JSON.parse(await Bun.file(filePath).text());

  try {
    await publisher.bulkPublishWorkouts(workouts);
    console.log("Workouts have been published to your Hevy account");
  } catch (error) {
    console.error("Error publishing workouts", error);
  }
}

export async function convertAndPublish(filePath: string) {
  const csvContent = await Bun.file(filePath).text();

  const exerciseData = fitbodDataToGeneralExercises(CSVtoJSON(csvContent));

  const workoutBuilder = new WorkoutBuilder(exerciseData);
  const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();

  const publisher = new WorkoutPublisher();

  try {
    await publisher.bulkPublishWorkouts(workouts);
    console.log("Workouts have been published to your Hevy account");
  } catch (error) {
    console.error("Error publishing workouts", error);
  }
}
