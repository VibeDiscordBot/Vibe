import Handler from "../classes/Handler";
import * as path from 'path'
import * as fs from 'fs'
import Event from "../classes/Event";
import Logger from "../classes/Logger";

export default class EventHandler extends Handler {
    public name: string = 'Eventhandler'

    public async init() {
        const eventsPath = this.bot.cfg.path.events

        fs.readdirSync(eventsPath, {
            withFileTypes: true
        }).forEach(async event => {
            if(event.isFile() && event.name.endsWith('.ts')) {
                const C = (await import(path.join(eventsPath, event.name))).default
                const instance: Event = new C(this.bot)

                if(instance.once) {
                    this.bot.once(instance.type, (...args: any[]) => {
                        instance.exec(...args)
                    })
                    Logger.info(`Registered event (type: once) ${instance.name}`)
                }else {
                    this.bot.on(instance.type, (...args: any[]) => {
                        instance.exec(...args)
                    })
                    Logger.info(`Registered event (type: on) ${instance.name}`)
                }
            }
        })
    }
}