import composite from './composite';
import parallel from './parallel';

function createTouches(initialTouches, { eventToTouches, moveEvent, ...props }) {
  const touches = parallel(mapCoordsToActions(initialTouches), {
    preventDefault: true,
    ...props
  });

  function updateTouches(e) {
    if (props.preventDefault) e.preventDefault();

    const latestTouches = eventToTouches(e);
    updateActionWithTouches(touches, latestTouches);
  }

  touches.setProps({
    _onStart: () => document.documentElement.addEventListener(moveEvent, updateTouches),
    _onStop: () => document.documentElement.removeEventListener(moveEvent, updateTouches)
  });

  return touches;
}

function mapCoordsToActions(coords) { 
  let actions = [];
  for (var i = 0; i < coords.length; i++) {
    const { x, y } = coords[i];
    actions[i] = composite({
      x: value(x),
      y: value(y)
    });
  }
  return composite(actions);
}

function updateActionWithTouches(action, newTouches) {
  for (const i in newTouches) {
    const { x, y } = newTouches[i];
    if (action[i] !== null) {
      action[i].x.set(x);
      action[i].y.set(y);
    } else {
      action[i] = composite({
        x: value(x),
        y: value(y)
      });
    }
  }
}

const mouseEventToTouches = ({ pageX, pageY }) => [{ x: pageX, y: pageY }];
const touchEventToTouches = ({ touches }) => extractCoords(touches);

function extractCoords(touches) { 
  let coords = [];
  for (var i = 0; i < touches.length; i++) {
    const { clientX, clientY } = touches[i];
    coords[i] = {
      x: clientX,
      y: clientY
    };
  }
  return coords;
}

const getNativeEvent = (e) => e.originalEvent || e.nativeEvent || e;

export default (e, props) => {
  const nativeEvent = getNativeEvent(e);
  return (nativeEvent.touches) ?
    createTouches(touchEventToTouches(e), {
      moveEvent: 'touchmove',
      eventToTouches: touchEventToTouches,
      ...props
    }) :
    createTouches(mouseEventToTouches(e), {
      moveEvent: 'mousemove',
      eventToTouches: mouseEventToTouches,
      ...props
    });
};
