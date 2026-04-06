import mongoose from "mongoose";
import dotenv from "dotenv";
import { describe, expect, test, beforeEach } from "@jest/globals";

dotenv.config();

import {
  creaComentario

} from "../servicios/comentariosServicio.js";
import  {Comentario}  from "../bd/modelos/comentario.js";

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Creando Comentarios", () => {
  test("Con todos los parámetros será exitoso", async () => {
    const comentario = new Comentario({
        nombre: 'Juan Gabriel Lopez',
        texto: 'Excelente servicio',
        puntuacion: 5,
        fecha:  Date.now()
    });

    const createdComentario = await creaComentario(comentario);

    expect(createdComentario._id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(createdComentario.createdAt).toBeInstanceOf(Date);
    expect(createdComentario.updatedAt).toBeInstanceOf(Date);
  });

  test("Sin nombre debe fallar", async () => {
    const comentario = new Comentario({
        texto: 'Excelente servicio',
        puntuacion: 5,
        fecha:  Date.now()
    });

    await expect(creaComentario(comentario)).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  test("Con parámetros mínimos debe ser exitoso", async () => {
    const comentario = new Comentario({
        nombre: 'Juan Gabriel Lopez',
        texto: 'Excelente servicio',
        puntuacion: 5
    });

    const createdComentario = await creaComentario(comentario);
    expect(createdComentario._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});
