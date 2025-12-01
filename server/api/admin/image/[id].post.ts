import { ServerFile } from "nuxt-file-storage";

export default defineEventHandler(async (event) => {
  const menuId = getRouterParam(event, 'id')
  const { files } = await readBody<{ files: ServerFile[] }>(event)
  const menuImageList = await useKnex('image').where({ menu_id: menuId })
  let isSetFirst = false
  if (menuImageList.length === 0) {
    isSetFirst = true
  }
  for ( const file of files ) {
    const result = await storeFileLocally(
      file,
      8,
      '/image/' + menuId + '/'
    )
    await useKnex('image').insert({
      menu_id: menuId,
      filename: result,
      ori_filename: file.name
    })

    if (isSetFirst) {
      await useKnex('menu').update({ first_img_filename: result }).where({ id: menuId })
      isSetFirst = false
    }
  }
  return {}
})