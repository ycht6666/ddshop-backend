import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// 從資料庫取結果給前端
router.get('/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [rows] = await db.query(
    `select coupon.id,coupon.name,coupon.money,coupon_send_management.user_id,coupon_send_management.usage_status From coupon join coupon_send_management on coupon.id = coupon_send_management.coupon_id WHERE coupon_send_management.user_id = ? AND coupon_send_management.usage_status = '未使用' `,
    [user_id]
  )
  const order_coupon = rows

  return res.json({ status: 'success', data: { order_coupon } })
})

export default router
