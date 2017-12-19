FROM node

MAINTAINER Geoff Cox redgeoff@gmail.com

WORKDIR /usr/src/app

RUN npm install -g couchdb-howler

COPY docker-entrypoint.sh .

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["/usr/local/bin/couchdb-howler"]
