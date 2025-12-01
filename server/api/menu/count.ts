interface CountItem {
  total: number
}
export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  // console.log(query)
  let result: CountItem[] = []
	let dbQuery = useKnex('menu')
	
	if (query.word) {
    dbQuery.where('store', 'LIKE', '%' + query.word + '%')
  }

	dbQuery.countDistinct('menu.id as total')
	
	result = await dbQuery
	
	return result[0].total
})