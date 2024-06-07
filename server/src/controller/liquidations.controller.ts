import { Request, Response } from "express";
import { getAllLiquidations } from "../database/services/liquidations.service";
import db from "../database";
import { and, desc, eq, getTableColumns, sql, sum } from "drizzle-orm";
import employees from "../database/schema/employees.schema";
import liquidations from "../database/schema/Liquidation.schema";

export const getLiquidations = async (req: Request, res: Response) => {
  try {
    const liquidations = await getAllLiquidations(db);
    console.log("successfully fetched all liquidations");
    return res.status(200).send({ liquidations });
  } catch (error) {
    console.log("error in fetching all liquidations");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const getEmployeeLiquidations = async (req: Request, res: Response) => {
  const date = new Date(req.query.date as string);
  try {
    let employeeLiquidations: Array<{
      employee: {
        empId: string;
        empName: string | null;
      };
      amount: string | null;
    }> = [];

    if (!req.query.date) {
      employeeLiquidations = await db
        .select({
          employee: {
            empName: getTableColumns(employees).empName,
            empId: getTableColumns(employees).empId,
          },
          amount: sum(liquidations.liquidationAmount),
        })
        .from(liquidations)
        .groupBy(liquidations.liquidationEmpId)
        .orderBy(({ amount }) => desc(amount))
        .innerJoin(
          employees,
          eq(employees.empId, liquidations.liquidationEmpId)
        );
    } else {
      employeeLiquidations = await db
        .select({
          employee: {
            empName: getTableColumns(employees).empName,
            empId: getTableColumns(employees).empId,
          },
          amount: sum(liquidations.liquidationAmount),
        })
        .from(liquidations)
        .where(
          and(
            eq(sql`month(liquidation_date)`, date.getMonth() + 1),
            eq(sql`year(liquidation_date)`, date.getFullYear())
          )
        )
        .groupBy(liquidations.liquidationEmpId)
        .innerJoin(
          employees,
          eq(employees.empId, liquidations.liquidationEmpId)
        );
    }

    console.log("successfully fetched all employee liquidations");
    return res.status(200).send({
      employeeLiquidations,
    });
  } catch (error) {
    console.log("error in fetching all employee liquidations");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
