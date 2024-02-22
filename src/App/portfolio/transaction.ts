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

export function  createTransaction(
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



/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */