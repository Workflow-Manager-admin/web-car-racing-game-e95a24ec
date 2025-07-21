#!/bin/bash
cd /home/kavia/workspace/code-generation/web-car-racing-game-e95a24ec/car_racing_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

