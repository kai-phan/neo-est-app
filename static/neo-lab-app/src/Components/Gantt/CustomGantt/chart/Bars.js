import React, { Component } from "react";
import { locate, locateID } from "@dhtmlx/trial-lib-gantt";
import NewLink from "./NewLink";
import cls from "classnames";
import css from "./Bars.module.css";

class Bars extends Component {
  constructor() {
    super();
    this.taskMove = null;
    this.ignoreNextClick = false;
    this.state = {
      start: null,
      end: null,
      touched: false,
    };
  }

  componentDidMount() {
    this.layer.addEventListener("touchmove", (e) => this.onTouchMove(e), {
      passive: false,
    });
  }

  componentWillUnmount() {
    this.layer.removeEventListener("touchmove", this.onTouchMove);
  }

  down(node, target, point) {
    const { clientX, clientY } = point;
    const id = node.dataset.id;
    const css = target.classList;

    if (css.contains("link")) {
      this.setState({
        start: {
          id,
          start: css.contains("left"),
          x: clientX,
          y: clientY,
        },
      });
      this.startDrag();
    } else {
      let mode = this.getMoveMode(node, point) || "move";

      this.taskMove = {
        id,
        mode,
        node,
        x: clientX,
        dx: 0,
        l: parseInt(node.style.left),
        w: parseInt(node.style.width),
      };
      this.startDrag();
    }
  }

  getMoveMode(node, e) {
    if (this.getTask(node.dataset.id).type === "milestone") return "";

    const rect = node.getBoundingClientRect();
    const p = (e.clientX - rect.left) / rect.width;
    let delta = 0.2 / (rect.width > 200 ? rect.width / 200 : 1);

    if (p < delta) return "start";
    if (p > 1 - delta) return "end";
    return "";
  }

  move(e, point) {
    const { clientX, clientY } = point;

    if (this.state.start) {
      this.setState({
        end: {
          x: clientX,
          y: clientY,
        },
      });
    } else if (this.taskMove && this.props.drag) {
      const { node, mode, l, w, x, id, start } = this.taskMove;
      const dx = (this.taskMove.dx = clientX - x);
      if (!start && Math.abs(dx) < 20) return;

      if (mode === "start") {
        node.style.left = `${l + dx}px`;
        node.style.width = `${w - dx}px`;
      } else if (mode === "end") {
        node.style.width = `${w + dx}px`;
      } else if (mode === "move") {
        node.style.left = `${l + dx}px`;
      }

      this.taskMove.start = true;
      this.props.action({
        action: "move-task",
        id,
        obj: {
          width: parseInt(node.style.width),
          left: parseInt(node.style.left),
        },
      });
    } else {
      const mnode = locate(e);
      if (mnode) {
        const mode = this.getMoveMode(mnode, point);
        mnode.style.cursor = mode ? "col-resize" : "pointer";
      }
    }
  }

  up(point) {
    const { start } = this.state;
    if (start) {
      const { clientX, clientY } = point;

      const source = start.id;
      const fromStart = start.start;
      this.setState({ start: null, end: null });

      const targetNode = document.elementFromPoint(clientX, clientY);
      const node = locate(targetNode);
      if (!node) return;

      const css = node.classList;
      const target = node.dataset.id;

      if (!target || source == target) return;

      let toStart = true;
      if (css.contains("link")) {
        if (css.contains("right")) {
          toStart = false;
        }
      } else {
        const rect = node.getBoundingClientRect();
        const x = clientX - rect.left;
        const w = rect.width;
        toStart = x < w / 2;
      }

      const type = (fromStart ? 1 : 0) + (toStart ? 0 : 2);
      if (this.props.newLink) {
        this.props.action({
          action: "add-link",
          obj: { source, target, type },
        });
      }
      this.endDrag();
    } else if (this.taskMove) {
      const { id, mode, dx, node, l, w, start } = this.taskMove;
      this.taskMove = null;

      if (!start) return;

      const time = Math.round(dx / this.props.cellWidth);
      // restore node position
      if (!time) {
        node.style.left = `${l}px`;
        node.style.width = `${w}px`;
      }

      this.props.action({
        action: "update-task-time",
        id,
        obj: { mode, time },
      });

      this.ignoreNextClick = false;

      this.endDrag();
    }
  }

  onMouseDown(e) {
    const node = locate(e);
    if (!node) return;

    this.down(node, e.target, e);
  }

  onMouseMove(e) {
    this.move(e, e);
  }

  onMouseUp(e) {
    this.up(e);
  }

  onTouchStart(e) {
    e.persist();

    const node = locate(e);
    if (node) {
      const target = e.target;
      this.touchTimer = setTimeout(() => {
        this.down(node, target, e.touches[0]);
        this.setState({ touched: true });
      }, 300);
    }
  }

  onTouchMove(e) {
    if (this.state.touched) {
      e.preventDefault();
      this.move(e, e.touches[0]);
    } else if (this.touchTimer) {
      clearTimeout(this.touchTimer);
      this.touchTimer = null;
    }
  }

  onTouchEnd(e) {
    this.setState({ touched: null });
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
      this.touchTimer = null;
    }

    this.up(e.changedTouches[0]);
  }

  onContextMenu(e) {
    e.preventDefault();
  }

  onClick(e) {
    if (this.ignoreNextClick) {
      this.ignoreNextClick = true;
      return;
    }

    const id = locateID(e.target);
    if (id) this.props.action({ action: "select-task", id });
  }

  onDblClick(e) {
    const id = locateID(e.target);
    if (id) this.props.action({ action: "show-details", id });
  }

  taskStyle(task) {
    return {
      left: `${task.$x}px`,
      top: `${task.$y}px`,
      width: `${task.$w}px`,
      height: `${task.$h}px`,
    };
  }

  getTask(id) {
    return this.props.tasks.find((a) => a.id == id);
  }

  lineHeight() {
    const { tasks } = this.props;
    return { lineHeight: `${tasks.length ? tasks[0].$h : 0}px` };
  }

  startDrag() {
    document.body.style.userSelect = "none";
  }

  endDrag() {
    document.body.style.userSelect = "";
  }

  render() {
    const { tasks, templates } = this.props;
    const { touched } = this.state;

    return (
      <div
        className={cls(css.bars, { [css.touch]: touched })}
        style={this.lineHeight()}
        ref={(node) => (this.layer = node)}
        onContextMenu={(e) => this.onContextMenu(e)}
        onMouseDown={(e) => this.onMouseDown(e)}
        onMouseMove={(e) => this.onMouseMove(e)}
        onMouseUp={(e) => this.onMouseUp(e)}
        onTouchStart={(e) => this.onTouchStart(e)}
        onTouchEnd={(e) => this.onTouchEnd(e)}
        onClick={(e) => this.onClick(e)}
        onDoubleClick={(e) => this.onDblClick(e)}
        onDragStart={() => false}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cls(css.bar, css[task.type || "task"], {
              [css.touch]:
                touched && this.taskMove && this.taskMove.id == task.id,
            })}
            style={this.taskStyle(task)}
            data-id={task.id}
            data-type={task.type}
            data-tooltip-id={task.id}
          >
            {/*<div className={cls(css.link, css.left, "link", "left")}></div>*/}

            {task.type !== "milestone" ? (
              <>
                {typeof task.progress !== "undefined" && (
                  <div className={css.progressWrapper}>
                    <div
                      className={css.progressPercent}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                )}

                {task.textLeft && (
                  <div className={css.textLeft}>{task.textLeft}</div>
                )}

                {task.textRight && (
                  <div className={css.textRight}>{task.textRight}</div>
                )}

                {templates.taskText ? (
                  <templates.taskText data={task} />
                ) : (
                  <div className={css.text}>{task.text}</div>
                )}
              </>
            ) : (
              <>
                <div className={css.content}></div>
                <div className={css.textRight}>
                  {task.text || task.textRight}
                </div>
              </>
            )}
            {/*<div className={cls(css.link, css.right, "link", "right")}></div>*/}
          </div>
        ))}

        {this.state.start && this.state.end && this.props.newLink && (
          <NewLink
            layer={this.layer}
            start={this.state.start}
            end={this.state.end}
          />
        )}
      </div>
    );
  }
}

export default Bars;
