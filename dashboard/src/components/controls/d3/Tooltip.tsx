import * as React from "react";

type Props = {
  tooltip: any;
};

type State = {};

export class Tooltip extends React.Component<Props, State> {
  render() {
    const { tooltip } = this.props;
    if (!tooltip.display) return null;

    let transform = "",
      x = 0,
      y = 0,
      width = 150,
      height = 70,
      transformText = "translate(" + width / 2 + "," + (height / 2 - 5) + ")",
      transformArrow = "";

    let position = tooltip.pos;
    if (isNaN(position.x)) {
      console.info("Dupa");
    }
    x = position.x;
    y = position.y;

    if (y > height + 102) {
      transform =
        "translate(" + (x - width / 2) + "," + (y - height - 20) + ")";
      transformArrow =
        "translate(" + (width / 2 - 20) + "," + (height - 2) + ")";
    } else if (y < height + 102) {
      transform =
        "translate(" + (x - width / 2) + "," + (Math.round(y) + 20) + ")";
      transformArrow =
        "translate(" + (width / 2 - 20) + "," + 0 + ") rotate(180,20,0)";
    }

    return (
      <g transform={transform} className="svg-tooltip">
        <rect
          className="shadow"
          width={width}
          height={height}
          rx="5"
          ry="5"
          fill="rgb(125, 199, 244)"
          opacity=".9"
        />
        <polygon
          className="shadow"
          points="10,0  30,0  20,10"
          transform={transformArrow}
          fill="rgb(125, 199, 244)"
          opacity=".9"
        />
        <text transform={transformText}>
          <tspan x="0" textAnchor="middle" fontSize="15px" fill="#ffffff">
            {tooltip.data.key}
          </tspan>
          <tspan
            x="0"
            textAnchor="middle"
            dy="25"
            fontSize="20px"
            fill="#a9f3ff"
          >
            {tooltip.data.value + " visits"}
          </tspan>
        </text>
      </g>
    );
  }
}
