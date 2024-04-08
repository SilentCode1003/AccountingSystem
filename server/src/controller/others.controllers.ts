import { Request, Response } from "express";
import { getAllEmployees } from "../database/services/employees.service";
import { getAllCustomers } from "../database/services/customers.service";
import { getAllVendors } from "../database/services/vendors.service";

export const getTransactionPartners = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    const customers = await getAllCustomers();
    const vendors = await getAllVendors();

    return res.status(200).send({
      employees,
      customers,
      vendors,
    });
  } catch (error) {
    return res.status(500).send({
      error: "Server error",
    });
  }
};
