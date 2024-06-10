import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '#configs/mysql.js' // 假設 MySQL 設定在此處

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
const router = express.Router()
dotenv.config()

const secretKey = process.env.SECRET_KEY

const getTokenFromHeaders = function (headers) {
  if (!headers.authorization) {
    return null
  }
  const token = headers.authorization.split(' ')[1]
  return token
}

router.post('/:id', async (req, res) => {
  try {
    const memberId = getIdParam(req)
    const {
      name,
      birthdate,
      gender,
      password,
      phone,
      city,
      district,
      address,
    } = req.body

    // const token = getTokenFromHeaders(req.headers)
    // const decoded = jwt.verify(token, secretKey)
    // const userId = decoded.id

    const [result] = await db.query(
      'UPDATE member SET name = ?, birthdate = ?, gender = ?, password = ?, phone = ?, city = ?, district = ?, address = ? WHERE id = ?',
      [
        name,
        birthdate,
        gender,
        password,
        phone,
        city,
        district,
        address,
        memberId,
      ]
    )

    if (result.affectedRows > 0) {
      console.log('已寫入資料庫')
      res.status(200).json({ status: true, message: '個人資料更新成功！' })
    } else {
      res.status(404).json({ status: false, message: '找不到使用者或沒有更新' })
    }
  } catch (error) {
    console.error('更新個人資料時發生錯誤:', error)
    res.status(500).json({ status: false, message: '內部伺服器錯誤' })
  }
})

//*更新推薦尺寸
router.post('/recommended-size/:id', async (req, res) => {
  try {
    const memberId = getIdParam(req)
    const { height, chestCircumference, waistline, hips, size } = req.body

    // const token = getTokenFromHeaders(req.headers)
    // const decoded = jwt.verify(token, secretKey)
    // const userId = decoded.id

    const [result] = await db.query(
      'UPDATE member SET height = ?, chest_circumference = ?, waistline = ?, hips = ?, recommended_size = ? WHERE id = ? ',
      [height, chestCircumference, waistline, hips, size, memberId]
    )

    if (result.affectedRows > 0) {
      console.log('已寫入資料庫')
      res
        .status(200)
        .json({ status: 'success', message: '個人資料更新成功' })
    } else {
      res.status(404).json({ status: false, message: '找不到使用者或沒有更新' })
    }
  } catch (error) {
    console.error('更新個人資料時發生錯誤:', error)
    res.status(500).json({ status: false, message: '內部伺服器錯誤' })
  }
})

//*取得推薦尺寸
router.get('/recommended-size/:id', async (req, res) => {
  const memberId = getIdParam(req)
  // const { size } = req.body

  // const token = getTokenFromHeaders(req.headers)
  // const decoded = jwt.verify(token, secretKey)
  // const userId = decoded.id

  const [rows] = await db.query(
    'SELECT recommended_size,gender,height,chest_circumference,waistline,hips FROM  member WHERE id = ? ',
    [memberId]
  )
  const result = rows

  return res.status(200).json({
    status: 'success',
    data: { result },
  })
})

export default router
