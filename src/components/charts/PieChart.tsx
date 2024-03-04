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
/*                                 PARAMS
/* *********************************  ********************************* */

const DEFAULT_SEGMENT_COMPARATOR: SegmentComparator = (a, b) => {
  return b.value - a.value;
}


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

// Input data for defining the chart.
export interface PieData {
  rings: RingData[],
  sorted: boolean,
  sortComparator?: SegmentComparator;
  showRoot: boolean;
};
export type RingData = {
  segments: SegmentData[],
};
export type SegmentData = {
  key: string,
  label: string,
  name?: string, 
  value: number,
};
export type SegmentComparator = (a: SegmentData, b: SegmentData) => number;


// Data the defines the actual visual aspects of the pie chart.
type PieChartData = {
  rings: PieChartRingData[],
};
type PieChartRingData = {
  segments: PieChartSegmentData[],
};
type PieChartSegmentData = {
  key: string,
  indices: PieChartSegmentIndices,
  label: string,
  name?: string, 
  value: number,
  ratio: number,
  color: string,
};
type PieChartSegmentIndices = {
  ring: number,
  segment: number,
};


export interface PieChartProps {
  data: PieData;
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
  const pieData = convert2PieChartData(data);
  // const [selectedDatum, setSelectedDatum] = useState<PieChartDatum] | null>(null);
  // const [selectedAlphabetLetter, setSelectedAlphabetLetter] = useState<string | null>(null);

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
        {pieData.rings.map((r, i) => (
          <Pie<PieChartSegmentData>
            data={r.segments}
            pieValue={(s) => (s.value)}
            outerRadius={radius + i*(donutThickness+5)}
            innerRadius={radius + i*(donutThickness+5) - donutThickness}
            cornerRadius={3}
            padAngle={0.005}
          >
            {(pie) => (
              <AnimatedPie<PieChartSegmentData>
                {...pie}
                animate={animate}
                getKey={(arc) => arc.data.key}
                getLabel={(arc) => (arc.data.label)}
                getPercent={(arc) => getPieSegmentPercent(arc.data)}
                onClickDatum={({ data: d }) =>
                  animate
                  && false
                  // && setSelectedDatum(d && selectedDatum === d ? null : d)
                }
                getColor={(arc) => (arc.data.color)}
                width={width}
                height={height}
              />
            )}
          </Pie>
        ))}
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

const getPieSegmentPercent = (d: PieChartSegmentData): string => {
  return `${(d.ratio*100).toFixed(1)}%`
};


function getSegmentColor(indices: PieChartSegmentIndices): string {
  // TODO - use ring index in functionality.
  const index = indices.segment % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[index];
}

function convert2PieChartData(pieData: PieData): PieChartData {
  let chartData: PieChartData = {
    rings: pieData.rings.map((r, i) => convert2PieChartRowData(
      r, i, pieData.sorted, pieData.sortComparator,
    )),
  };
  return chartData;
}

function convert2PieChartRowData(
  pieRing: RingData,
  ringIndex: number,
  sorted: boolean = false,
  sortComparator: SegmentComparator = DEFAULT_SEGMENT_COMPARATOR, 
): PieChartRingData {
  const rowTotal = calcRingDataTotalValue(pieRing);
  let pieSegments = [...pieRing.segments];
  if (sorted) {pieSegments.sort(sortComparator);}
  return {
    segments: pieSegments.map((s, i) => convert2PieChartSegmentData(
      s, {ring: ringIndex, segment: i}, rowTotal,
    )), 
  };
}

function calcRingDataTotalValue(pieRing: RingData): number {
  let total = 0;
  for (let s of pieRing.segments) {total += s.value;}
  return total;
}

function convert2PieChartSegmentData(
  pieSegment: SegmentData,
  indices: PieChartSegmentIndices,
  ratioDenominator: number,
): PieChartSegmentData {
  return {
    key: pieSegment.key,
    indices: indices,
    label: pieSegment.label,
    name: pieSegment.name,
    value: pieSegment.value,
    ratio: pieSegment.value / ratioDenominator,
    color: getSegmentColor(indices),
  };
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

