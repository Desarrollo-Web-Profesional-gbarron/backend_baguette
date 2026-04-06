import mongoose, { Schema } from "mongoose";
/**
 * @typedef {Object} Pedido
 * @property {string} nombre - Nombre del cliente
 * @property {string} telefono - Teléfono del cliente (10 dígitos)
 * @property {Date} fecha_solicitud - Fecha de solicitud del pedido
 * @property {number} total - Total del pedido (por defecto 0.0)
 * @property {string} comentario - Comentarios adicionales sobre el pedido
 */
const pedidoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    telefono: { type: String, required: true, length: 10 },
    direccion: { type: String, required: true },
    fecha_solicitud: { type: Date, required: true },
    total: { type: Number, default: 0.0 },
    comentario: { type: String },
    ubicacion: { type: String},   
  },
  { timestamps: true },
);

const Pedido = mongoose.model("Pedido", pedidoSchema);
export { Pedido };