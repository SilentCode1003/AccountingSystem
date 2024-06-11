import { eq } from "drizzle-orm";
import employees from "../schema/employees.schema";
import { editPayroll } from "./payroll.service";
import { DB } from "..";

export const getAllEmployees = async (db: DB) => {
  const employees = await db.query.employees.findMany();

  return employees;
};

export const getEmployeeByName = async (db: DB, empName: string) => {
  const employee = await db.query.employees.findFirst({
    where: eq(employees.empName, empName),
  });

  return employee;
};

export const addEmployee = async (
  db: DB,
  input: {
    empId: string;
    empName: string;
    empContactInfo: string;
    empEmail: string;
    empDateHired: Date;
    empSalary: number;
    empJobStatus: string;
    empDepartment: string;
    empPosition: string;
  }
) => {
  await db.insert(employees).values(input);

  const newEmployee = await db.query.employees.findFirst({
    where: (employee) => eq(employee.empId, input.empId),
  });

  return newEmployee;
};

export const editEmployee = async (
  db: DB,
  input: {
    empId: string;
    newData: {
      empName?: string;
      empContactInfo?: string;
      empEmail?: string;
      empDateHired?: Date;
      empDateTerminated?: Date;
      empJobStatus?: string;
      empDepartment?: string;
      empPosition?: string;
      empSalary?: number;
    };
  }
) => {
  const prevValues = await db.query.employees.findFirst({
    where: (emp) => eq(emp.empId, input.empId),
  });

  await db
    .update(employees)
    .set(input.newData)
    .where(eq(employees.empId, input.empId));

  const editedEmployee = await db.query.employees.findFirst({
    where: (emp) => eq(emp.empId, input.empId),
  });

  if (Number(prevValues?.empSalary) !== input.newData.empSalary) {
    const payrollIds = await db.query.payrolls.findMany({
      where: (payroll) => eq(payroll.prEmployeeId, input.empId),
    });
    for (const payroll of payrollIds) {
      await editPayroll(db, {
        prId: payroll.prId,
        prTranId: payroll.prTranId,
        prTotalDeduction: payroll.prTotalDeduction,
        prEmployeeId: payroll.prEmployeeId,
      });
    }
  }

  return editedEmployee;
};

export const fireEmployee = async (db: DB, input: { empId: string }) => {
  await db
    .update(employees)
    .set({ empDateTerminated: new Date() })
    .where(eq(employees.empId, input.empId));

  const firedEmployee = await db.query.employees.findFirst({
    where: (emp) => eq(emp.empId, input.empId),
  });

  return firedEmployee;
};
