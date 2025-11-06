import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
})
export type AuthValues = z.infer<typeof authSchema>

