import bcrypt from 'bcrypt'
import db from '../config/database.js'
import { v4 as uuidV4 } from 'uuid'
import { ObjectId } from 'mongodb'

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body

    const hashPassword = bcrypt.hashSync(password, 10)

    try {
        const isEmailUnavailable = await db.collection("users").findOne({ email })
        if (isEmailUnavailable) {
            return res.status(409).send("Email já existe!")
        }
        await db.collection("users").insertOne({ name, email, password: hashPassword })
        res.status(201).send("Usuário cadastrado com sucesso!")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const isUserSignedUp = await db.collection("users").findOne({ email })
        if (!isUserSignedUp) return res.status(400).send("Usuário/senha incorretos")

        const isCorrectPassword = bcrypt.compareSync(password, isUserSignedUp.password)
        if (!isCorrectPassword) return res.status(400).send("Usuário/senha incorretos")

        const token = uuidV4()
        await db.collection("sessions").insertOne({ idUser: isUserSignedUp._id, token, lastStatus: Date.now() })
        return res.status(200).send({token, isUserSignedUp})
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function logoff(req, res) {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", '')
    try{
        await db.collection("sessions").deleteOne({token})
        return res.status(200).send("Sessão encerrada! Direcionado para página de login")
    }catch(err){
        return res.status(500)
    }
}

export async function removeSessions(){
    try{
        let now = Date.now()
        const sessions = await db.collection("sessions").find().toArray()
        for (let i = 0; i < sessions.length; i++){
            if (now - sessions[i].lastStatus > 3600000){
                await db.collection("sessions").deleteOne({_id: ObjectId(sessions[i]._id)})
            }
        }
    }catch(err){
        console.log(err)
    }
}