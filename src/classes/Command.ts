import { Message, PermissionString } from "discord.js";
import Client from "./Client";

export default abstract class Command {
    abstract name: string
    abstract alias: string[] = []
    abstract permissions: PermissionString[] = []

    constructor(protected bot: Client) {}

    abstract exec(message: Message, args: string[], label: string): Promise<any>
}