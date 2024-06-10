import express from 'express'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'
import db from '#configs/mysql.js' // 导入您的 MySQL 配置文件

const router = express.Router()

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.post('/', async (req, res) => {
  try {
    const { memberEmail, Items, calculatedTotalPrice, userName } = req.body
    console.log(calculatedTotalPrice)
    console.log(memberEmail)
    console.log(Items)
    const productNames = Items.map((v) => v.name).join('、')
    const productSize = Items.map((v) => v.size).join('、')
    // 检查用户是否存在于数据库中
    const [rows] = await db.query('SELECT * FROM member WHERE account = ?', [
      memberEmail,
    ])
    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'logitecha1073114@gmail.com',
        pass: 'cvfw zzlv kwdf vjfe',
      },
    })

    const mailOptions = {
      from: 'logitecha1073114@gmail.com',
      to: memberEmail,
      subject: 'DDSHOP 訂購明細',
      html: `
        <p>你好，${userName}</p>
        <p>您的購買清單: ${productNames}</p>
        <p>總金額為: ${calculatedTotalPrice}</p>
        <p>敬上<br>DD服飾開發團隊</p>
        <img src="cid:logo" alt="DD Shop Logo" style="width:100px;height:auto;"/>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../public/avatar/logo.png'),
          cid: 'logo', // 设定cid，邮件内容中引用此cid
        },
      ],
    }

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('发送邮件错误:', error)
          reject('邮件发送失败')
        } else {
          console.log('邮件发送:', info.response)
          resolve('邮件发送成功')
        }
      })
    })

    res.status(200).json({ message: '邮件发送成功' })
  } catch (error) {
    console.error('发送邮件错误:', error)
    res.status(500).json({ error: '邮件发送失败' })
  }
})

export default router
