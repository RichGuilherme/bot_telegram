import express from "express"
import cors from "cors"
import router from "./routes"
import bodyParser from "body-parser"

function createApp() {
    const app = express()

    app.use(express.json())
    app.use(bodyParser.json())

    // const corsOptions = {
    //     origin: [""],
    //     methods: ["GET", "UPDATE"],
    // };

    // app.use(cors())

    app.use(router)

    return app
}

export default createApp