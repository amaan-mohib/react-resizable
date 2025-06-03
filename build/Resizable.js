"use strict";

exports.__esModule = true;
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactDraggable = require("react-draggable");
var _utils = require("./utils");
var _propTypes = require("./propTypes");
var _excluded = ["children", "className", "draggableOpts", "width", "height", "handle", "handleSize", "lockAspectRatio", "axis", "minConstraints", "maxConstraints", "onResize", "onResizeStop", "onResizeStart", "resizeHandles", "transformScale"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
// The base <Resizable> component.
// This component does not have state and relies on the parent to set its props based on callback data.
var Resizable = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Resizable, _React$Component);
  function Resizable() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.handleRefs = {};
    _this.lastHandleRect = null;
    _this.slack = null;
    // We add these two fields to remember the state at start of resizing
    _this.dragStart = null;
    _this.sizeStart = null;
    return _this;
  }
  var _proto = Resizable.prototype;
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.resetData();
  };
  _proto.resetData = function resetData() {
    this.lastHandleRect = this.slack = null;
  }

  // Clamp width and height within provided constraints
  ;
  _proto.runConstraints = function runConstraints(width, height) {
    var _this$props = this.props,
      minConstraints = _this$props.minConstraints,
      maxConstraints = _this$props.maxConstraints,
      lockAspectRatio = _this$props.lockAspectRatio;
    // short circuit
    if (!minConstraints && !maxConstraints && !lockAspectRatio) return [width, height];

    // If constraining to min and max, we need to also fit width and height to aspect ratio.
    if (lockAspectRatio) {
      var ratio = this.props.width / this.props.height;
      var deltaW = width - this.props.width;
      var deltaH = height - this.props.height;

      // Find which coordinate was greater and should push the other toward it.
      // E.g.:
      // ratio = 1, deltaW = 10, deltaH = 5, deltaH should become 10.
      // ratio = 2, deltaW = 10, deltaH = 6, deltaW should become 12.
      if (Math.abs(deltaW) > Math.abs(deltaH * ratio)) {
        height = width / ratio;
      } else {
        width = height * ratio;
      }
    }
    var oldW = width,
      oldH = height;

    // Add slack to the values used to calculate bound position. This will ensure that if
    // we start removing slack, the element won't react to it right away until it's been
    // completely removed.
    var _ref = this.slack || [0, 0],
      slackW = _ref[0],
      slackH = _ref[1];
    width += slackW;
    height += slackH;
    if (minConstraints) {
      width = Math.max(minConstraints[0], width);
      height = Math.max(minConstraints[1], height);
    }
    if (maxConstraints) {
      width = Math.min(maxConstraints[0], width);
      height = Math.min(maxConstraints[1], height);
    }

    // If the width or height changed, we must have introduced some slack. Record it for the next iteration.
    this.slack = [slackW + (oldW - width), slackH + (oldH - height)];
    return [width, height];
  }

  /**
   * Wrapper around drag events to provide more useful data.
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */;
  _proto.resizeHandler = function resizeHandler(handlerName, axis) {
    var _this2 = this;
    // Using `lastX` and `lastY` rather than `deltaX` and `deltaY` (see longer comment below)
    return function (e, _ref2) {
      var _this2$dragStart$x, _this2$dragStart$y;
      var node = _ref2.node,
        lastX = _ref2.lastX,
        lastY = _ref2.lastY;
      // Reset data in case it was left over somehow (should not be possible)
      if (handlerName === 'onResizeStart') {
        _this2.resetData();
        // Remembering state at start of resizing
        _this2.dragStart = {
          x: lastX,
          y: lastY
        };
        _this2.sizeStart = {
          x: _this2.props.width,
          y: _this2.props.height
        };
      }

      // Axis restrictions
      var canDragX = (_this2.props.axis === 'both' || _this2.props.axis === 'x') && axis !== 'n' && axis !== 's';
      var canDragY = (_this2.props.axis === 'both' || _this2.props.axis === 'y') && axis !== 'e' && axis !== 'w';
      // No dragging possible.
      if (!canDragX && !canDragY) return;

      // In order to fix an issue where resizing does not correctly follow the mouse cursor, we use the `lastX` and
      // `lastY` properties of the mouse event rather than the `deltaX` and `deltaY` properties.
      //
      // This approach is more robust because `lastX` and `lastY` are absolute values and will remain true even if some
      // events get dropped, whereas calculating the resulting width with `deltaX` and `deltaY` in a cumulative way will
      // accumulate errors if some events are skipped.
      var width = _this2.sizeStart.x + (canDragX ? lastX - ((_this2$dragStart$x = _this2.dragStart.x) != null ? _this2$dragStart$x : 0) : 0);
      var height = _this2.sizeStart.y + (canDragY ? lastY - ((_this2$dragStart$y = _this2.dragStart.y) != null ? _this2$dragStart$y : 0) : 0);
      // Run user-provided constraints.
      var _this2$runConstraints = _this2.runConstraints(width, height);
      width = _this2$runConstraints[0];
      height = _this2$runConstraints[1];
      var dimensionsChanged = width !== _this2.props.width || height !== _this2.props.height;

      // Call user-supplied callback if present.
      var cb = typeof _this2.props[handlerName] === 'function' ? _this2.props[handlerName] : null;
      // Don't call 'onResize' if dimensions haven't changed.
      var shouldSkipCb = handlerName === 'onResize' && !dimensionsChanged;
      if (cb && !shouldSkipCb) {
        e.persist == null ? void 0 : e.persist();
        cb(e, {
          node: node,
          size: {
            width: width,
            height: height
          },
          handle: axis
        });
      }

      // Reset internal data
      if (handlerName === 'onResizeStop') _this2.resetData();
    };
  }

  // Render a resize handle given an axis & DOM ref. Ref *must* be attached for
  // the underlying draggable library to work properly.
  ;
  _proto.renderResizeHandle = function renderResizeHandle(handleAxis, ref) {
    var handle = this.props.handle;
    // No handle provided, make the default
    if (!handle) {
      return /*#__PURE__*/React.createElement("span", {
        className: "react-resizable-handle react-resizable-handle-" + handleAxis,
        ref: ref
      });
    }
    // Handle is a function, such as:
    // `handle={(handleAxis) => <span className={...} />}`
    if (typeof handle === 'function') {
      return handle(handleAxis, ref);
    }
    // Handle is a React component (composite or DOM).
    var isDOMElement = typeof handle.type === 'string';
    var props = _objectSpread({
      ref: ref
    }, isDOMElement ? {} : {
      handleAxis: handleAxis
    });
    return /*#__PURE__*/React.cloneElement(handle, props);
  };
  _proto.render = function render() {
    var _this3 = this;
    // Pass along only props not meant for the `<Resizable>`.`
    // eslint-disable-next-line no-unused-vars
    var _this$props2 = this.props,
      children = _this$props2.children,
      className = _this$props2.className,
      draggableOpts = _this$props2.draggableOpts,
      width = _this$props2.width,
      height = _this$props2.height,
      handle = _this$props2.handle,
      handleSize = _this$props2.handleSize,
      lockAspectRatio = _this$props2.lockAspectRatio,
      axis = _this$props2.axis,
      minConstraints = _this$props2.minConstraints,
      maxConstraints = _this$props2.maxConstraints,
      onResize = _this$props2.onResize,
      onResizeStop = _this$props2.onResizeStop,
      onResizeStart = _this$props2.onResizeStart,
      resizeHandles = _this$props2.resizeHandles,
      transformScale = _this$props2.transformScale,
      p = _objectWithoutPropertiesLoose(_this$props2, _excluded);

    // What we're doing here is getting the child of this element, and cloning it with this element's props.
    // We are then defining its children as:
    // 1. Its original children (resizable's child's children), and
    // 2. One or more draggable handles.
    return (0, _utils.cloneElement)(children, _objectSpread(_objectSpread({}, p), {}, {
      className: (className ? className + " " : '') + "react-resizable",
      children: [].concat(children.props.children, resizeHandles.map(function (handleAxis) {
        var _this3$handleRefs$han;
        // Create a ref to the handle so that `<DraggableCore>` doesn't have to use ReactDOM.findDOMNode().
        var ref = (_this3$handleRefs$han = _this3.handleRefs[handleAxis]) != null ? _this3$handleRefs$han : _this3.handleRefs[handleAxis] = /*#__PURE__*/React.createRef();
        return /*#__PURE__*/React.createElement(_reactDraggable.DraggableCore, _extends({}, draggableOpts, {
          nodeRef: ref,
          key: "resizableHandle-" + handleAxis,
          onStop: _this3.resizeHandler('onResizeStop', handleAxis),
          onStart: _this3.resizeHandler('onResizeStart', handleAxis),
          onDrag: _this3.resizeHandler('onResize', handleAxis)
        }), _this3.renderResizeHandle(handleAxis, ref));
      }))
    }));
  };
  return Resizable;
}(React.Component);
exports.default = Resizable;
Resizable.propTypes = _propTypes.resizableProps;
Resizable.defaultProps = {
  axis: 'both',
  handleSize: [20, 20],
  lockAspectRatio: false,
  minConstraints: [20, 20],
  maxConstraints: [Infinity, Infinity],
  resizeHandles: ['se'],
  transformScale: 1
};