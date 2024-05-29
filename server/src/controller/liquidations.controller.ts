import { Request, Response } from "express";
import { getAllLiquidations } from "../database/services/liquidations.service";

export const getLiquidations = async (req: Request, res: Response) => {
  try {
    const liquidations = await getAllLiquidations();
    console.log("successfully fetched all liquidations");
    return res.status(200).send({ liquidations });
  } catch (error) {
    console.log("error in fetching all liquidations");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
