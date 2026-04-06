import mongoose, { Schema } from "mongoose";

/****
 * @typedef {Object} Comentario
 * @property {string} nombre - Nombre del cliente que hizo el comentario
 * @property {string} texto - Texto del comentario
 * @property {number} puntuacion - Puntuación del comentario (1 a 5)
 * @property {Date} fecha - Fecha en que se hizo el comentario  
 */
const comentarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    texto: { type: String, required: true },
    puntuacion: { type: Number, required: true, min: 1, max: 5 },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Comentario = mongoose.model("Comentario", comentarioSchema);
export { Comentario };