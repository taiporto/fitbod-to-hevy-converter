import { HevyAPI } from "./../lib/hevy/api";
import { CSVtoJSON } from "../utils/parsers/CSVtoJSON";
import { fitbodDataToGeneralExercises } from "../utils/parsers/fitbodToHevyExersises";
import { WorkoutBuilder } from "../main/hevy/workoutBuilder";
import { WorkoutPublisher } from "../main/hevy/workoutPublisher";
import { save_api_key, use_api_key } from "./db";
const cliProgress = require("cli-progress");

function initializeAPI() {
  const hevyAPIKey = use_api_key();
  return new HevyAPI(hevyAPIKey);
}

export async function setAPIKey(APIKey: string) {
  try {
    save_api_key(APIKey);
    console.log("API Key has been saved");
  } catch (err) {
    console.error(err);
    console.log("Unable to save API Key");
  }
}

export async function convert(filePath: string) {
  const hevyAPI = initializeAPI();
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  progressBar.start(100, 0);
  const csvContent = await Bun.file(filePath).text();
  progressBar.update(20);

  const exerciseData = fitbodDataToGeneralExercises(CSVtoJSON(csvContent));
  progressBar.update(40);

  const workoutBuilder = new WorkoutBuilder(exerciseData, hevyAPI);
  progressBar.update(60);

  const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();
  progressBar.update(80);

  Bun.file("hevy-workouts.json").write(JSON.stringify(workouts, null, 2));
  progressBar.update(100);
  progressBar.stop();
  console.log(
    "Your Fitbod exercises have been converted and saved to hevy-workouts.json"
  );
}

export async function publish(filePath: string) {
  const hevyAPI = initializeAPI();
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  const publisher = new WorkoutPublisher(hevyAPI);
  const workout = JSON.parse(await Bun.file(filePath).text());
  progressBar.update(50);

  try {
    await publisher.publishOneWorkout(workout);
    progressBar.update(100);
    progressBar.stop();
    console.log("Workout has been published to your Hevy account");
  } catch (error) {
    progressBar.stop();
    console.error("Error publishing workout", error);
  }
}

export async function bulkPublish(filePath: string) {
  const hevyAPI = initializeAPI();

  const publisher = new WorkoutPublisher(hevyAPI);
  const workouts = JSON.parse(await Bun.file(filePath).text());

  try {
    await publisher.bulkPublishWorkouts(workouts);
    console.log("Workouts have been published to your Hevy account");
  } catch (error) {
    console.error("Error publishing workouts", error);
  }
}

export async function convertAndPublish(filePath: string) {
  const hevyAPI = initializeAPI();
  const csvContent = await Bun.file(filePath).text();

  const exerciseData = fitbodDataToGeneralExercises(CSVtoJSON(csvContent));

  const workoutBuilder = new WorkoutBuilder(exerciseData, hevyAPI);
  const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();

  const publisher = new WorkoutPublisher(hevyAPI);

  try {
    await publisher.bulkPublishWorkouts(workouts);
    console.log("Workouts have been published to your Hevy account");
  } catch (error) {
    console.error("Error publishing workouts", error);
  }
}
