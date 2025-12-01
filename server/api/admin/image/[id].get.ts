export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const menuId = getRouterParam(event, 'id')

  let result = []
	let dbQuery = useKnex('image')

  result = await dbQuery.where({ menu_id: menuId })
	
	return result
})