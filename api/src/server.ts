import 'dotenv/config'
import createApp from './app';
import { botService } from './services/bot-service';
const PORT = process.env.PORT

const app = createApp()

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`)

    await botService.botInitWebhook()
})