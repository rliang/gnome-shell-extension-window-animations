const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;
const Tweener = imports.ui.tweener;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const SchemaSource = Gio.SettingsSchemaSource.new_from_directory(
  Me.dir.get_path(), Gio.SettingsSchemaSource.get_default(), false);
const settings = new Gio.Settings({
  settings_schema: SchemaSource.lookup(Me.metadata['settings-schema'], true)
});

const _state = {};

function getId(actor) {
  return actor.meta_window.get_stable_sequence();
}

function isValid(actor) {
  const types = settings.get_value('window-types').deep_unpack();
  return types.some(t => actor.meta_window.window_type === Meta.WindowType[t]);
}

function doMap(actor) {
  _state[getId(actor)] = {frame: actor.meta_window.get_frame_rect(), ready: false};
}

function doDestroy(actor) {
  delete _state[getId(actor)];
}

let _enabled = false;
let _allowed = true;

function doSizeChanged(actor) {
  const state = _state[getId(actor)];
  const r1 = state.frame;
  const r2 = actor.meta_window.get_frame_rect();
  state.frame = r2;
  if (!state.ready)
    return state.ready = true;
  if (!_enabled || !_allowed || !state.ready || !r1 || !isValid(actor))
    return;
  Tweener.addTween(actor, {
    transition: settings.get_string('animation-transition'),
    time: settings.get_double('animation-duration'),
    scale_x: 1,
    scale_y: 1,
    translation_x: 0,
    translation_y: 0,
    onStart: (actor, r1, r2) => {
      if ((actor.translation_x = r1.x - r2.x) > 0)
        actor.translation_x -= (r2.width - r1.width);
      if ((actor.translation_y = r1.y - r2.y) > 0)
        actor.translation_y -= (r2.height - r1.height);
      actor.set_pivot_point(r2.x >= r1.x ? 0 : 1, r2.y >= r1.y ? 0 : 1);
      actor.set_scale(r1.width / r2.width, r1.height / r2.height);
    },
    onStartParams: [actor, r1, r2]
  });
}

function enable() {
  _enabled = true;
}

function disable() {
  _enabled = false;
}

function init() {
  global.get_window_actors().forEach(doMap);
  global.window_manager.connect('map', (_, actor) => doMap(actor));
  global.window_manager.connect('destroy', (_, actor) => doDestroy(actor));
  global.window_manager.connect('size-changed', (_, actor) => doSizeChanged(actor));
  global.display.connect('grab-op-begin', () => _allowed = false);
  global.display.connect('grab-op-end', () => _allowed = true);
}
