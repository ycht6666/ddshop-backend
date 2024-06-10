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
GROUP BY 
    \`order\`.id
    ORDER BY 
    \`order\`.id DESC`,
    [user_id]
  )
  const order_list = rows

  return res.json({ status: 'success', data: { order_list } })
})

router.get('/', async function (req, res) {
  // 轉為數字
  const user_id = Number(req.query.userID) // 從路由中取得user_id
  const order_id = req.query.orderID
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
    AND (order_id LIKE ? OR order_details.name LIKE ?)
GROUP BY 
    \`order\`.id
    ORDER BY 
    \`order\`.id DESC`,
    [user_id, `%${order_id}%`, `%${order_id}%`]
  )
  const search_list = rows

  return res.json({ status: 'success', data: { search_list } })
})

export default router
