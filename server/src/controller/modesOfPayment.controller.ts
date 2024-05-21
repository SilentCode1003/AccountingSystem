import { Request, Response } from "express";
import {
  addModeOfPayment,
  editModeOfPayment,
} from "../database/services/modesOfPayment.service";
import {
  changeModeOfPaymentIsActive,
  getAllModesOfPayment,
} from "../database/services/modesOfPayment.service";
import {
  createValidator,
  toggleIsActiveValidator,
  updateValidator,
} from "../utils/validators/modesOfPayment.validator";

export const getModesOfPayments = async (req: Request, res: Response) => {
  try {
    const modesOfPayment = await getAllModesOfPayment();
    console.log("successfully fetched all modes of payment");
    return res.status(200).send({ modesOfPayment });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const createModeOfPayment = async (req: Request, res: Response) => {
  const input = createValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });
  try {
    const modeOfPayment = await addModeOfPayment(input.data);
    console.log("successfully created an mode of payment");
    return res.status(200).send({ modeOfPayment });
  } catch (error) {
    console.log("error creating an mode of payment");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const updateModeOfPayment = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse(req.body);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });
  try {
    const modeOfPayment = await editModeOfPayment(input.data);
    console.log("successfully updated an mode of payment");
    return res.status(200).send({ modeOfPayment });
  } catch (error) {
    console.log("error updating an mode of payment");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};

export const toggleModeOfPaymentIsActive = async (
  req: Request,
  res: Response
) => {
  const input = toggleIsActiveValidator.safeParse(req.params);

  if (!input.success)
    return res.status(400).send({
      error: input.error.errors[0].message,
    });

  try {
    const updatedModeOfPayment = await changeModeOfPaymentIsActive(input.data);
    console.log("successfully toggled a mode of payment");
    return res.status(200).send({ transactionType: updatedModeOfPayment });
  } catch (error) {
    console.log("error toggling a mode of payment");
    console.log(error);
    return res.status(500).send({
      error: "Server error",
    });
  }
};
