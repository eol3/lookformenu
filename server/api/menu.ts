// import knex from '~/database'

export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  // console.log(query)

  const data = await useKnex('menu').limit(10)
  // const data = useSum(1, 2)
  // const data = useKnex

  // console.log(data)

  return data
})