# Selfhosting Vibe
Vibe is distributed as a docker-compose stack \
thus allowing you to get Vibe up and running in a matter of minutes. \
You can selfhost Vibe by following these steps:

1. Rename the `.env.example` file in the root of the project to `.env`
```shell
$ mv .env.example .env
```

2. Fill in all the keys in the `.env` file to thier respective values
```
DISCORD_TOKEN=Your Discord Bot token

MONGODB_HOST=The IP of your MongoDB server, when running using docker-compose 127.0.0.1 (default) is fine

MONGODB_DATABASE=The name of the database that Vibe will use/create on your MongoDB server, if running using docker-compose vibe (default) is fine

BOT_PREFIX=The prefix you want to set for this bot when invoking commands, you can pick anything you'd like for this

LAVALINK_HOST=The IP of your Lavalink server, when running using docker-compose 127.0.0.1 (default) is fine

LAVALINK_PORT=The port of your Lavalink server, when running using docker-compose 2333 (default) is fine

LAVALINK_AUTH=The password to authenticate with to your Lavalink server, this can be anything you come up with. Make sure to write this down as we need it later
```

3. Now rename the `application.yml.example` file in the root of the project to `application.yml`
```shell
$ mv application.yml.example application.yml
```

4. Fill in all the keys in `application.yml` to thier respective values, keys not described here should be left to thier default values
```yml
server:
  port: The port for your Lavalink server, when running using docker-compose leave this to 2333 (default)
lavalink:
  server:
    password: The password that clients will need to use to authenticate to the Lavalink server, set this to the password you chose in step 2
```

5. All configuration is now done and you're ready to launch Vibe, launching Vibe is as easy as starting the docker-compose stack. There are several ways of running Vibe:

### As daemon (recommended)
In order to run Vibe as deamon we need to specify the deamon (-d) option when running the docker-compose command
```shell
$ docker-compose up -d
```

### In current shell session (recommended for debugging)
If we want to run Vibe in the current shell session we can use the standard docker-compose up command without additional arguments
```shell
$ docker-compose up
```

That's it for this guide, you've got Vibe running in a matter of minutes! \
Enjoy the high quality music :smile:

# :warning: Updating
After downloading a new Vibe version just restarting the docker-compose stack using
```shell
$ docker-compose restart
```
isn't enough, in order for Vibe to update you need to rebuild the Docker image before restarting. You can do this using the following command:
```shell
$ docker-compose build
```
After that has finished you can run
```shell
$ docker-compose restart
```
and Vibe will be the latest fanciest version