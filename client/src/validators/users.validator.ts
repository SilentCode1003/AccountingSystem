import { z } from 'zod'

export const createUserSchema = z.object({
  empId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'empId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not an employee id.`,
      })
    }
  }),
  userType: z.enum(['FINANCE', 'HIGHER_DEPARTMENT']),
})

export const updateUserSchema = z.object({
  userId: z.string().superRefine((val, ctx) => {
    if (val.split(' ')[0] !== 'userId') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Not a user id.`,
      })
    }
  }),
  newData: z.object({
    userUsername: z.string().optional(),
    userPassword: z.string().optional(),
    userFullName: z.string().optional(),
    userContactNumber: z.string().optional(),
    userProfilePic: z.instanceof(File).optional(),
  }),
})
