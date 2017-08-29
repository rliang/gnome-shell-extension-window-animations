const Gio = imports.gi.Gio;
const Meta = imports.gi.Meta;
const Tweener = imports.ui.tweener;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const SchemaSource = Gio.SettingsSchemaSource.new_from_directory(
  Me.dir.get_path(), Gio.SettingsSchemaSource.get_default(), false);
const settings = new Gio.Settings({
  settings_schema: SchemaSource.lookup(Me.metadata['settings-schema'], true)
});

const _oldrects = {};

function getId(actor) {
  return actor.meta_window.get_stable_sequence();
}

function isExcluded(actor) {
  const types = settings.get_value('exclude-window-types').deep_unpack();
  return types.some(t => actor.meta_window.window_type === Meta.WindowType[t]);
}

function doMap(actor) {
  _oldrects[getId(actor)] = actor.meta_window.get_frame_rect();
}

function doDestroy(actor) {
  delete _oldrects[getId(actor)];
}

let _enabled = false;

function doSizeChanged(actor) {
  const ra = _oldrects[getId(actor)];
  const rb = actor.meta_window.get_frame_rect();
  _oldrects[getId(actor)] = rb;
  if (!_enabled || isExcluded(actor))
    return;
  Tweener.addTween(actor, {
    transition: settings.get_string('animation-transition'),
    time: settings.get_double('animation-duration'),
    scale_x: 1,
    scale_y: 1,
    translation_x: 0,
    translation_y: 0,
    onStart: (actor, ra, rb) => {
      if ((actor.translation_x = ra.x - rb.x) > 0)
        actor.translation_x -= (rb.width - ra.width);
      if ((actor.translation_y = ra.y - rb.y) > 0)
        actor.translation_y -= (rb.height - ra.height);
      actor.set_pivot_point(rb.x >= ra.x ? 0 : 1, rb.y >= ra.y ? 0 : 1);
      actor.set_scale(ra.width / rb.width, ra.height / rb.height);
    },
    onStartParams: [actor, ra, rb]
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
}
