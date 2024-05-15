import Express from "express";
import 'dotenv/config'
// import TelegramBot from "node-telegram-bot-api";

const app = Express()

// const token = process.env.TOKEN_TELEGRAM || "";

// const bot = new TelegramBot(token, { polling: true });


// const chatId = -4277539222;

// async function sendMessageBot() {

//     await bot.sendMessage(chatId, `Hj dia ${new Date()} ficará na projeção Richard`)
// }

// sendMessageBot()

app.get("/bot", async (req, res) => {
    res.send("Bot is on!")
})

app.listen({
    hostname: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3001
}, () => {
    console.log("Servidor rodando com sucesso!")
})