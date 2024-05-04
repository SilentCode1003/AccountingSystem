import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

const apiKeys = mysqlTable("api_key_store", {
  aksId: varchar("aks_id", { length: 60 }).primaryKey().notNull(),
  aksUserName: varchar("aks_user_name", { length: 60 }).notNull().unique(),
  aksHashedKey: varchar("aks_hashed_key", { length: 60 }).notNull().unique(),
});

export default apiKeys;
