#!/bin/bash
# Kill any process running on port 5001

PORT=5001

echo "🔍 Checking for processes on port $PORT..."

PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
    echo "✅ Port $PORT is free"
else
    echo "🔪 Killing processes: $PIDS"
    kill -9 $PIDS
    echo "✅ Port $PORT is now free"
fi
