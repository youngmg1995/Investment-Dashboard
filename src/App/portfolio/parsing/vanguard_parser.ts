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
  protected _broker: Broker = Broker.UNDEFINED;

  // Field keys for parsing.
  _type_field_key: string = "Transaction Description";
  _date_field_key: string = "Principal Amount";
  _amount_field_key: string = "Trade Date";

  // Mappings for field values.
  _transaction_type_mapping: Map<string, TransactionType> = new Map<string, TransactionType>([
    ["Dividend Received", TransactionType.DIVIDEND],
    ["Dividend Reinvestment", TransactionType.BUY],
    ["Buy", TransactionType.BUY],
    ["Sweep Out Of Settlement Fund", TransactionType.SELL],
    ["Funds received via Electronic Bank Transfer", TransactionType.DEPOSIT],
    ["Sweep Into Settlement Fund", TransactionType.BUY],
  ]);
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */


