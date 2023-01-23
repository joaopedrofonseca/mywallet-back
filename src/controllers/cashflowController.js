import db from "../config/database.js"
import { cashSchema } from "../schemas/cashSchema.js"
import dayjs from "dayjs"
import { ObjectId } from "mongodb"

export async function cashflowList(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')

    if (!token) return res.status(401).send("Token não encontrado!")

    try {
        const isSessionActivated = await db.collection("sessions").findOne({ token })

        if (!isSessionActivated) return res.status(401).send("Sessão expirada! Por favor faça login novamente.")

        const user = await db.collection("users").findOne({ _id: ObjectId(isSessionActivated.idUser) })
        if (!user) return res.status(401).send("Usuário não cadastrado!")

        const cashflow = await db.collection("cashflow").find({userId: ObjectId(user._id)}).toArray()
        return res.status(200).send(cashflow)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function addProfit(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    const { value, description } = req.body
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
                isPositive: true,
                date: dayjs().format('DD/MM')
            }
        )
        await db.collection("balance").insertOne({value: Number(value)})
        const sum = await db.collection("balance").find().toArray()
        res.status(201).send(sum)

    } catch(err){
        res.status(500).send(err.message)
    }

}

export async function addCost(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    const { value, description } = req.body

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
                isPositive: false,
                date: dayjs().format('DD/MM')
            }
        )
        await db.collection("balance").insertOne({value: Number(value) * (-1)})
        const sum = await db.collection("balance").find().toArray()
        res.status(201).send(sum)

    } catch(err){
        res.status(500).send(err.message)
    }

}