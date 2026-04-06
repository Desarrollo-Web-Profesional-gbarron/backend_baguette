import mongoose from "mongoose";
import dotenv from "dotenv";
import { describe, expect, test, beforeEach } from "@jest/globals";

dotenv.config();

import {
  creaPedido,
  listaPedidos,
  listaAllPedidos,
  listaPedidosByNombre,
  getPedidoById,
  modificaPedido,
  eliminaPedido

} from "../servicios/pedidosServicio.js";
import { Pedido } from "../bd/modelos/pedido.js";

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Creando Pedidos", () => {
  test("Con todos los parámetros será exitoso", async () => {
    const pedido = new Pedido({
      nombre: "Juan Gabriel Lopez",
      telefono: "4181231234",
      direccion: "Av. De Las Flores No. 90",
      fecha_solicitud: new Date(),
      total: 45.0,
      comentario: "Ha sido pagado el pedido",
      ubicacion: "Plaza Principal #1, Centro, Dolores Hidalgo",
    });

    const createdPedido = await creaPedido(pedido);

    expect(createdPedido._id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(createdPedido.createdAt).toBeInstanceOf(Date);
    expect(createdPedido.updatedAt).toBeInstanceOf(Date);
  });

  test("Sin nombre debe fallar", async () => {
    const pedido = new Pedido({
      telefono: "4181231234",
      direccion: "Av. De Las Flores No. 90",
      fecha_solicitud: new Date(),
      total: 45.0,
    });

    await expect(creaPedido(pedido)).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  test("Con parámetros mínimos debe ser exitoso", async () => {
    const pedido = new Pedido({
      nombre: "Juan Gabriel Lopez",
      telefono: "4181231234",
      direccion: "Centro",
      fecha_solicitud: new Date(),
    });

    const createdPedido = await creaPedido(pedido);
    expect(createdPedido._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});


const ejemplosPedidos = [
  {
    nombre: "Alfredo Lima Perú",
    telefono: "4181231235",
    direccion: "Calle Falsa 123",
    fecha_solicitud: new Date("2026-04-05"),
    total: 90.0,
    comentario: "Ha sido pagado el pedido",
    ubicacion: "Plaza Principal #1, Centro, Dolores Hidalgo",
  },
  {
    nombre: "Natalia Arévalo Sanchez",
    telefono: "4181231236",
    direccion: "Calle Falsa 1234",
    fecha_solicitud: new Date("2026-04-07"),
    total: 90.0,
    comentario: "Ha sido pagado el pedido",
    ubicacion: "Plaza Principal #2, Centro, Dolores Hidalgo",
  },
  {
    nombre: "Alberto Olmos Vazquez",
    telefono: "4181231237",
    direccion: "Calle Falsa 12345",
    fecha_solicitud: new Date("2026-04-06"),
    total: 100.0,
    comentario: "NO ha sido pagado el pedido en su totalidad",
    ubicacion: "Plaza Principal #5, Centro, Dolores Hidalgo",
  },
];

let creandoEjemplosPedidos = [];

beforeEach(async () => {
  await Pedido.deleteMany({});
  creandoEjemplosPedidos = [];

  for (const pedido of ejemplosPedidos) {
    const nuevoPedido = new Pedido(pedido);
    creandoEjemplosPedidos.push(await nuevoPedido.save());
  }
});

describe("Listando Pedidos", () => {
  test("Debe regresar todos los pedidos", async () => {
    const pedidos = await listaAllPedidos();
    expect(pedidos.length).toEqual(creandoEjemplosPedidos.length);
  });

  test("Debe regresar pedidos ordenados por createdAt descendente", async () => {
    const pedidos = await listaAllPedidos();

    const sortedSamplePedidos = [...creandoEjemplosPedidos].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    expect(pedidos.map((p) => p.createdAt)).toEqual(
      sortedSamplePedidos.map((p) => p.createdAt)
    );
  });

  test("Debe tomar en cuenta las opciones de ordenamiento", async () => {
    const pedidos = await listaAllPedidos({
      sortBy: "updatedAt",
      sortOrder: "ascending",
    });

    const sortedSamplePedidos = [...creandoEjemplosPedidos].sort(
      (a, b) => a.updatedAt - b.updatedAt
    );

    expect(pedidos.map((p) => p.updatedAt)).toEqual(
      sortedSamplePedidos.map((p) => p.updatedAt)
    );
  });

  test("Debe filtrar pedidos por nombre", async () => {
    const pedidos = await listaPedidosByNombre("Natalia Arévalo Sanchez");
    expect(pedidos.length).toBe(1);
    expect(pedidos[0].nombre).toBe("Natalia Arévalo Sanchez");
  });
});

describe("Obteniendo un pedido", () => {
  test("Debe regresar el pedido completo", async () => {
    const pedido = await getPedidoById(creandoEjemplosPedidos[0]._id);
    expect(pedido.toObject()).toEqual(
      creandoEjemplosPedidos[0].toObject()
    );
  });

  test("Debe fallar si el ID no existe", async () => {
    const pedido = await getPedidoById("000000000000000000000000");
    expect(pedido).toEqual(null);
  });
});

describe("Modificando Pedidos", () => {
  test("Debe modificar el nombre", async () => {
    await modificaPedido(creandoEjemplosPedidos[0]._id, {
      nombre: "Test Nombre",
    });

    const pedidoModificado = await Pedido.findById(
      creandoEjemplosPedidos[0]._id
    );

    expect(pedidoModificado.nombre).toEqual("Test Nombre");
  });

  test("No debe modificar otras propiedades", async () => {
    await modificaPedido(creandoEjemplosPedidos[0]._id, {
      nombre: "Test Nombre",
    });

    const pedidoModificado = await Pedido.findById(
      creandoEjemplosPedidos[0]._id
    );

    expect(pedidoModificado.direccion).toEqual("Calle Falsa 123");
  });

  test("Debe modificar updatedAt", async () => {
    await modificaPedido(creandoEjemplosPedidos[0]._id, {
      nombre: "Test Nombre",
    });

    const pedidoModificado = await Pedido.findById(
      creandoEjemplosPedidos[0]._id
    );

    expect(pedidoModificado.updatedAt.getTime()).toBeGreaterThan(
      creandoEjemplosPedidos[0].updatedAt.getTime()
    );
  });

  test("Debe fallar si el ID no existe", async () => {
    const pedido = await modificaPedido("000000000000000000000000", {
      nombre: "Test Nombre",
    });

    expect(pedido).toEqual(null);
  });
});

describe("Eliminando Pedidos", () => {
  test("Debe remover el pedido de la BD", async () => {
    const result = await eliminaPedido(creandoEjemplosPedidos[0]._id);

    expect(result.deletedCount).toEqual(1);

    const deletedPedido = await Pedido.findById(
      creandoEjemplosPedidos[0]._id
    );

    expect(deletedPedido).toEqual(null);
  });

  test("Debe fallar si el ID no existe", async () => {
    const result = await eliminaPedido("000000000000000000000000");
    expect(result.deletedCount).toEqual(0);
  });
});