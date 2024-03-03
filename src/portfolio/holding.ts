/**
 * Library for Holding class which represents the current state of and
 * history for a particular security.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import { HoldingInfo, HoldingType, fetchHoldingInfo } from "./marketData";
import Transaction, { TransactionType } from "./transaction";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

interface CostBasisItem {
  shares: number,
  sharePrice: number,
}

enum CostBasisMethod {
  FIFO = "fifo",
  LIFO = "lifo",
  AVG = "avg",
}


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

// Tolerance for cost basis calculations.
const TOLERANCE = .00001;


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default class Holding {
  private info: HoldingInfo;
  private costBasis: CostBasis;
  private pricePerShare: number;

  constructor(symbol: string) {
    this.info = fetchHoldingInfo(symbol);
    this.costBasis = new CostBasis();
    this.pricePerShare = this.sharePrice(true);
  }

  public getSymbol(): string {return this.info.symbol;}
  public getName(): string {return this.info.name;}
  public getType(): HoldingType {return this.info.type;}

  public shares(): number {
    return this.costBasis.shares();
  }

  public sharePrice(update: boolean = false): number {
    if (update) this.updateSharePrice();
    return this.pricePerShare;
  }

  public updateSharePrice(): void {
    // TODO - add API call to fetch current share price.
    // Currently returns last non-zero price from transactionHistory or 0.
    if (this.costBasis.totalCost() > 0) {
      this.pricePerShare = this.costBasis.newest().sharePrice;
    } else {
      this.pricePerShare = 0;
    }
  }

  public cost(): number {
    return this.costBasis.totalCost();
  }

  public value(update: boolean = false) {
    return this.shares()*this.sharePrice(update);
  }

  public update(t: Transaction): void {
    switch (t.type) {
      case (TransactionType.BUY): {
        this.buy(t.shares, t.sharePrice);
        break;
      }
      case (TransactionType.SELL): {
        this.sell(t.shares);
        break;
      }
      default: {
        break;
      }
    }
  }

  public buy(shares: number, sharePrice: number) {
    this.costBasis.add(shares, sharePrice);
  }

  public sell(
    shares: number,
    accountingMethod: CostBasisMethod = CostBasisMethod.FIFO,
  ) {
    this.costBasis.remove(shares, accountingMethod);
  }
}

class CostBasis {
  private items: CostBasisItem[];

  constructor() {
    this.items = [];
  }

  public shares(): number {
    let shares = 0;
    for (let i of this.items) {
      shares += i.shares;
    }
    return shares;
  }

  public totalCost(): number {
    let total = 0;
    for (let i of this.items) {
      total += i.shares*i.sharePrice;
    }
    return total;
  }

  private oldest(): CostBasisItem {
    return this.items[this.items.length-1];
  }

  private popOldest(): CostBasisItem {
    let oldest = this.items.pop();
    if (oldest === undefined) {
      throw new Error("Attempting to pop item from empty CostBasis.")
    }
    return oldest;
  }

  public newest(): CostBasisItem {
    return this.items[0];
  }

  public pushNewest(i: CostBasisItem): void {
    this.items.unshift(i);
  }

  public add(shares: number, sharePrice: number): void {
    // Treats added CostBasisItem is the newest.
    this.pushNewest(createCreateCostBasisItem(shares, sharePrice));
  }

  public remove(shares: number, accountingMethod: CostBasisMethod): void {
    if (accountingMethod === CostBasisMethod.FIFO){
      this.removeFIFO(shares);
    } else {
      throw new Error(`Unsupported CostBasisMethod: ${accountingMethod}`);
    }
  }

  private removeFIFO(shares: number) {
    while (shares > TOLERANCE && this.oldest().shares <= shares) {
      shares -= this.popOldest().shares;
    }
    if (shares > TOLERANCE) {
      this.oldest().shares -= shares;
    }
  }
}

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function createCreateCostBasisItem(
  shares: number, sharePrice: number): CostBasisItem {
  return {shares: shares, sharePrice: sharePrice} as CostBasisItem;
}

