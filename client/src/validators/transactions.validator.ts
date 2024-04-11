import z from 'zod'

//validator for POST /transactions inputs
export const createTransactionSchema = z.object({
  tranDescription: z.string().min(1, { message: 'required' }),
  tranAmount: z
    .union([z.number(), z.nan()])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
  tranPartner: z.string().superRefine((val, ctx) => {
    if (val === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      })
    if (
      val.split(' ')[0] !== 'empId' &&
      val.split(' ')[0] !== 'custId' &&
      val.split(' ')[0] !== 'vdId'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid employee/customer/vendor id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  tranTransactionDate: z.date(),
  tranAccType: z.enum(['PAYABLE', 'RECEIVABLE', 'REVENUE', 'EXPENSE']),
})

//validator for PUT /transactions inputs
export const updateTransactionSchema = z.object({
  tranId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'tranId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  newData: z.object({
    tranAccId: z
      .string()
      .superRefine((val, ctx) => {
        if (val.split(' ')[0] !== 'accId') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not an account id.`,
          })
        }
        if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not valid uuid.`,
          })
        }
      })
      .optional(),
    tranDescription: z.string().optional(),
    tranAmount: z
      .union([z.number(), z.nan()])
      .refine((val) => !Number.isNaN(val), {
        message: 'required',
      }),
    tranPartner: z
      .string()
      .superRefine((val, ctx) => {
        if (
          val.split(' ')[0] !== 'empId' &&
          val.split(' ')[0] !== 'custId' &&
          val.split(' ')[0] !== 'vdId'
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not valid employee/customer/vendor id.`,
          })
        }
        if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not valid uuid.`,
          })
        }
      })
      .optional(),
    tranTransactionDate: z.date().optional(),
    tranAccType: z
      .enum(['PAYABLE', 'RECEIVABLE', 'REVENUE', 'EXPENSE'])
      .optional(),
  }),
})
