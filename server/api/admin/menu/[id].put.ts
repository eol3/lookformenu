export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  await useKnex('menu').update({
    ...body,
    update_date: useKnex.fn.now()
  }).where({ id: id})
  return { body }
})