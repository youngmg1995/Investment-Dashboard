/**
 * Library for Portfolio class which represents a financial account
 * created through a series of transactions.
 * 
 * Usage:
 * 
 *   let portflio = new Portfolio()
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

export enum Broker {
  UNDEFINED = "undefined",
  VANGUARD = "vanguard",
  FIDELITY = "fidelity",
  ROBINHOOD = "robinhood",
}

interface Transaction {
  type: TransactionType;
  time: Date;
  amount: number;
}

export enum TransactionType {
  UNDEFINED = "undefined",
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  BUY = "buy",
  SELL = "sell",
  DIVIDEND = "dividend",
}

// export enum TransactionSubType {
//   UNDEFINED = "undefined",
//   DEPOSIT = "deposit",
//   WITHDRAWAL = "withdrawal",
//   BUY = "buy",
//   SELL = "sell",
//   DIVIDEND = "dividend",
// }


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default class Portfolio {
  private _broker: Broker;
  private _transaction_history: Transaction[];

  constructor(broker: Broker, transaction_history?: Transaction[]) {
    this._broker = broker;
    this._transaction_history = transaction_history || [];
  }

  deposit(time: Date, amount: number) {
    this._makeTransaction(TransactionType.DEPOSIT, time, amount);
  }

  withdrawal(time: Date, amount: number) {
    this._makeTransaction(TransactionType.WITHDRAWAL, time, amount);
  }

  buy(time: Date, amount: number) {
    this._makeTransaction(TransactionType.BUY, time, amount);
  }

  sell(time: Date, amount: number) {
    this._makeTransaction(TransactionType.SELL, time, amount);
  }

  dividend(time: Date, amount: number) {
    this._makeTransaction(TransactionType.DIVIDEND, time, amount);
  }

  _addTranscation(t: Transaction) {
    this._transaction_history.push(t);
  }

  private _makeTransaction(
    type: TransactionType,
    time: Date,
    amount: number,
  ) {
    const t = _createTransaction(type, time, amount);
    this._addTranscation(t); 
  };
}

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function _createTransaction(
  type: TransactionType,
  time: Date,
  amount: number,
): Transaction {
  return {
    type: type,
    time: time,
    amount: amount,
  } as Transaction;
}

