import express from 'express'
const router = express.Router()
import { getIdParam } from '#db-helpers/db-tool.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
// import { getIdParam } from '#db-helpers/db-tool.js'
import db from '#configs/mysql.js'
router.get('/', async function (req, res) {
  // Assuming this is a function that retrieves the product ID from the request
  const [rows] = await db.query(
    ` SELECT
      id,
      name,
      size,
      color,
      ph1,
      product_id
  FROM
      order_details
     `
  )
  return res.json({
    status: 'success',
    data: {
      response: rows,
    },
  })
})
router.get('/:id', async function (req, res) {
  const id = req.params.id
  // Assuming this is a function that retrieves the product ID from the request

  const [rows] = await db.query(
    ` SELECT
          id,
          name,
          size,
          color,
          ph1,
          product_id
      FROM
          order_details

  WHERE
      id = ?`,
    [id]
  )

  return res.json({ status: 'success', data: { response: rows[0] } })
})
const uploadDirectory = 'public/uploads'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory)
    }
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.post(
  '/',
  upload.fields([
    { name: 'photo1', maxCount: 1 },
    { name: 'photo2', maxCount: 1 },
    { name: 'photo3', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { files, body } = req
      const { productId, rating, contents, orderDetailsId } = body
      const photoNames = []
      if (files.photo1) {
        photoNames.push(files.photo1[0].filename)
      }
      if (files.photo2) {
        photoNames.push(files.photo2[0].filename)
      }
      if (files.photo3) {
        photoNames.push(files.photo3[0].filename)
      }

      // 将文件名称、productId、rating、contents 插入 MySQL 的 product_reviews 表的对应字段
      const query =
        'INSERT INTO product_reviews (ph_1, ph_2, ph_3, product_id, stars, content,review_time) VALUES (?, ?, ?, ?, ?, ?,NOW())'
      const [result] = await db.query(query, [
        photoNames[0] || null,
        photoNames[1] || null,
        photoNames[2] || null,
        productId[0],
        rating[0],
        contents[0],
      ])

      // 获取新增的评论 ID
      const productReviewsId = result.insertId

      // 将新增的评论 ID 插入 order_details 表的 product_reviews_id 字段
      const insertOrderDetailsQuery =
        'UPDATE order_details SET product_reviews_id = ? WHERE id = ?'
      await db.query(insertOrderDetailsQuery, [
        productReviewsId,
        orderDetailsId[0],
      ])

      res.send('文件上传成功')
    } catch (error) {
      console.error('Error uploading files:', error)
      res.status(500).send('文件上传失败')
    }
  }
)

export default router
