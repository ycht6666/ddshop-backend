import express from 'express'
const router = express.Router()
import db from '#configs/mysql.js'

router.delete('/:reviewId', async (req, res) => {
  try {
    const reviewId = req.params.reviewId

    // 從MySQL資料庫中刪除評論
    const [rows] = await db.query('DELETE FROM product_reviews WHERE id = ?', [
      reviewId,
    ])

    if (rows.affectedRows > 0) {
      console.log('已從資料庫中刪除評論')
      res.status(200).json({ status: true, message: '個人評論刪除成功！' })
    } else {
      res.status(404).json({ status: false, message: '沒有找到對應的評論' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '刪除個人評論時發生錯誤' })
  }
})

export default router
