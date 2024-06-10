import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '#configs/mysql.js' // 假設 MySQL 設定在此處

const router = express.Router()
dotenv.config()

const secretKey = process.env.SECRET_KEY

router.post('/', async (req, res) => {
  try {
    const token = jwt.sign(
      {
        account: undefined,
        name: undefined,
        mail: undefined,
        head: undefined,
      },
      secretKey,
      {
        expiresIn: '-10s',
      }
    )
    // 在這裡你可以實作更多的登出相關邏輯，例如從資料庫中刪除登入記錄等

    // 返回成功注销的消息
    res.status(200).json({ status: 'success', message: '登出成功', token })
  } catch (error) {
    console.error('登出時發生錯誤:', error)
    res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
  }
})

export default router
