import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import sequelize from '#configs/db.js'
const { Posts } = sequelize.models

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  // 獲取query查詢字串參數值
  // const {
  //   page = 1, // 類型number，用於 `OFFSET = (Number(page)-1) * Number(perpage)`
  //   perpage = 10, // 類型number，用於 `LIMIT perpage`
  // } = req.query

  // 查詢資料表
  const [rows] = await db.query(`SELECT * FROM article_comment`)
  const comments = rows

  // 計算資料筆數
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM article`)
  const { count } = rows2[0]

  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total: count, // 代表目前查詢得到的所有筆數
      comments: comments,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const pid = getIdParam(req)

  // const product = await My_Product.findByPk(id, {
  //   raw: true, // 只需要資料表中資料
  // })

  const [rows] = await db.query('SELECT * FROM article WHERE article_id = ?', [
    pid,
  ])
  const comments = rows[0]

  return res.json({ status: 'success', data: { comments } })
})

// POST - Add new post
router.post('/', async function (req, res) {
  const { userId, category, text, picture } = req.body

  try {
    // Insert the new post into the database
    const [result] = await db.query(
      'INSERT INTO article (user_id, category, text, picture, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, category, text, picture]
    )

    // Get the ID of the newly inserted post
    const postId = result.insertId

    // Fetch the newly inserted post from the database
    const [[newPost]] = await db.query('SELECT * FROM article WHERE id = ?', [
      postId,
    ])

    return res.status(201).json({ status: 'success', data: { post: newPost } })
  } catch (error) {
    console.error('Error adding new post:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Failed to add new post' })
  }
})

export default router
