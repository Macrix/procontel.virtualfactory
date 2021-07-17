import * as d3 from 'd3'
import * as React from 'react';
import * as classNames from 'classnames';


  type Props = {
    width: number;
    height: any;
    pie: any;
    data:any;
  }

  type State = {
    /* empty */
  }


export class DonutChartPath extends React.Component<Props| undefined, State> {
  currentData: any;
  constructor(props?: Props, context?: any) {
    super(props, context);
    this.currentData = {};
  }
  componentDidUpdate() {
    const { width, height, pie, data } = this.props

    const outerRadius = height / 2
    const innerRadius = height / 3.3
    const legendDisplayed = (width <= (height + 180)) ? 0 : width / 5
    const transform = 'translate(' + ((width / 2) - legendDisplayed) + ',' + (height / 2) + ')'

    const arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius)

    let layout = d3.select(this.refs.DonutChartPath as d3.BaseType)
      .attr('transform', transform)

      let path:any = layout.selectAll('path').data(pie(data))

      path.exit().remove()
  
      path.enter().append('path')
        .attr('fill', d => (d as any).data.color)
        .attr('key', (d, i) => i)
        .each(d => this.currentData[(d as any).data.name] = { startAngle: (d as any).startAngle, endAngle: (d as any).startAngle })
        .merge(path)
          .transition().duration(2000)
            .attrTween('d', d => {
              let interpolate = d3.interpolate(this.currentData[(d as any).data.name], d) as any;
              this.currentData[(d as any).data.name] = d
              return function (t) {
                return arc(interpolate(t))
              }
            })
    }
  
    render() {
      return <g ref="DonutChartPath"/>
    }
  }
  
  