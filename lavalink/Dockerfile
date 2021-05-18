FROM ubuntu

RUN apt-get update && \
 apt-get install -y \
  openjdk-13-jre-headless \
  curl

WORKDIR /opt/Lavalink

RUN curl https://github.com/Cog-Creators/Lavalink-Jars/releases/download/3.3.2.3_1212/Lavalink.jar --output Lavalink.jar

ENTRYPOINT ["java", "-Djdk.tls.client.protocols=TLSv1.1,TLSv1.2", "-Xmx4G", "-jar", "Lavalink.jar"]