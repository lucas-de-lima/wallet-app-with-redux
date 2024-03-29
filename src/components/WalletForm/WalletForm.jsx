import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCurrencies,
  saveEditedExpense, saveExpenses } from '../../redux/actions/walletActions';
import Input from '../Input/Input';
import Button from '../Button/Button';

class WalletForm extends Component {
  state = {
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
  }

  handleInput = ({ target: { name, value } }) => {
    this.setState(({
      [name]: value,
    }));
  };

  fetchExchange = async () => {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const data = await response.json();
    return data;
  };

  handleSave = async () => {
    const { dispatch, expenses } = this.props;
    const { value, description, currency, method, tag } = this.state;
    const expense = {
      id: expenses.length === 0 ? 0 : expenses[expenses.length - 1].id + 1,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: await this.fetchExchange(),
    };
    dispatch(saveExpenses(expense));
  };

  handleClick = async () => {
    const { editor } = this.props;
    if (editor) {
      this.handleEdit();
    } else {
      this.handleSave();
    }

    this.setState({
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    });
  };

  handleEdit = () => {
    const { expenses, idToEdit, dispatch } = this.props;
    const { value, description, currency, method, tag } = this.state;
    const editExpense = expenses.find((expense) => expense.id === idToEdit);
    const editedExpense = {
      id: editExpense.id,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: editExpense.exchangeRates,
    };
    dispatch(saveEditedExpense(editedExpense));
  };

  render() {
    const { value, description, currency, method, tag } = this.state;
    const { currencies, buttonName } = this.props;
    return (
      <div className="wallet-form">
        <Input
          type="number"
          value={ value }
          name="value"
          testId="value-input"
          handleInput={ this.handleInput }
        >
          Valor
        </Input>
        <Input
          type="text"
          value={ description }
          name="description"
          testId="description-input"
          handleInput={ this.handleInput }
        >
          Descrição
        </Input>
        <select
          value={ currency }
          name="currency"
          data-testid="currency-input"
          onChange={ this.handleInput }
        >
          { currencies.length && currencies
            .map((curr) => <option key={ curr } value={ curr }>{ curr }</option>) }
        </select>
        <select
          value={ method }
          name="method"
          data-testid="method-input"
          onChange={ this.handleInput }
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
        <select
          value={ tag }
          name="tag"
          data-testid="tag-input"
          onChange={ this.handleInput }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
        <Button
          data-testid=""
          handleClick={ this.handleClick }
          buttonDisable={ false }
        >
          { buttonName }
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ wallet: { currencies, expenses, editor, idToEdit } }) => ({
  currencies,
  expenses,
  editor,
  idToEdit,
});

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.string).isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonName: PropTypes.string.isRequired,
  idToEdit: PropTypes.number.isRequired,
  editor: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(WalletForm);
