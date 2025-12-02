interface Query {
  word: string;
  ids: string;
  limit: number;
  offset: number;
  sortBy: string;
  orderBy: string;
}

export default defineEventHandler(async (event) => {

  const query: Query = getQuery(event)
  // console.log(query)

  let result: number[] = []
	let dbQuery = useKnex('menu')
	
  dbQuery.where('used', 1)

  if (query.word) {
    dbQuery.where('store', 'LIKE', '%' + query.word + '%')
  }
  
  if (query.ids === '') {
    return []
  }
  if (query.ids) {
    let idsArray = query.ids.split(',').map(id => parseInt(id));
    dbQuery.whereIn('id', idsArray)
  }
	
  if (query.limit) {
    dbQuery.limit(query.limit)
  } else {
    dbQuery.limit(10)
  }

  if (query.offset) {
    dbQuery.offset(query.offset)
  } else {
    dbQuery.offset(0)
  }

  if (query.sortBy && query.orderBy) {
		dbQuery.orderBy(query.sortBy, query.orderBy)
	}

	result = await dbQuery
	
	return result
})