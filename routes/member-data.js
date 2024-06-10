import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '#configs/mysql.js'

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

router.post('/', async (req, res) => {
  try {
    const token = getTokenFromHeaders(req.headers)
    const decoded = jwt.verify(token, secretKey)
    const userId = decoded.id

    const [row] = await db.query('SELECT * FROM member WHERE id = ?', [userId])

    if (row.length > 0) {
      const user = row[0]
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found:找不到使用者' })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ message: 'Internal server error:內部系統錯誤' })
  }
})

export default router
