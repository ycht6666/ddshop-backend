import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
// 資料庫使用sequelize
// import sequelize from '#configs/db.js'
// const { Products } = sequelize.models

// 資料庫使用SQL
import db from '##/configs/mysql.js'

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'my-products' })
// })

// GET - 得到所有收藏商品資料
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)
  const [rows] = await db.query(
    `SELECT ab.pid
    FROM article_bookmark AS ab
     WHERE ab.uid = ?
     ORDER BY ab.pid ASC`,
    [id]
  )
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({
    status: 'success',
    bookmarks: rows,
  })
})

//-----------------------------------------------
// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.post('/add', async function (req, res) {
  // 轉為數字
  const { uid, pid } = req.body

  // SQL查出來一定是陣列[]
  //單個商品 包含 顏色 尺寸 等等
  const [rows] = await db.query(
    `INSERT INTO article_bookmark (uid, pid)
  VALUES (?,?)`,
    [uid, pid]
  )
  const [rows1] = await db.query(
    `SELECT fa.pid
    FROM article_bookmark AS fa
     WHERE fa.uid = ?
     ORDER BY fa.pid ASC`,
    [uid]
  )

  // 获取受影响的行数
  const affectedRows = rows.affectedRows

  if (affectedRows === 1) {
    // 如果受影响的行数为 1，表示成功插入了一行记录
    return res.json({ status: 'success', message: '加入收藏成功', data: rows1 })
  } else {
    // 否则，表示未成功插入记录
    return res.status(400).json({ status: 'error', message: '加入收藏失敗' })
  }
})
router.delete('/delete', async function (req, res) {
  // 轉為數字
  const { uid, pid } = req.body

  // SQL查出來一定是陣列[]
  const [rows] = await db.query(
    `DELETE FROM article_bookmark 
    WHERE uid = ? AND pid = ? `,
    [uid, pid]
  )

  const [rows1] = await db.query(
    `SELECT fa.pid
    FROM article_bookmark AS fa
     WHERE fa.uid = ?
     ORDER BY fa.pid ASC`,
    [uid]
  )
  // 获取受影响的行数
  const affectedRows = rows.affectedRows

  if (affectedRows === 1) {
    // 如果受影响的行数为 1，表示成功插入了一行记录
    return res.json({ status: 'success', message: '刪除收藏成功', data: rows1 })
  } else {
    // 否则，表示未成功插入记录
    return res.status(400).json({ status: 'error', message: '刪除收藏失敗' })
  }
})

export default router
