#!/bin/bash
if [ -z "$1" ]
then
      echo "Aborting eS-judge build due to empty commit message."
else
      value=${2:-patch}
      yarn version --$value
      git add .
      git commit -m "$1"
      git push
fi