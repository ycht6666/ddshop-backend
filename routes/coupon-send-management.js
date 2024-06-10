import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// 從資料庫取特定會員的優惠劵給前端
router.get('/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [rows] = await db.query(
    'SELECT coupon_send_management.id, coupon_send_management.usage_status, coupon_send_management.usage_time, coupon_send_management.send_time, coupon.name, coupon.money, coupon.starting_time, coupon.end_time FROM coupon_send_management JOIN coupon ON coupon_send_management.coupon_id = coupon.id WHERE coupon_send_management.user_id = ?',
    [user_id]
  )
  const coupon_send_management = rows

  return res.json({
    status: 'success',
    data: { coupon_send_management },
  })
})

// 發送優惠劵
router.post('/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const { dateName } = req.body // 從前端取得 dateName

  // 首先查詢 coupon 表中是否存在指定的優惠劵名字
  const [couponResult] = await db.query(
    'SELECT id FROM coupon WHERE name LIKE ?',
    [`%${dateName}%`]
  )

  if (couponResult.length === 0) {
    // 如果優患劵名字不存在，則返回錯誤訊息
    return res
      .status(400)
      .json({ status: 'error', message: '優患劵名字不存在' })
  }

  const coupon_id = couponResult[0].id

  // 新增一項紀錄到 coupon_send_management 表中
  const [insertResult] = await db.query(
    'INSERT INTO coupon_send_management (id, user_id, coupon_id, coupon_name, usage_status, usage_time, send_time, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
    [null, user_id, coupon_id, null, '未使用', null]
  )

  // 如果成功更新，返回成功狀態碼和成功訊息
  return res.json({ status: 'success', message: '優惠劵發送成功' })
})

// 更新優惠劵狀態
router.post('/order/:id', async function (req, res) {
  try {
    const user_id = getIdParam(req) // 從路由中取得user_id

    const { couponID, usage_status } = req.body // 从前端取得 couponID 和 usage_status

    // 更新 coupon_send_management 表中的 usage_status
    const [updateResult] = await db.query(
      'UPDATE coupon_send_management SET usage_status = ? WHERE user_id = ? AND coupon_id = ?',
      [usage_status, user_id, couponID]
    )

    // 如果成功更新，返回成功狀態碼和成功訊息
    return res.json({ status: 'success', message: '更新成功' })
  } catch (error) {
    console.error('資料庫操作失敗:', error)
    // 如果在更新過程中發生錯誤，返回500狀態碼和錯誤消息
    return res.status(500).json({ status: 'error', message: '資料庫內部錯誤' })
  }
})
export default router
