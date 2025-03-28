const express = require('express');
const transactionController = require('../controller/transaction.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

router.get('/',transactionController.getAllTransactionHistory)
router.get('/user',authMiddleware.verifyToken,transactionController.getTransactionHistory)
router.post('/send-money',authMiddleware.verifyToken,transactionController.sendMoney)

module.exports = router