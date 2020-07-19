const express = require('express');
const service = require('../services/transactionService');
const transactionRouter = express.Router();

transactionRouter.get('/listdates/', service.listDateRanges);
transactionRouter.get('/find/', service.findTransactionByPeriod);
transactionRouter.get('/:id', service.findTransactionById);
transactionRouter.delete('/delete/:id', service.deleteTransaction);
transactionRouter.post('/', service.addTransaction);
transactionRouter.put('/:id', service.updateTransaction);

module.exports = transactionRouter;
