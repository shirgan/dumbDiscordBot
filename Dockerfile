FROM node:carbon-alpine

RUN addgroup -S nupp && adduser -S -g nupp nupp

ENV HOME=/home/nupp

COPY ./src $HOME/src
COPY ./build $HOME/build
COPY ./package.json $HOME/
COPY ./.babelrc $HOME/
RUN node -v

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init

WORKDIR $HOME

# Installs ffmpeg for being able to talk in voice channels.
# Python and Alpine SDK required because of node-opus – also related to voice.
# Git is required to fetch some unstable dependencies at the moment.
RUN apk add --no-cache --quiet build-base ffmpeg git make python
RUN rm -rf ./dist && rm -rf ./node_modules
RUN chown -R nupp:nupp $HOME/* /usr/local/bin/dumb-init && \
    chmod +x /usr/local/bin/dumb-init && \
    npm cache clean --force && \
    npm install --progress=false && \
    npm run build && \
    #rm -rf src && \
    #npm prune --production && \
    chown -R nupp:nupp $HOME/*

USER nupp

CMD ["dumb-init", "npm", "start"]
