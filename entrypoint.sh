#!/bin/sh
# Replace <HERE> with the value of MY_VARIABLE in index.html
sed -i 's|{REPLACE_ME}|'"$MY_VARIABLE"'|g' /usr/share/nginx/html/index.html

# Start nginx in the foreground
nginx -g 'daemon off;'