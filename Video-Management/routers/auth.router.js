const express = require('express')
const router = express.Router()
const {
    userLogin,
    UserSignUp,
    emailVerify,
    resendEmailVerifyOtp
} = require('../controller/auth.controller')

router.post("/login", userLogin)
router.post("/signup", UserSignUp)
router.post("/email-verify", emailVerify)
router.post("/resend-email-verify", resendEmailVerifyOtp)

module.exports = router