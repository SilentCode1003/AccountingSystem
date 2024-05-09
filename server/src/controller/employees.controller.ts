import { Request, Response } from "express";
import {
  addEmployee,
  editEmployee,
  fireEmployee,
  getAllEmployees,
} from "../database/services/employees.service";
import {
  createValidator,
  terminateEmpValidator,
  updateValidator,
} from "../utils/validators/employees.validator";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();

    console.log("successfully fetched all employees");
    return res.status(200).send({ employees });
  } catch (error) {
    console.log("error in fetching all employees");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createEmployee = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const newEmployee = await addEmployee(input.data);
    console.log("successfully created an employee");
    return res.status(200).send({ employee: newEmployee });
  } catch (error) {
    console.log("error creating an employee");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateEmployee = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const updatedEmployee = await editEmployee(input.data);
    console.log("successfully updated an employee");
    return res.status(200).send({
      employee: updatedEmployee,
    });
  } catch (error) {
    console.log(" error in updating an employee");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const terminateEmployee = async (req: Request, res: Response) => {
  const input = terminateEmpValidator.safeParse(req.params);

  if (!input.success) return res.status(400).send({ error: "invalid input" });

  try {
    const terminatedEmployee = await fireEmployee(input.data);
    console.log(" error in updating an employee");
    return res.status(200).send({ employee: terminatedEmployee });
  } catch (error) {
    console.log("error in updating an employee");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
