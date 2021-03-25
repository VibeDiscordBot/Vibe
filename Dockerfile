FROM node:15

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN git clone https://github.com/ufoscout/docker-compose-wait && \
 cd docker-compose-wait && \
 ${HOME}/.cargo/bin/cargo build --release
RUN mv docker-compose-wait/target/release/wait /wait

WORKDIR /opt/vibe

COPY ./tsconfig.json .

COPY ./package.json .
RUN yarn --frozen-lockfile --production

COPY ./.env .
COPY src src

CMD ["/wait", "&&", "yarn", "start"]