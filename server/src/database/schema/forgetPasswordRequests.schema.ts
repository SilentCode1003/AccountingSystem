import {
  AnyMySqlColumn,
  datetime,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import users from "./users.schema";

const forgetPasswordRequests = mysqlTable("forget_password_requests", {
  id: varchar("id", { length: 60 }).primaryKey(),
  userId: varchar("user_id", { length: 60 })
    .references((): AnyMySqlColumn => users.userId, {
      onDelete: "cascade",
    })
    .notNull(),
  timeRequested: datetime("time_requested").notNull(),
});

export default forgetPasswordRequests;
