import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  bulkPublish,
  clearCustomEquivalences,
  convert,
  publish,
  saveCustomEquivalence,
  saveCustomEquivalenceInBulk,
  setAPIKey,
} from "./handler";

yargs(hideBin(process.argv))
  .scriptName("hevy-toolbox")
  .usage("Usage: $0 <command> [options]")
  .command(
    "set-api-key <apiKey>",
    "Sets the API key for the Hevy API",
    (yargs) =>
      yargs.positional("apiKey", {
        description: "Your Hevy API key",
        type: "string",
      }),
    (argv) => setAPIKey(argv.apiKey as string)
  )
  .command(
    "convert <fitbodFilePath>",
    "Converts a Fitbod CSV file to a Hevy workout JSON file",
    (yargs) =>
      yargs.positional("fitbodFilePath", {
        description: "Path to the Fitbod exercise CSV file",
        type: "string",
      }),
    (argv) => convert(argv.fitbodFilePath as string)
  )
  .command(
    "publish <workoutFilePath>",
    "Publishes a single workout from a JSON file to your Hevy account. Requires setting an API key first (check set-api-key)",
    (yargs) =>
      yargs.positional("workoutFilePath", {
        description: "Path to the JSON file containing the single Hevy workout",
        type: "string",
      }),
    (argv) => publish(argv.workoutFilePath as string)
  )
  .command(
    "bulk-publish <workoutFilePath>",
    "Publishes the workouts in the given JSON file to your Hevy account. Requires setting an API key first (check set-api-key)",
    (yargs) =>
      yargs.positional("workoutFilePath", {
        description: "Path to the JSON file containing the Hevy workouts",
        type: "string",
      }),
    (argv) => bulkPublish(argv.workoutFilePath as string)
  )
  .command(
    "convert-and-publish <fitbodFilePath>",
    "Converts a CSV file of Fitbod exercises to Hevy workouts and publishes the converted workouts to your Hevy account. Requires setting an API key first (check set-api-key)",
    (yargs) =>
      yargs.positional("fitbodFilePath", {
        description: "Path to the Fitbod exercise CSV file",
        type: "string",
      }),
    (argv) => bulkPublish(argv.fitbodFilePath as string)
  )
  .command(
    "add-exercise <originalName> <hevyName>",
    "Add an exercise equivalence to the database",
    (yargs) => {
      yargs.positional("originalName", {
        description:
          "The original name of the exercise as it appears in the file to be converted",
        type: "string",
      });
      yargs.positional("hevyName", {
        description:
          "The corresponding name of the exercise in Hevy. Can be a custom name, as long as the custom exercise already exists in your Hevy account",
        type: "string",
      });
    },
    (argv) =>
      saveCustomEquivalence(
        argv.originalName as string,
        argv.hevyName as string
      )
  )
  .command(
    "add-exercises <equivalencesFilePath>",
    "Add multiple exercise equivalences to the database",
    (yargs) => {
      yargs.positional("equivalencesFilePath", {
        description:
          "Path to the JSON file containing the exercise equivalences. The file should be an object where the keys are the original exercise names and the values are the corresponding Hevy exercise names",
        type: "string",
      });
    },
    (argv) => {
      saveCustomEquivalenceInBulk(argv.equivalencesFilePath as string);
    }
  )
  .command(
    "clear-custom-equivalences",
    "Clear all custom exercise equivalences from the database",
    () => {},
    () => clearCustomEquivalences()
  )
  .alias("help", "-h")
  .alias("version", "-v")
  .parse();
