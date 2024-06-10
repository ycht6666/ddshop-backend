import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// 從資料庫取結果給前端
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  const [rows] = await db.query(
    'SELECT * FROM colorology_checklist c JOIN colorology_color_text t ON c.id = t.colorology_checklist_id WHERE c.id = ?',
    [id]
  )
  const colorology_checklist = rows[0]

  return res.json({ status: 'success', data: { colorology_checklist } })
})

export default router
