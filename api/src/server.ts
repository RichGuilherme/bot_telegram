import 'dotenv/config'
import createApp from './app';

const app = createApp()

app.listen({
    hostname: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3000
}, () => {
    console.log("Servidor rodando com sucesso!")
})