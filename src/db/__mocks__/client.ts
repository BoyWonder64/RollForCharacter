import initSqlJs, {
  type BindParams,
  type Database as SqlJsDatabase,
} from "sql.js";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "../schema";
import { CREATE_TABLES_SQL } from "../schemaSql";

let dbPromise: Promise<SqlJsDatabase> | null = null;

function getSqlJsDb(): Promise<SqlJsDatabase> {
  if (!dbPromise) {
    dbPromise = initSqlJs().then((SQL) => {
      const database = new SQL.Database();
      database.run("PRAGMA foreign_keys = ON;");
      database.run(CREATE_TABLES_SQL);
      return database;
    });
  }
  return dbPromise;
}

export const db = drizzle(
  async (sql, params, method) => {
    const sqlJsDb = await getSqlJsDb();
    const statement = sqlJsDb.prepare(sql);
    try {
      statement.bind(params as BindParams);
      const rows: unknown[][] = [];
      while (statement.step()) {
        rows.push(statement.get());
      }
      if (method === "get") {
        return { rows: (rows[0] as unknown[]) ?? [] };
      }
      return { rows };
    } finally {
      statement.free();
    }
  },
  { schema }
);
