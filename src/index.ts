import { CSVtoJSON } from "./utils/parsers/CSVtoJSON";
import { fitbodDataToGeneralExercises } from "./utils/parsers/fitbodToHevyExersises";
import { WorkoutBuilder } from "./main/hevy/workoutBuilder";

const fitbodFile = Bun.file("src/assets/fitbod_workout_data.csv");

const exerciseData = fitbodDataToGeneralExercises(
  CSVtoJSON(await fitbodFile.text())
);

const workoutBuilder = new WorkoutBuilder(exerciseData);

const workouts = await workoutBuilder.buildWorkoutsFromGeneralExercises();

console.log(workouts);