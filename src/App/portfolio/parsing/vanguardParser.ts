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
  static  broker: Broker = Broker.VANGUARD;

  // Field keys for parsing.
  protected  typeFieldKey: string = "Transaction Description";
  protected  tradeDateFieldKey: string = "Trade Date";
  protected  settleDateFieldKey: string = "Settlement Date";
  protected  symbolFieldKey: string = "Symbol";
  protected  sharesFieldKey: string = "Shares";
  protected  principalFieldKey: string = "Principal Amount";
  protected  commissionFieldKey: string = "Commission Fees";
  protected  netFieldKey: string = "Net Amount";

  // Mappings for field values.
   transactionTypeMapping: Map<string, TransactionType> = new Map<string, TransactionType>([
    ["Dividend Received", TransactionType.DIVIDEND],
    ["Dividend Reinvestment", TransactionType.BUY],
    ["Buy", TransactionType.BUY],
    ["Sweep Out Of Settlement Fund", TransactionType.SELL],
    ["Funds received via Electronic Bank Transfer", TransactionType.DEPOSIT],
    ["Sweep Into Settlement Fund", TransactionType.BUY],
  ]);

  constructor() {
    super(VanguardPortfolioParser.broker);
  }
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */


