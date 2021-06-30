import React, { Component } from "react";
import Bars from "./Bars";
import CellGrid from "./CellGrid";
import Links from "./Links";
import cls from "classnames";
import css from "./Chart.module.css";

class Chart extends Component {
  componentDidMount() {
    window.addEventListener("resize", () => this.dataRequest());
    this.dataRequest();
  }

  componentDidUpdate(prev) {
    if (this.props.selected && this.props.selected != prev.selected) {
      this.scrollToTask(this.props.selected);
    }

    if (this.props.cellHeight != prev.cellHeight) {
      this.onScroll();
    }

    this.chart.scrollTop = this.props.scrollTop;
    this.chart.scrollLeft = this.props.scrollLeft;

    if (this.props.scrollTop != this.chart.scrollTop) {
      this.props.action({ action: "scroll-chart", top: this.chart.scrollTop });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.dataRequest);
  }

  onScroll() {
    this.props.action({
      action: "scroll-chart",
      top: this.chart.scrollTop,
      left: this.chart.scrollLeft,
    });
    this.dataRequest();
  }

  dataRequest() {
    const { cellHeight } = this.props;
    const clientHeight = this.chart ? this.chart.clientHeight : 0;
    const scrollTop = this.chart ? this.chart.scrollTop : 0;
    const num = Math.ceil(clientHeight / cellHeight) + 1;
    const pos = Math.floor(scrollTop / cellHeight);
    const start = Math.max(0, pos);
    const end = pos + num;
    const from = start * cellHeight;
    this.props.action({ action: "data-request", start, end, from });
  }

  scrollToTask(task) {
    const { cellWidth, cellHeight } = this.props;
    const { clientWidth, clientHeight } = this.chart;

    let left = this.props.scrollLeft;
    let top = this.props.scrollTop;

    if (task.$x <= left) {
      left = task.$x - cellWidth;
    } else if (
      task.$x + task.$w >= clientWidth + left &&
      task.$w < clientWidth
    ) {
      left = task.$x + task.$w - clientWidth + cellWidth;
    } else if (task.$w > clientWidth) {
      left = task.$x - cellWidth;
    }

    if (task.$y < top) {
      top = task.$y - cellHeight;
    } else if (task.$y + task.$h >= clientHeight + top) {
      top = task.$y - clientHeight + cellHeight;
    }

    this.props.action({
      action: "scroll-chart",
      top,
      left,
    });
  }

  render() {
    const {
      drag,
      newLink,
      markers,
      tasks,
      links,
      selected,
      scrollLeft,
      cellWidth,
      cellHeight,
      fullWidth,
      fullHeight,
      action,
      templates,
      borders,
    } = this.props;

    const clientHeight = this.chart ? this.chart.clientHeight : 0;
    const markersHeight = fullHeight > clientHeight ? clientHeight : fullHeight;

    const areaStyle = { width: fullWidth, height: fullHeight };
    const markersStyle = { height: markersHeight, left: -scrollLeft };

    const selectStyle = {
      height: cellHeight - 1,
      top: selected ? selected.$y - 3 : 0,
    };

    return (
      <div
        className={css.chart}
        ref={(node) => (this.chart = node)}
        onScroll={() => this.onScroll()}
      >
        {markers.length !== 0 && (
          <div className={css.markers} style={markersStyle}>
            {markers.map((marker) => (
              <div
                key={marker}
                className={cls(css.marker, marker.css || css.default)}
                style={{ left: marker.left }}
              >
                <div className={css.content}>{marker.text}</div>
              </div>
            ))}
          </div>
        )}

        <div className={css.area} style={areaStyle}>
          <CellGrid width={cellWidth} height={cellHeight} borders={borders} />

          {selected && <div className={css.selection} style={selectStyle} />}
          {/*<Links links={links} width={fullWidth} height={fullHeight} />*/}
          <Bars
            cellWidth={cellWidth}
            tasks={tasks}
            drag={drag}
            newLink={newLink}
            templates={templates}
            action={action}
          />
        </div>
      </div>
    );
  }
}

export default Chart;
