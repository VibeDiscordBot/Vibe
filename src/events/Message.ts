import Event from "../classes/Event";
import * as djs from 'discord.js-light'

export default class Message extends Event {
    public name = 'Message (command)'
    public type = 'message'
    public once = false

    public async run(message: djs.Message) {
        if(message.content.startsWith(this.bot.cfg.prefix)) {
            const content = message.content.slice(this.bot.cfg.prefix.length).trim()
            const args = content.split(' ')
            const label = args.shift()

            if(!this.bot.commandHandler.run(message, args, label)) {
                message.channel.send(`Unknown command "${label}"`)
            }
        }
    }
}