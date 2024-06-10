import express from 'express'
import db from '#configs/mysql.js' // 假設 MySQL 設定在此處

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const {
      account,
      password,
      name,
      gender,
      birthdate,
      phone,
      city,
      address,
      district,
      height,
      chest_circumference,
      waistline,
      hips,
      recommended_size,
    } = req.body

    // 檢查是否已存在相同帳號的使用者
    const [existingUser] = await db.query(
      'SELECT * FROM member WHERE account = ?',
      [account]
    )

    if (existingUser.length > 0) {
      throw new Error('帳號已經有人使用')
    }

    const avatar = 'uploads/avatar.jpg'

    // 將新使用者資料插入到資料庫中
    await db.query(
      'INSERT INTO member (account, password, name, gender, birthdate, phone, city, address, district, height, chest_circumference, waistline, hips, recommended_size, avatar, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        account,
        password,
        name,
        gender,
        birthdate,
        phone,
        city,
        address,
        district,
        height,
        chest_circumference,
        waistline,
        hips,
        recommended_size,
        avatar,
      ]
    )

    res.status(201).json({ status: 'success', message: '使用者新增成功' })
  } catch (error) {
    console.error('新增使用者時發生錯誤:', error)
    res.status(400).json({ status: 'error', message: error.message })
  }
})

export default router
