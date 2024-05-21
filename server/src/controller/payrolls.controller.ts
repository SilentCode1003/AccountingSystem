import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import path from "path";
import * as xlsx from "xlsx";
import db from "../database";
import employees from "../database/schema/employees.schema";
import modesOfPayment from "../database/schema/modeOfPayment";
import {
  addPayroll,
  editPayroll,
  getAllPayrolls,
} from "../database/services/payroll.service";
import {
  createPayrollByFileValidator,
  createValidator,
  updateValidator,
} from "../utils/validators/payrolls.validator";

export const getPayrolls = async (req: Request, res: Response) => {
  try {
    const payrolls = await getAllPayrolls();
    console.log("successfully fetched all payrolls");
    return res.status(200).send({
      payrolls,
    });
  } catch (error) {
    console.log("error in fetching all payrolls");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createPayroll = async (req: Request, res: Response) => {
  const input = createValidator.safeParse({
    ...req.body,
    prTotalDeduction: parseFloat(req.body.prTotalDeduction),
    prDateFrom: new Date(req.body.prDateFrom).toISOString(),
    prDateTo: new Date(req.body.prDateTo).toISOString(),
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

    console.log("successfully created new payroll");
    return res.status(200).send({ payroll: newPayroll });
  } catch (error) {
    console.log(error);
    console.log("error creating new payroll");
    return res.status(500).send({ error: "Server error" });
  }
};
export const updatePayroll = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse({
    ...req.body,
    prFile: req.files?.prFile,
    prTotalDeduction: parseFloat(req.body.prTotalDeduction),
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0] });

  try {
    const updatedPayroll = await editPayroll({
      ...input.data,
      prTranFileMimeType:
        input.data.prFile &&
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

    console.log("successfully updated payroll");
    return res.status(200).send({ payroll: updatedPayroll });
  } catch (error) {
    console.log("error updating an payroll");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const createPayrollByFile = async (req: Request, res: Response) => {
  if (!req.files?.prFile)
    return res.status(400).send({ error: "No file uploaded" });

  const validateFile = createPayrollByFileValidator.safeParse({
    prFile: req.files!.prFile,
  });

  if (!validateFile.success)
    return res
      .status(400)
      .send({ error: validateFile.error.errors[0].message });
  try {
    const file = validateFile.data.prFile;

    const f = xlsx.read(file.data, { type: "buffer" }).Sheets["Sheet1"];

    const shapeDataToDB: Array<{
      empId: string;
      empName: string;
      prSalary: number;
      prTotalDeductions: number;
      prDateFrom: Date;
      prDateTo: Date;
      prMopName: string;
    }> = xlsx.utils.sheet_to_json(f, {
      header: [
        "empId",
        "empName",
        "empSalary",
        "prTotalDeductions",
        "prDateFrom",
        "prDateTo",
        "prMopName",
      ],
    });

    shapeDataToDB.shift();

    const newMultiFileName = `multiFile ${crypto.randomUUID()}`;

    const newPayrolls = await Promise.all(
      shapeDataToDB.map(async (pr) => {
        //check if employee exists
        const empExists = await db.query.employees.findFirst({
          where: eq(employees.empId, pr.empId),
        });

        //early return if employee does not exist
        if (!empExists) throw new Error("Employee does not exists");

        const modeOfPayment = await db.query.modesOfPayment.findFirst({
          where: eq(modesOfPayment.mopName, pr.prMopName),
        });

        if (!modeOfPayment) throw new Error("Mode of payment does not exists");

        //insert payroll
        const newPayroll = await addPayroll({
          prDateFrom: new Date(pr.prDateFrom),
          prDateTo: new Date(pr.prDateTo),
          prEmployeeId: pr.empId,
          prMopId: modeOfPayment.mopId,
          prTranFileMimeType: "xlsx",
          prTotalDeduction: pr.prTotalDeductions,
          prFileName: newMultiFileName,
        });

        return newPayroll;
      })
    );

    file.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newMultiFileName}.xlsx`
      )
    );

    console.log("successfully created payrolls by file");
    return res.send({ payrolls: newPayrolls });
  } catch (error) {
    console.log("error creating payrolls by file");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
