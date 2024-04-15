import z from "zod";

//validator for POST /transactions inputs
export const createValidator = z.object({
  tranDescription: z.string(),
  tranAmount: z.number(),
  tranAccTypeId: z.string().superRefine((val, ctx) => {
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
  tranPartner: z.string().superRefine((val, ctx) => {
    if (val === "")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      });
    if (
      val.split(" ")[0] !== "empId" &&
      val.split(" ")[0] !== "custId" &&
      val.split(" ")[0] !== "vdId"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid employee/customer/vendor id.`,
      });
    }
    if (!z.string().uuid().safeParse(val.split(" ")[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      });
    }
  }),
  tranTransactionDate: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  tranAccType: z.enum(["PAYABLE", "RECEIVABLE", "REVENUE", "EXPENSE"]),
});

//validator for PUT /transactions inputs
export const updateValidator = z.object({
  tranId: z.string().superRefine((val, ctx) => {
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
  newData: z.object({
    tranAccId: z
      .string()
      .superRefine((val, ctx) => {
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
      })
      .optional(),
    tranDescription: z.string().optional(),
    tranAccTypeId: z.string().superRefine((val, ctx) => {
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
    tranAccType: z
      .enum(["PAYABLE", "RECEIVABLE", "REVENUE", "EXPENSE"])
      .optional(),
    tranAmount: z.number().optional(),
    tranPartner: z
      .string()
      .superRefine((val, ctx) => {
        if (val === "")
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Required`,
          });
        if (
          val.split(" ")[0] !== "empId" &&
          val.split(" ")[0] !== "custId" &&
          val.split(" ")[0] !== "vdId"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not valid employee/customer/vendor id.`,
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
    tranTransactionDate: z
      .string()
      .datetime()
      .transform((date) => new Date(date))
      .optional(),
  }),
});
