import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { bulkPublish, convert, publish } from "./handler";

yargs(hideBin(process.argv))
  .command(
    "convert <fitbodFilePath>",
    "Converts a Fitbod CSV file to an organized Hevy workout JSON file",
    (yargs) =>
      yargs.positional("fitbodFilePath", {
        description: "Path to the Fitbod exercise CSV file",
        type: "string",
      }),
    (argv) => convert(argv.file as string)
  )
  .command(
    "publish <workoutFilePath>",
    "Publishes a single workout from a JSON file to your Hevy account",
    (yargs) =>
      yargs.positional("workoutFilePath", {
        description: "Path to the JSON file containing the single Hevy workout",
        type: "string",
      }),
    (argv) => publish(argv.workoutFile as string)
  )
  .command(
    "bulk-publish <workoutFilePath>",
    "Publishes the workouts in the given JSON file to your Hevy account",
    (yargs) =>
      yargs.positional("workoutFilePath", {
        description: "Path to the JSON file containing the Hevy workouts",
        type: "string",
      }),
    (argv) => bulkPublish(argv.workoutFile as string)
  )
  .command(
    "convert-and-publish <fitbodFilePath>",
    "Converts a CSV file of Fitbod exercises to Hevy workouts and publishes the converted workouts to your Hevy account",
    (yargs) =>
      yargs.positional("fitbodFilePath", {
        description: "Path to the Fitbod exercise CSV file",
        type: "string",
      }),
    (argv) => bulkPublish(argv.workoutFile as string)
  )
  .parse();
