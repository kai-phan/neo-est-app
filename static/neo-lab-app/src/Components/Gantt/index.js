import React from 'react';
import { Gantt, MaterialTheme } from '@dhtmlx/trial-react-gantt';
import Styled from 'styled-components';

import { issuesToData } from '../../helpers';
import TaskContent from './TaskContent';
import { invoke } from '@forge/bridge';

const scales = [
  // { unit: 'month', step: 1, format: 'MMMM yyy' },
  { unit: 'week', step: 1, format: 'w' },
  { unit: 'day', step: 1, format: 'Do d' },
  // { unit: 'hour', step: 1, format: 'hh' },
];

const columns = [
  { name: 'text', label: 'Task' ,width: '30%' },
  { name: 'summary', width: '40%' },
  { name: 'renderStatus', width: '30%', align: 'right' },
];

const links = [
  { source: 2, target: 3, type: 0 },
  { source: 1, target: 4, type: 1 },
  { source: 5, target: 6, type: 2 }
];

const AppGantt = (props) => {
  const { issues } = props;

  const tasks = issuesToData(issues);

  const markers = [
    {
      start: new Date(),
      text: "To day",
    }
  ];

  return (
    <GanttWrapper>
      <MaterialTheme>
        <Gantt
          cellWidth={50}
          cellHeight={45}
          markers={markers}
          scales={scales}
          columns={columns}
          tasks={tasks}
          links={links}
          templates={{ taskText: TaskContent }}
        />
      </MaterialTheme>
    </GanttWrapper>
  );
};

const GanttWrapper = Styled.div`
    height: 100%;
    font-family: "Roboto", Arial, Helvetica, sans-serif !important;

    .Gantt-module_layout__3I6ye {
        height: auto;    
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        background-color: #fbfbfb;
        color: #111;
        
        .Header-module_row__3oqKd {
            background-color: #fbfbfb;
        }
    }
    .
`;

export default AppGantt;