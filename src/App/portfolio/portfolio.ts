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

import { csvRow, parseCSVFile } from "../utils";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

interface Transaction {
  type: TransactionType;
  time: Date;
  amount: number;
}

enum TransactionType {
  UNDEFINED = "undefined",
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  BUY = "buy",
  SELL = "sell",
  DIVIDEND = "dividend",
}

enum Broker {
  UNDEFINED = "undefined",
  VANGUARD = "vanguard",
  FIDELITY = "fidelity",
  ROBINHOOD = "robinhood",
}


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

const _VANGUARD_TRANSACTION_TYPE_FIELD_HEADING = "Transaction Description"
const _VANGUARD_AMOUNT_FIELD_HEADING = "Principal Amount"
const _VANGUARD_TIME_FIELD_HEADING = "Trade Date"


const _VANGUARD_TRANSACTION_TYPE_MAPPING = new Map<string, TransactionType>([
  ["Dividend Received", TransactionType.DIVIDEND],
  ["Dividend Reinvestment", TransactionType.BUY],
  ["Buy", TransactionType.BUY],
  ["Sweep Out Of Settlement Fund", TransactionType.SELL],
  ["Funds received via Electronic Bank Transfer", TransactionType.DEPOSIT],
  ["Sweep Into Settlement Fund", TransactionType.BUY],
]);


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default class Portfolio {
  private _transaction_history: Transaction[];

  constructor(transaction_history?: Transaction[]) {
    this._transaction_history = transaction_history || [];
  }

  _addTranscation(t: Transaction) {
    this._transaction_history.push(t);
  }

  // total(): number {
  //   let total = 0;
  //   for (const t of this._transaction_history) {
  //     total += (t.positive  ? t.amount : -t.amount);
  //   }
  //   return total;
  // }

  private _type_total(t_type: TransactionType): number {
    let total = 0;
    for (const t of this._transaction_history) {
      if (t.type === t_type) {total += t.amount;};
    }
    return total;
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

export async function portfolioFromFile(f: File): Promise<Portfolio> {
  const csvData = await parseCSVFile(f);
  return _portfolioFromDataObjects(csvData);
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

function _transactionFromVanguardData(d: any): Transaction {
  const type = _VANGUARD_TRANSACTION_TYPE_MAPPING.get(d[_VANGUARD_TRANSACTION_TYPE_FIELD_HEADING]);
  if (type === undefined) {
    throw new Error(`Missing field in Vanguard portfolio data record: ${_VANGUARD_TRANSACTION_TYPE_FIELD_HEADING}`)
  }
  const time = new Date(d[_VANGUARD_TIME_FIELD_HEADING]);
  const amount = Math.abs(Number(d[_VANGUARD_AMOUNT_FIELD_HEADING]))
  return _createTransaction(
    type,
    time,
    amount,
  );
}

function _transactionFromDataObject(
  d: csvRow, 
  b: Broker = Broker.VANGUARD,
): Transaction {
  switch (b) {
    case Broker.VANGUARD: {
      return _transactionFromVanguardData(d);
    }
    default: {
      throw new Error(`Unsupported broker: ${b}`);
    }
  }
}

function _portfolioFromDataObjects(
  data: csvRow[],
  broker: Broker = Broker.VANGUARD,
): Portfolio {
  let portfolio = new Portfolio();
  for (let d of data) {
    const t = _transactionFromDataObject(d, broker);
    portfolio._addTranscation(t);
  }
  return portfolio;
}

