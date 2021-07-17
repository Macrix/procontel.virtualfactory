import * as d3 from 'd3'
import * as React from 'react';
import {DonutChartPath} from './DonutChartPath'
import {DonutChartLegend} from './DonutChartLegend'

type Props = {
  chartId: any;
  width: any;
  height: any;
  data: any;
}

type State = {}

export class DonutChart extends React.Component<Props, State> {

  render() {
    const { chartId, width, height, data } = this.props
    const pie = d3.pie()
      .value(d => (d as any).count)
      .padAngle(0.04)
      .sort(null)

  return (
      <svg
        id={chartId}
        width={width}
        height={height}>
        <DonutChartPath
          width={width}
          height={height}
          pie={pie}
          data={data}/>
        <DonutChartLegend
          pie={pie}
          data={data}
          width={width}
          height={height}/>
      </svg>
    )
  }
}