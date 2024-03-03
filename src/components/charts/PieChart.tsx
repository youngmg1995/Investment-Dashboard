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
import { Annotation, Label, Connector } from "@visx/annotation";


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

export interface PieInputDatum {
  key: string,
  label: string,
  value: number,
  subData?: PieInputDatum[],
}

interface PieDatum {
  key: string,
  label: string,
  value: number,
  ratio: number,
  color: string,
  subData?: PieDatum[],
}

export interface PieChartProps {
  // portfolioMix: {[key: string]: number};
  data: PieInputDatum[];
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getLabel: (d: PieArcDatum<Datum>) => string;
  getPercent: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
  width: number;
  height: number;
};

// react-spring transition definitions
type AnimatedStyles = {
  startAngle: number;
  endAngle: number;
  opacity: number
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

// const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

const defaultMargin = { top: 100, right: 200, bottom: 100, left: 200 };


const letters: LetterFrequency[] = letterFrequency.slice(0, 4);
const frequency = (d: LetterFrequency) => d.frequency;
const getLetterFrequencyColor = scaleOrdinal({
  domain: letters.map((l) => l.letter),
  range: ['rgba(93,30,91,1)', 'rgba(93,30,91,0.8)', 'rgba(93,30,91,0.6)', 'rgba(93,30,91,0.4)'],
});


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

const PieChart: React.FC<PieChartProps> = ({
  data,
  width,
  height,
  margin = defaultMargin,
  animate = true,
}) => {
  const pieData = convert2PieData(data);
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
          data={selectedDatum ? [selectedDatum]: pieData}
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
              getLabel={(arc) => getPieDatumLabel(arc.data)}
              getPercent={(arc) => getPieDatumPercent(arc.data)}
              onClickDatum={({ data: d }) =>
                animate && 
                setSelectedDatum(d && selectedDatum === d ? null : d)
              }
              getColor={(arc) => getPieDatumColor(arc.data)}
              width={width}
              height={height}
            />
          )}
        </Pie>
        {/* <Pie
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
              getLabel={({ data: { letter } }) => letter}
              onClickDatum={({ data: { letter } }) =>
                animate &&
                setSelectedAlphabetLetter(
                  selectedAlphabetLetter && selectedAlphabetLetter === letter ? null : letter,
                )
              }
              getColor={({ data: { letter } }) => getLetterFrequencyColor(letter)}
              width={width}
              height={height}
            />
          )}
        </Pie> */}
      </Group>
    </svg>
  );
}

export default PieChart;

/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

const getPieDatumKey = (d: PieDatum): string => (d.key);
const getPieDatumLabel = (d: PieDatum): string => (d.label);
const getPieDatumValue = (d: PieDatum): number => (d.value);
const getPieDatumColor = (d: PieDatum): string => (d.color);
const getPieDatumPercent = (d: PieDatum): string => {
  return `${(d.ratio*100).toFixed(1)}%`
};


const getItemColor = (i: number) => {
  const index = Math.floor(i) % DEFAULT_COLORS.length;
  console.log("i", i);
  console.log("index", index);
  return DEFAULT_COLORS[index];
}

const convert2PieData = (inputData: PieInputDatum[]): PieDatum[] => {
  let data = [];
  let total = 0;
  for (let i of inputData) {
    data.push({
      key: i.key,
      label: i.label,
      value: i.value,
      subData: i.subData ? convert2PieData(i.subData) : undefined,
    });
    total += i.value;
  }
  data.sort((a, b) => (b.value - a.value));
  return data.map((d, i) => Object.assign({}, d, {
    color: getItemColor(i),
    ratio: d.value / total,
  }));
}


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

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getLabel,
  getPercent,
  getColor,
  onClickDatum,
  width,
  height
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(
    arcs,
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
    }
  );
  const targetLabelOffset = (width / 2) * 0.6;
  console.log(arcs);
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={to(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle
              })
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
              fontSize={10}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getPercent(arc)}
            </text>
            <Annotation
              x={centroidX}
              y={centroidY}
              dx={
                // offset label to a constant left- or right-coordinate
                (centroidX < 0 ? -targetLabelOffset : targetLabelOffset) -
                centroidX
              }
              dy={centroidY < 0 ? -50 : 50}
            >
              <Label
                showAnchorLine
                anchorLineStroke="#eaeaea"
                showBackground={false}
                title={getLabel(arc)}
                // subtitle={`${arc.value.toFixed(1)}%`}
                subtitle={arc.value.toLocaleString(undefined, {maximumFractionDigits:0})}
                fontColor="#fff"
                width={100}
                // these will work in @visx/annotation@1.4
                // see https://github.com/airbnb/visx/pull/989
                horizontalAnchor={centroidX < 0 ? 'end' : 'start'}
                backgroundPadding={{
                  left: 8,
                  right: 8,
                  top: 0,
                  bottom: 0
                }}
              />
              <Connector stroke="#fff" />
            </Annotation>
          </animated.g>
        )}
      </g>
    );
  });
}

