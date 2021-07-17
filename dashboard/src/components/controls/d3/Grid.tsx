import * as d3 from "d3";
import * as React from "react";

type Props = {
  grid: any;
};

type State = {
  /* empty */
};

export class Grid extends React.Component<Props | undefined, State> {
  constructor(props?: Props, context?: any) {
    super(props, context);
    this.renderGrid = this.renderGrid.bind(this);
  }

  componentDidMount() {
    this.renderGrid();
  }
  componentDidUpdate() {
    this.renderGrid();
  }

  renderGrid() {
    const { grid } = this.props;

    let node = this.refs.grid as d3.BaseType;
    d3.select(node).call(grid);
  }

  render() {
    return <g ref="grid" className="y-grid" />;
  }
}
