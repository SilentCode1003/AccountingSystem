import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export const forgetPasswordSchema = z.object({
  userName: z.string().min(1, { message: 'Username is required' }),
})

export const changePasswordSchema = z.object({
  userId: z.string().min(1, { message: 'Username is required' }),
  newPassword: z.string().min(1, { message: 'Password is required' }),
})
