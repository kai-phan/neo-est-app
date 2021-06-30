import React from 'react';
import css from '@dhtmlx/trial-react-gantt/src/components/TimeScale.module.css';
import classes from 'classnames';
import moment from 'moment';

export default class CustomTimeScale extends React.Component {
  dayOffStyle = (cell) => {
    if (
      moment(cell.value).isValid() &&
      moment(cell.value).day() === 6 ||
      moment(cell.value).day() === 0
    ) {
      return {
        color: 'red',
      };
    }

    return {};
  };

  render() {
    const { scrollLeft, scales } = this.props;
    const { rows } = scales;
    return (
      <div
        className={css.scale}
        style={{ left: -scrollLeft, width: scales.width }}
      >
        {rows.map((row, index) => (
          <div
            key={index}
            className={css.row}
            style={{ height: row.height + 'px' }}
          >
            {row.cells.map((cell, i) => (
              <div
                key={i}
                className={classes(css.cell, cell.css)}
                style={{ width: cell.width, ...this.dayOffStyle(cell) }}
              >
                {index === 0 ? cell.value : moment(cell.value).format('ddd D')}
                {/*{cell.value}*/}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}