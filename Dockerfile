FROM node:12.16.1-alpine3.9

WORKDIR /app

EXPOSE ${PORT}

# Copying source files
COPY . .

RUN ./scripts/build.sh

CMD ./scripts/start.sh
