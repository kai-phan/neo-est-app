import React from 'react';
import { Gantt, MaterialTheme } from '@dhtmlx/trial-react-gantt';
import Styled from 'styled-components';

import { columns, scales, tasks, links } from './data';

const AppGantt = (props) => {
  return (
    <GanttWrapper>
      <MaterialTheme>
        <Gantt scales={scales} columns={columns} tasks={tasks} links={links}/>
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
`;

export default AppGantt;