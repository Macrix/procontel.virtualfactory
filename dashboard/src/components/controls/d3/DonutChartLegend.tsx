import * as d3 from 'd3'
import * as React from 'react';
import * as classNames from 'classnames';


  type Props = {
    width: number;
    height: any;
    pie: any;
    data:any;
  }

  type State= {
    /* empty */
  }

export class DonutChartLegend extends React.Component<Props, State> {

  render() {
    const {  width, height, pie, data } = this.props
  // Responsive: don't show legend if too small
  if (width <= (height + 180)) return null

  const transform = 'translate(' + (width / 1.25) + ', 55)'

  const legend = pie(data)
    .map((d, i) => {
      const trsf = 'translate(10,' + (i * 30) + ')'
      const rectStyle = { fill: d.data.color, stroke: d.data.color }
      const textStyle = { fill: d.data.color }

      return (
        <g transform={trsf} key={i}>
          <rect width="20" height="20" style={rectStyle} rx="2" ry="2"/>
          <text x="30" y="15" className="browser-legend" style={textStyle}>{d.data.name}</text>
        </g>
      )
    })

  return (
    <g transform={transform}>
      {legend}
    </g>
  )
  }
}