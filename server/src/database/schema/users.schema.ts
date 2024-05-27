import {
  boolean,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

const users = mysqlTable("users", {
  userId: varchar("user_id", { length: 60 }).primaryKey(),
  userType: mysqlEnum("user_type", ["FINANCE", "HIGHER_DEPARTMENT"]),
  userUsername: varchar("user_username", { length: 16 }).notNull().unique(),
  userFullName: varchar("user_fullname", { length: 50 }).notNull(),
  userProfilePic: text("user_profile_pic").notNull().default("default-img.png"),
  userContactNumber: varchar("user_contact_number", { length: 15 }).notNull(),
  userPassword: varchar("user_password", { length: 60 }).notNull(),
  userIsActive: boolean("user_is_active").notNull().default(true),
});

export default users;
