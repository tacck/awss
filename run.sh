#!/bin/sh

AWS_PROFILE="$AWS_PROFILE" _awssol_prompt

selected_profile="$(cat ~/.awssol)"

if [ -z "$selected_profile" ]
then
  unset AWS_PROFILE
else
  export AWS_PROFILE="$selected_profile"
fi
