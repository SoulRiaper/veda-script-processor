#!/bin/bash

time=`date -Iseconds`
echo $time
/sbin/start-stop-daemon --start --verbose --chdir $PWD --make-pidfile --pidfile $PWD/.pid --background --startas /bin/bash -- -c "exec node --use-openssl-ca --openssl-legacy-provider src/veda-script-processor.js >> log/${PWD##*/}-$time.log 2>&1"
