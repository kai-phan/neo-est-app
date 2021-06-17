import React, { useEffect, useState } from 'react';
import { invoke, requestJira } from '@forge/bridge';
import { Gantt, MaterialTheme } from "@dhtmlx/trial-react-gantt";
import { columns, scales, tasks, links } from "./data";

import request from './api';

function App() {
    const [issues, setIssues] = useState(null);

    useEffect(() => {
        // invoke('getText', { example: 'my-invoke-variable' }).then(setData);
        const initFetch = async () => {
            const res = await requestJira('/rest/api/3/search');
            setIssues(res.body);
        }
        initFetch();
    }, []);

    return (
        <MaterialTheme>
            {JSON.stringify(issues)}
            <Gantt scales={scales} columns={columns} tasks={tasks} links={links} />
        </MaterialTheme>
    );
}

export default App;
