import z from "zod";

export const createPayrollSchema = z.object({
  prEmployeeId: z.string().superRefine((val, ctx) => {
    if (val === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      });
    }
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
  prTotalDeduction: z
    .union([
      z.number().positive({ message: "must not be 0 or negative" }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: "required",
    }),
  prDateFrom: z.date(),
  prDateTo: z.date(),
});

export const updatePayrollSchema = z.object({
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
  prAccId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "accId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an account id.`,
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
    prTotalDeduction: z
      .union([
        z.number().positive({ message: "must not be 0 or negative" }),
        z.nan(),
      ])
      .refine((val) => !Number.isNaN(val), {
        message: "required",
      }),
    prDateFrom: z.date().optional(),
    prDateTo: z.date().optional(),
  }),
});
