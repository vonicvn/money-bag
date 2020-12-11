FROM node:12.16.1-alpine3.9

WORKDIR /app

RUN apk add --update \
  git \
  openssh-client

EXPOSE ${PORT}

# Copying source files
COPY . .

RUN npm install yarn

RUN npm install

RUN npm run build

CMD ["npm", "start"]

# docker build -t asia.gcr.io/vonicweb/<image_name> .
# docker build -t vonicvn/g-exchange-client:$REVISION_ID .