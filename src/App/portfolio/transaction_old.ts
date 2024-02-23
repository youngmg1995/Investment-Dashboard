/**
 * Library for Transaction interface and associated types.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import { SortedArray } from './utils';

/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

export default interface Transaction {
  type: TransactionType;
  tradeDate: Date;
  settleDate: Date;
  symbol: string;
  shares: number;
  sharePrice: number;
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
  CAPITAL_GAIN_ST = "capital_gain_st",
  CAPITAL_GAIN_LT = "captial_gain_lt",
}


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

/**
 * Class for storing transactions in an ordered manner.
 */
export class TransactionHistory {
  private transactions: SortedArray<Transaction>;

  constructor() {
    this.transactions = new SortedArray<Transaction>(
      compareTransactionsOnTradeDate);
  }

  [key: number]: Transaction;

  public size() {
    return this.transactions.length;
  }

  public push(t: Transaction): number {
    return this.transactions.push(t);
  }

  public [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        done: i >= this.transactions.length,
        value: this.transactions[i++],
      })
    };
  };
}


export function  createTransaction(
  type: TransactionType,
  tradeDate: Date,
  settleDate: Date,
  symbol: string,
  shares: number,
  principal: number,
  commission: number,
): Transaction {
  const sharePrice = shares > 0 ? principal / shares : 0;
  const net = principal - commission;
  return {
    type,
    tradeDate: tradeDate,
    settleDate: settleDate,
    symbol,
    shares,
    sharePrice,
    principal,
    commission,
    net,
  } as Transaction;
}



/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function compareTransactionsOnTradeDate(
  t1: Transaction, t2: Transaction): number {
  if (t1.tradeDate > t2.tradeDate) {
    return 1;
  } else if (t1.tradeDate < t2.tradeDate) {
    return -1;
  } else {
    return 0;
  }
}
