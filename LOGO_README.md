# ToolWave Logo Files

## Logo Versions

### 1. Wave Logo (Primary)
- **Full Logo**: `assets/images/logo.svg` - Icon + "ToolWave" text
- **Icon Only**: `assets/images/logo-icon.svg` - For favicon use

### 2. Grid Logo (Alternative)
- **Full Logo**: `assets/images/logo-alt.svg` - Grid icon + "ToolWave" text
- **Icon Only**: `assets/images/logo-icon-grid.svg` - Grid icon for favicon

## Design Specifications

- **Colors**: Primary blue (#3b82f6) + dark gray text (#1f2937)
- **Style**: Flat design, minimal, no gradients
- **Background**: White/transparent
- **Scalable**: SVG format works at any size

## Usage

### In HTML (Full Logo)
```html
<img src="assets/images/logo.svg" alt="ToolWave" height="40">
```

### Favicon
Convert `logo-icon.svg` to `.ico` or use directly:
```html
<link rel="icon" type="image/svg+xml" href="assets/images/logo-icon.svg">
```

### CSS Styling
```css
.logo {
  height: 40px;
  width: auto;
}
```

## Color Options

If you want to change the blue color, edit the `stroke="#3b82f6"` attributes:
- Blue (current): `#3b82f6`
- Purple: `#8b5cf6`
- Green: `#10b981`
- Teal: `#14b8a6`

## Notes

- All logos are vector (SVG) and scale perfectly
- Text uses system fonts for consistency
- Icon is positioned to the left of text
- Works on light backgrounds (add dark mode variants if needed)
