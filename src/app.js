// backend/src/app.js
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
const xss = require('xss-clean'); // Middleware para limpiar inputs de scripts


import { pedidosRoutes } from './rutas/pedidos.js'
import {comentariosRoutes} from './rutas/comentarios.js'


// Crear la aplicación Express
const app = express()
// Configurar middlewares
app.use(helmet());
app.use(cors())
app.use(xss());
app.use(bodyParser.json())


// Configurar rutas
pedidosRoutes(app)
comentariosRoutes(app)


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola from Express!')
})


export { app }