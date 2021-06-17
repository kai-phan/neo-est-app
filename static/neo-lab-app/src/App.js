import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import { Gantt, MaterialTheme } from "@dhtmlx/trial-react-gantt";
import { columns, scales, tasks, links } from "./data";

import request from './api';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // invoke('getText', { example: 'my-invoke-variable' }).then(setData);
        invoke('apiCall', { cb: request.getListIssue }).then(setData);
    }, []);

    return (
        <MaterialTheme>
            {JSON.stringify(data)}
            <Gantt scales={scales} columns={columns} tasks={tasks} links={links} />
        </MaterialTheme>
    );
}

export default App;
