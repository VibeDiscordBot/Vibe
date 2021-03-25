FROM node:15

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

WORKDIR /opt/vibe

COPY ./package.json .
RUN yarn

COPY . .

CMD ["/wait", "&&", "yarn", "start"]