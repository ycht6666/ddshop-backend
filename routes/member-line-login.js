// pages/api/line-login-url.js

import express from 'express'
import querystring from 'querystring'

const router = express.Router()

const LINE_LOGIN_URL = 'https://access.line.me/oauth2/v2.1/authorize'
const CLIENT_ID = 2005424688 // 替换为你的 Channel ID
const REDIRECT_URI = 'http://localhost:3000/member/edit-personal-data' // 替换为你的回调 URL
const STATE = 'someRandomString' // 用于防止 CSRF 攻击
const SCOPE = 'profile openid email'

router.get('/', (req, res) => {
  const loginUrl = `${LINE_LOGIN_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&nonce=helloWorld&prompt=consent&max_age=3600&ui_locales=zh-TW&bot_prompt=normal`
  res.json({ loginUrl })
})

export default router
