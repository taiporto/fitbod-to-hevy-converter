import { HevyAPI } from "./../lib/hevy/api";
import { CSVtoJSON } from "../utils/parsers/CSVtoJSON";
import { originalDataToGeneralExercises } from "../utils/parsers/fitbodToHevyExersises";
import { WorkoutBuilder } from "../main/hevy/workoutBuilder";
import { WorkoutPublisher } from "../main/hevy/workoutPublisher";
import {
  delete_custom_equivalences,
  save_api_key,
  save_equivalence,
  use_api_key,
} from "./db";
import yoctoSpinner from "yocto-spinner";
import chalk from "chalk";

function initializeAPI() {
  try {
    const hevyAPIKey = use_api_key();
    return new HevyAPI(hevyAPIKey);
  } catch (err) {
    console.log(
      chalk.red("API Key not found. Set an API key with ") +
        chalk.red.underline("hevy-toolbox set-api-key <apiKey>")
    );
    process.exit(1);
  }
}

export async function setAPIKey(APIKey: string) {
  const spinner = yoctoSpinner({ text: "Setting API key..." }).start();
  try {
    save_api_key(APIKey);
    spinner.success("API Key has been saved");
  } catch (err) {
    console.error(err);
    spinner.error("Unable to save API Key");
  }
}

export async function convert(filePath: string) {
  const spinner = yoctoSpinner({ text: "Converting exercises..." }).start();

  const hevyAPI = initializeAPI();

  const csvContent = await Bun.file(filePath).text();

  const exerciseData = originalDataToGeneralExercises(CSVtoJSON(csvContent));

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

  const exerciseData = originalDataToGeneralExercises(CSVtoJSON(csvContent));
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

export async function saveCustomEquivalence(
  originalName: string,
  hevyName: string
) {
  const spinner = yoctoSpinner({
    text: "Saving custom equivalence...",
  }).start();

  try {
    save_equivalence(originalName, hevyName, true);
    spinner.success("Custom equivalence saved");
  } catch (error) {
    spinner.error("Error saving custom equivalence");
    console.error(error);
  }
}

export async function saveCustomEquivalenceInBulk(filePath: string) {
  const spinner = yoctoSpinner({
    text: "Saving custom equivalences...",
  }).start();

  const jsonContent = JSON.parse(await Bun.file(filePath).text()) as {
    originalName: string;
    hevyName: string;
  }[];

  try {
    jsonContent.forEach(({ originalName, hevyName }) => {
      save_equivalence(originalName, hevyName, true);
    });
    spinner.success("Custom equivalences saved");
  } catch (error) {
    spinner.error("Error saving custom equivalences");
    console.error(error);
  }
}

export async function clearCustomEquivalences() {
  const spinner = yoctoSpinner({
    text: "Clearing custom equivalences...",
  }).start();

  try {
    delete_custom_equivalences();
    spinner.success("Custom equivalences cleared");
  } catch (error) {
    spinner.error("Error clearing custom equivalences");
    console.error(error);
  }
}