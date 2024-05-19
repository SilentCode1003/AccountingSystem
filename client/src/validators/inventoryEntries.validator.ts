import { z } from 'zod'

export const createInventoryEntrySchema = z.object({
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
  iepProducts: z
    .array(
      z.object({
        iepInvId: z.string().superRefine((val, ctx) => {
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
        iepQuantity: z
          .union([
            z.number().positive({ message: 'must not be 0 or negative' }),
            z.nan(),
          ])
          .refine((val) => !Number.isNaN(val), {
            message: 'required',
          })
          .optional(),
      }),
    )
    .min(1, { message: 'required' }),
})

export const updateInventoryEntrySchema = z.object({
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
  iepProducts: z
    .array(
      z.object({
        iepInvId: z.string().superRefine((val, ctx) => {
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
        iepQuantity: z
          .number()
          .positive({ message: 'Must not be a negative number' }),
      }),
    )
    .min(1, { message: 'required' }),
})
