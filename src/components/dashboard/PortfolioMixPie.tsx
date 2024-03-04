/**
 * Visx chart for displaying Portfolio mix.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState} from 'react';

import Portfolio, { Holding } from '../../portfolio';
import { PieChart, PieData, RingData, SegmentData } from '../charts';


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

enum MixType {
  HOLDING_TYPE = "holding_type",
  LOCATION = "location",
}


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

interface PortfolioMixPieProps {
  portfolio: Portfolio;
}


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

const PortfolioMixPie: React.FC<PortfolioMixPieProps> = (props) => {
  const [mixType, setMixType] = useState<MixType>(MixType.HOLDING_TYPE);
  
  const holdings = props.portfolio.getHoldings()
  let groupingsRingTable: {[key: string]: SegmentData} = {};
  let holdingsRing: RingData = {segments: []};
  for (let s in holdings) {
    const h = holdings[s];
    const grouping = getHoldingGrouping(h, mixType);
    if (grouping in groupingsRingTable) {
      groupingsRingTable[grouping].value += h.value();
    } else {
      groupingsRingTable[grouping] = {
        key: grouping,
        label: grouping,
        value: h.value(),
      }
    }
    holdingsRing.segments.push({
      key: h.getSymbol(),
      label: h.getSymbol(),
      name: h.getName(),
      value: h.value(),
    })
  }
  const groupingsRing: RingData = {segments: []};
  for (let k in groupingsRingTable) {
    groupingsRing.segments.push(groupingsRingTable[k]);
  }
  let mixChartData: PieData = {
    rings: [groupingsRing, holdingsRing],
    sorted: true,
    showRoot: false,
  }
  
  return (
    <PieChart data={mixChartData} width={800} height={500}/>
  );
}

export default PortfolioMixPie;

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

function getHoldingGrouping(h: Holding, m: MixType): string {
  switch (m) {
    case (MixType.HOLDING_TYPE): {
      return h.getType();
    }
    default: {
      throw new Error(`Unsupported MixType for getHoldingGrouping: ${m}`);
    }
  }
}

