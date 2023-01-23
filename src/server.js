import express from "express"
import cors from "cors"
import authRouter from "./routes/authRouter.js"
import cashRouter from "./routes/cashRouter.js"

const server = express()
server.use(cors())
server.use(express.json())
server.use([authRouter, cashRouter])

server.listen(5000, () => {
    console.log("Servidor: http://localhost:5000")
})