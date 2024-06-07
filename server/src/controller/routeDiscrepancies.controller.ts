import { Request, Response } from "express";
import { toggleRouteDiscrepancyValidator } from "../utils/validators/others.validator";
import {
  getAllRouteDiscrepancies,
  toggleRouteDiscrepancy,
} from "../database/services/routesDiscrepancy.service";
import db from "../database";

export const getRouteDiscrepancies = async (req: Request, res: Response) => {
  try {
    const routeDiscrepancies = await getAllRouteDiscrepancies(db);
    console.log("successfully fetched all route discrepancies");
    return res.status(200).send({ routeDiscrepancies });
  } catch (error) {
    console.log("error in fetching all route discrepancies");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const toggleRouteDiscrepancyIsResolved = async (
  req: Request,
  res: Response
) => {
  const input = toggleRouteDiscrepancyValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const routeDiscrepancy = await toggleRouteDiscrepancy(db, input.data);

    console.log("successfully toggled route discrepancy");
    return res.status(200).send({ routeDiscrepancy });
  } catch (error) {
    console.log("error in toggling route discrepancy");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
