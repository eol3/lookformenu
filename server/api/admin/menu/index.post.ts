export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody(event)
  await useKnex('menu').insert(body)
  return { body }
})