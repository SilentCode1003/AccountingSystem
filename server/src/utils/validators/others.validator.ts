import z from "zod";

//validator for POST /others/AccountTotal
export const AccountTotalValidator = z.object({
  accTypeId: z.string().superRefine((val, ctx) => {
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
  accCreatedAt: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
});

export const IncomeStatementByMonthValidator = z.object({
  month: z.date(),
  accTypes: z.union([z.array(z.string()), z.string()]).optional(),
});

export const getAccountTypeTotalPerMonthValidator = z.object({
  date: z.date(),
  accTypeId: z.string().superRefine((val, ctx) => {
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
});

export const accounTypeIdValidator = z.object({
  accTypeId: z.string().superRefine((val, ctx) => {
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
});

export const syncEmployeesByAPIValidator = z.object({
  employeeApi: z.string().url({ message: "Invalid api url" }),
});

export const toggleRouteDiscrepancyValidator = z.object({
  rdId: z.string().superRefine((val, ctx) => {
    if (val.split(" ")[0] !== "rdId") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a route discrepancy id.`,
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
