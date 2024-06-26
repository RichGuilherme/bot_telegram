import { Message } from "node-telegram-bot-api"
import { botService } from "../services/bot-service"

export const handle =  async (req: any) => {
   const { body } = req

   if (body) {
      const messageObj: Message = body.message

      await botService.handleChatBot(messageObj)
   }
}