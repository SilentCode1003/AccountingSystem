import { UploadedFile } from "express-fileupload";
import z from "zod";

//validator for POST /inventoryEntries input
export const createValidator = z.object({
  invEntryInvId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "invId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  invEntryQuantity: z.number(),
  invEntryDate: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  invEntryPartner: z.string().superRefine((val, ctx) => {
    if (val === "")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      });
    if (val.split(" ")[0] !== "custId" && val.split(" ")[0] !== "vdId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid customer/vendor id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  invEntryType: z.enum(["INCOMING", "OUTGOING"]),
  invEntryFile: z.custom<UploadedFile>().refine(
    (file) => {
      if (
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/pdf"
      )
        return true;
      return false;
    },
    {
      message: "Only xlsx/pdf files are allowed",
    }
  ),
});

//validator for PUT /inventoryEntries input
export const updateValidator = z.object({
  invEntryId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "invEntryId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory entry id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  invEntryInvId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "invId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  invEntryTranId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "tranId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  invEntryQuantity: z.number().optional(),
  invEntryDate: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
  invEntryPartner: z
    .string()
    .superRefine((val, ctx) => {
      if (val === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
        });
      if (val.split(" ")[0] !== "custId" && val.split(" ")[0] !== "vdId") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid customer/vendor id.`,
        });
      }
      if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid uuid.`,
        });
      }
    })
    .optional(),
  invEntryType: z.enum(["INCOMING", "OUTGOING"]).optional(),
  invEntryFile: z
    .custom<UploadedFile>()
    .refine(
      (file) => {
        if (
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.mimetype === "application/pdf"
        )
          return true;
        return false;
      },
      {
        message: "Only xlsx/pdf files are allowed",
      }
    )
    .optional(),
});
