import  React, { useRef, useState }  from 'react';
import { useFormInput } from '../../hooks';
import { BarChart, DonutChart, ProgressChart, Sparkline, SparklineModel } from '../controls/d3';

import { EndpointConnectionFactory, IEndpointConnection } from '@macrix/pct-cmd';
import { HubConnectionState } from '@microsoft/signalr';
import './style.css';


type Props = {
  donutData: any;
}

type State = {
    widthSpark: number;
    heightSpark: number;
    widthDonut: number;
    heightDonat: number;
    widthProgress: number;
    heightProgress: number;
}

export const NeedsDashboard: React.FC = props => {
  const ip = useFormInput('http://localhost:5009');
  const [factory] = React.useState(new EndpointConnectionFactory());
  const [endpointConnection, setEndpointConnection] = React.useState<IEndpointConnection>(null!);
  const [connectionState, setConnectionState] = React.useState<HubConnectionState>(HubConnectionState.Disconnected);
  const [logs, _setLogs] = React.useState<string[]>([]);
  const inputCommand = useFormInput(`
  {
    "CustomerName": "ProconTEL team"
  }`);
  const stateRef = React.useRef(logs);
  const setLogs = (data: string[]) => {
      stateRef.current = data;
      _setLogs(data);
  };


  const start = async () => {
      const connection = factory.create(ip.value);
      connection.onconnected(x => setConnectionState(connection.state));
      connection.onclose(x => setConnectionState(connection.state));
      connection.onreconnected(x => setConnectionState(connection.state));
      connection.onreconnecting(x => setConnectionState(connection.state));
      connection.onconnected(id => {
          connection.off('onTemperature');
          connection.on('onTemperature', (command) => {
              setLogs([
                  ...stateRef.current,
                  `Received notification: ${JSON.stringify(command)}.`
              ]);
          });
      });
      try {
          await connection.start();
      }
      catch (err) {
          console.error(err);
      }
      setEndpointConnection(connection);
  };

  const stop = async () => {
      await endpointConnection.stop();
  };
  const [sparklineSize, setSparklineSize] = React.useState({ 
    height: 300,
    width: 400
  })
  const [donutchartSize, setDonutchartSize] = React.useState({ 
    height: 200,
    width: 200
  })
  const [progresschartSize, setProgresschartSize] = React.useState({ 
    height: 200,
    width: 200
  })
  const sparkline = useRef<HTMLDivElement>(null);
  const donutchart = useRef<HTMLDivElement>(null);
  const progresschart = useRef<HTMLDivElement>(null);
  const handler = () => {

  if(sparkline){
    setSparklineSize({
      width: sparkline.current.offsetWidth,
      height: sparkline.current.offsetHeight - 100
    });
  }

   if(donutchart){
    setDonutchartSize({
      width: donutchart.current.offsetWidth,
      height: donutchart.current.offsetHeight - 100
    });
   }

   if(progresschart){
    setProgresschartSize({
      width: progresschart.current.offsetWidth,
      height: progresschart.current.offsetHeight - 100
    });
   }
}
React.useEffect(() => {
  handler();
}, []);
  React.useEffect(() => {
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    }
  })
    
    const widgets = {
      data:{
        barchart:[
          { month : "Jan", value : 31 },
          { month : "Feb", value : 33 },
          { month : "Mar", value : 45 },
          { month : "Apr", value : 56 },
          { month : "May", value : 35 },
          { month : "Jun", value : 87 },
          { month : "Jul", value : 54 },
          { month : "Aug", value : 32 },
          { month : "Sep", value : 65 },
          { month : "Oct", value : 47 },
          { month : "Nov", value : 64 },
          { month : "Dec", value : 84 }
        ],
        progresschart:[
          { percent : 1 / 100, color : ["#0288D1", "#99d5e6", "#01579B" ]}
        ],
        sparkline:[
          new SparklineModel(4, new Date("2017-12-14")),
          new SparklineModel(7, new Date("2017-12-15")),
          new SparklineModel(12, new Date("2017-12-16")),
          new SparklineModel(9, new Date("2017-12-17")),
          new SparklineModel(8, new Date("2017-12-18")),
          new SparklineModel(1, new Date("2017-12-19"))
        ]
      }
    }
    const printConnectionButton = () => (connectionState && connectionState === 'Disconnected' ?
    (<button onClick={async (ev) => await start()}>Start</button>) :
    (<button onClick={async (ev) => await stop()}>Stop</button>))

    const renderConnection = () => {
      return <> 
      <label>Endpoint IP:</label>
      <div>
          <input type="text" name="name" {...ip} disabled={connectionState === 'Connected'} />
          {printConnectionButton()}
      </div>
      {connectionState}
      <br></br>
            <div className="terminal">
                {logs.map((item, idx) => (
                    <pre key={idx}> {idx + 1}. {item}</pre>
                ))}
            </div>
      </>
  }

    const renderWidgets = (widgets: any) => {
        return <div className="column-stretch">
          <div className="widget column-stretch" id="top-line-chart" ref={sparkline} >
            <h3 className="title"> Sensor</h3>
              <Sparkline
                        chartId="sparkline_1"
                        width={sparklineSize.width}
                        height={sparklineSize.height}
                        data={widgets.data.sparkline}/>
          </div>
          <div className="column-stretch">
            <div className="row-stretch">
              <div className="widget column-stretch" id="browser" ref={donutchart} >
                <h3 className="title"> Top5</h3>
                  <DonutChart
                          chartId="donutchart_1"
                          width={(donutchartSize.width > 40 ? donutchartSize.width - 40 : donutchartSize.width)}
                          height={donutchartSize.height}
                          data={[]}/>
              </div>
              <div className="widget column-stretch" id="ret_visitors" ref={progresschart} >
                <h3 className="title"> Effectiveness</h3>
                <ProgressChart
                          chartId="progresschart_1"
                          width={(progresschartSize.width > 40 ? progresschartSize.width - 40 : progresschartSize.width)}
                          height={progresschartSize.height/2}
                          data={widgets.data.progresschart}/>
                        <br/>
                        <BarChart
                          chartId="barchart_1"
                          width={(progresschartSize.width > 40 ? progresschartSize.width - 40 : progresschartSize.width)}
                          height={progresschartSize.height/2}
                          data={widgets.data.barchart}/>
              </div>
            </div>  
          </div>
        </div>
    }
    return (
    <>
      <div className="main">
        {renderConnection()}
        <div className="content">
          {renderWidgets(widgets) }
        </div>
      </div>
    </>
    );
  }

