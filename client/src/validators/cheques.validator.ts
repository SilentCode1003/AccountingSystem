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
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
  chqIssueDate: z.date(),
  chqMopId: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      })
    }
    if (val.split(' ')[0] !== 'mopId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an mode of payment id.`,
      })
    }
  }),
  chqNumber: z.string().max(50),
  chqStatus: z.enum(['APPROVED', 'PENDING', 'REJECTED']),
  chqAccTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'accTypeId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an account type id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  chqFile: z.instanceof(File, { message: 'Required' }).refine(
    (file) => {
      if (
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/pdf'
      )
        return true
      return false
    },
    { message: 'Only xlsx/pdf files are allowed!' },
  ),
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
  chqPayeeName: z.optional(z.string()),
  chqAmount: z
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
  chqIssueDate: z.optional(z.date()),
  chqNumber: z.string().max(50).optional(),
  chqStatus: z.optional(z.enum(['APPROVED', 'PENDING', 'REJECTED'])),
  chqAccTypeId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(' ')[0] !== 'accTypeId') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an account type id.`,
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
  chqMopId: z
    .string()
    .superRefine((val, ctx) => {
      if (val === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
        })
      }
      if (val.split(' ')[0] !== 'mopId') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an mode of payment id.`,
        })
      }
    })
    .optional(),
  chqFile: z
    .instanceof(File, { message: 'Required' })
    .refine(
      (file) => {
        if (
          file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/pdf'
        )
          return true
        return false
      },
      { message: 'Only xlsx/pdf files are allowed!' },
    )
    .optional(),
})
