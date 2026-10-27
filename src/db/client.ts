import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";
import { CREATE_TABLES_SQL } from "./schemaSql";
import { runColumnMigrations } from "./migrateColumns";
import { seedSpellsIfNeeded } from "./seedSpells";
import { seedEquipmentItemsIfNeeded } from "./seedEquipmentItems";
import { seedMagicItemsIfNeeded } from "./seedMagicItems";
import { seedMonstersIfNeeded } from "./seedMonsters";
import { seedFeatsIfNeeded } from "./seedFeats";

const sqliteDb = openDatabaseSync("rollforcharacter.db");

sqliteDb.execSync("PRAGMA foreign_keys = ON;");
sqliteDb.execSync(CREATE_TABLES_SQL);
runColumnMigrations(sqliteDb);
seedSpellsIfNeeded(sqliteDb);
seedEquipmentItemsIfNeeded(sqliteDb);
seedMagicItemsIfNeeded(sqliteDb);
seedMonstersIfNeeded(sqliteDb);
seedFeatsIfNeeded(sqliteDb);

export const db = drizzle(sqliteDb, { schema });
