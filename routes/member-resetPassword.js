import express from 'express'
import db from '#configs/mysql.js'

const router = express.Router()

router.put('/', async (req, res) => {
  try {
    const { verifyEmail, newPassword } = req.body

    // 更新數據中的密碼
    await db.query('UPDATE member SET password = ? WHERE account = ?', [
      newPassword,
      verifyEmail,
    ])

    res.status(200).json({ status: true, message: '密碼已成功更新' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: false, message: '服務器錯誤' })
  }
})

export default router
