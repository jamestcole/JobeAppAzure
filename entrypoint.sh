#!/bin/sh
# Replace <REPLACE_ME> with the value of STRING_TO_REPLACE_PARAGRAPH_TEXT in index.html
sed -i 's|<REPLACE_ME>|'"$STRING_TO_REPLACE_PARAGRAPH_TEXT"'|g' /usr/share/nginx/html/index.html

# Start nginx in the foreground
nginx -g 'daemon off;'