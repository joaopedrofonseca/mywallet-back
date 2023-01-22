import db from "../config/database.js"
import { cashSchema } from "../schemas/cashSchema.js"

export async function cashflowList(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')

    if (!token) return res.status(401).send("Token não encontrado!")

    try {
        const isSessionActivated = await db.collection("sessions").findOne({ token })

        if (!isSessionActivated) return res.status(401).send("Sessão expirada! Por favor faça login novamente.")

        const user = await db.collection("users").findOne({ _id: isSessionActivated.idUser })
        if (!user) return res.status(401).send("Usuário não cadastrado!")

        const cashflow = await db.collection("cashflow").find().toArray()
        const filteredCashflow = cashflow.filter(e => e.userId !== user._id)

        return res.status(200).send(filteredCashflow)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function addProfit(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    const { value, description } = req.body

    const { error } = cashSchema.validate({ value, description })
    if (error) {
        const errorMessages = error.details.map(err => err.message)
        return res.status(422).send(errorMessages)
    }

    try {
        const isSessionActivated = await db.collection("sessions").findOne({ token })
        if (!isSessionActivated) return res.status(401).send("Sessão expirada! Por favor faça login novamente.")

        const user = await db.collection("users").findOne({ _id: isSessionActivated.idUser })
        if (!user) return res.status(401).send("Usuário não cadastrado!")

        await db.collection("cashflow").insertOne(
            {
                userId: user._id,
                value,
                description,
                isPositive: true
            }
        )
        res.status(201).send("Entrada criada com sucesso!")

    } catch(err){
        res.status(500).send(err.message)
    }

}

/*
        //1. procurar objeto em sessions
        //2. pegar idUser em users
        //3. filtrar receita somente para aquele idUser
 */