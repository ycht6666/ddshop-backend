import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  const [rows] = await db.query(
    'SELECT * FROM tarot_checklist WHERE tarot_checklist.id = ?',
    [id]
  )
  const tarot_checklist = rows[0]

  return res.json({ status: 'success', data: { tarot_checklist } })
})

export default router
