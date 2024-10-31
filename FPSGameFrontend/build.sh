#!/bin/bash

# Define input and output files
INPUT_HTML="examples/games_fpsCopy.html"
OUTPUT_HTML="../templates/frontend/index.html"

# Create build directory if it doesn't exist
mkdir -p build

# Minify HTML
npx html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true "$INPUT_HTML" -o "$OUTPUT_HTML"

# Minify JavaScript files
npx terser examples/games_fps.js -o build/games_fps.min.js
npx terser examples/games_fps_settings.js -o build/games_fps_settings.min.js

# Minify CSS files
npx cssnano examples/main.css build/main.min.css

# Additional commands for bundling, if needed
# npx webpack or any other bundler/command

echo "Build completed successfully!"

# #!/bin/bash

# # Remove old build files
# rm -rf build/

# # Create new build directory
# mkdir -p build

# # Copy three.js files into build
# cp node_modules/three/build/three.module.js build/three.module.js
# cp node_modules/three/build/three.module.min.js build/three.module.min.js

# # Copy additional modules and libraries
# cp -r examples/jsm/ build/

# # Log output
# echo "Build completed. Files copied to the build directory."


# # npm run build && mv build/index.html ../templates/frontend/index.html