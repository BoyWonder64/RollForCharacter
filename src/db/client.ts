import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";
import { CREATE_TABLES_SQL } from "./schemaSql";

const sqliteDb = openDatabaseSync("rollforcharacter.db");

sqliteDb.execSync("PRAGMA foreign_keys = ON;");
sqliteDb.execSync(CREATE_TABLES_SQL);

export const db = drizzle(sqliteDb, { schema });
