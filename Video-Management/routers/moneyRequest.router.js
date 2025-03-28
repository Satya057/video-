const express = require('express');
const moneyRequestController = require('../controller/moneyRequest.controller')
const router = express.Router()

router.get('/',moneyRequestController.getAllMoneyRequest)
router.post('/',moneyRequestController.getMoneyRequest)
router.post('/send-money-request',moneyRequestController.sendMoneyRequest)
router.get('/accept-money-request',moneyRequestController.acceptMoneyRequest)
router.get('/reject-money-request',moneyRequestController.rejectMoneyRequest)


module.exports = router