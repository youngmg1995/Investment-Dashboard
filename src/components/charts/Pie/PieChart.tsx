/**
 * Generic class for creating pie charts.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import Pie, { PieArcDatum, ProvidedProps } from '@visx/shape/lib/shapes/Pie';
// import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { GradientPinkBlue } from '@visx/gradient';

import AnimatedPieSegment from './AnimatedPieSegment';
// import { on } from 'events';


/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

// Input data for defining the chart.
export interface PieData {
  rings: RingData[],
  sorted?: boolean,
  sortComparator?: SegmentComparator;
  showRoot?: boolean;
  annotate?: boolean;
};
export type RingData = {
  segments: SegmentData[],
  annotate?: boolean,
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
  annotate: boolean,
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
  margin?: typeof DEFAULT_MARGINS;
  animate?: boolean;
};


/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */

const DEFAULT_SEGMENT_COMPARATOR: SegmentComparator = (a, b) => {
  return b.value - a.value;
}

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

const DEFAULT_MARGINS = { top: 100, right: 200, bottom: 100, left: 200 };
const DEFAULT_CORNER_RADIUS = 3;
const DEFAULT_RING_THICKNESS = 50;
const DEFAULT_RING_SEPARATION = 5;
const DEFAULT_PAD_ANGLE = 0.005;


// const letters: LetterFrequency[] = letterFrequency.slice(0, 4);
// const frequency = (d: LetterFrequency) => d.frequency;
// const getLetterFrequencyColor = scaleOrdinal({
//   domain: letters.map((l) => l.letter),
//   range: ['rgba(93,30,91,1)', 'rgba(93,30,91,0.8)', 'rgba(93,30,91,0.6)', 'rgba(93,30,91,0.4)'],
// });


/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

const PieChart: React.FC<PieChartProps> = ({
  data,
  width,
  height,
  margin = DEFAULT_MARGINS,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<PieArcDatum<PieChartSegmentData> | null>(null);

  const pieData = convert2PieChartData(data);
  const onSegmentClick = (arc: PieArcDatum<PieChartSegmentData>) => {
    if (selectedSegment && arc.data.key === selectedSegment.data.key) {
      setSelectedSegment(null);
    } else {
      setSelectedSegment(arc);
    }
  }

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;

  return (
    <svg width={width} height={height}>
      <GradientPinkBlue id="visx-pie-gradient" />
      <rect rx={14} width={width} height={height} fill="url('#visx-pie-gradient')" />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        {renderPie(
          pieData, radius, width, height, onSegmentClick, selectedSegment
        )}
        {renderSelectedSegment(
          (selectedSegment ? selectedSegment.data : null), radius, width, height, onSegmentClick
        )}
      </Group>
    </svg>
  );
}

export default PieChart;


/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */
function convert2PieChartData(pieData: PieData): PieChartData {
  let chartData: PieChartData = {
    rings: pieData.rings.map((r, i) => convert2PieChartRingData(
      r, i, pieData.sorted, pieData.sortComparator, pieData.annotate,
    )),
  };
  return chartData;
}

function renderPie(
  pieData: PieChartData,
  radius: number,
  width: number,
  height: number,
  onSegmentClick: (arc: PieArcDatum<PieChartSegmentData>) => void,
  selectedSegment: PieArcDatum<PieChartSegmentData> | null,
): JSX.Element[] {
 return (pieData.rings.map((ring, ringIndex) => (
    <Pie<PieChartSegmentData>
      data={ring.segments}
      pieValue={(s) => (s.value)}
      outerRadius={radius + ringIndex*(DEFAULT_RING_THICKNESS+DEFAULT_RING_SEPARATION) + DEFAULT_RING_THICKNESS}
      innerRadius={radius + ringIndex*(DEFAULT_RING_THICKNESS+DEFAULT_RING_SEPARATION)}
      cornerRadius={DEFAULT_CORNER_RADIUS}
      padAngle={DEFAULT_PAD_ANGLE}
    >
      {(segment: ProvidedProps<PieChartSegmentData>) => (
        renderSegment(
          segment,
          false,
          ring.annotate,
          onSegmentClick,
          width,
          height,
          selectedSegment,
        )
      )}
    </Pie>
  )));
}


function renderSelectedSegment(
  selectedSegment: PieChartSegmentData | null,
  radius: number,
  width: number,
  height: number,
  onSegmentClick: (arc: PieArcDatum<PieChartSegmentData>) => void,
): JSX.Element {
 return (
    <Pie<PieChartSegmentData>
      data={selectedSegment ? [selectedSegment] : []}
      pieValue={(s) => (s.value)}
      outerRadius={radius - DEFAULT_RING_SEPARATION*2}
      cornerRadius={DEFAULT_CORNER_RADIUS}
      padAngle={DEFAULT_PAD_ANGLE}
    >
      {(segment: ProvidedProps<PieChartSegmentData>) => (
        <AnimatedPieSegment<PieChartSegmentData>
          {...segment}
          animate={true}
          annotate={false}
          getKey={(arc) => arc.data.key}
          getLabel={(arc) => ("")}
          getPercent={(arc) => getPieSegmentPercent(arc.data)}
          onClickDatum={onSegmentClick}
          getColor={(arc) => (arc.data.color)}
          width={width}
          height={height}
          selectedSegment={null}
        />
      )}
    </Pie>
  );
}


function renderSegment(
  segment: ProvidedProps<PieChartSegmentData>,
  animate: boolean,
  annotate: boolean,
  onSegmentClick: (arc: PieArcDatum<PieChartSegmentData>) => void,
  width: number,
  height: number,
  selectedSegment: PieArcDatum<PieChartSegmentData> | null,
): JSX.Element {
  return (
    <AnimatedPieSegment<PieChartSegmentData>
      {...segment}
      animate={animate}
      annotate={annotate}
      getKey={(arc) => arc.data.key}
      getLabel={(arc) => (arc.data.label)}
      getPercent={(arc) => getPieSegmentPercent(arc.data)}
      onClickDatum={onSegmentClick}
      getColor={(arc) => (arc.data.color)}
      width={width}
      height={height}
      selectedSegment={selectedSegment}
    />
  );
}


function convert2PieChartRingData(
  pieRing: RingData,
  ringIndex: number,
  sorted: boolean = false,
  sortComparator: SegmentComparator = DEFAULT_SEGMENT_COMPARATOR, 
  annotate: boolean = false,
): PieChartRingData {
  const rowTotal = calcRingDataTotalValue(pieRing);
  let pieSegments = [...pieRing.segments];
  if (sorted) {pieSegments.sort(sortComparator);}
  return {
    segments: pieSegments.map((s, i) => convert2PieChartSegmentData(
      s, {ring: ringIndex, segment: i}, rowTotal,
    )),
    annotate: (pieRing.annotate || annotate),
  };
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
function calcRingDataTotalValue(pieRing: RingData): number {
  let total = 0;
  for (let s of pieRing.segments) {total += s.value;}
  return total;
}


const getPieSegmentPercent = (d: PieChartSegmentData): string => {
  return `${(d.ratio*100).toFixed(1)}%`
};
function getSegmentColor(indices: PieChartSegmentIndices): string {
  // TODO - use ring index in functionality.
  const index = indices.segment % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[index];
}