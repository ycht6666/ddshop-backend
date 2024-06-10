import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const uploadDirectory = 'uploads'
const router = express.Router()
dotenv.config()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import sequelize from '#configs/db.js'
const { Posts } = sequelize.models

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  // 分頁用
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 10 // 預設每頁10筆資料
  const offset = (page - 1) * perpage
  const limit = perpage

  // Get user_id from query parameters
  const userId = req.query.user_id

  try {
    // Initialize the base query and query parameters array
    let baseQuery = 'SELECT * FROM article'
    let countQuery = 'SELECT COUNT(*) AS count FROM article'
    let queryParams = []

    // Add condition for user_id if provided
    if (userId) {
      baseQuery += ' WHERE user_id = ?'
      countQuery += ' WHERE user_id = ?'
      queryParams.push(userId)
    }

    // Append LIMIT and OFFSET to the base query
    baseQuery += ' LIMIT ? OFFSET ?'
    queryParams.push(limit, offset)

    // Execute the query to get the posts
    const [rows] = await db.query(baseQuery, queryParams)
    const posts = rows

    // Execute the query to get the total count of posts
    const [rows2] = await db.query(countQuery, queryParams.slice(0, -2)) // Remove LIMIT and OFFSET parameters for count query
    const { count } = rows2[0]

    // Calculate the total number of pages
    const pageCount = Math.ceil(count / perpage)

    // Standard JSON response
    return res.json({
      status: 'success',
      data: {
        total: count, // Total number of posts
        pageCount, // Total number of pages
        page, // Current page
        perpage, // Number of posts per page
        posts, // The posts for the current page
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch posts',
    })
  }
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  // const product = await My_Product.findByPk(id, {
  //   raw: true, // 只需要資料表中資料
  // })

  const [rows] = await db.query(
    `
    SELECT 
        a.id, 
        a.user_id, 
        a.category, 
        a.text, 
        a.picture, 
        a.created_at, 
        COALESCE(like_counts.like_count, 0) AS like_count
    FROM 
        article a
    LEFT JOIN 
        (SELECT pid, COUNT(*) AS like_count 
        FROM article_like 
        GROUP BY pid) like_counts 
    ON 
        a.id = like_counts.pid
    WHERE 
        a.id = ?
    `,
    [id]
  )
  const posts = rows[0]

  return res.json({ status: 'success', data: { posts } })
})

//* Set up Multer middleware for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory)
    }
    cb(null, uploadDirectory) // Use uploadDirectory variable
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Use a timestamp to prevent overwriting
  },
})

const upload = multer({ storage: storage })

// POST - Add new post
router.post('/', upload.single('picture'), async function (req, res) {
  const { userId, category, text } = req.body
  const picturePath = req.file ? req.file.path : null

  try {
    // Insert the new post into the database
    const [result] = await db.query(
      'INSERT INTO article (user_id, category, text, picture, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, category, text, picturePath]
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
