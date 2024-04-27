import { z } from "zod";

export const createEmployeeSchema = z.object({
  empName: z.string().min(1, { message: "required" }),
  empAddress: z.string().min(1, { message: "required" }),
  empContactInfo: z.string().min(1, { message: "required" }),
  empEmail: z.string().email().min(1, { message: "required" }),
  empBirthdate: z.date(),
  empDateHired: z.date(),
  empSalary: z
    .union([
      z.number().positive({ message: "must not be 0 or negative" }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: "required",
    }),
});

export const updateEmployeeSchema = z.object({
  empId: z.string().superRefine((val, ctx) => {
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
  newData: z.object({
    empName: z.string().optional(),
    empAddress: z.string().optional(),
    empContactInfo: z.string().optional(),
    empEmail: z.string().email().optional(),
    empBirthdate: z.date().optional(),
    empDateHired: z.date().optional(),
    empDateTerminated: z.date().optional(),
    empSalary: z
      .union([
        z.number().positive({ message: "must not be 0 or negative" }),
        z.nan(),
      ])
      .refine((val) => !Number.isNaN(val), {
        message: "required",
      }),
  }),
});

export const terminateEmployeeSchema = z.object({
  empId: z.string().superRefine((val, ctx) => {
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
});
