# gnome-shell-window-animations

GNOME Shell extension and library that adds transitions on window focus, move
and resize.

## Building

This module's source uses ES6 classes and modules, to build it into an ES5 UMD
module run `npm run build`.

## Usage

This module can be used as a standalone extension or as a library.

To use as an extension, just clone this repo:

```sh
git clone https://github.com/rliang/gnome-shell-window-animations ~/.local/share/gnome-shell/extensions/window-animations@rliang.github.com
```

To use as a library, include the UMD module or use a module bundler like
Webpack.

```javascript
import WindowAnimation, {WindowFocusAnimation} from 'gnome-shell-window-animations';

const Tweener = imports.ui.tweener;

class OnCloseAnimation extends WindowAnimation {
  constructor() {
    super('unmanaged', 'easeOutQuad');
  }
  animate(win, actor) {
    Tweener.addTween(actor, {
      transition: this.transition,
      time: /* ... */,
      x: /* ... */,
      y: /* ... */,
      scale_x: /* ... */,
      scale_y: /* ... */,
      onStart: /* ... */,
      onComplete: /* ... */,
    });
  }
}

const focus = new WindowFocusAnimation();
const close = new OnCloseAnimation();

export function enable() {
  focus.enable();
  close.enable();
}

export function disable() {
  focus.disable();
  close.disable();
}
```

## Documentation

For now, the JSDoc annotations in the source.
