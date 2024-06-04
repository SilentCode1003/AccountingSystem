import "dotenv/config";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { MySqlDatabase, MySqlTransaction } from "drizzle-orm/mysql-core";
import {
  drizzle,
  MySql2PreparedQueryHKT,
  MySql2QueryResultHKT,
} from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import schema from "./schema/schema";

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const db = drizzle(connection, {
  schema,
  mode: "default",
});

db.transaction;

export type DBTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type Database = MySqlDatabase<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof schema
>;

export type DB = DBTransaction | Database;

export default db;
