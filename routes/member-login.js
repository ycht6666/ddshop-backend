import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '#configs/mysql.js'
dotenv.config()

const router = express.Router()
const secretKey = process.env.SECRET_KEY

router.post('/', async (req, res) => {
  const { account, password } = req.body

  try {
    const [rows] = await db.query(
      'SELECT * FROM member WHERE account = ? AND password = ?',
      [account, password]
    )

    if (rows.length > 0) {
      const userData = rows[0]
      const token = jwt.sign(
        {
          account: userData.account, // 修正此處為 'userData.account'
          userPassword: userData.password,
          id: userData.id,
          avatar: userData.avatar,
        },
        secretKey,
        { expiresIn: '3h' }
      )

      res.status(200).json({ status: 'success', message: '驗證成功', token })
    } else {
      res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
