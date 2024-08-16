import 'dotenv/config'
import createApp from './app'
import { botService } from './services/bot-service'

const PORT = process.env.PORT

const startServer = async () => {
    try {

        const app = createApp()
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta: ${PORT}`)
        })
        await botService.botInitWebhook()
    } catch (error) {
        console.error("Error durante a inicialização do server:", error)
    }
}

startServer()