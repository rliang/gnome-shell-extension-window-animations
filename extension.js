const Tweener = imports.ui.tweener;

let _enabled = false;

let _oldrects = {};

function windowRefreshSize(win) {
  if (!_enabled)
    return;
  const actr = win.get_compositor_private();
  const rect = win.get_frame_rect();
  const oldr = _oldrects[win.get_stable_sequence()];
  Tweener.addTween(actr, {
    transition: 'easeOutQuad',
    time: 0.25,
    scale_x: 1,
    scale_y: 1,
    onStart: () => {
      _oldrects[win.get_stable_sequence()] = rect;
      actr.set_pivot_point(0, 0);
      actr.set_scale(oldr.width / rect.width, oldr.height / rect.height);
    }
  });
}

function windowRefreshPosition(win) {
  if (!_enabled)
    return;
  const actr = win.get_compositor_private();
  const rect = win.get_frame_rect();
  const oldr = _oldrects[win.get_stable_sequence()];
  Tweener.addTween(actr, {
    transition: 'easeOutQuad',
    time: 0.25,
    translation_x: 0,
    translation_y: 0,
    onStart: () => {
      _oldrects[win.get_stable_sequence()] = rect;
      actr.translation_x = oldr.x - rect.x;
      actr.translation_y = oldr.y - rect.y;
    }
  });
}

function windowInit(win) {
  _oldrects[win.get_stable_sequence()] = win.get_frame_rect();
  win.connect('unmanaged', win => delete _oldrects[win.get_stable_sequence()]);
  win.connect('size-changed', windowRefreshSize);
  win.connect('position-changed', windowRefreshPosition);
}

function enable() {
  _enabled = true;
}

function disable() {
  _enabled = false;
}

function init() {
  global.get_window_actors().forEach(win => windowInit(win.meta_window));
  global.display.connect('window-created', (ds, win) => windowInit(win));
}

