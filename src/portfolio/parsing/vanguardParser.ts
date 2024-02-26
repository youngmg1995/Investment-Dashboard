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

import { Broker } from '../portfolio';
import { TransactionType } from "../transaction";


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
  protected  typeFieldKey: string = "Transaction type";
  protected  tradeDateFieldKey: string = "Trade date";
  protected  settleDateFieldKey: string = "Settlement date";
  protected  symbolFieldKey: string = "Symbol";
  protected  sharesFieldKey: string = "Quantity";
  protected  principalFieldKey: string = "Amount";
  protected  commissionFieldKey: string = "Commissions & fees";

  // Mappings for field values.
  protected transactionTypeMapping: {[key: string]: TransactionType} = {
    "Buy": TransactionType.BUY,
    "Sweep out": TransactionType.SELL,
    "Dividend": TransactionType.DIVIDEND,
    "Reinvestment": TransactionType.BUY,
    "Funds Received": TransactionType.DEPOSIT,
    "Funds Withrawn": TransactionType.WITHDRAWAL,
    "Sweep in": TransactionType.BUY,
    "Capital gain (LT)": TransactionType.CAPITAL_GAIN_LT,
    "Reinvestment (LT gain)": TransactionType.BUY,
    "Capital gain (ST)": TransactionType.CAPITAL_GAIN_ST,
    "Reinvestment (ST gain)": TransactionType.BUY,
    "Sell": TransactionType.SELL,
  };

  constructor() {
    super(VanguardPortfolioParser.broker);
  }
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */


