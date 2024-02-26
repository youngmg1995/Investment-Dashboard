/**
 * Library for Transaction interface and associated types.
 */


/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */



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
  UNDEFINED = "0_undefined",
  DEPOSIT = "1_deposit",
  WITHDRAWAL = "7_withdrawal",
  BUY = "5_buy",
  SELL = "6_sell",
  DIVIDEND = "2_dividend",
  CAPITAL_GAIN_ST = "3_capital_gain_st",
  CAPITAL_GAIN_LT = "4_captial_gain_lt",
}

type TransactionCompareFn = (t1: Transaction, t2: Transaction) => number;


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
  private transactions: Transaction[];
  private isSorted: boolean;
  private mostRecentTransaction?: Transaction;
  private compareFn: TransactionCompareFn;

  constructor(
    compareFn: TransactionCompareFn = compareTransactions
  ) {
    this.transactions = [];
    this.isSorted = true;
    this.compareFn = compareFn;
  }

  [key: number]: Transaction;

  public size(): number {
    return this.transactions.length;
  }

  public push(t: Transaction): void {
    if (this.sorted()) {
      if (
        this.mostRecentTransaction === undefined || 
        this.compareFn(t, this.mostRecentTransaction) >= 0
      ) {
        this.mostRecentTransaction = t;
      } else {
        this.isSorted = false;
        this.mostRecentTransaction = undefined;
      }
    }
    this.transactions.push(t);
  }

  public sorted(): boolean {
    return this.isSorted;
  }

  public sort(): void {
    if (this.sorted()) return;
    this.transactions.sort(this.compareFn);
    this.isSorted = true;
    this.mostRecentTransaction = this.transactions[this.size() - 1];
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

function compareTransactions(
  t1: Transaction, t2: Transaction
): number {
  const v = compareTransactionsOnTradeDate(t1, t2);
  if (v === 0) return compareTransactionTypes(t1.type, t2.type);
  return v;
}

function compareTransactionsOnTradeDate(
  t1: Transaction, t2: Transaction
): number {
  if (t1.tradeDate > t2.tradeDate) {
    return 1;
  } else if (t1.tradeDate < t2.tradeDate) {
    return -1;
  } else {
    return 0;
  }
}

function compareTransactionTypes(
  t1: TransactionType, t2: TransactionType
): number {
  return t1.valueOf().localeCompare(t2.valueOf());
}
