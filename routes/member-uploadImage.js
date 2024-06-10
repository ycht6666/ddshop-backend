import express from 'express'
import dotenv from 'dotenv'
import db from '#configs/mysql.js'
import multer from 'multer'
import fs from 'fs'
import { getIdParam } from '#db-helpers/db-tool.js'
import path from 'path'

const uploadDirectory = 'uploads'
const router = express.Router()
dotenv.config()

//*取得會員大頭照照片
router.get('/:id', async (req, res) => {
  console.log('你好嗎?')
  const memberId = getIdParam(req)
  const [result] = await db.query('SELECT * FROM member WHERE id = ?', [
    memberId,
  ])
  console.log(result[0].avatar)
  const avatar = result[0].avatar
  console.log(typeof avatar)
  res.json({
    status: 'success',
    data: { avatar },
  })
})

//* 設置 Multer 中間件，用於處理文件上傳
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //* 檢查目錄是否存在，如果不存在，則創建它
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory)
    }
    cb(null, 'uploads/') //* 文件上傳後保存的目錄
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //* 使用原始文件名作為保存的文件名
  },
})
const upload = multer({ storage: storage })

//* 將照片路由存到資料庫裡面
router.post('/:id', upload.single('file'), async (req, res) => {
  try {
    const memberId = getIdParam(req)
    const [row] = await db.query('SELECT * FROM member WHERE id = ?', [
      memberId,
    ])

    // ? photoPath是後端存放照片的路徑
    if (row.length > 0) {
      const user = row[0]
      const photoPath = req.file.path // 上傳的照片路徑
      console.log(photoPath)
      db.query('UPDATE member SET avatar = ? WHERE id = ?', [
        photoPath,
        memberId,
      ])

      res.status(200).json({
        success: true,
        message: 'Photo uploaded successfully',
        user: { ...user, photoPath },
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Error uploading photo:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
