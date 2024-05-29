import { Request, Response } from "express";
import { getAllBudgets } from "../database/services/budgets.service";

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
