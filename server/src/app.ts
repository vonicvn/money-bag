/* istanbul ignore file */
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'

export const app = express()

app.use(cors())
app.use(json())

app.get('/', (req, res) => res.send({ success: true }))
