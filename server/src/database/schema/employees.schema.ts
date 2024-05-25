import { date, decimal, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const employees = mysqlTable("employees", {
  empId: varchar("emp_id", { length: 60 }).primaryKey(),
  empName: varchar("emp_name", { length: 50 }),
  empContactInfo: varchar("emp_contact_info", { length: 15 }).notNull(),
  empEmail: varchar("emp_email", { length: 50 }).notNull().default(""),
  empJobStatus: varchar("emp_job_status", { length: 50 }).notNull(),
  empDepartment: varchar("emp_department", { length: 50 }).notNull(),
  empPosition: varchar("emp_position", { length: 50 }).notNull(),
  empDateHired: date("emp_date_hired").notNull(),
  empDateTerminated: date("emp_date_terminated"),
  empSalary: decimal("emp_salary", { precision: 13, scale: 2 })
    .$type<number>()
    .notNull()
    .default(15000.0),
});

export default employees;
