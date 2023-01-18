#!/bin/bash

# Default commands in case some bs happens and the startup script can't find package.json
# to dynamically import the possible start functions
DEFAULT_COMMANDS=("api" "workers")

# Vector binary, serves as the logging agent
VECTOR_PATH=${VECTOR_SYSTEM_PATH:-~/.vector/bin/vector}

# Get command line argument for workers config
STARTUP_CONFIG_ARG=$1

# check to see if we are running this build with Vector, and if so, make sure it is installed
if [[ "$RUN_WITH_VECTOR" =~ ^(true|True|TRUE)$ ]]; then
  if [ ! -f "${VECTOR_PATH}" ]; then
    echo "Vector (the logging agent) should be installed for this build, configured\
    to be at '${VECTOR_PATH}', please check your system or '${STARTUP_CONFIG_ARG}.Dockerfile'"
    exit 1
  fi
fi

# Check if package.json exists
if [ -f "package.json" ]; then
  # Get a list of possible configurations from package.json
  POSSIBLE_CONFIGS=($(grep -oE "start:[a-z]*" package.json | sed 's/start://'))
  if [ -z "$POSSIBLE_CONFIGS" ]; then
    # Assign default commands if no configs found
    POSSIBLE_CONFIGS="${DEFAULT_COMMANDS[*]}"
  fi
else
  # Assign default commands if package.json does not exist
  POSSIBLE_CONFIGS="${DEFAULT_COMMANDS[*]}"
fi

# Check if passed command line argument is a valid configuration
if echo "${POSSIBLE_CONFIGS[@]}" | grep -qw "$STARTUP_CONFIG_ARG"; then
  if [[ "$RUN_WITH_VECTOR" =~ ^(true|True|TRUE)$ ]]; then
    # Start Vector in the background
    ${VECTOR_PATH} --config apps/cog/vector.toml &
  fi

  # Start the actual application
  yarn --cwd apps/cog start:${STARTUP_CONFIG_ARG}

  echo "processes exited..."
  # Exit with status of process that exited first
  exit $?
else
  echo "Invalid configuration provided. Please specify one of the following: ${POSSIBLE_CONFIGS[*]}"
  exit 1
fi