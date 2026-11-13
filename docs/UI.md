# UI Modes

The app is getting two display modes so people can pick the look that works best for them. Basic mode is being built by Sreeja and is colorful and playful, with different background colors for different areas of the UI. Minimal mode is being built by Gabe and others and is meant to be calm and low-stimulation, with very little going on visually, so people who use the calculator aren't distracted or overstimulated.


For basic mode, the plan is to use different background colors for different areas of the UI, such as the sidebar, the table area and the buttons. There should still be enough contrast between text and background that everything stays readable, and each colored area should have a clear purpose for its color, even though the look can be playful.

For minimal mode, the goal is a calm UI that doesn't overstimulate. That means using very few colors, ideally one neutral background, one text color and at most one accent. It also means skipping decoration that doesn't help, such as heavy shadows, thick borders and busy dividers. Interactions should be quiet, with no movement on hover or press and just a subtle color change at most. Contrast should be soft enough to be easy on the eyes while still readable. The UI should show only what the user needs for the current task, and the layout should stay predictable, with controls in the same place and nothing shifting around.

Right now the sidebar's colors are hard-coded in class names, so supporting multiple modes will take some restructuring. One approach is to pull the colors and shadows out of the class names into a theme object or CSS variables, with one theme per mode. A mode setting, either basic or minimal, would live in a shared place such as context or a prop, and the sidebar would read its colors from the active theme instead of hard-coded values. The layout and behavior would stay the same across modes so that only the look changes. 
