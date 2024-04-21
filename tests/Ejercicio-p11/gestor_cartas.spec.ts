import "mocha";
import { expect } from "chai";
import fs from "fs";
import {
  GuardarCarta,
  CargarCartas,
  MostrarCarta,
  EliminarCarta,
  ActualizarCarta,
} from "../../src/Ejercicio_p11/gestor_cartas.js";

import {
  Carta,
  Color,
  LineaTipo,
  Rareza,
} from "../../src/Ejercicio_p11/cartas_magic.js";

const usuariotest = "Juan";

// Ruta del directorio de cartas y archivo a eliminar
const directorioCartasUsuario = "./cards/Juan";
const archivoAEliminar = `${directorioCartasUsuario}/1.json`;

// Eliminar el archivo 1.json antes de que comiencen las pruebas
before((done) => {
  fs.unlink(archivoAEliminar, (err) => {
    if (err) {
      console.error(`Error al eliminar el archivo: ${err}`);
    }
    done(); // Indicar a Mocha que se puede proceder con las pruebas
  });
});

describe("GuardarCarta", () => {
  it("Test 1 - debería guardar una carta correctamente", (done) => {
    const carta: Carta = new Carta(
      1,
      "Ejemplo de carta",
      3,
      Color.Rojo,
      LineaTipo.Criatura,
      Rareza.Rara,
      "Ejemplo de reglas",
      4,
      3,
      undefined,
      100,
    );

    GuardarCarta(usuariotest, carta, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(
        `Se ha guardado correctamente en el usuario: ${usuariotest}`,
      );
      done();
    });
  });

  it("Test 2 - no debería guardar una carta si ya existe", (done) => {
    const carta: Carta = new Carta(
      1,
      "Ejemplo de carta",
      3,
      Color.Rojo,
      LineaTipo.Criatura,
      Rareza.Rara,
      "Ejemplo de reglas",
      4,
      3,
      undefined,
      100,
    );

    GuardarCarta(usuariotest, carta, (err, data) => {
      expect(err).to.equal(
        `El archivo para la carta ${carta.nombre} ya existe`,
      );
      done();
    });
  });

  it("Test 3 - debería guardar otra carta correctamente", (done) => {
    const otracarta: Carta = new Carta(
      2,
      "Otra carta",
      2,
      Color.Azul,
      LineaTipo.Criatura,
      Rareza.Mitica,
      "Otras reglas",
      2,
      2,
      undefined,
      200,
    );

    GuardarCarta(usuariotest, otracarta, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(
        `Se ha guardado correctamente en el usuario: ${usuariotest}`,
      );
      done();
    });
  });

  it("Test 4 - debería guardar otra carta correctamente", (done) => {
    const Dragon: Carta = new Carta(
      4,
      "Dragón de Ojos Azules",
      8,
      Color.Incoloro,
      LineaTipo.Criatura,
      Rareza.Mitica,
      "Cuando el Dragón de Ojos Azules entra al campo de batalla, puedes invocar a un Dragón Blanco de Ojos Azules desde tu mano, tu mazo o tu cementerio",
      3000,
      2500,
      undefined,
      1000,
    );

    GuardarCarta(usuariotest, Dragon, (err, data) => {
      expect(err).to.equal("El archivo para la carta Dragón de Ojos Azules ya existe");
      expect(data).to.undefined;
      done();
    });
  });
});

describe("CargarCartas", () => {
  it("Test 1 - debería cargar las cartas de un usuario correctamente", (done) => {
    CargarCartas(usuariotest, (err, coleccioncartas) => {
      expect(err).to.be.undefined;
      expect(coleccioncartas).to.be.an("array");
      done();
    });
  });

  it("Test 2 - no debería cargar las cartas de un usuario si no existe", (done) => {
    const usuarioInexistente = "UsuarioInexistente";

    CargarCartas(usuarioInexistente, (err, coleccioncartas) => {
      expect(err).to.equal(
        `Error al cargar las cartas del usuario: ENOENT: no such file or directory, access './cards/UsuarioInexistente'`,
      );
      done();
    });
  });
});

describe("MostrarCarta", () => {
  it("Test 1 - debería mostrar una carta correctamente", (done) => {
    const id = 1; // ID de la carta que deseas mostrar
    MostrarCarta(usuariotest, id, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.be.an("object");
      // Puedes agregar más expectativas aquí para verificar los datos de la carta mostrada
      done();
    });
  });

  it("Test 2 - no debería mostrar una carta si no existe", (done) => {
    const id = 999; // ID de la carta que no existe
    MostrarCarta(usuariotest, id, (err, data) => {
      expect(err).to.equal(
        `No existe ninguna carta con ID ${id} en la colección.`,
      );
      done();
    });
  });

  it("Test 3 - debería mostrar otra carta correctamente", (done) => {
    const id = 2; // ID de la carta que deseas mostrar
    MostrarCarta(usuariotest, id, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.be.an("object");
      expect(data).to.have.property("nombre", "Otra carta");
      done();
    });
  });
});

describe("ActualizarCarta", () => {
  it("Test 1 - debería actualizar una carta correctamente", (done) => {
    const id = 1; // ID de la carta que deseas actualizar
    const nuevaCarta: Carta = new Carta(
      id,
      "Nueva carta",
      2,
      Color.Azul,
      LineaTipo.Criatura,
      Rareza.Mitica,
      "Nuevas reglas",
      2,
      2,
      undefined,
      200,
    );
    ActualizarCarta(usuariotest, id, nuevaCarta, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(
        `Se actualizado correctamente en el usuario: ${usuariotest} con ${nuevaCarta.id}`,
      );
      done();
    });
  });

  it("Test 2 - no debería actualizar una carta si no existe", (done) => {
    const id_nuevo = 8; // ID de la carta que no existe
    const nuevaCarta: Carta = new Carta(
      id_nuevo,
      "Nueva carta",
      2,
      Color.Azul,
      LineaTipo.Criatura,
      Rareza.Mitica,
      "Nuevas reglas",
      2,
      2,
      undefined,
      200,
    );
    ActualizarCarta(usuariotest, id_nuevo, nuevaCarta, (err, data) => {
      console.log(err);
      expect(err).to.equal(`No existe este usuario ${usuariotest}`);
      done();
    });
  });

  it("Test 3 - debería actualizar otra carta correctamente", (done) => {
    const id = 2; // ID de la carta que deseas actualizar
    const nuevaCarta: Carta = new Carta(
      id,
      "Nueva carta",
      2,
      Color.Azul,
      LineaTipo.Criatura,
      Rareza.Mitica,
      "Nuevas reglas",
      2,
      2,
      undefined,
      200,
    );
    ActualizarCarta(usuariotest, id, nuevaCarta, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(
        `Se actualizado correctamente en el usuario: ${usuariotest} con ${nuevaCarta.id}`,
      );
      done();
    });
  });
});

describe("EliminarCarta", () => {
  it("Test 1 - debería eliminar una carta correctamente", (done) => {
    const id = 1; // ID de la carta que deseas eliminar
    const filePath = `./cards/${usuariotest}/${id}.json`;
    EliminarCarta(usuariotest, id, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(
        `Carta con ID ${id} eliminada y archivo ${filePath} borrado con éxito.`,
      );
      done();
    });
  });

  it("Test 2 - no debería eliminar una carta si no existe", (done) => {
    const id = 999; // ID de la carta que no existe
    EliminarCarta(usuariotest, id, (err, data) => {
      expect(err).to.equal(
        `No existe ninguna carta con ID ${id} en la colección.`,
      );
      done();
    });
  });

  it("Test 3 - deberia eliminar otra carta correctamente", (done) => {
    const id = 2; // ID de la carta que deseas eliminar

    EliminarCarta(usuariotest, id, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(
        `Carta con ID ${id} eliminada y archivo ${directorioCartasUsuario}/${id}.json borrado con éxito.`,
      );
      done();
    });
  });
});
