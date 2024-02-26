/**
 * Contributes abstract class for parsing a CsvFile into a Portfolio.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import Papa, {ParseConfig, ParseResult} from 'papaparse';
import Portfolio, { Broker } from '../portfolio';
import { TransactionType } from '../transaction';


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

type csvRow = { [field: string]: string };


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default abstract class PortfolioParser {
  // Top level params.
  private  broker: Broker;
  private  portfolio: Portfolio;

  // Field keys for parsing.
  protected abstract  typeFieldKey: string;
  protected abstract  tradeDateFieldKey: string;
  protected abstract  settleDateFieldKey: string;
  protected abstract  symbolFieldKey: string;
  protected abstract  sharesFieldKey: string;
  protected abstract  principalFieldKey: string;
  protected abstract  commissionFieldKey: string;

  // Mappings for field values.
  protected abstract  transactionTypeMapping: {[key: string]: TransactionType};

  constructor(broker: Broker) {
    this.broker = broker;
    this.portfolio = new Portfolio(broker);
  }

  public async portfolioFromFile(f: File): Promise<Portfolio> {
    const csvData = await  parseCSVFile(f);
    this.parseCsvData(csvData);
    this.portfolio.update();
    return this.portfolio;
  }

  private parseCsvData(data: csvRow[]): void {
    for (let d of data) {
      const t = this.parseTransactionType(d);
      this.updatePortfolio(t, d);
    }
  }

  private updatePortfolio(t: TransactionType, row: csvRow): void {
    switch (t) {
      case TransactionType.DEPOSIT: {
        this.makeDeposit(row);
        break;
      }
      case TransactionType.WITHDRAWAL: {
        this.makeWithrawal(row);
        break;
      }
      case TransactionType.BUY: {
        this.makeBuy(row);
        break;
      }
      case TransactionType.SELL: {
        this.makeSell(row);
        break;
      }
      case TransactionType.DIVIDEND: {
        this.makeDividend(row);
        break;
      }
      case TransactionType.CAPITAL_GAIN_ST: {
        this.makeCapitalGainSt(row);
        break;
      }
      case TransactionType.CAPITAL_GAIN_LT: {
        this.makeCapitalGainLt(row);
        break;
      }
      default: {
        throw new Error(`Unsupported transaction type: ${t}`);
      }
    };
  }

  private makeDeposit(row: csvRow): void {
    this.portfolio.deposit(
      this.parseTradeDate(row),
      this.parsePrincipal(row),
    );
  };

  private makeWithrawal(row: csvRow): void {
    this.portfolio.withdrawal(
      this.parseTradeDate(row),
      this.parsePrincipal(row),
    );
  };

  private makeBuy(row: csvRow): void {
    this.portfolio.buy(
      this.parseTradeDate(row),
      this.parseSettleDate(row),
      this.parseSymbol(row),
      this.parseShares(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
    );
  };

  private makeSell(row: csvRow): void {
    this.portfolio.sell(
      this.parseTradeDate(row),
      this.parseSettleDate(row),
      this.parseSymbol(row),
      this.parseShares(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
    );
  };

  private makeDividend(row: csvRow): void {
    this.portfolio.dividend(
      this.parseTradeDate(row),
      this.parseSymbol(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
    );
  };

  private makeCapitalGainSt(row: csvRow): void {
    this.portfolio.capitalGainSt(
      this.parseTradeDate(row),
      this.parseSymbol(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
    );
  };

  private makeCapitalGainLt(row: csvRow): void {
    this.portfolio.capitalGainLt(
      this.parseTradeDate(row),
      this.parseSymbol(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
    );
  };

  private parseTransactionType(row: csvRow): TransactionType {
    const value =  getStringRowFieldValue(row, this.typeFieldKey);
    if (!(value in this.transactionTypeMapping)) {
      throw new Error(`Invalid ${this.broker} TransactionType value: ${value}`);
    }
    return this.transactionTypeMapping[value];
  };

  private parseTradeDate(row: csvRow): Date {
    return  getDateRowFieldValue(row, this.tradeDateFieldKey);
  }

  private parseSettleDate(row: csvRow): Date {
    return  getDateRowFieldValue(row, this.settleDateFieldKey);
  }

  private parseSymbol(row: csvRow): string {
    return  getStringRowFieldValue(row, this.symbolFieldKey);
  }

  private parseShares(row: csvRow): number {
    return  getFloatRowFieldValue(row, this.sharesFieldKey);
  }

  private parsePrincipal(row: csvRow): number {
    return  getFloatRowFieldValue(row, this.principalFieldKey);
  }

  private parseCommission(row: csvRow): number {
    return  getFloatRowFieldValue(row, this.commissionFieldKey);
  }
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function  parseCSVFile(csvFile: any): Promise<csvRow[]> {
  return new Promise((resolve, reject) => {
    const config: ParseConfig = {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<csvRow>) => {
            resolve(results.data);
        }
    }
    Papa.parse(csvFile, config);
  });
}

function  getDateRowFieldValue(row: csvRow, fieldKey: string): Date {
  const value =  getStringRowFieldValue(row, fieldKey);
  return new Date(value);
}

function  getFloatRowFieldValue(row: csvRow, fieldKey: string): number {
  const value =  getStringRowFieldValue(row, fieldKey).replace(/,/g, '');
  return Math.abs(parseFloat(value));
}

function  getStringRowFieldValue(row: csvRow, fieldKey: string): string {
  const value = row[fieldKey];
  if (value === undefined) {
    throw new Error(`Field key "${fieldKey}" not found for row: ${row}`);
  }
  return value;
}
