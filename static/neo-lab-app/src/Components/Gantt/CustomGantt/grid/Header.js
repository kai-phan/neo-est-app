import React, { Component } from "react";
import cls from "classnames";
import css from "./Header.module.css";

import { LocaleContext } from "./Locale/Locale";

class Header extends Component {
  cellStyle(column) {
    const style = {
      textAlign: column.align,
    };
    column.width === "100%" ? (style.flex = 1) : (style.width = column.width);
    return style;
  }

  render() {
    const { compactMode, columns, height, action } = this.props;

    const _ = this.context.__;

    return (
      <div className={css.table}>
        <div className={css.row} style={{ height }}>
          {columns.map((column) => (
            <div
              key={column.name}
              className={css.cell}
              style={this.cellStyle(column)}
            >
              {column.action ? (
                compactMode ? (
                  <span
                    className={cls(css.menu, "mdi", "mdi-menu")}
                    onClick={() => action({ action: "toggle-grid" })}
                  ></span>
                ) : (
                  <span
                    className={css.add}
                    onClick={() => action({ action: "add-task", id: 0 })}
                  />
                )
              ) : (
                _("gantt", column.label)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Header.contextType = LocaleContext;

export default Header;
