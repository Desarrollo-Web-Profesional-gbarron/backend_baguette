import { Comentario } from "../bd/modelos/comentario.js";
/**
 * Función para crear un comentario en la base de datos.
 * @param {string} texto - El texto del comentario a crear.
 * @param {number} puntuacion - La puntuación del comentario (1 a 5).
 * @returns {Promise<comentario>} - El comentario creado.
 * @throws {Error} - Si ocurre un error al crear el comentario. 
 */

export async function creaComentario(nombre, texto, puntuacion, fecha) {

    const nuevoComentario = new Comentario({
      nombre,
      texto,
      puntuacion,
      fecha
    });
    return await nuevoComentario.save();
}