#! /usr/bin/env bun
import "./cli/command.ts";
import {
  exercise_equivalence_table_query,
  keys_table_query,
  save_custom_equivalence,
} from "./cli/db.ts";
import { EXERCISE_NAME_MAPPING } from "./constants.ts";

keys_table_query.run();
exercise_equivalence_table_query.run();

Object.entries(EXERCISE_NAME_MAPPING).forEach(([original_name, hevy_name]) => {
  save_custom_equivalence(original_name, hevy_name);
});
