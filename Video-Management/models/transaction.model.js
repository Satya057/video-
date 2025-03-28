
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    // transactionNumber: { type: String, required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failed'], required: true }
  });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports={Transaction};