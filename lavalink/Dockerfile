FROM ubuntu

RUN apt-get update && \
 apt-get install -y \
  openjdk-13-jre-headless \
  curl

WORKDIR /opt/Lavalink

COPY Lavalink.jar .

ENTRYPOINT ["java", "-Djdk.tls.client.protocols=TLSv1.1,TLSv1.2", "-Xmx4G", "-jar", "Lavalink.jar"]