import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 使用sql查詢的方式
import db from '#configs/mysql.js'

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  try {
    const id = getIdParam(req)

    console.log(`Fetching member with ID: ${id}`)

    const [rows] = await db.query(
      `
      SELECT m.id, m.nickname, m.avatar, m.gender, m.height, f.bio
      FROM member m
      LEFT JOIN member_forum_info f ON m.id = f.member_id
      WHERE m.id = ?
      `,
      [id]
    )

    console.log(`Query result:`, rows)

    const member = rows[0]

    if (!member) {
      console.log('Member not found')
      return res
        .status(404)
        .json({ status: 'error', message: 'Member not found' })
    }

    if (member.avatar) {
      member.avatar = `/images/member/${member.avatar.replace('uploads\\', '').replace('uploads/', '')}`
    }

    console.log(`Returning member data:`, member)

    return res.json({ status: 'success', data: { member } })
  } catch (error) {
    console.error('Error fetching member:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' })
  }
})

export default router
