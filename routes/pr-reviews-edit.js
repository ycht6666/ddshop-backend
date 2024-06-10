import express from 'express'
const router = express.Router()
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
// import { getIdParam } from '#db-helpers/db-tool.js'
import db from '#configs/mysql.js'
import { fileURLToPath } from 'url'
router.get('/', async function (req, res) {
  // Assuming this is a function that retrieves the product ID from the request
  const [rows] = await db.query(
    ` SELECT
    od.id, od.name, od.size, od.color, od.ph1, od.product_id,pr.id AS reviews_id, pr.ph_1, pr.ph_2, pr.ph_3, pr.content, pr.stars
FROM
    order_details od
    JOIN
    product_reviews pr ON od.product_reviews_id = pr.id `
  )
  return res.json({
    status: 'success',
    data: {
      response: rows,
    },
  })
})
router.get('/:id', async function (req, res) {
  const id = req.params.id // Assuming this is a function that retrieves the product ID from the request

  const [rows] = await db.query(
    ` SELECT
    od.id, od.name, od.size, od.color, od.ph1, od.product_id,pr.id AS reviews_id, pr.ph_1, pr.ph_2, pr.ph_3, pr.content, pr.stars
FROM
    order_details od
    JOIN
    product_reviews pr ON od.product_reviews_id = pr.id
WHERE od.id= ? `,
    [id]
  )

  return res.json({ status: 'success', data: { response: rows[0] } })
})

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

//POST 路由處理上傳照片
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

// 創建 multer 實例
const upload = multer({ storage })

router.post('/', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: '請選擇一個文件' })
  }

  res.json({
    status: 'success',
    fileName: req.file.filename,
  })
})

//改資料庫資料
router.put('/update/:id', async (req, res) => {
  try {
    const reviewsId = req.params.id
    const { photo1, photo2, photo3, contents, rating } = req.body

    const [result] = await db.query(
      'UPDATE product_reviews SET ph_1 = ?, ph_2 = ?, ph_3 = ?, content = ?, stars = ? WHERE id = ?',
      [photo1, photo2, photo3, contents, rating, reviewsId]
    )

    if (result.changedRows > 0) {
      console.log('已寫入資料庫')
      res.status(200).json({ status: true, message: '個人評論更新成功！' })
    } else {
      res.status(404).json({ status: false, message: '沒有更新' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating product review' })
  }
})
export default router
