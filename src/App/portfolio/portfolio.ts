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
  trade_time: Date;
  settle_time: Date;
  symbol: string;
  shares: number;
  principal: number;
  commission: number;
  net: number;
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

const _CASH_SYMBOL = "0000";
const _MONEY_MARKET_SYMBOL = "0001";


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
    const trade_time = time;
    const settle_time = time;
    const symbol = _CASH_SYMBOL;
    const shares = amount;
    const principal = amount;
    const commission = 0.00; 
    const net = amount;
    this.buy(
      trade_time, settle_time, symbol, shares, principal, commission, net
    );
  }

  withdrawal(time: Date, amount: number) {
    const trade_time = time;
    const settle_time = time;
    const symbol = _CASH_SYMBOL;
    const shares = amount;
    const principal = amount;
    const commission = 0.00; 
    const net = amount;
    this.sell(
      trade_time, settle_time, symbol, shares, principal, commission, net
    );
  }

  buy(
    trade_time: Date,
    settle_time: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
    net: number,
  ) {
    this._makeTransaction(
      TransactionType.BUY,
      trade_time,
      settle_time,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
  }

  sell(
    trade_time: Date,
    settle_time: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
    net: number,
  ) {
    this._makeTransaction(
      TransactionType.SELL,
      trade_time,
      settle_time,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
  }

  dividend(
    time: Date,
    symbol: string,
    principal: number,
    commission: number,
    net: number,
  ) {
    const trade_time = time;
    const settle_time = time;
    const shares = net;
    this._makeTransaction(
      TransactionType.DIVIDEND,
      trade_time,
      settle_time,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
    const amount = net;
    this.deposit(time, amount); 
  }

  _addTranscation(t: Transaction) {
    this._transaction_history.push(t);
  }

  private _makeTransaction(
    type: TransactionType,
    trade_time: Date,
    settle_time: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
    net: number,
  ) {
    const t = _createTransaction(
      type,
      trade_time,
      settle_time,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
    this._addTranscation(t); 
  };
}

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function _createTransaction(
  type: TransactionType,
  trade_time: Date,
  settle_time: Date,
  symbol: string,
  shares: number,
  principal: number,
  commission: number,
  net: number,
): Transaction {
  return {
    type,
    trade_time,
    settle_time,
    symbol,
    shares,
    principal,
    commission,
    net,
  } as Transaction;
}

