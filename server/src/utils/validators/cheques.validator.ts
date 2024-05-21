import { UploadedFile } from "express-fileupload";
import z from "zod";

//validator for POST /cheques inputs
export const createValidator = z.object({
  chqPayeeName: z.string(),
  chqAmount: z.number(),
  chqIssueDate: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  chqStatus: z.enum(["APPROVED", "PENDING", "REJECTED"]),
  chqNumber: z.string().max(50),
  chqAccTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "accTypeId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an account type id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  chqFile: z.custom<UploadedFile>().refine(
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
  chqMopId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "mopId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a mode of payment id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
});

//validor for PUT /cheques input
export const updateValidator = z.object({
  chqId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "chqId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an cheque id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  chqPayeeName: z.optional(z.string()),
  chqAmount: z.optional(z.number()),
  chqIssueDate: z.optional(
    z
      .string()
      .datetime()
      .transform((date) => new Date(date))
  ),
  chqStatus: z.optional(z.enum(["APPROVED", "PENDING", "REJECTED"])),
  chqNumber: z.string().max(50).optional(),
  chqAccTypeId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(" ")[0] !== "accTypeId") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an account type id.`,
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
  chqUpdatedAt: z.optional(
    z
      .string()
      .datetime()
      .transform((date) => new Date(date))
  ),
  chqTranId: z.string().superRefine((val, ctx) => {
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
  chqMopId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(" ")[0] !== "mopId") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not a mode of payment id.`,
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
  chqFile: z
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

export const approveChequeValidator = z.object({
  chqId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "chqId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an cheque id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
});

export const createChequeByFileValidator = z.object({
  chqFile: z.custom<UploadedFile>().refine(
    (file) => {
      if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        return true;
      return false;
    },
    {
      message: "Only xlsx files are allowed",
    }
  ),
});
