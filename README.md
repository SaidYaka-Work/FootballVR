# VR Wedding Environment

A simple virtual reality wedding environment built with A-Frame where you can walk around and explore a wedding setup.

## Features

- Interactive wedding arch
- Day/night toggle
- Ambient sounds
- Immersive environment with chairs, aisle, and decorations
- Works on desktop and mobile VR
- **Text input to create custom objects** - Type what you want to see and it appears in the world!
- **AI-generated 3D models** - Toggle AI mode to create procedurally generated models

## How to Use

1. Clone this repository
2. Open `index.html` in your browser
3. Navigate using:
   - WASD keys (on desktop)
   - Look around by moving your mouse (on desktop)
   - Move your head (in VR headset)
   - Use a VR controller to teleport (if available)

## Controls

- Click the VR button in the bottom right to enter VR mode (if you have a compatible headset)
- Look at the wedding arch to see it animate
- Click the gold button to toggle between day and night
- **Type in the text box** and click "Create" to add objects to your wedding environment
- **Check the "Use AI Models" box** to generate AI-powered 3D models instead of standard ones

## Creating Objects

The text input allows you to create various wedding-related objects by typing what you want:
- "cake" or "wedding cake" - Creates a tiered wedding cake
- "flower" or "bouquet" - Creates a colorful flower bouquet
- "table" - Creates a table with tablecloth
- "chair" - Creates a wooden chair
- "gift" or "present" - Creates a gift box with ribbon
- "candle" - Creates a candle with flickering flame
- "balloon" - Creates a floating balloon
- "arch" - Creates a wedding arch with flowers

You can also type anything else, and it will create a generic object with your text displayed.

To remove any object, simply click on it.

## AI-Generated Models

When the "Use AI Models" option is enabled:

- The system will generate unique 3D models based on your text description
- Models are created using a combination of techniques:
  - Pre-existing AI-generated templates
  - Procedurally generated geometry with randomized parameters
  - Voxel-based representation for generic objects
- AI-generated models have physics properties and can be interacted with
- Each AI model has an "AI" badge to indicate it was AI-generated

Note: This is a simplified demonstration of AI model generation. In a full implementation, it would connect to a 3D model generation API service (like Shap-E, Point-E, or other text-to-3D model services) to create truly unique models from text.

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- For VR: A VR headset (Oculus, HTC Vive, etc.) or a WebXR-compatible mobile device

## Customization

You can customize the wedding environment by editing:
- `index.html` - Change the layout, colors, and objects
- `js/main.js` - Modify interactions and behaviors
- `css/style.css` - Update styles and appearance

## Development

To serve the project locally:

```
python3 -m http.server
```

Then open your browser and navigate to `http://localhost:8000` 