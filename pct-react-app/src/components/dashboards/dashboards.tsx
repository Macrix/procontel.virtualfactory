import * as React from 'react';
import './style.css';


export class Dashboards extends React.Component  {
  render() {
    const { children } = this.props;
    return (
      <div className="main">
        <div className="content">
          {children}
        </div>
      </div>
    );
  }
}
