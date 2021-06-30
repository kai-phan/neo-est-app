import { locate } from "@dhtmlx/trial-lib-gantt";

function getOffset(node, relative, ev) {
  const box = node.getBoundingClientRect();
  const base = relative.getBoundingClientRect();

  return {
    top: box.top - base.top,
    left: box.left - base.left,
    dt: box.bottom - ev.clientY,
    db: ev.clientY - box.top,
  };
}

const SHIFT = 5;

export function reorder(node, config) {
  let source, clone;
  let x, y, base, detail;
  let touched, touchTimer;

  function down(event) {
    x = event.clientX;
    y = event.clientY;
    base = getOffset(source, node, event);

    document.body.style.userSelect = "none";
  }

  function handleTouchstart(event) {
    source = locate(event);
    if (!source) return;

    touchTimer = setTimeout(() => {
      touched = true;
      if (config && config.touchStart) config.touchStart();
      if (config && config.css) {
        source.classList.add(config.css.reorder);
      }
      down(event.touches[0]);
    }, 500);

    node.addEventListener("touchmove", handleTouchmove);
    node.addEventListener("touchend", handleTouchend);
    node.addEventListener("contextmenu", handleContext);
  }

  function handleContext(event) {
    if (touched || touchTimer) {
      event.preventDefault();
      return false;
    }
  }

  function handleMousedown(event) {
    if (event.which === 3) return;

    source = locate(event);
    if (!source) return;

    node.addEventListener("mousemove", handleMousemove);
    node.addEventListener("mouseup", handleMouseup);

    down(event);
  }

  function end(full) {
    node.removeEventListener("mousemove", handleMousemove);
    node.removeEventListener("mouseup", handleMouseup);
    node.removeEventListener("touchmove", handleTouchmove);
    node.removeEventListener("touchend", handleTouchend);
    document.body.style.userSelect = "";

    if (full) {
      node.removeEventListener("mousedown", handleMousedown);
      node.removeEventListener("touchstart", handleTouchstart);
    }
  }

  function move(event) {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    if (!clone) {
      if (config && config.start) {
        if (config.start({ id: source.dataset.id, e: event }) === false) return;
      }
      if (Math.abs(dx) < SHIFT && Math.abs(dy) < SHIFT) return;

      clone = source.cloneNode(true);
      clone.style.pointerEvents = "none";
      clone.classList.add(config.css.reorderCard);
      clone.style.position = "absolute";
      clone.style.left = base.left + "px";
      clone.style.top = base.top + "px";

      source.style.visibility = "hidden";
      source.parentNode.insertBefore(clone, source);
    }

    if (clone) {
      const top = Math.max(0, base.top + dy);
      clone.style.top = top + "px";

      const targetNode = document.elementFromPoint(
        event.clientX,
        event.clientY
      );
      const target = locate(targetNode);

      if (target && target !== source) {
        const box = target.getBoundingClientRect();
        const line = box.top + box.height / 2;

        const after =
          event.clientY + base.db > line &&
          target.nextElementSibling !== source;
        const before =
          event.clientY - base.dt < line &&
          target.previousElementSibling !== source;
        if (config && config.move)
          if (
            config.move({ id: source.dataset.id, top, before, after }) === false
          )
            return;
        if (after) {
          // move down
          target.parentNode.insertBefore(source, target.nextElementSibling);
          detail = { id: source.dataset.id, after: target.dataset.id };
        } else if (before) {
          // move up
          target.parentNode.insertBefore(source, target);
          detail = { id: source.dataset.id, before: target.dataset.id };
        }
        return;
      }

      if (config && config.move) config.move({ id: source.dataset.id, top });
    }
  }

  function handleMousemove(event) {
    move(event);
  }

  function handleTouchmove(event) {
    if (touched) {
      event.preventDefault();
      move(event.touches[0]);
    } else if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
  }

  function handleTouchend() {
    touched = null;
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
    up();
  }

  function handleMouseup() {
    up();
  }

  function up() {
    if (source) {
      source.style.visibility = "";
      source.classList.remove(config.css.reorder);
    }
    if (clone) {
      clone.parentNode.removeChild(clone);
      if (config && config.end)
        if (config.end(detail || { id: source.dataset.id }) === false) {
          source.parentNode.removeChild(source);
        }
    }

    source = clone = base = detail = null;
    end();
  }

  if (node.style.position !== "absolute") node.style.position = "relative";

  node.addEventListener("mousedown", handleMousedown);
  node.addEventListener("touchstart", handleTouchstart);

  return {
    destroy() {
      end(true);
    },
  };
}
