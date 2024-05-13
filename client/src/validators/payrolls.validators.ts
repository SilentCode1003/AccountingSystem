import z from 'zod'

export const createPayrollSchema = z.object({
  prEmployeeId: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      })
    }
    if (val.split(' ')[0] !== 'empId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an employee id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  prTotalDeduction: z
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
  prDateFrom: z.date(),
  prDateTo: z.date(),
  prFile: z.instanceof(File, { message: 'Required' }).refine(
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

export const updatePayrollSchema = z.object({
  prId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'prId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an payroll id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  prTranId: z.string().superRefine((val, ctx) => {
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
  prEmployeeId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(' ')[0] !== 'empId') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an employee id.`,
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
  prTotalDeduction: z
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
    .refine((val) => !Number.isNaN(val), {
      message: 'required',
    }),
  prDateFrom: z.date().optional(),
  prDateTo: z.date().optional(),
  prFile: z
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
