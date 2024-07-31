import 'dotenv/config'
import createApp from './app'
import { botService } from './services/bot-service'

const PORT = process.env.PORT

const startServer = async () => {
    try {
        await botService.botInitWebhook()

        const app = createApp()
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta: ${PORT}`)
        })
    } catch (error) {
        console.error("Error durante a inicialização do server:", error)
    }
}

startServer()