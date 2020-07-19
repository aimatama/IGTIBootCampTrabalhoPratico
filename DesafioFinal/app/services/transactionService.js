const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const TransactionModel = require('../models/TransactionModel');

const listDateRanges = async (req, res) => {
  const response = await TransactionModel.collection.distinct('yearMonth');
  var nameMonths = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const responseFinal = response.map((currentYearMonth) => {
    return {
      yearMonth: currentYearMonth,
      monthYear:
        nameMonths[currentYearMonth.substring(5, 7) - 1] +
        '/' +
        currentYearMonth.substring(0, 4),
    };
  });
  try {
    res.send(responseFinal);
  } catch (error) {
    res.status(500).send({
      message:
        'Ocorreu um erro na listagem das datas das transações: ' ||
        error.message,
    });
    console.log(
      'Ocorreu um erro na listagem das datas das transações: ' ||
        JSON.stringify(error.message)
    );
  }
};

const findTransactionByPeriod = async (req, res) => {
  const { period, desc } = req.query;

  if (!period) {
    res.status(500).send({
      message: 'Informe um período para realizar a consulta.',
    });
    return;
  }

  var condition = desc
    ? {
        description: { $regex: new RegExp(desc), $options: 'i' },
        yearMonth: period,
      }
    : { yearMonth: period };

  const response = await TransactionModel.find(condition);
  try {
    const responseOrdering = response.sort((a, b) => {
      return a.day - b.day;
    });
    res.send(responseOrdering);
  } catch (error) {
    res.status(500).send({
      message:
        'Ocorreu um erro na busca de transações por período: ' || error.message,
    });
    console.log(
      'Ocorreu um erro na busca de transações por período: ' ||
        JSON.stringify(error.message)
    );
  }
};

const findTransactionById = async (req, res) => {
  const { id } = req.params;

  const response = await TransactionModel.findOne({ _id: id });
  try {
    res.send(response);
  } catch (error) {
    res.status(500).send({
      message:
        'Ocorreu um erro na busca de transações por ID: ' || error.message,
    });
    console.log(
      'Ocorreu um erro na busca de transações por ID: ' ||
        JSON.stringify(error.message)
    );
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  const response = await TransactionModel.findOneAndRemove({ _id: id });
  try {
    res.send(response);
  } catch (error) {
    res.status(500).send({
      message: 'Ocorreu um erro na exclusão da transação: ' || error.message,
    });
    console.log(
      'Ocorreu um erro na exclusão da transação: ' ||
        JSON.stringify(error.message)
    );
  }
};

const addTransaction = async (req, res) => {
  var transaction = {
    description: req.body.description,
    value: req.body.value,
    category: req.body.category,
    year: req.body.year,
    month: req.body.month,
    day: req.body.day,
    yearMonth: req.body.yearMonth,
    yearMonthDay: req.body.yearMonthDay,
    type: req.body.type,
  };
  var data = new TransactionModel(transaction);
  const response = await data.save();
  try {
    res.send(response);
  } catch (error) {
    res.status(500).send({
      message: 'Ocorreu um erro na inclusão da transação: ' || error.message,
    });
    console.log(
      'Ocorreu um erro na inclusão da transação: ' ||
        JSON.stringify(error.message)
    );
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const response = await TransactionModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  try {
    res.send(response);
  } catch (error) {
    res.status(500).send({
      message: 'Ocorreu um erro na atualização da transação: ' || error.message,
    });
    console.log(
      'Ocorreu um erro na atualização da transação: ' ||
        JSON.stringify(error.message)
    );
  }
};

module.exports = {
  listDateRanges,
  findTransactionByPeriod,
  findTransactionById,
  deleteTransaction,
  addTransaction,
  updateTransaction,
};
