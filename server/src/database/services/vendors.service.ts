import crypto from "crypto";
import vendors from "../schema/vendors.schema";
import { eq, not } from "drizzle-orm";
import { DB } from "..";

export const getAllVendors = async (db: DB) => {
  const vendors = await db.query.vendors.findMany();

  return vendors;
};

export const getVendorByName = async (db: DB, vdName: string) => {
  const vendor = await db.query.vendors.findFirst({
    where: (vendor) => eq(vendor.vdName, vdName),
  });

  return vendor;
};

export const addVendor = async (
  db: DB,
  input: {
    vdName: string;
    vdContactInfo: string;
    vdAddress: string;
    vdEmail: string;
  }
) => {
  const newVendorId = `vdId ${crypto.randomUUID()}`;

  await db.insert(vendors).values({ ...input, vdId: newVendorId });

  const newVendor = await db.query.vendors.findFirst({
    where: (vendor) => eq(vendor.vdId, newVendorId),
  });

  return newVendor;
};

export const editVendor = async (
  db: DB,
  input: {
    vdId: string;
    newData: {
      vdName?: string;
      vdContactInfo?: string;
      vdAddress?: string;
      vdEmail?: string;
    };
  }
) => {
  await db
    .update(vendors)
    .set(input.newData)
    .where(eq(vendors.vdId, input.vdId));

  const editedVd = await db.query.vendors.findFirst({
    where: (vd) => eq(vd.vdId, input.vdId),
  });

  return editedVd;
};

export const toggleIsActive = async (db: DB, input: { vdId: string }) => {
  await db
    .update(vendors)
    .set({ vdIsActive: not(vendors.vdIsActive) })
    .where(eq(vendors.vdId, input.vdId));

  const updatedVd = await db.query.vendors.findFirst({
    where: (vd) => eq(vd.vdId, input.vdId),
  });

  return updatedVd;
};
