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
    const { verifyEmail, generatedOtp } = req.body

    // 检查用户是否存在于数据库中
    const [rows] = await db.query('SELECT * FROM member WHERE account = ?', [
      verifyEmail,
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
      to: verifyEmail,
      subject: '重設密碼驗證OTP',
      html: `
      <p>您的OTP密碼是: ${generatedOtp}。
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
          console.error('Error sending email:', error)
          reject('Failed to send email')
        } else {
          console.log('Email sent:', info.response)
          resolve('Email sent successfully')
        }
      })
    })

    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

export default router
