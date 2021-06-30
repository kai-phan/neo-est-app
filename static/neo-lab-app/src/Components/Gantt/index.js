import React from 'react';
import { MaterialTheme } from '@dhtmlx/trial-react-gantt';

import CustomGantt from './CustomGantt';
import { issuesToData } from '../../helpers';
import TaskContent from './TaskContent';

const scales = [
  { unit: 'month', step: 1, format: 'MMMM yyy' },
  { unit: 'day', step: 1, format: 'yyyy/MM/dd' },
];

const columns = [
  { name: 'text', label: 'Task', width: '30%' },
  { name: 'summary', width: '40%' },
  { name: 'renderStatus', width: '30%', align: 'right' },
];

const AppGantt = (props) => {
  const { issues } = props;
  const tasks = issuesToData(issues);

  const markers = [
    {
      start: new Date(),
      text: 'Today',
    }
  ];

  return (
    <MaterialTheme>
      <CustomGantt
        cellWidth={60}
        cellHeight={45}
        markers={markers}
        scales={scales}
        columns={columns}
        tasks={tasks}
        templates={{ taskText: TaskContent }}
      />
    </MaterialTheme>
  );
};


export default AppGantt;