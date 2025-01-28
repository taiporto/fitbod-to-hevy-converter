#! /usr/bin/env bun
import "./cli/command.ts";
import { keys_table_query } from "./cli/db.ts";

keys_table_query.run();
