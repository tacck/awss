#!/bin/sh

AWS_PROFILE="$AWS_PROFILE" _awss_prompt

selected_profile="$(cat ~/.awss)"

if [ -z "$selected_profile" ]
then
  unset AWS_PROFILE
else
  export AWS_PROFILE="$selected_profile"
fi
