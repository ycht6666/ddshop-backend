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

//寫入order資料庫
router.post('/addData/:id', async function (req, res) {
  const {
    couponName,
    couponDiscount,
    shippnig_method,
    payment_method,
    receiver_address,
    order_status,
    payment_status,
    Items,
    product_amount_total,
  } = req.body

  // const city = receiver_address.map((address) => address.city)
  // const district = receiver_address.map((address) => address.district)
  // const address = receiver_address.map((address) => address.address)
  const {
    city,
    district,
    address,
    storename,
    storeaddress,
    phone,
    ship_method,
    name,
  } = receiver_address[0]

  // 轉為數字
  const member_id = getIdParam(req) // 從路由中取得user_id

  // 判斷是不是超商的地址
  let order_address
  if (!storename || storename.length === 0) {
    order_address = city + district + address
  } else {
    order_address = storename + storeaddress
  }

  // 判斷是不是超商取貨
  let shipping_method
  if (!ship_method) {
    shipping_method = '送貨到家'
  } else {
    shipping_method = ship_method
  }

  const [row] = await db.query(
    'INSERT INTO `order` (coupon_name, coupon_discount, shipping_method, payment_method, total_cost,payment_status,order_status,receiver,receiver_address,receiver_phone,member_id,order_creation_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW())',
    [
      couponName,
      couponDiscount,
      shipping_method,
      payment_method,
      product_amount_total,
      payment_status,
      order_status,
      name,
      order_address,
      phone,
      member_id,
    ]
  )
  const orderData = row

  // 获取刚生成的order表格的ID
  const orderId = row.insertId

  Items.map(async (v, i) => {
    const product_id = v.id
    const product_name = v.name
    const product_size = v.size
    const product_color = v.pdColor
    const product_quantity = v.quantity
    const product_color_id = v.pid
    const price = v.price
    const img = v.img
    const product_amount_total = product_quantity * price
    const [row1] = await db.query(
      'INSERT INTO `order_details` (order_id, product_id, name, size,color,product_quantity,price,ph1,product_amount_total,product_color_id) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        orderId,
        product_id,
        product_name,
        product_size,
        product_color,
        product_quantity,
        price,
        img,
        product_amount_total,
        product_color_id
      ]
    )
  })

  const body = [
    couponName,
    shippnig_method,
    payment_method,
    receiver_address,
    order_status,
    phone,
    city,
    district,
    address,
    storename,
    storeaddress,
    product_amount_total,
    payment_status,
    Items,
  ]

  return res.json({
    status: 'success',
    message: '送過去的資料',
    data: { orderId },
  })
})

// 從資料庫取結果給前端
router.get('/', async function (req, res) {
  // 轉為數字
  const user_id = Number(req.query.userID) // 從路由中取得user_id
  const order_id = Number(req.query.orderID)
  const [rows] = await db.query(
    `SELECT * 
       FROM \`order\`
       JOIN order_details ON \`order\`.id = order_details.order_id
       WHERE \`order\`.id = ? AND \`order\`.member_id = ?`,
    [order_id, user_id]
  )
  const detailsData = rows

  return res.json({ status: 'success', data: { detailsData } })
})

export default router
