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

import Holding from "./holding";
import Transaction, { 
  TransactionHistory, TransactionType, createTransaction 
} from "./transaction";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

export enum Broker {
  UNDEFINED = "undefined",
  VANGUARD = "vanguard",
  FIDELITY = "fidelity",
  ROBINHOOD = "robinhood",
}


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

const CASH_SYMBOL = "0000";


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default class Portfolio {
  private broker: Broker;
  private alwaysUpdate: boolean;
  private transactionHistory: TransactionHistory;
  private holdings: {[symbol: string]: Holding};

  constructor(broker: Broker, alwaysUpdate: boolean = false) {
    this.broker = broker;
    this.alwaysUpdate = alwaysUpdate;
    this.transactionHistory = new TransactionHistory();
    this.holdings = {};
  }

  public value() {
    this.update();
    let value = 0;
    for (let s in this.holdings) {
      value += this.holdings[s].value();
    }
    return value;
  }

  public update(): void {
    if (this.isCurrent()) return;
    this.transactionHistory.sort();
    this.updateHoldings();
  }

  private updateHoldings(): void {
    this.holdings = {};
    for (let t of this.transactionHistory) {
      this.updateHolding(t);
    }
    for (let s in this.holdings) {
      this.holdings[s].updateSharePrice();
    }
  }

  private updateHolding(t: Transaction): void {
    if (!(t.symbol in this.holdings)) {
      this.holdings[t.symbol] = new Holding();
    }
    this.holdings[t.symbol].update(t);
  }

  public isCurrent(): boolean {
    if (!this.transactionHistory.sorted()) return false;
    // for (let s in this.holdings) {
    //   const h = this.holdings[s];
    //   if (!h.isCurrent()) return false;
    // }
    return true;
  }

  public deposit(time: Date, amount: number) {
    const tradeDate = time;
    const settleDate = time;
    const symbol = CASH_SYMBOL;
    const shares = amount;
    const principal = amount;
    const commission = 0.00;
    this.buy(
      tradeDate, settleDate, symbol, shares, principal, commission
    );
  }

  public withdrawal(time: Date, amount: number) {
    const tradeDate = time;
    const settleDate = time;
    const symbol = CASH_SYMBOL;
    const shares = amount;
    const principal = amount;
    const commission = 0.00;
    this.sell(
      tradeDate, settleDate, symbol, shares, principal, commission
    );
  }

  public buy(
    tradeDate: Date,
    settleDate: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
  ) {
    shares = shares || principal;
    this.makeTransaction(
      TransactionType.BUY,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
    );
  }

  public sell(
    tradeDate: Date,
    settleDate: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
  ) {
    shares = shares || principal;
    this.makeTransaction(
      TransactionType.SELL,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
    );
  }

  public dividend(
    time: Date,
    symbol: string,
    principal: number,
    commission: number,
  ) {
    const tradeDate = time;
    const settleDate = time;
    const shares = 0;
    this.makeTransaction(
      TransactionType.DIVIDEND,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
    );
    const amount = principal - commission;
    this.deposit(time, amount);
  }

  public capitalGainSt(
    time: Date,
    symbol: string,
    principal: number,
    commission: number,
  ) {
    const tradeDate = time;
    const settleDate = time;
    const shares = 0;
    this.makeTransaction(
      TransactionType.CAPITAL_GAIN_ST,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
    );
    const amount = principal - commission;
    this.deposit(time, amount);
  }

  public capitalGainLt(
    time: Date,
    symbol: string,
    principal: number,
    commission: number,
  ) {
    const tradeDate = time;
    const settleDate = time;
    const shares = 0;
    this.makeTransaction(
      TransactionType.CAPITAL_GAIN_LT,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
    );
    const amount = principal - commission;
    this.deposit(time, amount);
  }

  private makeTransaction(
    type: TransactionType,
    tradeDate: Date,
    settleDate: Date,
    symbol: string,
    shares: number,
    principal: number,
    commission: number,
  ) {
    const t = createTransaction(
      type,
      tradeDate,
      settleDate,
      symbol,
      shares,
      principal,
      commission,
    );
    this.addTranscation(t);
  };

  private addTranscation(t: Transaction) {
    this.transactionHistory.push(t);
    if (this.alwaysUpdate && this.isCurrent()) {
      this.updateHolding(t);
    }
  }
}

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */


