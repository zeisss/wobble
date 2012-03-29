# Munin Plugins

These munin plugin exports several maybe interesting data to munin.

## Installation

1. Link the plugins you want to activate to your `/etc/munin/plugins/` folder.
2. Add the following to your `/etc/munin/plugin-conf.d/munin-node` file:

       [wobble*]
       env.WOBBLE_HOME /opt/wobble

   Make sure you changed the path to match your local system.

3. Restart the munin-node daemon.

## Testing

You can run the plugins locally:

    $ WOBBLE_HOME=/opt/wobble /etc/munin/plugins/wobble-online-users
    users.value 1
    sessions.value 1

or through munin-run

    $ munin-run wobble-online-users
    users.value 1
    sessions.value 1
