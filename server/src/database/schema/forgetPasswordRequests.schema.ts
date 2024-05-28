import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const forgetPasswordRequests = mysqlTable("forget_password_requests", {
  id: varchar("id", { length: 60 }).primaryKey(),
  userId: varchar("user_id", { length: 60 }).notNull(),
  timeRequested: datetime("time_requested").notNull(),
});

export default forgetPasswordRequests;
