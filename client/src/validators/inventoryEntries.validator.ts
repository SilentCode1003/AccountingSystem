import { z } from 'zod'

export const createInventoryEntrySchema = z.object({
  invEntryInvId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'invId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  invEntryQuantity: z
    .number()
    .positive({ message: 'must not be 0 or negative' }),
  invEntryDate: z.date(),
  invEntryPartner: z.string().superRefine((val, ctx) => {
    if (val === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Required`,
      })
    if (val.split(' ')[0] !== 'custId' && val.split(' ')[0] !== 'vdId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid customer/vendor id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  invEntryType: z.enum(['INCOMING', 'OUTGOING']),
  invEntryFile: z.instanceof(File, { message: 'Required' }).refine(
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

export const updateInventoryEntrySchema = z.object({
  invEntryInvId: z
    .string()
    .superRefine((val, ctx) => {
      if (val.split(' ')[0] !== 'invId') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not an inventory id.`,
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
  invEntryId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'invEntryId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an inventory entry id.`,
      })
    }
    if (!z.string().uuid().safeParse(val.split(' ')[1]).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not valid uuid.`,
      })
    }
  }),
  invEntryTranId: z.string().superRefine((val, ctx) => {
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

  invEntryQuantity: z
    .number()
    .positive({ message: 'must not be 0 or negative' })
    .optional(),
  invEntryDate: z.date().optional(),
  invEntryPartner: z
    .string()
    .superRefine((val, ctx) => {
      if (val === '')
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
        })
      if (val.split(' ')[0] !== 'custId' && val.split(' ')[0] !== 'vdId') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Not valid customer/vendor id.`,
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
  invEntryType: z.enum(['INCOMING', 'OUTGOING']).optional(),
  invEntryFile: z
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
