/**
 * Visx chart for displaying Portfolio mix.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState} from 'react';

import Portfolio, { Holding } from '../../portfolio';
import { PieChart, PieInputDatum } from '../charts';


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
  let mixChartGroupData: {[key: string]: PieInputDatum} = {};
  for (let s in holdings) {
    const h = holdings[s];
    const grouping = getHoldingGrouping(h, mixType);
    if (grouping in mixChartGroupData) {
      mixChartGroupData[grouping].value += h.value();
    } else {
      mixChartGroupData[grouping] = {
        key: grouping,
        label: grouping,
        value: h.value(),
      }
    }
  }
  let mixChartData: PieInputDatum[] = [];
  for (let k in mixChartGroupData) {
    mixChartData.push(mixChartGroupData[k]);
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

