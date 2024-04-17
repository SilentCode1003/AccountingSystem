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
  chqAmount: z
    .union([z.number(), z.nan()])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
  chqIssueDate: z.date(),
  chqStatus: z.enum(['APPROVED', 'PENDING', 'REJECTED']),
  chqAccTypeId: z.string(),
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
    chqAmount: z
      .union([z.number(), z.nan()])
      .refine((val) => !Number.isNaN(val), {
        message: 'required',
      }),
    chqIssueDate: z.optional(z.date()),
    chqStatus: z.optional(z.enum(['APPROVED', 'PENDING', 'REJECTED'])),
    chqAccTypeId: z.string().optional(),
  }),
})
