/**
 * Generic class for creating pie charts.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */

/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { animated, useTransition, to } from '@react-spring/web';
import { Annotation, Label, Connector } from "@visx/annotation";


/* *********************************  ********************************* */
/*                                 PARAMS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */

type AnimatedPieSegmentProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  annotate?: boolean;
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



/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

export default function AnimatedPieSegment<Datum>({
  arcs,
  path,
  animate,
  annotate,
  getLabel,
  getPercent,
  getColor,
  onClickDatum,
  width,
  height
}: AnimatedPieSegmentProps<Datum>) {
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
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
    const labelText = annotate ? getPercent(arc) : getLabel(arc);

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
              {labelText}
            </text>
            {annotate && 
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
            }
          </animated.g>
        )}
      </g>
    );
  });
}



/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */

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