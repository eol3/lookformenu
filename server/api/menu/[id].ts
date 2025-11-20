// import knex from '~/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const data = await useKnex('menu').where({ id: id }).first()
  return data
})