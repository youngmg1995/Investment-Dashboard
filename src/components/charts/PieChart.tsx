/**
 * Generic class for creating pie charts.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { GradientPinkBlue } from '@visx/gradient';
import letterFrequency, { LetterFrequency } from '@visx/mock-data/lib/mocks/letterFrequency';
import { animated, useTransition, to } from '@react-spring/web';


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

export interface PieDatum {
  key: string,
  value: number,
}

export interface PieChartProps {
  // portfolioMix: {[key: string]: number};
  data: PieDatum[];
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

const DEFAULT_COLORS = [
  'rgba(255,255,255,0.7)',
  'rgba(255,255,255,0.6)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.4)',
  'rgba(255,255,255,0.3)',
  'rgba(255,255,255,0.2)',
  'rgba(255,255,255,0.1)',
];


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

const letters: LetterFrequency[] = letterFrequency.slice(0, 4);
const frequency = (d: LetterFrequency) => d.frequency;

const getItemColor = (i: number) => {
  const index = Math.floor(i) % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[index];
}
const getLetterFrequencyColor = scaleOrdinal({
  domain: letters.map((l) => l.letter),
  range: ['rgba(93,30,91,1)', 'rgba(93,30,91,0.8)', 'rgba(93,30,91,0.6)', 'rgba(93,30,91,0.4)'],
});

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

const PieChart: React.FC<PieChartProps> = ({
  data,
  width,
  height,
  margin = defaultMargin,
  animate = true,
}) => {
  const [selectedDatum, setSelectedDatum] = useState<PieDatum | null>(null);
  const [selectedAlphabetLetter, setSelectedAlphabetLetter] = useState<string | null>(null);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 50;

  return (
    <svg width={width} height={height}>
      <GradientPinkBlue id="visx-pie-gradient" />
      <rect rx={14} width={width} height={height} fill="url('#visx-pie-gradient')" />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          // data={
          //   selectedBrowser ? browsers.filter(({ label }) => label === selectedBrowser) : browsers
          // }
          data={selectedDatum ? [selectedDatum] : data}
          pieValue={getPieDatumValue}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie<PieDatum>
              {...pie}
              animate={animate}
              getKey={(arc) => getPieDatumKey(arc.data)}
              onClickDatum={({ data: d }) =>
                animate && 
                setSelectedDatum(d && selectedDatum === d ? null : d)
              }
              getColor={({ index: i }) => getItemColor(i)}
            />
          )}
        </Pie>
        <Pie
          data={
            selectedAlphabetLetter
              ? letters.filter(({ letter }) => letter === selectedAlphabetLetter)
              : letters
          }
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie<LetterFrequency>
              {...pie}
              animate={animate}
              getKey={({ data: { letter } }) => letter}
              onClickDatum={({ data: { letter } }) =>
                animate &&
                setSelectedAlphabetLetter(
                  selectedAlphabetLetter && selectedAlphabetLetter === letter ? null : letter,
                )
              }
              getColor={({ data: { letter } }) => getLetterFrequencyColor(letter)}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

export default PieChart;

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

const getPieDatumKey = (d: PieDatum) => (d.key);
const getPieDatumValue = (d: PieDatum) => (d.value);

