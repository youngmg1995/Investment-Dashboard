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

import Portfolio from "./portfolio";
import parsePortfolioFromFiles from "./parsing";
import Holding from "./holding";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default Portfolio;
export { parsePortfolioFromFiles, Holding };
