import * as d3 from "d3";
import * as React from "react";

type Props = {
  hideTooltip: any;
  showTooltip: any;
  y: any;
  x: any;
  data: any;
};

type State = {
  /* empty */
};

export class Dots extends React.Component<Props | undefined, State> {

  render() {
    const { x, y, showTooltip, hideTooltip, data } = this.props;
    // Copy data in a new array
    let newData = [...data];

    // Remove last & first point
    newData.shift();
    newData.pop();

    const parser = d3.timeFormat("%B %d, %Y");

    const circles = newData.map((d, i) => {
      return (
        <circle
          className="dot"
          r="7"
          cx={x(d.date)}
          cy={y(d.count)}
          fill="#7dc7f4"
          stroke="#313131"
          strokeWidth="1px"
          key={i}
          onMouseOver={showTooltip}
          onMouseOut={hideTooltip}
          data-key={parser(d.date)}
          data-value={d.count}
        />
      );
    });

    return <g>{circles}</g>;
  }
}
