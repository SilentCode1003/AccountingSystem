import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, {
    message: 'Email is required',
  }),
})
