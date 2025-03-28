const {User} = require('../models/user.model')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')


const sendMoney = async (req, res) => {
  const { recipient, amount } = req.body;
  const { userId } = req.user;

  if (!userId || !recipient || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input. or Required All Fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
     
      const fromAccount = await User.findById(userId).session(session);
      const toAccount = await User.findOne({ email: recipient }).session(session);

      if (!toAccount) {
          throw new Error("Receiver Account not found.");
      }

      if (fromAccount.email ==  toAccount.email) {
        throw new Error("You not send money in your Account");
    }

   
      if (fromAccount.balance < amount) {
          throw new Error("Insufficient funds.");
      }

   
      fromAccount.balance = Number(fromAccount.balance) - Number(amount);
      toAccount.balance = Number(toAccount.balance) + Number(amount);


      await fromAccount.save({ session });
      await toAccount.save({ session });

  
      const transaction = new Transaction({
       
          fromUser: fromAccount._id,
          toUser: toAccount._id,
          amount,
          status: "Success",
      });
      const response = await transaction.save({ session });
      console.log(response)

  
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
          message: "Transaction successful!",
          transactionId:response._id, 
      });
  } catch (error) {
    
      await session.abortTransaction();
      session.endSession();

      res.status(500).json({ message: "Transaction failed.", error: error.message });
  }
};





const getTransactionHistory = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
 
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate('fromUser', 'firstName lastName email') // Populate selected fields
      .populate('toUser', 'firstName lastName email');

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    // Transform transactions for response
    const modifiedTransactions = transactions.map(transaction => {
      const isOutgoing = transaction.fromUser._id.toString() === userId;
      return {
        transactionId: transaction._id,
        amount: transaction.amount,
        prefix: isOutgoing ? '-' : '+',
        direction: isOutgoing ? 'outgoing' : 'incoming',
        fromUser: transaction.fromUser,
        toUser: transaction.toUser,
        status: transaction.status,
        createdAt: transaction.createdAt,
      };
    });

    res.status(200).json({ transactions: modifiedTransactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history.", error: error.message });
  }
};



const getAllTransactionHistory = async(req,res) => {
  try {
  
    const transactions = await Transaction.find({});
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history", error: error.message });
  }
}






module.exports={sendMoney,getTransactionHistory,getAllTransactionHistory}