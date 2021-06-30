import React, { Component } from "react";
import { locateID } from "@dhtmlx/trial-lib-gantt";
import { reorder } from "./actions/reorder";

import cls from "classnames";
import css from "./Body.module.css";

class Body extends Component {
  constructor() {
    super();
    this.delta = 20;
    this.scroll = true;
  }

  componentDidMount() {
    reorder(this.node, {
      start: (e) => this.startReorder(e),
      move: (e) => this.moveReorder(e),
      end: (e) => this.endReorder(e),
      touchStart: () => this.endScroll(),
      css,
    });
  }

  startReorder({ id }) {
    const { tasks, action } = this.props;

    id *= 1;
    const task = tasks.find((a) => a.id === id);
    if (!task) return;

    if (task.open) action({ id, action: "toggle-task" });

    action({ action: "hide-details" });
  }

  moveReorder({ id, top }) {
    const { scrollDelta, action } = this.props;

    action({
      action: "move-task",
      id,
      obj: { top: top + scrollDelta },
    });
  }

  endReorder(result) {
    const { action } = this.props;

    let id = result.id * 1;
    const { before, after } = result;
    const target = (before || after) * 1;

    if (!target) {
      action({ id, action: "repaint-task" });
      return;
    }

    const mode = before ? "before" : "after";

    action({
      id,
      action: "reorder-task",
      obj: { id, mode, target },
    });
  }

  endScroll() {
    this.scroll = false;
  }

  onClick(e) {
    const id = locateID(e);
    if (!id) return;

    const action = e.target.dataset.action;
    if (action) {
      this.props.action({ id, action });
      e.preventDefault();
    } else {
      this.props.action({ action: "select-task", id });
    }
  }

  onDblClick(e) {
    const id = locateID(e);
    if (id) this.props.action({ action: "show-details", id });
  }

  onWheel(e) {
    const { scrollTop, action } = this.props;
    const step = e.deltaMode ? e.deltaY * 18 : e.deltaY;
    const top = Math.max(0, scrollTop + step);
    action({ action: "scroll-chart", top });
  }

  onTouchStart(e) {
    e.preventDefault();
    this.scroll = true;
    this.touchY = e.touches[0].clientY + this.props.scrollTop;
  }

  onTouchMove(e) {
    if (this.scroll) {
      const delta = this.touchY - e.touches[0].clientY;
      this.props.action({ action: "scroll-chart", top: delta });
      e.preventDefault();
      return false;
    }
  }

  getIcon(task) {
    if (!task.data) return "";
    return task.open ? "close" : "open";
  }

  getCellStyle(column) {
    const style = {
      textAlign: column.align,
    };
    column.width === "100%" ? (style.flex = 1) : (style.width = column.width);
    return style;
  }

  getCellTemplate(column, task) {
    if (column.name === "text") {
      return (
        <div
          className={css.content}
          style={{ paddingLeft: (task.$level - 1) * this.delta + "px" }}
        >
          <div
            className={cls(css.icon, css[this.getIcon(task)])}
            data-action="toggle-task"
          ></div>
          {column.template(task)}
        </div>
      );
    } else if (column.action) {
      return <span className={css.add} data-action={column.action} />;
    }

    return column.template(task);
  }

  render() {
    const {
      tasks,
      columns,
      cellHeight,
      scrollTop,
      scrollDelta,
      selected,
    } = this.props;

    return (
      <div
        className={css.table}
        ref={(node) => (this.node = node)}
        style={{ top: -(scrollTop - scrollDelta) }}
        onClick={(e) => this.onClick(e)}
        onWheel={(e) => this.onWheel(e)}
        onTouchStart={(e) => this.onTouchStart(e)}
        onTouchMove={(e) => this.onTouchMove(e)}
        // onDoubleClick={(e) => this.onDblClick(e)}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cls(css.row, {
              [css.selected]: selected && selected.id == task.id,
            })}
            style={{ height: cellHeight + "px" }}
            data-id={task.id}
          >
            {columns.map((column) => (
              <div
                key={column.name}
                className={css.cell}
                style={this.getCellStyle(column)}
              >
                {this.getCellTemplate(column, task)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Body;
