import express from "express"
import cors from "cors"
import { signIn, signUp } from "./controllers/authController.js"
import { addProfit, cashflowList } from "./controllers/cashflowController.js"

const server = express()
server.use(cors())
server.use(express.json())

//rotas de login e cadastro
server.post("/cadastro", signUp)
server.post("/", signIn)

//rota cashflow
server.get("/home", cashflowList)
server.post("/nova-entrada", addProfit)

server.listen(5000, () => { 
    console.log("Servidor: http://localhost:5000")
})