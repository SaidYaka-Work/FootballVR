# VR Football Environemnt

A simple virtual reality Football game built with A-Frame where you can walk around and explore a football game setup.

## Features

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
