import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// 結果寫到資料庫
router.post('/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const { id: colorology_checklist_id } = req.body // 從前端取得id並將其指定給colorology_checklist_id

  // 更新 colorology_result
  const [updateResult] = await db.query(
    'UPDATE colorology_result SET colorology_checklist_id = ? WHERE user_id = ?',
    [colorology_checklist_id, user_id]
  )

  // 如果影響的行數為 0，表示沒有找到對應的會員記錄，需要插入新記錄
  if (updateResult.affectedRows === 0) {
    await db.query(
      'INSERT INTO colorology_result (colorology_checklist_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [colorology_checklist_id, user_id]
    )
  }

  // 如果成功更新，返回成功狀態碼和成功訊息
  return res.json({ status: 'success', message: '更新成功' })
})

// 從資料庫取結果給前端
router.get('/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [rows] = await db.query(
    'SELECT * FROM colorology_result cr JOIN colorology_checklist cc ON cr.colorology_checklist_id = cc.id JOIN colorology_color_text cct ON cc.id = cct.colorology_checklist_id WHERE cr.user_id = ?',
    [user_id]
  )
  const colorology_checklist = rows[0]

  return res.json({ status: 'success', data: { colorology_checklist } })
})

export default router
