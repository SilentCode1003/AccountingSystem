import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

const accountTypes = mysqlTable("account_types", {
  accTypeId: varchar("acc_type_id", { length: 60 }).primaryKey().notNull(),
  accTypeName: varchar("acc_type_name", { length: 60 }).notNull().unique(),
});
export default accountTypes;
