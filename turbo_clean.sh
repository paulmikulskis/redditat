#!/bin/bash


# In a monorepo built with Turborepo, removing the directories 
# and files specified in the TO_REMOVE array (such as "build", "dist", and "node_modules")
# can be useful when trying to rebuild the monorepo or troubleshoot issues 
# with the codebase. These directories and files often contain build artifacts 
# or dependencies that may not be necessary for the current state of the codebase, 
# and removing them can help to ensure that the monorepo is in a clean state before rebuilding. 


# Define the list of files and directories to remove
TO_REMOVE=(
  "build"
  "dist"
  "node_modules"
  ".turbo"
  ".yarn"
  "yarn.lock"
)

# Go through each element in the list
for element in "${TO_REMOVE[@]}"; do
  # Check if the element is a file or directory
  if [ -f "$element" ]; then
    # If it's a file, remove it
    rm -f "$element"
  elif [ -d "$element" ]; then
    # If it's a directory, remove it recursively
    rm -rf "$element"
  fi
done

# Repeat the process for the "apps" and "packages" directories
for dir in "apps" "packages"; do
  cd "$dir"
  for element in "${TO_REMOVE[@]}"; do
    if [ -f "$element" ]; then
      rm -f "$element"
    elif [ -d "$element" ]; then
      rm -rf "$element"
    fi
  done
  cd ..
done
