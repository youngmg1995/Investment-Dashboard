/**
 * Contributes abstract class for parsing a CsvFile into a Portfolio.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import Papa, {ParseConfig, ParseResult} from 'papaparse';
import Portfolio, { Broker, TransactionType } from '../portfolio';


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
  protected abstract  netFieldKey: string;

  // Mappings for field values.
  protected abstract  transactionTypeMapping: Map<string, TransactionType>;

  constructor(broker: Broker) {
    this.broker = broker;
    this.portfolio = new Portfolio(broker);
  }

  async portfolioFromFile(f: File): Promise<Portfolio> {
    const csvData = await  parseCSVFile(f);
    this.parseCsvData(csvData);
    return this.portfolio;
  }

   parseCsvData(data: csvRow[]): void {
    for (let d of data) {
      const t = this.parseTransactionType(d);
      this.updatePortfolio(t, d);
    }
  }

   updatePortfolio(t: TransactionType, row: csvRow): void {
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
      default: {
        throw new Error(`Unsupported transaction type: ${t}`);
      }
    };
  }

   makeDeposit(row: csvRow): void {
    this.portfolio.deposit(
      this.parseTradeDate(row),
      this.parseNet(row),
    );
  };

   makeWithrawal(row: csvRow): void {
    this.portfolio.withdrawal(
      this.parseTradeDate(row),
      this.parseNet(row),
    );
  };

   makeBuy(row: csvRow): void {
    this.portfolio.buy(
      this.parseTradeDate(row),
      this.parseSettleDate(row),
      this.parseSymbol(row),
      this.parseShares(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
      this.parseNet(row),
    );
  };

   makeSell(row: csvRow): void {
    this.portfolio.sell(
      this.parseTradeDate(row),
      this.parseSettleDate(row),
      this.parseSymbol(row),
      this.parseShares(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
      this.parseNet(row),
    );
  };

   makeDividend(row: csvRow): void {
    this.portfolio.dividend(
      this.parseTradeDate(row),
      this.parseSymbol(row),
      this.parsePrincipal(row),
      this.parseCommission(row),
      this.parseNet(row),
    );
  };

   parseTransactionType(row: csvRow): TransactionType {
    const value =  getStringRowFieldValue(row, this.typeFieldKey);
    const t = this.transactionTypeMapping.get(value);
    if (t === undefined) {
      throw new Error(`Invalid ${this.broker} TransactionType value: ${value}`);
    }
    return t;
  };

   parseTradeDate(row: csvRow): Date {
    return  getDateRowFieldValue(row, this.tradeDateFieldKey);
  }

   parseSettleDate(row: csvRow): Date {
    return  getDateRowFieldValue(row, this.settleDateFieldKey);
  }

   parseSymbol(row: csvRow): string {
    return  getStringRowFieldValue(row, this.symbolFieldKey);
  }

   parseShares(row: csvRow): number {
    return  getNumericRowFieldValue(row, this.sharesFieldKey);
  }

   parsePrincipal(row: csvRow): number {
    return  getNumericRowFieldValue(row, this.principalFieldKey);
  }

   parseCommission(row: csvRow): number {
    return  getNumericRowFieldValue(row, this.commissionFieldKey);
  }

   parseNet(row: csvRow): number {
    return  getNumericRowFieldValue(row, this.netFieldKey);
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

function  getNumericRowFieldValue(row: csvRow, fieldKey: string): number {
  const value =  getStringRowFieldValue(row, fieldKey);
  return Number(value);
}

function  getStringRowFieldValue(row: csvRow, fieldKey: string): string {
  const value = row[fieldKey];
  if (value === undefined) {
    throw new Error(`Field key "${fieldKey}" not found for row: ${row}`);
  }
  return value;
}
