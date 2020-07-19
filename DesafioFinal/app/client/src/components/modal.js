import React, { useState } from 'react';
import Modal from 'react-modal';
import M from 'materialize-css';

Modal.setAppElement('#root');
export default function ModalComponent({
  onSave,
  onClose,
  selectedTransaction,
}) {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const {
    _id: id,
    description,
    value,
    category,
    yearMonthDay,
    type,
    typePositive = type === '+' ? true : false,
    typeNegative = type === '-' ? true : false,
  } = selectedTransaction;

  const [descriptionInput, setDescriptionInput] = useState(
    description !== undefined ? description : ''
  );
  const [valueInput, setValueInput] = useState(value !== undefined ? value : 0);
  const [categoryInput, setCategoryInput] = useState(
    category !== undefined ? category : ''
  );
  const [yearMonthDayInput, setYearMonthDayInput] = useState(
    yearMonthDay !== undefined ? yearMonthDay : ''
  );
  const [typeInput, setTypeInput] = useState(type !== undefined ? type : '');

  const handleDescription = (event) => {
    setDescriptionInput(event.target.value);
  };

  const handleValue = (event) => {
    //if (!Number(event.target.value)) {
    //return;
    //}
    setValueInput(event.target.value);
  };

  const handleCategory = (event) => {
    setCategoryInput(event.target.value);
  };

  const handleYearMonthDay = (event) => {
    setYearMonthDayInput(event.target.value);
  };

  const handleType = (event) => {
    setTypeInput(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    let idInput = '';
    if (id !== undefined && id !== '') {
      idInput = id;
    }

    if (descriptionInput === undefined || descriptionInput === '') {
      M.toast({
        html: 'ATENÇÃO. Você precisa informar a descrição do lançamento.',
        classes: 'rounded',
      });
      return;
    }

    if (valueInput === undefined || valueInput === '' || valueInput === '0') {
      M.toast({
        html: 'ATENÇÃO. Você precisa informar o valor do lançamento.',
        classes: 'rounded',
      });
      return;
    }

    if (categoryInput === undefined || categoryInput === '') {
      M.toast({
        html: 'ATENÇÃO. Você precisa informar a categoria do lançamento.',
        classes: 'rounded',
      });
      return;
    }

    if (yearMonthDayInput === undefined || yearMonthDayInput === '') {
      M.toast({
        html: 'ATENÇÃO. Você precisa informar a categoria do lançamento.',
        classes: 'rounded',
      });
      return;
    }

    const year = yearMonthDayInput.substring(6, 10);
    const month = yearMonthDayInput.substring(3, 5);
    const day = yearMonthDayInput.substring(0, 2);
    const yearMonth = year + '-' + month;
    const yearMonthDay = year + '-' + month + '-' + day;

    const formData = {
      id: idInput,
      description: descriptionInput,
      value: parseFloat(valueInput),
      category: categoryInput,
      year: year,
      month: month,
      day: day,
      yearMonth: yearMonth,
      yearMonthDay: yearMonthDay,
      type: typeInput,
    };
    onSave(formData);
  };

  const handleCancelButton = () => {
    onClose(null);
  };

  if (
    yearMonthDayInput.substring(3, 2) !== '/' &&
    yearMonthDayInput.substring(3, 2) !== '/'
  ) {
    const year = yearMonthDayInput.substring(0, 4);
    const month = yearMonthDayInput.substring(5, 7);
    const day = yearMonthDayInput.substring(8, 10);
    selectedTransaction.yearMonthDay = day + '/' + month + '/' + year;
  }

  return (
    <div>
      <Modal isOpen={true} style={customStyles}>
        <form>
          {/* Início do Modal :) */}

          <div className="row center">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              className="row"
            >
              <div className="col s12 center">
                <h4 className="center">Inclusão/Edição de Lançamento</h4>
                <div className="switch">
                  <label>
                    <input
                      name="group1"
                      type="radio"
                      id="txttypepositive"
                      checked={typePositive}
                      onClick={handleType}
                      onChange={handleType}
                      value="+"
                    />
                    <span>Receita</span>
                  </label>
                  <label>
                    <input
                      name="group1"
                      type="radio"
                      checked={typeNegative}
                      id="txttypenegative"
                      onClick={handleType}
                      onChange={handleType}
                      value="-"
                    />
                    <span>Despesa</span>
                  </label>
                </div>
                <div className="input-field">
                  <input
                    id="txtdescription"
                    type="text"
                    value={descriptionInput}
                    onChange={handleDescription}
                  />
                  <label htmlFor="txtdescription" className="active">
                    Descrição do lançamento:
                  </label>
                </div>
                <div className="input-field">
                  <input
                    id="txtcategory"
                    type="text"
                    value={categoryInput}
                    onChange={handleCategory}
                  />
                  <label htmlFor="txtcategory" className="active">
                    Categoria do lançamento:
                  </label>
                </div>
                <div className="input-field">
                  <input
                    id="txtvalue"
                    type="number"
                    value={valueInput}
                    onChange={handleValue}
                  />
                  <label htmlFor="txtvalue" className="active">
                    Valor do lançamento:
                  </label>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    id="txtyearMonthDay"
                    value={yearMonthDayInput}
                    onChange={handleYearMonthDay}
                  />
                  <label htmlFor="txtyearMonthDay" className="active">
                    Data do lançamento:
                  </label>
                </div>
                <div className="col s6 center">
                  <a
                    href="#"
                    className="waves-effect waves-light btn"
                    onClick={handleFormSubmit}
                  >
                    <i className="material-icons left">save</i>Salvar
                  </a>
                </div>
                <div className="col s6 center">
                  <a
                    href="#"
                    className="waves-effect waves-light btn"
                    onClick={handleCancelButton}
                  >
                    <i className="material-icons left">cancel</i>Voltar
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Término do Modal :) */}
        </form>
      </Modal>
    </div>
  );
}
