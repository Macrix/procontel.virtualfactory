import * as d3 from 'd3'
import * as React from 'react';
import * as classNames from 'classnames';


import {InsetShadow} from './'
  type Props = {
    chartId: any;
    width: any;
    height: any;
    data: any;
  }

  type State = {
    /* empty */
  }

export class ProgressChart extends React.Component<Props| undefined, State> {
  currentPercent:number;
  constructor(props?: Props, context?: any) {
    super(props, context);
    this.currentPercent = 0
  }

  componentDidUpdate() {
    const { width, height, data } = this.props
    const outerRadius = (height / 2) - 10
    const innerRadius = outerRadius - 20
    const transform = 'translate(' + width / 2 + ',' + height / 2 + ')'

    const style2 = { filter: 'url(#inset-shadow2)' }
    const arcLine = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(10)
        .startAngle(-0.05)

    let svg = d3.select(this.refs.ProgressChart as d3.BaseType)

    let layout = svg
      .select('g')
      .attr('transform', transform)

    let path: any = layout.selectAll('path.arcLine').data(data, 0 as any)

    path.exit().remove()

    path.enter().append('path')
      .attr('fill', d => (d as any).color[1])
      .attr('class', 'arcLine')
      .attr('style', style2 as any)
      .merge(path)
        .transition().duration(2000)
          .attrTween('d', d => {
            let endAngle = (2 * Math.PI) * (d as any).percent
            let interpolate = d3.interpolate({ endAngle: this.currentPercent }, { endAngle: endAngle }) as any;
            this.currentPercent = endAngle
            return function (t) {
              return arcLine(interpolate(t))
            }
          })
  }

  render() {
    const { chartId, width, height, data } = this .props

    const styleText = { fontSize: '40px', fontColor: '#99d5e6' }
    const style1 = { filter: 'url(#inset-shadow1)' }

    const outerRadius = (height / 2) - 10
    const innerRadius = outerRadius - 20

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI) as any;

    return (
        <div>
          <svg ref="ProgressChart" id={chartId} width={width} height={height}>
            <g>
              <InsetShadow chartId="inset-shadow1" stdDeviation="15" floodColor="black" floodOpacity=".5"/>
              <InsetShadow chartId="inset-shadow2" stdDeviation="15" floodColor="white" floodOpacity=".8"/>
              <circle r={innerRadius} cx="0" cy="0" fill={data[0].color[2]} fillOpacity="0.5"/>
              <text textAnchor="middle" dy="15" dx="5" fill={d3.rgb((data[0] as any).color[1] as any).brighter(2).toString()} style={styleText}>
                {Math.floor(data[0].percent * 100) + '%'}
              </text>
              <path className="backgroundProgress" fill={data[0].color[0]} d={arc()} style={style1}/>
            </g>
          </svg>
        </div>
    )
  }
}

