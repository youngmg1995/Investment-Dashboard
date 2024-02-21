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
  tradeDate: Date;
  settleDate: Date;
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

const  CASH_SYMBOL = "0000";
export const MONEY_MARKET_SYMBOL = "0001";


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default class Portfolio {
  private  broker: Broker;
  private  transactionHistory: Transaction[];

  constructor(broker: Broker, transactionHistory?: Transaction[]) {
    this.broker = broker;
    this.transactionHistory = transactionHistory || [];
  }

  deposit(time: Date, amount: number) {
    const tradeDate = time;
    const settleDate = time;
    const symbol =  CASH_SYMBOL;
    const shares = amount;
    const principal = amount;
    const commission = 0.00; 
    const net = amount;
    this.buy(
      tradeDate, settleDate, symbol, shares, principal, commission, net
    );
  }

  withdrawal(time: Date, amount: number) {
    const tradeDate = time;
    const settleDate = time;
    const symbol =  CASH_SYMBOL;
    const shares = amount;
    const principal = amount;
    const commission = 0.00; 
    const net = amount;
    this.sell(
      tradeDate, settleDate, symbol, shares, principal, commission, net
    );
  }

  buy(
    tradeDate: Date,
    settleDate: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
    net: number,
  ) {
    this.makeTransaction(
      TransactionType.BUY,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
  }

  sell(
    tradeDate: Date,
    settleDate: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
    net: number,
  ) {
    this.makeTransaction(
      TransactionType.SELL,
      tradeDate,
      settleDate,
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
    const tradeDate = time;
    const settleDate = time;
    const shares = net;
    this.makeTransaction(
      TransactionType.DIVIDEND,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
    const amount = net;
    this.deposit(time, amount); 
  }

   addTranscation(t: Transaction) {
    this.transactionHistory.push(t);
  }

  private  makeTransaction(
    type: TransactionType,
    tradeDate: Date,
    settleDate: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
    net: number,
  ) {
    const t =  createTransaction(
      type,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
      net,
    );
    this.addTranscation(t); 
  };
}

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function  createTransaction(
  type: TransactionType,
  tradeDate: Date,
  settleDate: Date,
  symbol: string,
  shares: number,
  principal: number,
  commission: number,
  net: number,
): Transaction {
  return {
    type,
    tradeDate: tradeDate,
    settleDate: settleDate,
    symbol,
    shares,
    principal,
    commission,
    net,
  } as Transaction;
}

