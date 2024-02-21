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
  private _broker: Broker;
  private _portfolio: Portfolio;

  // Field keys for parsing.
  protected abstract _type_field_key: string;
  protected abstract _trade_date_field_key: string;
  protected abstract _settle_date_field_key: string;
  protected abstract _symbol_field_key: string;
  protected abstract _shares_field_key: string;
  protected abstract _principal_field_key: string;
  protected abstract _commission_field_key: string;
  protected abstract _net_field_key: string;

  // Mappings for field values.
  protected abstract _transaction_type_mapping: Map<string, TransactionType>;

  constructor(broker: Broker) {
    this._broker = broker;
    this._portfolio = new Portfolio(broker);
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
        this._makeWithrawal(row);
        break;
      }
      case TransactionType.BUY: {
        this._makeBuy(row);
        break;
      }
      case TransactionType.SELL: {
        this._makeSell(row);
        break;
      }
      case TransactionType.DIVIDEND: {
        this._makeDividend(row);
        break;
      }
      default: {
        throw new Error(`Unsupported transaction type: ${t}`);
      }
    };
  }

  _makeDeposit(row: csvRow): void {
    this._portfolio.deposit(
      this._parseTradeDate(row),
      this._parseNet(row),
    );
  };

  _makeWithrawal(row: csvRow): void {
    this._portfolio.withdrawal(
      this._parseTradeDate(row),
      this._parseNet(row),
    );
  };

  _makeBuy(row: csvRow): void {
    this._portfolio.buy(
      this._parseTradeDate(row),
      this._parseSettleDate(row),
      this._parseSymbol(row),
      this._parseShares(row),
      this._parsePrincipal(row),
      this._parseCommission(row),
      this._parseNet(row),
    );
  };

  _makeSell(row: csvRow): void {
    this._portfolio.sell(
      this._parseTradeDate(row),
      this._parseSettleDate(row),
      this._parseSymbol(row),
      this._parseShares(row),
      this._parsePrincipal(row),
      this._parseCommission(row),
      this._parseNet(row),
    );
  };

  _makeDividend(row: csvRow): void {
    this._portfolio.dividend(
      this._parseTradeDate(row),
      this._parseSymbol(row),
      this._parsePrincipal(row),
      this._parseCommission(row),
      this._parseNet(row),
    );
  };

  _parseTransactionType(row: csvRow): TransactionType {
    const value = _getStringRowFieldValue(row, this._type_field_key);
    const t = this._transaction_type_mapping.get(value);
    if (t === undefined) {
      throw new Error(`Invalid ${this._broker} TransactionType value: ${value}`);
    }
    return t;
  };

  _parseTradeDate(row: csvRow): Date {
    return _getDateRowFieldValue(row, this._trade_date_field_key);
  }

  _parseSettleDate(row: csvRow): Date {
    return _getDateRowFieldValue(row, this._settle_date_field_key);
  }

  _parseSymbol(row: csvRow): string {
    return _getStringRowFieldValue(row, this._symbol_field_key);
  }

  _parseShares(row: csvRow): number {
    return _getNumericRowFieldValue(row, this._shares_field_key);
  }

  _parsePrincipal(row: csvRow): number {
    return _getNumericRowFieldValue(row, this._principal_field_key);
  }

  _parseCommission(row: csvRow): number {
    return _getNumericRowFieldValue(row, this._commission_field_key);
  }

  _parseNet(row: csvRow): number {
    return _getNumericRowFieldValue(row, this._net_field_key);
  }
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

function _getDateRowFieldValue(row: csvRow, field_key: string): Date {
  const value = _getStringRowFieldValue(row, field_key);
  return new Date(value);
}

function _getNumericRowFieldValue(row: csvRow, field_key: string): number {
  const value = _getStringRowFieldValue(row, field_key);
  return Number(value);
}

function _getStringRowFieldValue(row: csvRow, field_key: string): string {
  const value = row[field_key];
  if (value === undefined) {
    throw new Error(`Field key "${field_key}" not found for row: ${row}`);
  }
  return value;
}
