#!/bin/bash
"""
This script is intended to be used as the entry point for 
starting up the a yarn application, in this case Cog, whether that be the API or the workers.
It is typically invoked when building and running the API or workers Dockerfiles.
The script expects the package.json to have script commands such as:  start:[COMMAND]

The script first checks if Vector, a logging agent, is configured to run and if it is present in the system.
If package.json is present, it dynamically import the possible start functions from package.json.
Otherwise, it defaults to the commands in 'DEFAULT_COMMANDS' below

It then checks if the provided command line argument is a valid configuration, 
and if so, starts Vector and the actual application with the provided configuration.

This script can also be used outside of a Docker container.  If you want to play with/test Vector, make sure
to set the appropriate environment variables, such as VECTOR_PATH and VECTOR_CONFIG_FILE_PATH when RUN_WITH_VECTOR=true
"""

# name of the application this startup.sh script is booting inside of apps/
APPLICATION_NAME=${APPLICATION_NAME:-cog}
# Vector binary, serves as the logging agent
VECTOR_PATH=${VECTOR_SYSTEM_PATH:-~/.vector/bin/vector}
# Location of the Vector configuration file, defaults to look inside [MONOREPO-ROOT]/vector/vector-cog.toml
VECTOR_CONFIG_FILE_PATH=${VECTOR_CONFIG_FILE_PATH:-vector/vector-cog.toml}
# In case the startup.sh script cannot create /var/lib/vector, where should Vector store data?
VECTOR_BACKUP_DATA_DIR=${VECTOR_BACKUP_DATA_DIR:-vector/data}
# Default commands in case some bs happens and the startup script can't find package.json
# to dynamically import the possible start functions
DEFAULT_COMMANDS=("api" "workers") # not required to set these, as the script will dynamically read package.json
# Get command line argument for yarn config
STARTUP_CONFIG_ARG=$1

# check to see if we are running this build with Vector, and if so, make sure it is installed
if [[ "$RUN_WITH_VECTOR" =~ ^(true|True|TRUE)$ ]]; then
  if [ ! -f "${VECTOR_PATH}" ]; then
    echo "Vector (the logging agent) should be installed for this build, configured\
    to be at \"${VECTOR_PATH}\", please check your system or Dockerfile"
    exit 1
  fi
  if [ ! -f "${VECTOR_CONFIG_FILE_PATH}" ]; then
    echo "Vector config file could not be found at \"${VECTOR_CONFIG_FILE_PATH}\"\
    please check your system or Dockerfile"
    echo "DEBUG: cwd=$(pwd)"
    echo "ls -la:" && ls -la
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
    # Attempt to create directory in /var/lib
    mkdir -p /var/lib/vector || {
        # If we don't have permissions to create a directory in /var/lib, create one in the current working directory
        mkdir -p ${VECTOR_BACKUP_DATA_DIR}
        # Update the Vector config file
        sed -i '/data_dir/d' ${VECTOR_CONFIG_FILE_PATH}
        echo "data_dir = \"${VECTOR_BACKUP_DATA_DIR}\"" >> ${VECTOR_CONFIG_FILE_PATH}
        echo "INFO: Vector data directory created in current working directory\
        and Vector config file updated to reflect this change, set data_dir = \"${VECTOR_BACKUP_DATA_DIR}\""
    }
    ${VECTOR_PATH} --config ${VECTOR_CONFIG_FILE_PATH} &
  fi

  # Start the actual application
  yarn --cwd apps/${APPLICATION_NAME} start:${STARTUP_CONFIG_ARG}

  echo "processes exited..."
  # Exit with status of process that exited first
  exit $?
else
  echo "Invalid configuration provided. Please specify one of the following: ${POSSIBLE_CONFIGS[*]}"
  exit 1
fi