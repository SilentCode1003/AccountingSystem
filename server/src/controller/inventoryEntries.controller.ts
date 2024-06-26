import { Request, Response } from "express";
import {
  addInventoryEntry,
  editInventoryEntry,
  getAllInventoryEntries,
} from "../database/services/inventoryEntries.service";
import {
  createValidator,
  updateValidator,
} from "../utils/validators/inventoryEntries.validator";
import path from "path";
import db from "../database";

export const getInventoryEntries = async (req: Request, res: Response) => {
  try {
    const inventoryEntries = await getAllInventoryEntries(db);
    console.log("successfully fetched all inventory entries");
    return res.status(200).send({ inventoryEntries });
  } catch (error) {
    console.log("error in fetching all inventory entries");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const createInventoryEntry = async (req: Request, res: Response) => {
  console.log("test");
  const input = createValidator.safeParse({
    ...req.body,
    iepProducts: Array.isArray(req.body.iepProducts)
      ? req.body.iepProducts
      : [req.body.iepProducts],
    invEntryFile: req.files?.invEntryFile,
    invEntryDate: new Date(req.body.invEntryDate).toISOString(),
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors });
  try {
    const newInventoryEntry = await addInventoryEntry(db, {
      ...input.data,
      invEntryTranFileMimeType:
        input.data.invEntryFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.invEntryFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${newInventoryEntry?.invEntryTranId}.${
          input.data.invEntryFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );

    console.log("successfully created inventory entry");
    return res.status(200).send({ inventoryEntry: newInventoryEntry });
    // return res.status(400).send({ input: input.data });
  } catch (error) {
    const err = error as Error;

    if (err.message.includes("Not enough stocks"))
      return res.status(400).send({
        error: err.message,
      });
    console.log("error in creating inventory entry");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
export const updateInventoryEntry = async (req: Request, res: Response) => {
  const input = updateValidator.safeParse({
    ...req.body,
    iepProducts: Array.isArray(req.body.iepProducts)
      ? req.body.iepProducts
      : [req.body.iepProducts],
    invEntryFile: req.files?.invEntryFile,
    invEntryDate: new Date(req.body.invEntryDate).toISOString(),
  });

  if (!input.success)
    return res.status(400).send({ error: input.error.errors[0].message });

  try {
    const updatedInventoryEntry = await editInventoryEntry(db, {
      ...input.data,
      invEntryTranFileMimeType:
        input.data.invEntryFile &&
        input.data.invEntryFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ? "xlsx"
          : "pdf",
    });
    input.data.invEntryFile?.mv(
      path.join(
        __dirname,
        "..",
        "..",
        "files/transactionfiles",
        `${updatedInventoryEntry?.invEntryTranId}.${
          input.data.invEntryFile.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? "xlsx"
            : "pdf"
        }`
      )
    );
    console.log("successfully updated inventory entry");
    return res.status(200).send({ inventoryEntry: updatedInventoryEntry });
  } catch (error) {
    const err = error as Error;

    if (err.message.includes("Not enough stocks"))
      return res.status(400).send({
        error: err.message,
      });
    console.log("error in updating inventory entry");
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
};
