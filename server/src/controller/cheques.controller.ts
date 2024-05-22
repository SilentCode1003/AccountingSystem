import { Request, Response } from "express";
import {
  addCheque,
  editCheque,
  getAllCheques,
  getChequeById,
  incrementChequeApproval,
  setChequeStatus,
} from "../database/services/cheques.service";
import {
  approveChequeValidator,
  createChequeByFileValidator,
  createValidator,
  updateValidator,
} from "../utils/validators/cheques.validator";
import path from "path";
import xlsx from "xlsx";
import db from "../database";
import modesOfPayment from "../database/schema/modeOfPayment";
import { eq } from "drizzle-orm";
import accountTypes from "../database/schema/accountType.schema";
import crypto from "crypto";

export const getCheques = async (req: Request, res: Response) => {
  try {
    const cheques = await getAllCheques();
    console.log("successfully fetched all cheques");
    return res.status(200).send({ cheques });
  } catch (error) {
    console.log("error in fetching all cheques");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createCheque = async (req: Request, res: Response) => {
  const input = createValidator.safeParse({
    ...req.body,
    chqFile: req.files!.chqFile,
    chqAmount: parseFloat(req.body.chqAmount),
    chqIssueDate: new Date(req.body.chqIssueDate).toISOString(),
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const newCheque = await addCheque({
      ...input.data,
      chqTranFileMimeType:
        input.data.chqFile &&
        input.data.chqFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.chqFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newCheque?.chqTranId}.${
          input.data.chqFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );

    console.log("successfully created new cheque");
    return res.status(200).send({ cheque: newCheque });
  } catch (error) {
    console.log("error creating new cheque");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateCheque = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse({
    ...req.body,
    chqFile: req.files?.chqFile,
    chqAmount: req.body.chqAmount && parseFloat(req.body.chqAmount),
    chqIssueDate: new Date(req.body.chqIssueDate).toISOString(),
  });
  if (!input.success) return res.status(400).send({ error: input.error });

  try {
    const updatedChq = await editCheque({
      ...input.data,
      chqTranFileMimeType:
        input.data.chqFile &&
        input.data.chqFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.chqFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${updatedChq?.chqTranId}.${
          input.data.chqFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );
    console.log("successfully updated cheque");
    return res.status(200).send({ cheque: updatedChq });
  } catch (error) {
    console.log("error updating cheque");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const approveCheque = async (req: Request, res: Response) => {
  const input = approveChequeValidator.safeParse(req.params);

  if (!input.success) return res.status(400).send({ error: "invalid inputs" });
  try {
    const chq = await getChequeById(input.data.chqId);

    if (!chq) return res.status(404).send({ error: "Cheque not found" });

    if (chq.chqStatus === "APPROVED") {
      console.log("Cheque already approved");
      return res.status(200).send({ cheque: chq });
    }

    const incrementedChq = await incrementChequeApproval(input.data.chqId);

    if (incrementedChq!.chqApprovalCount >= 3) {
      const updatedChq = await setChequeStatus(input.data.chqId, "APPROVED");
      console.log("Set cheque status to approved");

      return res.status(200).send({ cheque: updatedChq });
    }
    console.log("successfully incremented cheque");
    return res.status(200).send({ cheque: incrementedChq });
  } catch (error) {
    console.log("error in incrementing cheque status cheque");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};

export const createChequeByFile = async (req: Request, res: Response) => {
  if (!req.files?.chqFile)
    return res.status(400).send({ error: "No file uploaded" });

  const validateFile = createChequeByFileValidator.safeParse({
    chqFile: req.files!.chqFile,
  });

  if (!validateFile.success)
    return res
      .status(400)
      .send({ error: validateFile.error.errors[0].message });
  try {
    const file = validateFile.data.chqFile;

    const f = xlsx.read(file.data, { type: "buffer" }).Sheets["Sheet1"];

    const shapeDataToDB: Array<{
      chqPayeeName: string;
      chqAmount: number;
      chqIssueDate: Date;
      chqStatus: "PENDING" | "APPROVED" | "REJECTED";
      chqNumber: string;
      chqMopName: string;
      chqAccType: string;
    }> = xlsx.utils.sheet_to_json(f, {
      header: [
        "chqPayeeName",
        "chqAmount",
        "chqIssueDate",
        "chqStatus",
        "chqNumber",
        "chqMopName",
        "chqAccType",
      ],
    });

    shapeDataToDB.shift();

    const newMultiFileName = `multiFile ${crypto.randomUUID()}`;

    const newCheques = await Promise.all(
      shapeDataToDB.map(async (chq) => {
        const modeOfPayment = await db.query.modesOfPayment.findFirst({
          where: eq(modesOfPayment.mopName, chq.chqMopName),
        });
        const accType = await db.query.accountTypes.findFirst({
          where: eq(accountTypes.accTypeName, chq.chqAccType),
        });

        if (!modeOfPayment) throw new Error("Mode of payment does not exists");
        if (!accType) throw new Error("Account type does not exists");

        const newChq = await addCheque({
          chqAccTypeId: accType?.accTypeId as string,
          chqAmount: chq.chqAmount,
          chqIssueDate: new Date(
            Math.round((Number(chq.chqIssueDate) - 25569) * 86400 * 1000)
          ),
          chqNumber: chq.chqNumber,
          chqPayeeName: chq.chqPayeeName,
          chqFileName: newMultiFileName,
          chqStatus: chq.chqStatus,
          chqMopId: modeOfPayment?.mopId as string,
          chqTranFileMimeType: "xlsx",
        });
        return newChq;
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

    console.log("successfully created cheques by file");
    return res.send({ cheques: newCheques });
  } catch (error) {
    console.log("error creating cheques by file");
    console.log(error);

    if (error instanceof Error && error.message.includes("already exists"))
      return res.status(400).send({
        error: error.message,
      });
    return res.status(500).send({ error: "Server error" });
  }
};
