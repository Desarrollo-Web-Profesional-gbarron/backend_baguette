import { initBaseDeDatos } from "./bd/init.js";
import { Comentario } from "./bd/modelos/comentario.js";

await initBaseDeDatos()

const comentario = new Comentario({
    nombre: 'Juan Gabriel Lopez',
    texto: 'Excelente servicio',
    puntuacion: 5,
    fecha:  Date.now()
});

const createdComentario = await comentario.save()
