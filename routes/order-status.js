import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

router.get('/', async function (req, res) {
  // 轉為數字
  const user_id = Number(req.query.userID) // 從路由中取得user_id
  const status = req.query.status
  const [rows] = await db.query(
    `SELECT 
    \`order\`.id as order_id,
    \`order\`.total_cost,
    \`order\`.order_status,
    \`order\`.payment_status,
    order_details.ph1,
    order_details.color,
    order_details.product_quantity,
    order_details.name,
    order_details.id as details_id
FROM 
    \`order\`
JOIN 
    order_details ON \`order\`.id = order_details.order_id
WHERE 
    \`order\`.member_id = ?
    AND \`order\`.order_status = ?
GROUP BY 
    \`order\`.id;`,
    [user_id, status]
  )
  const list_status = rows

  return res.json({ status: 'success', data: { list_status } })
})
export default router
