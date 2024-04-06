import z from 'zod'

export const createChequeSchema = z.object({
  chqPayeeName: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      })
    }
  }),
  chqAmount: z.number(),
  chqIssueDate: z.date(),
  chqStatus: z.enum(['APPROVED', 'PENDING', 'REJECTED']),
  chqAccType: z.enum(['PAYABLE', 'RECEIVABLE', 'REVENUE', 'EXPENSE']),
})

export const chequeUpdateSchema = z.object({
  chqId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'chqId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an cheque id.`,
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
    chqPayeeName: z.optional(z.string()),
    chqAmount: z.optional(z.number()),
    chqIssueDate: z.optional(z.date()),
    chqStatus: z.optional(z.enum(['APPROVED', 'PENDING', 'REJECTED'])),
    chqAccType: z
      .enum(['PAYABLE', 'RECEIVABLE', 'REVENUE', 'EXPENSE'])
      .optional(),
  }),
})
