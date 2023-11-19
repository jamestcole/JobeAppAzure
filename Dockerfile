FROM nginx:alpine

ARG REPLACEABLE_PARAGRAPH="REPLACE_THIS_WITH_DESIRED_VALUE"

ENV STRING_TO_REPLACE_PARAGRAPH_TEXT=${REPLACEABLE_PARAGRAPH}

COPY ./index.html /usr/share/nginx/html/index.html

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]