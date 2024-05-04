import { Request, Response } from "express";
import {
  addPayroll,
  editPayroll,
  getAllPayrolls,
} from "../database/services/payroll.service";
import {
  createValidator,
  updateValidator,
} from "../utils/validators/payrolls.validator";
import path from "path";

export const getPayrolls = async (req: Request, res: Response) => {
  try {
    const payrolls = await getAllPayrolls();
    return res.status(200).send({
      payrolls,
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};
export const createPayroll = async (req: Request, res: Response) => {
  const input = createValidator.safeParse({
    ...req.body,
    prTotalDeduction: parseFloat(req.body.prTotalDeduction),
    prFile: req.files!.prFile,
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const newPayroll = await addPayroll({
      ...input.data,
      prTranFileMimeType:
        input.data.prFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.prFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newPayroll?.prTranId}.${
          input.data.prFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );
    return res.status(200).send({ payroll: newPayroll });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updatePayroll = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse({
    ...req.body,
    prFile: req.files!.prFile,
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0] });

  try {
    const updatedPayroll = await editPayroll({
      ...input.data,
      prTranFileMimeType:
        input.data.prFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.prFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${updatedPayroll?.prTranId}.${
          input.data.prFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );
    return res.status(200).send({ payroll: updatedPayroll });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
