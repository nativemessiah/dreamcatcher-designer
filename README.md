# Dream Catcher Studio

A small vanilla web app for designing dream catchers with live controls for style, color, and shape. The app renders a customizable dream catcher as SVG and allows export as SVG.

## Features

- Style presets: Classic, Boho, Celestial, Forest, Sunrise
- Shape options: Circle, Oval, Diamond, Crescent
- Real-time control of size, web density, feather count, and accent colors
- Glow toggle and downloadable SVG export
- Responsive layout for desktop and mobile

## Run locally

Open `index.html` in a browser, or use a simple static local server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Project structure

- `index.html` — app layout and controls
- `styles.css` — interface styling
- `app.js` — dream catcher renderer and interactions

## Notes

This is intentionally built with native HTML, CSS, and JavaScript without a framework.
