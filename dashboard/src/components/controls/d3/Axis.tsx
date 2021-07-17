import * as d3 from 'd3'
import * as React from 'react';
import * as classNames from 'classnames';


type Props = {
    h: number;
    axis: any;
    axisType: any;
  }

  type State= {
    /* empty */
  }

export class Axis extends React.Component<Props | undefined, State> {

  constructor(props: Props, context?: any) {
    super(props, context);
    this.renderAxis = this.renderAxis.bind(this)
  }

  componentDidMount() {
    this.renderAxis()
  }
  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    const { axis } = this.props

    let node = this.refs.axis as d3.BaseType;
    d3.select(node).call(axis)
  }

  render() {
    const { axisType, h } = this.props

    let translate = 'translate(0,' + h + ')'
    return (
      <g ref="axis" className="axis" transform={axisType === 'x' ? translate : ''}/>
    )
  }
}
