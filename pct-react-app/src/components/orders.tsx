import { EndpointConnectionFactory, IEndpointConnection } from '@macrix/pct-cmd';
import { HubConnectionState } from '@microsoft/signalr';
import React from 'react';
import { useFormInput } from './../hooks';

export const Orders: React.FC = props => {
    const ip = useFormInput('http://localhost:6001');
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

    const createOrder = async () => {
        setLogs([`Sending POST command: ${JSON.stringify(inputCommand.value)}.`]);
        endpointConnection
            .post('create_order', JSON.parse(inputCommand.value))
            .then(x => setLogs([...stateRef.current, 'Command sent.']));
    }

    const getOrder = async () => {
        setLogs([`Sending GET command: ${JSON.stringify(inputCommand)}.`]);
        endpointConnection
            .get('create_order_sync', JSON.parse(inputCommand.value))
            .then(x => setLogs([...stateRef.current, `Received: ${JSON.stringify(x)}.`]));
    }

    const start = async () => {
        const connection = factory.create(ip.value);
        connection.onconnected(x => setConnectionState(connection.state));
        connection.onclose(x => setConnectionState(connection.state));
        connection.onreconnected(x => setConnectionState(connection.state));
        connection.onreconnecting(x => setConnectionState(connection.state));
        connection.onconnected(id => {
            connection.off('order_created');
            connection.on('order_created', (command) => {
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

    const printConnectionButton = () => (connectionState && connectionState === 'Disconnected' ?
        (<button onClick={async (ev) => await start()}>Start</button>) :
        (<button onClick={async (ev) => await stop()}>Stop</button>))

    return (
        <>
            <label>Endpoint IP:</label>
            <div>
                <input type="text" name="name" {...ip} disabled={connectionState === 'Connected'} />
                {printConnectionButton()}
            </div>
            {connectionState}
            <br></br>
            <div>
                <button disabled={connectionState !== 'Connected'} onClick={async (ev) => await getOrder()}>GET</button>
                <button disabled={connectionState !== 'Connected'} onClick={async (ev) => await createOrder()}>POST</button>
            </div>

            <textarea rows={6} cols={50} placeholder="Command" name="command" {...inputCommand} disabled={connectionState !== 'Connected'}></textarea>

            <br></br>
            <div className="terminal">
                {logs.map((item, idx) => (
                    <pre key={idx}> {idx + 1}. {item}</pre>
                ))}
            </div>
        </>)
}
