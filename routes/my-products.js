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

// GET - 得到所有商品資料
router.get('/', async function (req, res) {
  // 獲取query查詢字串參數值
  // const {
  //   name_like='', // 類型string, 用於 `name LIKE '%name_like%'`
  //   tag='', // 類型number, 用於`tag_id IN (tag)`
  //   style='', // 類型number, 用於`st_id IN (tag)`
  //   price_gte=0, // 類型number, 用於 `price >= price_gte`
  //   price_lte=15000, // 類型number, 用於 `price <= price_lte`
  //   page = 1, // 類型number，用於 `OFFSET = (Number(page)-1) * Number(perpage)`
  //   perpage = 10, // 類型number，用於 `LIMIT perpage`
  //   sort='id', // 類型string, 用於 ORDER BY
  //   order='asc',  // 類型string, 用於 ORDER BY
  // } = req.query

  //
  const allSelect = `
  products.id AS product_id,
  product_color.id AS product_color_id,
  products.name AS product_name,
  products.price,
  products.tag_id,
  tag_name,
  products.mt_id,
  mt_name,
  products.st_id,
  st_name,
  products.ma_id,
  ma_name,
  color.id AS color_id,
  color.color_name AS color_name,
  color,
  ph1,
  ph2`

  //存放連接的表單
  const allTable = `
  JOIN tag ON products.tag_id = tag.id 
JOIN main_type ON products.mt_id = main_type.id
JOIN style ON products.st_id = style.id
JOIN material ON products.ma_id = material.id
JOIN product_color ON product_color.product_id = products.id
JOIN color ON color.id = product_color.color_id
`
  const hotp = req.query.hotp || ''
  const withp = hotp
    ? `WITH RankedProducts AS (
    SELECT product_color_id
    FROM order_details
    GROUP BY product_color_id
    ORDER BY COUNT(product_color_id) DESC
  )`
    : ''
  const withpj = hotp
    ? `JOIN RankedProducts rp ON product_color.id = rp.product_color_id`
    : ''
  //存放WHERE條件的陣列
  const conditions = []
  //搜尋商品名稱
  const name_like = req.query.name_like || '' //關鍵字
  conditions[0] = name_like ? ` products.name LIKE '%${name_like}%'` : ''
  //標籤 預設 1男性 2女性
  const tag = req.query.tag ? req.query.tag.split(',') : []
  conditions[1] =
    tag.length > 0 ? `tag_id IN (${tag.map((v) => `'${v}'`).join(',')})` : ''

  //風格 預設 1 2 3 4 5
  const style = req.query.style ? req.query.style.split(',') : []
  conditions[2] =
    style.length > 0 ? `st_id IN (${style.map((v) => `'${v}'`).join(',')})` : ''

  //價格大於等於 預設大於0
  const price_gte = req.query.price_gte || 0
  conditions[3] = price_gte ? ` price >= ${price_gte}` : ''
  //價格小於等於 預設小於1500
  const price_lte = req.query.price_lte || 1500
  conditions[4] = price_lte ? ` price <= ${price_lte}` : ''
  //搜尋新品
  const newp = req.query.newp || ''
  conditions[5] = newp ? ` newp = ${newp}` : ''
  //主要分類
  const mt = req.query.mt ? req.query.mt.split(',') : []
  conditions[6] =
    mt.length > 0
      ? ` products.mt_id IN (${mt.map((v) => `'${v}'`).join(',')})`
      : ''
  // 最後組合where從句
  //1.過濾空白的查詢從句
  const cvs = conditions.filter((v) => v)
  //2.使用AND組合有的從句
  const where =
    cvs.length > 0 ? 'WHERE' + cvs.map((v) => `(${v})`).join(` AND `) : ''

  console.log(where)

  // 排序 預設asc desc
  const sort = req.query.sort || 'product_color.id'
  const order = req.query.order || 'asc'
  const orderby = `ORDER BY ${sort} ${order}`

  //分頁
  const page = Number(req.query.page) || 1 //在第幾分頁
  const perpage = Number(req.query.perpage) || 12 // 當前頁面要顯示多少項目
  const offset = (page - 1) * perpage
  const limit = perpage
  // SQL 查出來一定是陣列[] 查尋資料表
  //商品列表
  const [rows] = await db.query(
    `${withp} SELECT ${allSelect} FROM  products ${allTable} ${withpj} ${where} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  )
  const products = rows

  // SQL 查出來一定是陣列[] 查尋資料表
  //所有商品 配對顏色用
  const [rows1] = await db.query(
    `SELECT ${allSelect}  FROM  products ${allTable} `
  )
  const Allproducts = rows1

  // SQL 查出來一定是陣列[] 查尋資料表
  //計算資料總筆數
  const [rows2] = await db.query(
    `${withp} SELECT COUNT(*) AS count FROM  products ${allTable} ${withpj} ${where}`
  )
  const { count } = rows2[0]

  //計算目前共幾頁
  const pageCount = Math.ceil(count / perpage)

  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total: count,
      pageCount,
      page,
      perpage,
      Allproducts,
      products,
    },
  })
})

//-----------------------------------------------
// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  const allSelect = `
  products.id AS product_id,
  product_color.id AS product_color_id,
  products.name AS product_name,
  products.price,
  products.tag_id,
  tag_name,
  products.mt_id,
  mt_name,
  products.st_id,
  st_name,
  products.ma_id,
  ma_name,
  color.id AS color_id,
  color.color_name AS color_name,
  color,
  size_id,
  size_name,
  stock,
  ph1,
  ph2,
  ph3,
  ph4,
  ph5
  `

  //存放連接的表單
  const allTable = `
  JOIN tag ON products.tag_id = tag.id 
JOIN main_type ON products.mt_id = main_type.id
JOIN style ON products.st_id = style.id
JOIN material ON products.ma_id = material.id
JOIN product_color ON product_color.product_id = products.id
JOIN color ON color.id = product_color.color_id
JOIN product_color_size ON product_color_size.product_color_id = product_color.id
JOIN size ON  size.id = product_color_size.size_id
`

  // 轉為數字
  const id = getIdParam(req)
  //findByPk用組件找
  // sequelize
  // const product = await Products.findByPk(id, {
  //   raw: true, // 只需要資料表中資料
  // })

  // SQL查出來一定是陣列[]
  //單個商品 包含 顏色 尺寸 等等
  const [rows] = await db.query(
    `SELECT ${allSelect} FROM  products ${allTable} WHERE product_id = (SELECT product_id FROM product_color WHERE product_color.id = ?)`,
    [id]
  )
  const product = rows

  const [rows1] = await db.query(
    `WITH recommend AS(
      SELECT products.id
      FROM products
      WHERE st_id = (SELECT products.st_id 
      FROM products
      WHERE products.id = (SELECT products.id
      FROM products 
      JOIN product_color pc on pc.product_id = products.id 
      WHERE pc.id =  ? ))
      LIMIT 3 OFFSET 3
      )
      SELECT products.id AS product_id,
        product_color.id AS product_color_id,
        products.name AS product_name,
        products.price,
        products.tag_id,
        tag_name,
        products.mt_id,
        mt_name,
        products.st_id,
        st_name,
        products.ma_id,
        ma_name,
        color.id AS color_id,
        color.color_name AS color_name,
        color,
        ph1,
        ph2 
      FROM products 
      JOIN recommend rc ON products.id = rc.id
      JOIN tag ON products.tag_id = tag.id 
      JOIN main_type ON products.mt_id = main_type.id
      JOIN style ON products.st_id = style.id
      JOIN material ON products.ma_id = material.id
      JOIN product_color ON product_color.product_id = products.id
      JOIN color ON color.id = product_color.color_id`,
    [id]
  )

  const recommend = rows1

  //所有商品 配對顏色用
  const [rows2] = await db.query(
    `SELECT ${allSelect}  FROM  products ${allTable} `
  )
  const Allproducts = rows2

  const [rows3] = await db.query(
    `SELECT size_chart
    FROM product_size_chart as psc
    WHERE psc.mt_id =(SELECT products.mt_id 
    FROM products
    WHERE products.id = (SELECT products.id
    FROM products 
    JOIN product_color pc on pc.product_id = products.id 
    WHERE pc.id =  ? )) `,
    [id]
  )
  const sizeChart = rows3

  return res.json({
    status: 'success',
    data: { product, recommend, Allproducts, sizeChart },
  })
})

export default router
