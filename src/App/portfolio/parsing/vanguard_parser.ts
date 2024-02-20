/**
 * PortfolioParser for Vanguard transaction histories.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import PortfolioParser from "./parser";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

import { Broker, TransactionType } from '../portfolio';


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default class VanguardPortfolioParser extends PortfolioParser {
  // Top level params.
  static _broker: Broker = Broker.VANGUARD;

  // Field keys for parsing.
  protected _type_field_key: string = "Transaction Description";
  protected _trade_time_field_key: string = "Trade Date";
  protected _settle_time_field_key: string = "Settlement Date";
  protected _symbol_field_key: string = "Symbol";
  protected _shares_field_key: string = "Shares";
  protected _principal_field_key: string = "Principal Amount";
  protected _commission_field_key: string = "Commission Fees";
  protected _net_field_key: string = "Net Amount";

  // Mappings for field values.
  _transaction_type_mapping: Map<string, TransactionType> = new Map<string, TransactionType>([
    ["Dividend Received", TransactionType.DIVIDEND],
    ["Dividend Reinvestment", TransactionType.BUY],
    ["Buy", TransactionType.BUY],
    ["Sweep Out Of Settlement Fund", TransactionType.SELL],
    ["Funds received via Electronic Bank Transfer", TransactionType.DEPOSIT],
    ["Sweep Into Settlement Fund", TransactionType.BUY],
  ]);

  constructor() {
    super(VanguardPortfolioParser._broker);
  }
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */


