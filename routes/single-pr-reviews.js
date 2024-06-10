import express from 'express'
const router = express.Router()
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
// import { getIdParam } from '#db-helpers/db-tool.js'
import db from '#configs/mysql.js'
import { fileURLToPath } from 'url'
//獲取資料庫的資料
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId
  try {
    const [rows] = await db.query(
      'SELECT od.order_id, od.name, od.size, od.color, pr.product_id, pr.id AS reviews_id, pr.ph_1, pr.ph_2, pr.ph_3, pr.content, pr.stars, pr.review_time FROM order_details od JOIN product_reviews pr ON od.product_reviews_id = pr.id WHERE pr.product_id  = ?',
      [productId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' })
    }

    return res.json({ status: 'success', data: { response: rows } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})
//獲得照片
const __dirname = path.dirname(fileURLToPath(import.meta.url))

router.get('/photo/:filename', async (req, res) => {
  try {
    const { filename } = req.params
    const directoryPath = path.join(__dirname, '../public/uploads')
    const filePath = path.join(directoryPath, filename)

    // 检查文件是否存在
    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)

    if (!fileExists) {
      return res.status(404).send('文件不存在')
    }

    // 检查文件扩展名
    const fileExtension = path.extname(filename).toLowerCase()
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', 'webp']
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).send('不支持的文件类型')
    }

    res.sendFile(filePath)
  } catch (err) {
    console.error(err)
    return res.status(500).send('无法获取文件')
  }
})
export default router
