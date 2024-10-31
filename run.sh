#!/usr/bin/bash

list="[vitedev|vitebuild]"
if [ -z "$1" ]; then
    echo "Please provide a mode"
    echo "Usage: $0 <mode> $list"
    exit 1
fi

if [ "$1" == "vitedev" ]; then
    echo "Running server"
    cd FPSGameFrontend/ && npx vite dev --port 5500
    elif [ "$1" == "vitebuild" ]; then
    echo "Running build"
    cd FPSGameFrontend/ && npx build -e
    if [ $? -ne 0 ]; then
        echo "Build failed"
        exit 1
    fi
    echo "Build successful"
    if [ "$2" == "preview" ]; then
        echo "Running preview"
        npx vite preview --port 5500
    fi
else
    echo "<mode>[$1] is not in list  $list"
    exit 1
fi

