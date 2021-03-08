import Client from "./Client";
import Logger from "./Logger";

export default abstract class Handler {
    abstract name: string

    constructor(protected bot: Client) {}

    abstract init(): Promise<void>

    public async build(): Promise<void> {
        Logger.info(`Building ${this.name}`)
        await this.init()
        Logger.info(`Built ${this.name}`)
    }
}