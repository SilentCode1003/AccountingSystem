import { z } from 'zod'

export const updateUserSchema = z.object({
  userId: z.string(),
  newData: z.object({
    userUsername: z.string(),
    userPassword: z.string(),
    userFullName: z.string(),
    userContactNumber: z.string(),
    userProfilePic: z.instanceof(File),
  }),
})
