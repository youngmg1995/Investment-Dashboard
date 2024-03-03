/**
 * Library for fetching market data on securities (i.e. stocks and bonds.)
 * Currently just static info, but will eventually implement an API (e.g.
 * through Alpaca or IBKR) that fetches on the fly, in real time.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

import { Broker } from "./portfolio"

/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

export enum HoldingType {
  UNDEFINED = "Undefined",
  CASH = "Cash",
  STOCK = "Stocks",
  BOND = "Bonds",
}

export enum LocationType {
  UNDEFINED = "undefined",
  DOMESTIC = "Domestic",
  INTERNATIONAL = "International",
}

export type HoldingInfo = {
  symbol: string,
  label: string,
  name: string,
  type: HoldingType,
  location: LocationType,
}


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

const STATIC_VANGUARD_HOLDING_INFO: {[symbol: string]: HoldingInfo} = {
  "0000": {
    symbol: "0000",
    label: "Cash",
    name: "Cash",
    type: HoldingType.CASH,
    location: LocationType.UNDEFINED,
  },
  "VMFXX": {
    symbol: "VMFXX",
    label: "VMFXX",
    name: "Vanguard Federal Money Market Fund",
    type: HoldingType.CASH,
    location: LocationType.UNDEFINED,
  },
  "VTI": {
    symbol: "VTI",
    label: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: HoldingType.STOCK,
    location: LocationType.DOMESTIC,
  },
  "VXUS": {
    symbol: "VXUS",
    label: "VXUS",
    name: "Vanguard Total Intl. Stock Index Fund ETF",
    type: HoldingType.STOCK,
    location: LocationType.INTERNATIONAL,
  },
  "BND": {
    symbol: "BND",
    label: "BND",
    name: "Vanguard Total Bond Market ETF",
    type: HoldingType.BOND,
    location: LocationType.DOMESTIC,
  },
  "BNDX": {
    symbol: "BNDX",
    label: "BNDX",
    name: "Vanguard Total Intl. Bond Index ETF",
    type: HoldingType.BOND,
    location: LocationType.INTERNATIONAL,
  },


  "VAW": {
    symbol: "VAW",
    label: "VAW",
    name: "Vanguard Materials ETF",
    type: HoldingType.STOCK,
    location: LocationType.DOMESTIC,
  },
}


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export function fetchHoldingInfo(
  symbol: string, broker: Broker = Broker.VANGUARD
): HoldingInfo {
  switch (broker) {
    case (Broker.VANGUARD): {
      return fetchVanguardHoldingInfo(symbol);
    }
    default: {
      throw new Error(`Unsupported Broker for fetchHoldingInfo: ${broker}`);
    }
  }
}


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function fetchVanguardHoldingInfo(symbol: string): HoldingInfo {
  if (!(symbol in STATIC_VANGUARD_HOLDING_INFO)) {
    throw new Error(`Unsupported symbol for fetchVanguardHoldingInfo: ${symbol}`);
  }
  return STATIC_VANGUARD_HOLDING_INFO[symbol];
}


