(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('gnome-shell-signal-tracker'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.gnomeShellSignalTracker);
	    global.windowAnimations = mod.exports;
	  }
	})(this, function (exports, _gnomeShellSignalTracker) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.WindowResizeAnimation = exports.WindowMoveAnimation = exports.WindowFocusAnimation = undefined;
	  exports.enable = enable;
	  exports.disable = disable;

	  var _gnomeShellSignalTracker2 = _interopRequireDefault(_gnomeShellSignalTracker);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (!self) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return call && (typeof call === "object" || typeof call === "function") ? call : self;
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  var _createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();

	  const Meta = imports.gi.Meta;
	  const Tweener = imports.ui.tweener;

	  /**
	   * Helper class to manage a window animation.
	   *
	   * When enabled, the animation described by {@link animate} is applied when a
	   * given window signal is emitted. Also patches every window with
	   * "old_client_pos" and "old_rect" properties. For more information on windows
	   * and actors' properties check the GNOME Shell API documentation.
	   *
	   * @abstract
	   * @see {@link animate}
	   */

	  let WindowAnimation = function () {

	    /**
	     * @param {String} trigger the signal name that triggers the animation.
	     * @param {String} transition the name of the Tweener transition.
	     *
	     * @see {@link ui.tweener}
	     */
	    function WindowAnimation(trigger, transition) {
	      _classCallCheck(this, WindowAnimation);

	      this.trigger = trigger;
	      this.transition = transition;
	      this.signals = new _gnomeShellSignalTracker2.default();
	      this.windows = new _gnomeShellSignalTracker.ShellWindowTracker(this.signals);
	    }

	    /**
	     * Applies the animation.
	     *
	     * @param {gi.Meta.Window} win the window to apply the animation on.
	     * @param actor the corresponding scene actor.
	     * @abstract
	     * @protected
	     */


	    _createClass(WindowAnimation, [{
	      key: 'animate',
	      value: function animate(win, actor) {}
	    }, {
	      key: 'enable',
	      value: function enable() {
	        this.windows.onEvery(win => {
	          const actor = win.get_compositor_private();
	          win.old_client_pos = actor.get_geometry();
	          win.old_rect = win.get_frame_rect();
	        });
	        this.windows.connectEvery(this.trigger, win => {
	          const actor = win.get_compositor_private();
	          this.animate(win, actor, actor);
	        });
	      }
	    }, {
	      key: 'disable',
	      value: function disable() {
	        this.signals.clean();
	      }
	    }]);

	    return WindowAnimation;
	  }();

	  exports.default = WindowAnimation;

	  let WindowFocusAnimation = exports.WindowFocusAnimation = function (_WindowAnimation) {
	    _inherits(WindowFocusAnimation, _WindowAnimation);

	    /**
	     * @param {Number} scale the zoom-in scale factor.
	     * @param {Number} inTime the time in seconds to zoom-in.
	     * @param {Number} outTime the time in seconds to zoom-out.
	     * @param {String} transition the name of the Tweener transition.
	     */
	    function WindowFocusAnimation(scale = 1.025, inTime = 0.03, outTime = 0.07, transition = 'easeOutQuad') {
	      _classCallCheck(this, WindowFocusAnimation);

	      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WindowFocusAnimation).call(this, 'focus', transition));

	      _this.scale = scale;
	      _this.inTime = inTime;
	      _this.outTime = outTime;
	      return _this;
	    }

	    _createClass(WindowFocusAnimation, [{
	      key: 'animate',
	      value: function animate(win, actor) {
	        Tweener.addTween(actor, {
	          transition: this.transition,
	          time: this.inTime, scale_x: this.scale, scale_y: this.scale,
	          onStart: () => actor.set_pivot_point(0.5, 0.5),
	          onComplete: () => Tweener.addTween(actor, {
	            transition: this.transition,
	            time: this.outTime, scale_x: 1, scale_y: 1
	          })
	        });
	      }
	    }]);

	    return WindowFocusAnimation;
	  }(WindowAnimation);

	  let WindowMoveAnimation = exports.WindowMoveAnimation = function (_WindowAnimation2) {
	    _inherits(WindowMoveAnimation, _WindowAnimation2);

	    /**
	     * @param {Number} time the duration in seconds of the animation.
	     * @param {String} transition the name of the Tweener transition.
	     */
	    function WindowMoveAnimation(time = 0.2, transition = 'easeOutQuad') {
	      _classCallCheck(this, WindowMoveAnimation);

	      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(WindowMoveAnimation).call(this, 'position-changed', transition));

	      _this2.time = time;
	      return _this2;
	    }

	    _createClass(WindowMoveAnimation, [{
	      key: 'animate',
	      value: function animate(win, actor) {
	        if (win.window_type !== Meta.WindowType.NORMAL) return;
	        if (win.fullscreen) return;
	        const orect = win.old_rect;
	        const nrect = win.get_frame_rect();
	        let { x, y } = win.frame_rect_to_client_rect(nrect);
	        if (win.constructor.name.match('X11') && win.decorated) {
	          x -= 5;y -= 36;
	        }
	        Tweener.addTween(actor, {
	          transition: this.transition,
	          time: this.time, x: x, y: y,
	          onStart: () => {
	            actor.set_position(win.old_client_pos.x, win.old_client_pos.y);
	            win.old_client_pos.x = x;
	            win.old_client_pos.y = y;
	            win.old_rect.x = nrect.x;
	            win.old_rect.y = nrect.y;
	          }
	        });
	      }
	    }]);

	    return WindowMoveAnimation;
	  }(WindowAnimation);

	  let WindowResizeAnimation = exports.WindowResizeAnimation = function (_WindowAnimation3) {
	    _inherits(WindowResizeAnimation, _WindowAnimation3);

	    /**
	     * @param {Number} time the duration in seconds of the animation.
	     * @param {String} transition the name of the Tweener transition.
	     */
	    function WindowResizeAnimation(time = 0.2, transition = 'easeOutQuad') {
	      _classCallCheck(this, WindowResizeAnimation);

	      var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(WindowResizeAnimation).call(this, 'size-changed', transition));

	      _this3.time = time;
	      return _this3;
	    }

	    _createClass(WindowResizeAnimation, [{
	      key: 'animate',
	      value: function animate(win, actor) {
	        if (win.window_type !== Meta.WindowType.NORMAL) return;
	        if (win.fullscreen) return;
	        const orect = win.old_rect;
	        const nrect = win.get_frame_rect();
	        Tweener.addTween(actor, {
	          transition: this.transition,
	          time: this.time, scale_x: 1, scale_y: 1,
	          onStart: () => {
	            actor.set_pivot_point(0, 0);
	            actor.set_scale(orect.width / nrect.width, orect.height / nrect.height);
	            win.old_rect.width = nrect.width;
	            win.old_rect.height = nrect.height;
	          }
	        });
	      }
	    }]);

	    return WindowResizeAnimation;
	  }(WindowAnimation);

	  /**
	   * The extension's animations.
	   *
	   * @type {Array<WindowAnimation>}
	   */
	  const extension = [new WindowFocusAnimation(), new WindowMoveAnimation(), new WindowResizeAnimation()];

	  /**
	   * Enables the module as an extension.
	   */
	  function enable() {
	    for (let a of extension) a.enable();
	  }

	  /**
	   * Disables the module as an extension.
	   */
	  function disable() {
	    for (let a of extension) a.disable();
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports);
	    global.signalTracker = mod.exports;
	  }
	})(this, function (exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  var _createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();

	  const Signals = imports.signals;
	  const global = window.global;

	  /**
	   * Tracks objects implementing the GJS signal emitter interface.
	   *
	   * This class should be used on a per-extension basis. Call {@link clean} when
	   * it is disabled.
	   *
	   * @see {@link connect}
	   * @see {@link imports.signals}
	   */

	  let SignalTracker = function () {
	    function SignalTracker() {
	      _classCallCheck(this, SignalTracker);

	      Signals.addSignalMethods(this.cleaner = {});
	    }

	    /**
	     * Connects an object's signal to a handler and tracks it until {@link clean}
	     * is called.
	     *
	     * @param {Object} obj the object to track.
	     * @param {String} sig the object's signal to track.
	     * @param {Function} cb the signal handler.
	     * @return {Function} the callback to manually stop the tracking.
	     */


	    _createClass(SignalTracker, [{
	      key: 'connect',
	      value: function connect(obj, sig, cb) {
	        const oid = obj.connect(sig, cb);
	        const cid = this.cleaner.connect(null, () => obj.disconnect(oid));
	        return () => {
	          this.cleaner.disconnect(cid);obj.disconnect(oid);
	        };
	      }
	    }, {
	      key: 'clean',
	      value: function clean() {
	        this.cleaner.emit();
	        this.cleaner.disconnectAll();
	      }
	    }]);

	    return SignalTracker;
	  }();

	  exports.default = SignalTracker;

	  let ShellWindowTracker = exports.ShellWindowTracker = function () {

	    /**
	     * @param {SignalTracker} tracker a signal tracker.
	     */
	    function ShellWindowTracker(tracker) {
	      _classCallCheck(this, ShellWindowTracker);

	      this.tracker = tracker;
	    }

	    /**
	     * Executes a callback on all current windows, and also whenever a new one is
	     * created.
	     *
	     * @param {Function(gi.Meta.Window)} cb the callback.
	     * @return {Function} the callback to manually stop the tracking.
	     */


	    _createClass(ShellWindowTracker, [{
	      key: 'onEvery',
	      value: function onEvery(cb) {
	        for (let a of global.get_window_actors()) cb(a.meta_window);
	        return this.tracker.connect(global.display, 'window-created', (_, win) => cb(win));
	      }

	      /**
	       * Connects a window's signal to a handler and tracks it with the underlying
	       * signal tracker.
	       *
	       * @param {gi.Meta.Window} win the window to track.
	       * @param {String} sig the window's signal to track.
	       * @param {Function} cb the signal handler.
	       * @return {Function} the callback to manually stop the tracking.
	       */

	    }, {
	      key: 'connect',
	      value: function connect(win, sig, cb) {
	        const dc = this.tracker.connect(win, sig, cb);
	        return this.tracker.connect(win, 'unmanaged', dc);
	      }

	      /**
	       * Connects every window's signal to a handler and tracks it with the
	       * underlying signal tracker.
	       *
	       * @param {String} sig the window's signal to track.
	       * @param {Function} cb the signal handler.
	       * @return {Function} the callback to manually stop the tracking.
	       * @see {@link connect}
	       * @see {@link onEvery}
	       */

	    }, {
	      key: 'connectEvery',
	      value: function connectEvery(sig, cb) {
	        return this.onEvery(win => this.connect(win, sig, cb));
	      }
	    }]);

	    return ShellWindowTracker;
	  }();

	  let ShellWorkspaceTracker = exports.ShellWorkspaceTracker = function () {

	    /**
	     * @param {SignalTracker} tracker a signal tracker.
	     */
	    function ShellWorkspaceTracker(tracker) {
	      _classCallCheck(this, ShellWorkspaceTracker);

	      this.tracker = tracker;
	    }

	    /**
	     * Executes a callback on all current workspaces, and also whenever a new one
	     * is created.
	     *
	     * @param {Function(gi.Meta.Workspace)} cb the callback.
	     * @return {Function} the callback to manually stop the tracking.
	     */


	    _createClass(ShellWorkspaceTracker, [{
	      key: 'onEvery',
	      value: function onEvery(cb) {
	        for (let i = 0; i < global.screen.n_workspaces; i++) cb(global.screen.get_workspace_by_index(i));
	        return this.tracker.connect(global.screen, 'workspace-added', (_, i) => cb(global.screen.get_workspace_by_index(i)));
	      }

	      /**
	       * Connects a workspace's signal to a handler and tracks it with the
	       * underlying signal tracker.
	       *
	       * @param {gi.Meta.Workspace} win the workspace to track.
	       * @param {String} sig the workspace's signal to track.
	       * @param {Function} cb the signal handler.
	       * @return {Function} the callback to manually stop the tracking.
	       */

	    }, {
	      key: 'connect',
	      value: function connect(ws, sig, cb) {
	        const dc = this.tracker.connect(ws, sig, cb);
	        return this.tracker.connect(global.screen, 'workspace-removed', dc);
	      }

	      /**
	       * Connects every workspace's signal to a handler and tracks it with the
	       * underlying signal tracker.
	       *
	       * @param {String} sig the workspace's signal to track.
	       * @param {Function} cb the signal handler.
	       * @return {Function} the callback to manually stop the tracking.
	       * @see {@link connect}
	       * @see {@link onEvery}
	       */

	    }, {
	      key: 'connectEvery',
	      value: function connectEvery(sig, cb) {
	        return this.onEvery(ws => this.connect(ws, sig, cb));
	      }
	    }]);

	    return ShellWorkspaceTracker;
	  }();
	});


/***/ }
/******/ ])
});
;