import React from 'react';
import { Gantt } from '@dhtmlx/trial-react-gantt';
import { wx } from '@dhtmlx/trial-react-gantt';
import css from './customGantt.module.css';

import CustomTimeScale from '../CustomGantt/scale/CustomTimeScale';
import CustomChart from './chart/Chart';
import CustomGrid from './grid/Grid';
import EstimateModal from '../../Modal';
import { formatTask } from '../../../helpers';

const { Tooltip } = wx;

class CustomGantt extends Gantt {
  render() {
    const { dataStart, dataEnd, from } = this.state;
    const {
      scrollTop,
      scrollLeft,
      selected,
      details,
      columnsData,
      compactMode,
    } = this.state;
    const { tasks, links, scales, tasksMap } = this.store.state;
    const { grid, cellWidth, cellHeight, readonly } = this.props;
    const { templates, markers, taskTypes, tooltip, borders } = this.props;
    const gridWidth = compactMode ? 50 : grid.width || 400;

    const noDrag = readonly.noDrag || readonly;
    const noEdit = readonly.noEdit || readonly;
    const noNewLink = readonly.noNewLink || readonly;

    const fullWidth = scales.width;
    const fullHeight = tasks.length * cellHeight;

    const renderTasks = tasks.slice(dataStart, dataEnd).map((task) => formatTask(task, cellWidth));

    const { start, diff } = scales;

    const markersData = markers.map((marker) => ({
      ...marker,
      left: diff(marker.start, start) * cellWidth,
    }));

    return (
      <Tooltip content={tooltip} data={this.getTooltipData.bind(this)}>
        <div className={css.layout}>
          {grid && (
            <CustomGrid
              compactMode={compactMode}
              width={gridWidth}
              tasks={renderTasks}
              columns={columnsData}
              scales={scales}
              scrollTop={scrollTop}
              scrollDelta={from}
              cellHeight={cellHeight}
              selected={selected}
              action={(ev) => this.action(ev)}
            />
          )}

          <div className={css.content}>
            <CustomTimeScale scales={scales} scrollLeft={scrollLeft}/>

            <CustomChart
              drag={!noDrag}
              newLink={!noNewLink}
              markers={markersData}
              tasks={renderTasks}
              links={links}
              scrollTop={scrollTop}
              scrollLeft={scrollLeft}
              selected={selected}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              fullWidth={fullWidth}
              fullHeight={fullHeight}
              templates={templates}
              borders={borders}
              action={(ev) => this.action(ev)}
            />
          </div>
          {details && <EstimateModal issue={details} action={this.action} />}
        </div>
      </Tooltip>
    );
  }
}

export default CustomGantt;