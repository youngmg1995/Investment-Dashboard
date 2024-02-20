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
  protected _broker: Broker = Broker.UNDEFINED;
  private _portfolio: Portfolio;

  // Field keys for parsing.
  protected abstract _type_field_key: string;
  protected abstract _date_field_key: string;
  protected abstract _amount_field_key: string;

  // Mappings for field values.
  protected abstract _transaction_type_mapping: Map<string, TransactionType>;

  constructor() {
    this._portfolio = new Portfolio(this._broker);
  }

  async portfolioFromFile(f: File): Promise<Portfolio> {
    const csvData = await _parseCSVFile(f);
    this._parseCsvData(csvData);
    return this._portfolio;
  }

  _parseCsvData(data: csvRow[]): void {
    for (let d of data) {
      const t = this._parseTransactionType(d);
      this._updatePortfolio(t, d);
    }
  }

  _updatePortfolio(t: TransactionType, row: csvRow): void {
    switch (t) {
      case TransactionType.DEPOSIT: {
        this._makeDeposit(row);
        break;
      }
      case TransactionType.WITHDRAWAL: {
        this._makeDeposit(row);
        break;
      }
      case TransactionType.BUY: {
        this._makeDeposit(row);
        break;
      }
      case TransactionType.SELL: {
        this._makeDeposit(row);
        break;
      }
      case TransactionType.DIVIDEND: {
        this._makeDeposit(row);
        break;
      }
      default: {
        throw new Error(`Unsupported transaction type: ${t}`);
      }
    };

  }

  _parseTransactionType(row: csvRow): TransactionType {
    const value = _getRowFieldValue(row, this._type_field_key);
    const t = this._transaction_type_mapping.get(value);
    if (t === undefined) {
      throw new Error(`Invalid ${this._broker} TransactionType value: ${value}`);
    }
    return t;
  };

  _parseTime(row: csvRow): Date {
    return new Date();
  }

  _parseAmount(row: csvRow): number {
    return 0;
  }

  _makeDeposit(row: csvRow): void {
    this._portfolio.deposit(
      this._parseTime(row),
      this._parseAmount(row),
    );
  };

  _makeWithrawal(row: csvRow): void {
    this._portfolio.withdrawal(
      this._parseTime(row),
      this._parseAmount(row),
    );
  };

  _makeBuy(row: csvRow): void {
    this._portfolio.buy(
      this._parseTime(row),
      this._parseAmount(row),
    );
  };

  _makeSell(row: csvRow): void {
    this._portfolio.sell(
      this._parseTime(row),
      this._parseAmount(row),
    );
  };

  _makeDividend(row: csvRow): void {
    this._portfolio.dividend(
      this._parseTime(row),
      this._parseAmount(row),
    );
  };
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function _parseCSVFile(csv_file: any): Promise<csvRow[]> {
  return new Promise((resolve, reject) => {
    const config: ParseConfig = {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<csvRow>) => {
            resolve(results.data);
        }
    }
    Papa.parse(csv_file, config);
  });
}

function _getRowFieldValue(row: csvRow, field_key: string): string {
  const value = row[field_key];
  if (value === undefined) {
    throw new Error(`Field key "${field_key}" not found for row: ${row}`);
  }
  return value;
}
