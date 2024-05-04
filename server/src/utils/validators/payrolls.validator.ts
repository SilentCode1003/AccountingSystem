import { UploadedFile } from "express-fileupload";
import z from "zod";

//validator for POST /payrolls input
export const createValidator = z.object({
  prEmployeeId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "empId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an employee id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  prTotalDeduction: z.number(),
  prDateFrom: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  prDateTo: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  prFile: z.custom<UploadedFile>().refine(
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

//validator for PUT /payrolls input
export const updateValidator = z.object({
  prId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "prId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an payroll id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  prTranId: z.string().superRefine((val, ctx) => {
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
  prEmployeeId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(" ")[0] !== "empId") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an employee id.`,
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
  prTotalDeduction: z.number().optional(),
  prDateFrom: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
  prDateTo: z
    .string()
    .datetime()
    .transform((date) => new Date(date))
    .optional(),
  prFile: z.custom<UploadedFile>().refine(
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
