import React, { useEffect, useState } from 'react';
import api from './services/TransactionApi';
import ModalComponent from './components/modal';

export default function App() {
  const [listDateRanges, setListDateRanges] = useState([]);
  const [dataSelect, setListDateRangeSelect] = useState('');
  const [transactionList, setTransactionList] = useState([]);
  const [selectedTransaction, setselectedTransaction] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const styles = {
    summaryBoard: {
      marginTop: '10px',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '1px',
      marginRight: '1px',
    },
    totalRevenue: {
      color: '#87CEFA',
      fontWeight: 'bold',
    },
    totalExpenses: {
      color: '#DB7093',
      fontWeight: 'bold',
    },
    transactionRevenue: {
      background: '#87CEFA',
      border: '10px solid #fff',
    },
    transactionExpense: {
      background: '#DB7093',
      border: '10px solid #fff',
    },
    inputFilter: { marginLeft: '20px' },
    cardContent: {
      border: '1px solid',
    },
    balancePositive: {
      color: '#87CEFA',
    },
    balanceNegative: {
      color: '#DB7093',
    },
    filterForm: {
      marginTop: '10px',
      marginLeft: '10px',
    },
    borderRadiusLeft: {
      borderTopLeftRadius: '25px',
      borderBottomLeftRadius: '25px',
    },
    borderRadiusRight: {
      borderTopRightRadius: '25px',
      borderBottomRightRadius: '25px',
    },
  };

  useEffect(() => {
    async function fetchData() {
      const response = await api.get('/listdates');
      setListDateRanges(response.data);
      if (response.data.length > 0) {
        handleListDateRanges(response.data[0].yearMonth);
      }
    }
    fetchData();
  }, []);

  const handleListDateRanges = async (data) => {
    const responseTransactionList = await api.get(`find?period=${data}`);
    setListDateRangeSelect(data);
    setTransactionList(responseTransactionList.data);
  };

  const handleFindTransaction = async (data) => {
    const responseTransactionList = await api.get(
      `find?period=${dataSelect}&desc=${data}`
    );
    setTransactionList(responseTransactionList.data);
  };

  const handleDeleteTransaction = async (data) => {
    const transactionDelete = await api.delete(`delete/${data._id}`);
    const index = transactionList.findIndex(
      (d) => d._id === transactionDelete.data._id
    );

    transactionList.splice(index, 1);

    setTransactionList([...transactionList]);
  };

  const handleEditTransaction = async (transactionEdit) => {
    setselectedTransaction(transactionEdit);
    setIsModalOpen(true);
  };

  const handleNewTransactionClick = () => {
    setIsModalOpen(true);
  };

  const handlePersistData = async (formData) => {
    const { id } = formData;
    let transaction;

    if (id !== undefined && id !== '') {
      transaction = await api.put(`/${id}`, formData);
    } else {
      transaction = await api.post('/', formData);
    }
    handleListDateRanges(transaction.data.yearMonth);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleMonthNavigation = (operation) => {
    let date = '';
    let month = 0;
    let year = 0;
    month = dataSelect.substring(5, 7);
    year = dataSelect.substring(0, 4);
    if (operation === '+') {
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    } else {
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
    }
    if (year < 2019 || year > 2021) {
      return;
    }
    date = year + '-' + pad(month, 2);
    setListDateRangeSelect(date);
    handleListDateRanges(date);
  };

  function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  const numberTransactions = transactionList.length;

  let totalRevenue = 0;

  let totalExpenses = 0;

  transactionList.forEach((currentTransaction) => {
    if (currentTransaction.type === '-') {
      totalExpenses += currentTransaction.value;
    } else {
      totalRevenue += currentTransaction.value;
    }
  });

  let balance = totalRevenue - totalExpenses;

  const totalRevenueFormatted = totalRevenue.toLocaleString(
    navigator.language,
    {
      minimumFractionDigits: 2,
    }
  );
  const totalExpensesFormatted = totalExpenses.toLocaleString(
    navigator.language,
    {
      minimumFractionDigits: 2,
    }
  );
  const balanceFormatted = balance.toLocaleString(navigator.language, {
    minimumFractionDigits: 2,
  });

  const balanceStyle =
    balance > 0 ? styles.balancePositive : styles.balanceNegative;

  return (
    <>
      <div className="container">
        <form>
          <div className="card-content" style={styles.cardContent}>
            <h1 className="center">Bootcamp Full Stack - Desafio Final</h1>
            <h4 className="center">Controle Financeiro Pessoal</h4>
            <div style={styles.summaryBoard} className="row">
              <div className="col s1">
                <button
                  className="waves-effect waves-light btn-flat"
                  type="button"
                  onClick={() => handleMonthNavigation('-')}
                >
                  <i className="material-icons center">navigate_before</i>
                </button>
              </div>
              <div className="col s2">
                <select
                  className="browser-default"
                  onChange={(e) => handleListDateRanges(e.target.value)}
                  value={dataSelect}
                >
                  {listDateRanges.map((data) => {
                    return (
                      <option key={data.yearMonth} value={data.yearMonth}>
                        {data.monthYear}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col s1">
                <button
                  className="waves-effect waves-light btn-flat"
                  type="button"
                  onClick={() => handleMonthNavigation('+')}
                >
                  <i className="material-icons center">navigate_next</i>
                </button>
              </div>
              <div className="col s2">
                <strong>Lançamentos: </strong>
                <strong>{numberTransactions}</strong>
              </div>
              <div className="col s2">
                <strong>Receitas: </strong>
                <span style={styles.totalRevenue}>{totalRevenueFormatted}</span>
              </div>
              <div className="col s2">
                <strong>Despesas: </strong>
                <span style={styles.totalExpenses}>
                  {totalExpensesFormatted}
                </span>
              </div>
              <div className="col s2">
                <strong>Saldo: </strong>
                <span style={balanceStyle}>
                  R$
                  {balanceFormatted}
                </span>
              </div>
            </div>
            <div style={styles.filterForm} className="row">
              <button
                onClick={() => handleNewTransactionClick()}
                className="waves-effect waves-light btn col s2"
                type="button"
              >
                + Novo Lançamento
              </button>
              <input
                className="col s9"
                style={styles.inputFilter}
                type="text"
                placeholder="Filtro"
                onChange={(e) => handleFindTransaction(e.target.value)}
              />
            </div>
            <table style={{ marginTop: '5px' }}>
              <tbody>
                {transactionList.map((currentTransaction) => {
                  const transactionStyle =
                    currentTransaction.type !== '-'
                      ? styles.transactionRevenue
                      : styles.transactionExpense;
                  const currentTransactionFormatted = currentTransaction.value.toLocaleString(
                    navigator.language,
                    {
                      minimumFractionDigits: 2,
                    }
                  );
                  return (
                    <tr key={currentTransaction._id} style={transactionStyle}>
                      <td style={styles.borderRadiusLeft}>
                        <strong>
                          {currentTransaction.day < 10
                            ? '0' + currentTransaction.day
                            : currentTransaction.day}
                        </strong>
                      </td>
                      <td>
                        <div>
                          <strong>{currentTransaction.category}</strong>
                        </div>
                        <div>{currentTransaction.description}</div>
                      </td>
                      <td>
                        <strong>R$</strong>
                        {currentTransactionFormatted}
                      </td>
                      <td style={styles.borderRadiusRight}>
                        <button
                          className="waves-effect waves-light btn-flat"
                          type="button"
                          onClick={() =>
                            handleEditTransaction(currentTransaction)
                          }
                        >
                          <i className="material-icons center">edit</i>
                        </button>
                        <button
                          className="waves-effect waves-light btn-flat"
                          type="button"
                          onClick={() =>
                            handleDeleteTransaction(currentTransaction)
                          }
                        >
                          <i className="material-icons center">delete</i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {isModalOpen && (
              <ModalComponent
                onSave={handlePersistData}
                onClose={handleClose}
                selectedTransaction={selectedTransaction}
              />
            )}
          </div>
        </form>
      </div>
    </>
  );
}
