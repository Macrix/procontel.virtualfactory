import * as d3 from 'd3'
import * as React from 'react';
import * as classNames from 'classnames';

 type Props ={
    chartId: any;
    stdDeviation: any;
    floodColor: any;
    floodOpacity: any;
  }

  type State= {
    /* empty */
  }

export class InsetShadow extends React.Component<Props, State> {

render(){
  const { chartId, stdDeviation, floodColor, floodOpacity } = this.props
  return (
    <defs>
      <filter id={chartId}>
        <feOffset dx="0" dy="0"/>
        <feGaussianBlur stdDeviation={stdDeviation} result="offset-blur"/>
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
        <feFlood floodColor={floodColor} floodOpacity={floodOpacity} result="color"/>
        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
      </filter>
    </defs>
  )
}
}