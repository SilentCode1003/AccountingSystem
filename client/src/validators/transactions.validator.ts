import z from 'zod'

//validator for POST /transactions inputs
export const createTransactionSchema = z.object({
  tranDescription: z.string().min(1, { message: 'required' }),
  tranAmount: z
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
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
    if (
      val.split(' ')[0] !== 'empId' &&
      !z.string().uuid().safeParse(val.split(' ')[1]).success
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  tranTransactionDate: z.date(),
  tranTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'tranTypeId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction type id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  tranMopId: z.string().superRefine((val, ctx) => {
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
  tranFile: z.instanceof(File, { message: 'Required' }).refine(
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
  tranTypeId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'tranTypeId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an transaction type id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  tranDescription: z.string().optional(),
  tranAmount: z
    .union([
      z.number().positive({ message: 'must not be 0 or negative' }),
      z.nan(),
    ])
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
      if (
        val.split(' ')[0] !== 'empId' &&
        !z.string().uuid().safeParse(val.split(' ')[1]).success
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid uuid.`,
        })
      }
    })
    .nullable()
    .optional(),
  tranTransactionDate: z.date().optional(),
  tranMopId: z
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
  tranFile: z
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
