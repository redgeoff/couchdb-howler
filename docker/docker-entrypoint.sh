#!/bin/bash

set -e

# All command line params in alpha order without the starting --
declare -a params=(
  "couchdb_url"
  "help"
  "log_level"
  "port"
  "version"
)

if [ "$1" = '/usr/local/bin/couchdb-howler' ]; then

  cmdParams=''

  for i in "${params[@]}"
  do

    dockerParam=${i}

    # Append to the list of params and values
    if [ "${!dockerParam}" != "" ]; then
      cmdParams="$cmdParams --$i=${!dockerParam}"
    fi

  done

  echo "cmdParams="$cmdParams

  $@ $cmdParams

else

  $@

fi
