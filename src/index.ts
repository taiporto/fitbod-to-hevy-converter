#! /usr/bin/env bun
import "./cli/command.ts";
import {
  drop_tables,
  exercise_equivalence_table_query,
  keys_table_query,
  save_equivalence,
  set_unique_key_name,
} from "./cli/db.ts";
import { EXERCISE_NAME_MAPPING } from "./constants.ts";

keys_table_query.run();
set_unique_key_name.run();
exercise_equivalence_table_query.run();

Object.entries(EXERCISE_NAME_MAPPING).forEach(([original_name, hevy_name]) => {
  save_equivalence(original_name, hevy_name, false);
});