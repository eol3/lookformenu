import { rm  } from 'node:fs/promises';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const menuId = getRouterParam(event, 'id')
  
  let path = './public/static/image/' + menuId
  await rm (path, { recursive: true, force: true });
  
  return await useKnex('image').where({ menu_id: menuId }).del()
})