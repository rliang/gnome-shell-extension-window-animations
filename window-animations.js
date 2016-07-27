import SignalTracker, {ShellWindowTracker} from 'gnome-shell-signal-tracker';

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
export default class WindowAnimation {

  /**
   * @param {String} trigger the signal name that triggers the animation.
   * @param {String} transition the name of the Tweener transition.
   *
   * @see {@link ui.tweener}
   */
  constructor(trigger, transition) {
    this.trigger = trigger;
    this.transition = transition;
    this.signals = new SignalTracker();
    this.windows = new ShellWindowTracker(this.signals);
  }

  /**
   * Applies the animation.
   *
   * @param {gi.Meta.Window} win the window to apply the animation on.
   * @param actor the corresponding scene actor.
   * @abstract
   * @protected
   */
  animate(win, actor) {
  }

  /**
   * Enables the animation.
   *
   * Patches every window with "old_client_pos" and "old_rect" properties, and
   * tracks their trigger signal.
   */
  enable() {
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

  /**
   * Disables the animation.
   */
  disable() {
    this.signals.clean();
  }
}

/**
 * A short zoom-in animation for when a window is focused.
 *
 * @see {@link animate}
 */
export class WindowFocusAnimation extends WindowAnimation {

  /**
   * @param {Number} scale the zoom-in scale factor.
   * @param {Number} inTime the time in seconds to zoom-in.
   * @param {Number} outTime the time in seconds to zoom-out.
   * @param {String} transition the name of the Tweener transition.
   */
  constructor(scale=1.025, inTime=0.03, outTime=0.07, transition='easeOutQuad') {
    super('focus', transition);
    this.scale = scale;
    this.inTime = inTime;
    this.outTime = outTime;
  }

  animate(win, actor) {
    Tweener.addTween(actor, {
      transition: this.transition,
      time: this.inTime, scale_x: this.scale, scale_y: this.scale,
      onStart: () => actor.set_pivot_point(0.5, 0.5),
      onComplete: () => Tweener.addTween(actor, {
        transition: this.transition,
        time: this.outTime, scale_x: 1, scale_y: 1,
      }),
    });
  }
}

/**
 * A movememnt animation for when a window's position is changed.
 *
 * @see {@link animate}
 */
export class WindowMoveAnimation extends WindowAnimation {

  /**
   * @param {Number} time the duration in seconds of the animation.
   * @param {String} transition the name of the Tweener transition.
   */
  constructor(time=0.2, transition='easeOutQuad') {
    super('position-changed', transition);
    this.time = time;
  }

  animate(win, actor) {
    if (win.window_type !== Meta.WindowType.NORMAL)
      return;
    if (win.fullscreen)
      return;
    const orect = win.old_rect;
    const nrect = win.get_frame_rect();
    let {x, y} = win.frame_rect_to_client_rect(nrect);
    if (win.constructor.name.match('X11') && win.decorated) {
      x -= 5; y -= 36;
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
      },
    });
  }
}

/**
 * A scaling animation for when a window's size has changed.
 *
 * @see {@link animate}
 */
export class WindowResizeAnimation extends WindowAnimation {

  /**
   * @param {Number} time the duration in seconds of the animation.
   * @param {String} transition the name of the Tweener transition.
   */
  constructor(time=0.2, transition='easeOutQuad') {
    super('size-changed', transition);
    this.time = time;
  }

  animate(win, actor) {
    if (win.window_type !== Meta.WindowType.NORMAL)
      return;
    if (win.fullscreen)
      return;
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
      },
    });
  }
}

/**
 * The extension's animations.
 *
 * @type {Array<WindowAnimation>}
 */
const extension = [
  new WindowFocusAnimation(),
  new WindowMoveAnimation(),
  new WindowResizeAnimation(),
];

/**
 * Enables the module as an extension.
 */
export function enable() {
  for (let a of extension)
    a.enable();
}

/**
 * Disables the module as an extension.
 */
export function disable() {
  for (let a of extension)
    a.disable();
}
