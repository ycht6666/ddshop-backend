import express from 'express'
import db from '#configs/mysql.js' // 假設 MySQL 設定在此處
import { getIdParam } from '#db-helpers/db-tool.js' //*取得

const router = express.Router()
let memberId

// 设置默认地址的端点
router.post('/set-default/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const default_address = req.body.address
    // console.log(request)
    // 将所有该用户的地址设置为非默认
    console.log('進來了')
    console.log(typeof userId)
    console.log(userId)
    await db.query(
      'UPDATE member_address SET is_default = "0" WHERE member_id = ?',
      [userId]
    )

    // 將指定的地址設置為默認
    await db.query('UPDATE member_address SET is_default = "1" WHERE id = ?', [
      default_address,
    ])

    res.status(200).json({ message: 'Default address set successfully' })
  } catch (error) {
    console.error('Error setting default address:', error)
    res.status(500).json({ error: 'Error setting default address' })
  }
})

// * 新增地址資料
router.post('/:id', async (req, res) => {
  try {
    memberId = getIdParam(req)
    const {
      recipientName,
      recipientphone,
      recipientCity,
      recipientAddress,
      recipientDistrict,
    } = req.body
    console.log('進來了')

    // 將新地址資料插入到'member_address'資料庫中
    await db.query(
      'INSERT INTO member_address (member_id,name, phone, city, address, district,is_default, created_at, updated_at) VALUES (?,?, ?, ?, ?, ?,?, NOW(), NOW())',
      [
        memberId,
        recipientName,
        recipientphone,
        recipientCity,
        recipientAddress,
        recipientDistrict,
        0,
      ]
    )

    res.status(201).json({ status: 'success', message: '地址新增成功' })
  } catch (error) {
    console.error('新增使用者時發生錯誤:', error)
    res.status(400).json({ status: 'error', message: error.message })
  }
})

//*更新會員收件地址
router.post('/edit-address/:id', async (req, res) => {
  try {
    const memberId = getIdParam(req)
    const { addressId, name, recipientphone, city, district, address } =
      req.body

    const [result] = await db.query(
      'UPDATE member_address SET name = ?, phone = ?, city = ?, district = ?, address = ? WHERE id = ? ',
      [name, recipientphone, city, district, address, addressId]
    )

    //?回傳更新後的地址
    // 將新地址資料插入到'member_address'資料庫中
    const [rows] = await db.query(
      'SELECT * FROM member_address WHERE member_id = ?',
      [memberId]
    )

    if (result.affectedRows > 0) {
      console.log('已寫入資料庫')
      res.status(200).json({
        status: 'success',
        message: '收件地址更新成功！',
        result: rows,
      })
    } else {
      res.status(404).json({ status: false, message: '找不到使用者或沒有更新' })
    }
  } catch (error) {
    console.error('更新收地址時發生錯誤:', error)
    res.status(500).json({ status: false, message: '內部伺服器錯誤' })
  }
})

//*呈現會員收件地址資料
router.get('/:id', async (req, res) => {
  try {
    console.log('進來了')
    memberId = getIdParam(req)

    // 將新地址資料插入到'member_address'資料庫中
    const [rows] = await db.query(
      'SELECT * FROM member_address WHERE member_id = ?',
      [memberId]
    )

    res.status(201).json({ status: 'success', message: rows })
  } catch (error) {
    console.error('查詢地址時發生錯誤:', error)
    res.status(400).json({ status: 'error', message: error.message })
  }
})

// *刪除地址資料
router.post('/delete-address/:id', async (req, res) => {
  try {
    console.log('進來了')
    memberId = getIdParam(req)
    // 从请求体中获取要删除的地址的 ID
    const addressId = req.body.address

    // 使用 SQL 查询删除对应的地址数据
    await db.query(
      'DELETE FROM member_address WHERE id = ? AND member_id = ?',
      [addressId, memberId]
    )

    // 发送删除成功的响应给客户端
    res.status(200).json({ message: 'Address deleted successfully' })
  } catch (error) {
    // 如果发生错误，发送错误响应给客户端
    console.error('Error deleting address:', error)
    res.status(500).json({ error: 'Error deleting address' })
  }
})
export default router
