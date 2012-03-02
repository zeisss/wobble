#!/bin/sh

case $1 in
   config)
        cat <<'EOM'
graph_title Warnings
graph_info Several sensors
graph_category wobble
graph_vlabel warnings
orphaned_topics.label Orphaned Topics
orphaned_posts.label Orphaned Posts
EOM
        exit 0;;
esac

echo -n "orphaned_topics.value "
/opt/wobble_dev/scripts/wobble-warning-sensors.php --orphaned-topics
echo -n "orphaned_posts.value "
/opt/wobble_dev/scripts/wobble-warning-sensors.php
