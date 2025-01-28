import { HevyAPI } from "./../lib/hevy/api";
import { CSVtoJSON } from "../utils/parsers/CSVtoJSON";
import { fitbodDataToGeneralExercises } from "../utils/parsers/fitbodToHevyExersises";
import { WorkoutBuilder } from "../main/hevy/workoutBuilder";
import { WorkoutPublisher } from "../main/hevy/workoutPublisher";
import { save_api_key, use_api_key } from "./db";
import yoctoSpinner from "yocto-spinner";

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
  const spinner = yoctoSpinner({ text: "Converting exercises..." }).start();

  const hevyAPI = initializeAPI();

  const csvContent = await Bun.file(filePath).text();

  const exerciseData = fitbodDataToGeneralExercises(CSVtoJSON(csvContent));

  const workoutBuilder = new WorkoutBuilder(exerciseData, hevyAPI);

  const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();

  Bun.file("hevy-workouts.json").write(JSON.stringify(workouts, null, 2));
  spinner.success("Your workouts have been saved to hevy-workouts.json");
}

export async function publish(filePath: string) {
  const spinner = yoctoSpinner({ text: "Publishing workout..." }).start();
  const hevyAPI = initializeAPI();
  const publisher = new WorkoutPublisher(hevyAPI);
  const workout = JSON.parse(await Bun.file(filePath).text());

  try {
    await publisher.publishOneWorkout(workout);
    spinner.success("Your workout has been published to your Hevy account");
  } catch (error) {
    spinner.error("Error publishing workout");
    console.error(error);
  }
}

export async function bulkPublish(filePath: string) {
  const spinner = yoctoSpinner({ text: "Publishing workouts..." }).start();
  const hevyAPI = initializeAPI();

  const publisher = new WorkoutPublisher(hevyAPI);
  const workouts = JSON.parse(await Bun.file(filePath).text());

  try {
    await publisher.bulkPublishWorkouts(workouts);
    spinner.success("Workouts have been published to your Hevy account");
  } catch (error) {
    spinner.error("Error publishing workouts");
    console.error(error);
  }
}

export async function convertAndPublish(filePath: string) {
  const spinner = yoctoSpinner({
    text: "Converting exercises to Hevy workouts...",
  }).start();
  const hevyAPI = initializeAPI();
  const csvContent = await Bun.file(filePath).text();

  const exerciseData = fitbodDataToGeneralExercises(CSVtoJSON(csvContent));
  const workoutBuilder = new WorkoutBuilder(exerciseData, hevyAPI);
  const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();

  spinner.text = "Publishing Hevy workouts...";
  const publisher = new WorkoutPublisher(hevyAPI);

  try {
    await publisher.bulkPublishWorkouts(workouts);
    spinner.success("Workouts have been published to your Hevy account");
  } catch (error) {
    spinner.error("Error publishing workouts");
    console.error(error);
  }
}
