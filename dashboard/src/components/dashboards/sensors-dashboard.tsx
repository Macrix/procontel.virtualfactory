import { HubConnectionState } from '@microsoft/signalr';
import React, { useRef } from 'react';
import { useFormInput } from '../../hooks';
import { EndpointConnection } from '../../services';
import { BarChart, DonutChart, ProgressChart, Sparkline, SparklineModel } from '../controls/d3';
import './style.css';


export const SensorsDashboard: React.FC = props => {
  const ip = useFormInput('http://localhost:5009');
  const [endpointConnection, setEndpointConnection] = React.useState<EndpointConnection>(null!);
  const [connectionState, setConnectionState] = React.useState<HubConnectionState>(HubConnectionState.Disconnected);
  const [temparatures, _setTemparatures] = React.useState<SparklineModel[]>([]); 
  const inputCommand = useFormInput(`
  {
    "CustomerName": "ProconTEL team"
  }`);
  
  const temperaturesRef = React.useRef(temparatures);
  const setTemperatures = (data: SparklineModel[]) => {
    temperaturesRef.current = data;
    _setTemparatures(data);
  };
//   const createOrder = async () => {
//     setLogs([`Sending POST command: ${JSON.stringify(inputCommand.value)}.`]);
//     endpointConnection
//         .post('create_order', JSON.parse(inputCommand.value))
//         .then(x => setLogs([...stateRef.current, 'Command sent.']));
// }

// const getOrder = async () => {
//     setLogs([`Sending GET command: ${JSON.stringify(inputCommand)}.`]);
//     endpointConnection
//         .get('create_order_sync', JSON.parse(inputCommand.value))
//         .then(x => setLogs([...stateRef.current, `Received: ${JSON.stringify(x)}.`]));
// }

  const start = async () => {
      const connection = new EndpointConnection(ip.value + '/hubs/commands/');
      connection.onconnected(x => setConnectionState(connection.state));
      connection.onclose(x => setConnectionState(connection.state));
      connection.onreconnected(x => setConnectionState(connection.state));
      connection.onreconnecting(x => setConnectionState(connection.state));
      connection.onconnected(id => {
          connection.off('onTemperature');
          connection.on('onTemperature', (command: number) => {
            setTemperatures([
                  ...temperaturesRef.current.slice(Math.max(temperaturesRef.current.length - 20, 0)),
                  new SparklineModel(command as number, new Date(Date.now()))
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
                        data={temparatures}/>
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

