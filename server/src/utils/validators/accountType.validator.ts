import z from "zod";

export const createValidator = z.object({
  accTypeName: z.string(),
  accTypeIsProfit: z.boolean(),
  accTypeDefault: z.enum(["CASHFLOW", "BALANCESHEET", "INCOMESTATEMENT"]),
});

export const updateValidator = z.object({
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
  newData: z.object({
    accTypeName: z.optional(z.string()),
    accTypeIsProfit: z.boolean().optional(),
    accTypeDefault: z
      .enum(["CASHFLOW", "BALANCESHEET", "INCOMESTATEMENT"])
      .optional(),
  }),
});

export const deleteValidator = z.object({
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
