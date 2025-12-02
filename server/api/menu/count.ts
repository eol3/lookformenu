interface CountItem {
  total: number,
  ids: string;
}
interface Query {
  word: string;
  ids: string;
}
export default defineEventHandler(async (event) => {

  const query: Query = getQuery(event)
  let result: CountItem[] = []
	let dbQuery = useKnex('menu')
	
	if (query.word) {
    dbQuery.where('store', 'LIKE', '%' + query.word + '%')
  }

  if (query.ids === '') {
    return 0
  }
  if (query.ids) {
    let idsArray = query.ids.split(',').map(id => parseInt(id));
    dbQuery.whereIn('id', idsArray)
  }

	dbQuery.countDistinct('menu.id as total')
	
	result = await dbQuery
	
	return result[0].total
})