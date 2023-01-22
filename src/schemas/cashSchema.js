import joi from 'joi'

export const cashSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
})