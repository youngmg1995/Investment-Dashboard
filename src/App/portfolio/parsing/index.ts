/**
 * Library for extracting data from a CSV file into a Portfolio class
 * instance.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import Portfolio, { Broker } from "../portfolio";
import PortfolioParser from "./parser";
import VanguardPortfolioParser from "./vanguard_parser";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

const _BROKER_PARSERS = new Map<Broker, PortfolioParser>([
  [Broker.VANGUARD, new VanguardPortfolioParser()],
]);

/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default function parsePortfolioFromFiles(
  files: FileList, broker: Broker = Broker.VANGUARD
): Promise<Portfolio> {
  if (files.length > 1) {
    throw new Error("Multi-file parsing is unsupported.");
  }

  const parser = _BROKER_PARSERS.get(broker);
  if (parser === undefined) {
    throw new Error(`Unsupported Broker: ${broker}`)
  }
  console.log(broker);
  return parser.portfolioFromFile(files[0]);
}
