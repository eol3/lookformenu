// server/routes/static/[...].get.ts
import fs from 'node:fs'
import path from 'node:path'
import { sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. 取得網址上的路徑參數
  // 例如網址是 /static/image/1/menu.jpg，這裡會抓到 "image/1/menu.jpg"
  const filePathParams = getRouterParam(event, '_') || ''
  // 2. 拼湊出您硬碟上的真實絕對路徑
  const fullPath = path.resolve('./public/static/', filePathParams)
  // 3. 檢查檔案是否存在
  if (!fs.existsSync(fullPath)) {
    // 找不到就回傳 404
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  // 4. 如果檔案存在，建立讀取串流並回傳給瀏覽器
  return sendStream(event, fs.createReadStream(fullPath))
})