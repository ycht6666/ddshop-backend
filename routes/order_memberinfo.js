import express from 'express'
import crypto from 'crypto'

const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// 從資料庫取會員的給前端
router.get('/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [row1] = await db.query(
    'select member.id,member.name,member.phone,member.address,member.city,member.district,member.account From member WHERE member.id = ?',
    [user_id]
  )
  const order_memberinfo = row1

  return res.json({
    status: 'success',
    data: { order_memberinfo },
  })
})

//寫入7-11資料庫
router.post('/sevenEleven/:id', async function (req, res) {
  const {
    name,
    outside,
    phone,
    ship,
    storeId,
    storeaddress,
    storename,
    TempVar,
  } = req.body

  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id
  const newId = Number(new Date())
  const [row2] = await db.query(
    'INSERT INTO shipment_address (id,storeid, storename, storeaddress, outside, ship, phone, name,ship_method, member_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),NOW())',
    [
      newId,
      storeId,
      storename,
      storeaddress,
      outside,
      ship,
      phone,
      name,
      '超商取貨',
      user_id,
    ]
  )

  const order_memberinfo = row2

  return res.json({
    status: 'success',
    data: { order_memberinfo },
  })
})

//查詢原有的7-11資料庫
router.get('/sevenEleven/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [row3] = await db.query(
    'select shipment_address.id,shipment_address.storename,shipment_address.storeaddress,shipment_address.phone,shipment_address.name,shipment_address.ship_method From shipment_address join member on shipment_address.member_id = member.id WHERE member_id =?',
    [user_id]
  )
  const order_ShipAddress = row3

  return res.json({
    status: 'success',
    data: { order_ShipAddress },
  })
})

//寫入7-11資料庫
router.post('/sevenEleven/:id', async function (req, res) {
  const {
    name,
    outside,
    phone,
    ship,
    storeId,
    storeaddress,
    storename,
    TempVar,
  } = req.body

  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [row2] = await db.query(
    'INSERT INTO shipment_address (storeid, storename, storeaddress, outside, ship, phone, name,ship_method, member_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())',
    [
      storeId,
      storename,
      storeaddress,
      outside,
      ship,
      phone,
      name,
      '超商取貨',
      user_id,
    ]
  )

  const order_memberinfo = row2
  // const [insertResult] = await db.query(
  //   'INSERT INTO coupon_send_management (id, user_id, coupon_id, coupon_name, usage_status, usage_time, send_time, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
  //   [null, user_id, coupon_id, null, '未使用', null]
  // )

  return res.json({
    status: 'success',
    data: { order_memberinfo },
  })
})

//拉出1筆7-11資料庫
router.get('/sevenEleven/pick/:id', async function (req, res) {
  // 轉為數字
  const ship_id = getIdParam(req) // 從路由中取得user_id

  const [row4] = await db.query(
    'SELECT shipment_address.id, shipment_address.storename, shipment_address.storeaddress, shipment_address.phone, shipment_address.name, shipment_address.ship_method FROM shipment_address WHERE shipment_address.id = ?',
    [ship_id]
  )

  const pick_ShipAddress = row4

  const [row] = await db.query(
    'select member_address.id,member_address.member_id,member_address.name,member_address.city,member_address.district,member_address.address,member_address.is_default,member_address.phone From member_address join `member` on member_address.member_id = member.id WHERE member_address.id =?',
    [ship_id]
  )

  const pick_HomeAddress = row

  if (pick_ShipAddress.length > 0) {
    return res.json({
      status: 'success',
      data: { pick_ShipAddress },
    })
  } else if (pick_HomeAddress.length > 0) {
    return res.json({
      status: 'successHome',
      data: { pick_HomeAddress },
    })
  }
})

//查詢原有的家裡資料庫
router.get('/home/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [row5] = await db.query(
    'select member_address.id,member_address.member_id,member_address.name,member_address.city,member_address.district,member_address.address,member_address.is_default,member_address.phone From member_address join member on member_address.member_id = member.id WHERE member_id =?',
    [user_id]
  )
  const order_HomeAddress = row5

  return res.json({
    status: 'success',
    data: { order_HomeAddress },
  })
})

//查詢原有的家裡資料庫
router.get('/home/defalut/:id', async function (req, res) {
  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [row6] = await db.query(
    'select member_address.id,member_address.member_id,member_address.name,member_address.city,member_address.district,member_address.address,member_address.is_default,member_address.phone From member_address join member on member_address.member_id = member.id WHERE member_id =? and is_default=1',
    [user_id]
  )
  const order_HomeDefaultAddress = row6

  return res.json({
    status: 'success',
    data: { order_HomeDefaultAddress },
  })
})

//寫入home資料庫
router.post('/home/:id', async function (req, res) {
  const { name, phone, city, district, address } = req.body

  // 轉為數字
  const user_id = getIdParam(req) // 從路由中取得user_id

  const [row] = await db.query(
    'INSERT INTO member_address (name, phone, city, district,address,member_id,is_default,created_at,updated_at) VALUES (?,?,?,?,?,?,?,NOW(),NOW())',
    [name, phone, city, district, address, user_id, 0]
  )

  const order_homeInfo = row

  return res.json({
    status: 'success',
    data: { order_homeInfo },
  })
})

export default router
