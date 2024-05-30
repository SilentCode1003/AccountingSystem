import { Request, Response } from "express";
import { getAllBudgets } from "../database/services/budgets.service";
import db from "../database";
import { getTableColumns, sql, sum, and, eq } from "drizzle-orm";
import employees from "../database/schema/employees.schema";
import budgets from "../database/schema/Budget.schema";
import { desc } from "drizzle-orm";

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await getAllBudgets();
    console.log("successfully fetched all budgets");
    return res.status(200).send({ budgets });
  } catch (error) {
    console.log("error in fetching all budgets");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const getEmployeeBudgets = async (req: Request, res: Response) => {
  const date = new Date(req.query.date as string);
  try {
    let employeeBudgets: Array<{
      employee: {
        empId: string;
        empName: string | null;
      };
      amount: string | null;
    }> = [];

    if (!req.query.date) {
      employeeBudgets = await db
        .select({
          employee: {
            empName: getTableColumns(employees).empName,
            empId: getTableColumns(employees).empId,
          },
          amount: sum(budgets.budgetAmount),
        })
        .from(budgets)
        .groupBy(budgets.budgetEmpId)
        .orderBy(({ amount }) => desc(amount))
        .innerJoin(employees, eq(employees.empId, budgets.budgetEmpId));
    } else {
      employeeBudgets = await db
        .select({
          employee: {
            empName: getTableColumns(employees).empName,
            empId: getTableColumns(employees).empId,
          },
          amount: sum(budgets.budgetAmount),
        })
        .from(budgets)
        .where(
          and(
            eq(sql`month(budget_date)`, date.getMonth() + 1),
            eq(sql`year(budget_date)`, date.getFullYear())
          )
        )
        .groupBy(budgets.budgetEmpId)
        .innerJoin(employees, eq(employees.empId, budgets.budgetEmpId));
    }

    console.log("successfully fetched all employee budgets");
    return res.status(200).send({
      employeeBudgets,
    });
  } catch (error) {
    console.log("error in fetching all employee budgets");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
