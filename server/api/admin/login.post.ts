import { z } from 'zod'
const config = useRuntimeConfig()
const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  if (email === config.adminUserEmail && password === config.adminPassword) {
    // set the user session in the cookie
    // this server util is auto-imported by the auth-utils module
    await setUserSession(event, {
      user: {
        name: email,
      },
    })
    
    return { success: true }
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials',
  })
})
