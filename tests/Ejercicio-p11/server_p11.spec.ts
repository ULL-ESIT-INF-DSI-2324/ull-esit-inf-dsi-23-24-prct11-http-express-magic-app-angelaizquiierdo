import "mocha";
import fs from "fs";
import { expect } from "chai";
import request from "request";

// Ruta del directorio de cartas y archivo a eliminar
const directorioCartasUsuario = "./cards/eva";
const archivoAEliminar = `${directorioCartasUsuario}/7.json`;

// Eliminar el archivo 7.json antes de que comiencen las pruebas
before((done) => {
  fs.unlink(archivoAEliminar, (err) => {
    if (err) {
      console.error(`Error al eliminar el archivo: ${err}`);
    }
    done(); // Indicar a Mocha que se puede proceder con las pruebas
  });
});

describe("Pruebas de las rutas de la aplicación Express", () => {
  // Prueba para la ruta GET /cards
  it("Test 1 - get (no debería funcionar si el usuario no se da en la query string)", (done) => {
    request.get(
      { url: "http://localhost:3000/cards", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "Falta parametro de usuario en la solicitud",
        );
        done();
      },
    );
  });

  it("Test 2 - get (debería obtener todas las cartas de un usuario)", (done) => {
    request.get(
      { url: "http://localhost:3000/cards?usuario=eva", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("EXITO");

        done();
      },
    );
  });

  it("Test 3 - get (debería obtener una carta de un usuario)", (done) => {
    request.get(
      { url: "http://localhost:3000/cards?usuario=eva&id=6", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("EXITO");
        done();
      },
    );
  });

  // Prueba para la ruta POST /cards
  it("Test 4 - post (no debería funcionar si el usuario no se da en la query string)", (done) => {
    request.post(
      { url: "http://localhost:3000/cards", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "Falta parametro de usuario en la solicitud",
        );
        done();
      },
    );
  });
  it("Test 5 - post (debería añadir una carta a un usuario)", (done) => {
    const cardToAdd = {
      id: 7,
      nombre: "Pokemon-Pikachu",
      costemana: 5,
      color: "Rojo",
      lineatipo: "Instantaneo",
      rareza: "Rara",
      reglas:
        "Objetivo del juego: El objetivo principal es reducir los puntos de vida del oponente a cero. Cada jugador comienza con 20 puntos de vida",
      valorMercado: 50,
    };
    request.post(
      { url: "http://localhost:3000/cards?usuario=eva", json: cardToAdd },
      (error: Error, response) => {
        expect(response.body.status).to.equal("EXITO");
        done();
      },
    );
  });
  it("Test 6 - debería añadir una carta", (done) => {
    const cardToAdd = {
      id: 4,
      nombre: "Lightning Bolt",
      costemana: 1,
      color: "Rojo",
      lineatipo: "Conjuro",
      rareza: "Común",
      reglas:
        "Lightning Bolt es un hechizo rojo de daño directo que causa 3 puntos de daño a cualquier objetivo.",
      valorMercado: 50,
    };

    request.post(
      { url: "http://localhost:3000/cards?usuario=eva", json: cardToAdd },
      (error: Error, response) => {
        expect(response.body.status).to.equal("EXITO");
        done();
      },
    );
  });

  it("Test 7 - no debería añadir esta carta ya que existe", (done) => {
    const cardToAdd = {
      id: 4,
      nombre: "Lightning Bolt",
      costemana: 1,
      color: "Rojo",
      lineatipo: "Conjuro",
      rareza: "Común",
      reglas:
        "Lightning Bolt es un hechizo rojo de daño directo que causa 3 puntos de daño a cualquier objetivo.",
      valorMercado: 50,
    };

    request.post(
      { url: "http://localhost:3000/cards?usuario=eva", json: cardToAdd },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "El archivo para la carta Lightning Bolt ya existe",
        );
        done();
      },
    );
  });

  // Prueba para la ruta DELETE /cards
  it("Test 8 - no debería funcionar si el usuario no se da en la query string", (done) => {
    request.delete(
      { url: "http://localhost:3000/cards", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "Falta parametro de usuario en la solicitud",
        );
        done();
      },
    );
  });
  it("Test 9 - debería eliminar una carta de un usuario", (done) => {
    request.delete(
      { url: "http://localhost:3000/cards?usuario=eva&id=4", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("EXITO");
        expect(response.body.answer).to.equal(
          "Carta con ID 4 eliminada y archivo ./cards/eva/4.json borrado con éxito.",
        );
        done();
      },
    );
  });
  it("Test 10 - no debería eliminar una carta de un usuario si no existe", (done) => {
    request.delete(
      { url: "http://localhost:3000/cards?usuario=eva&id=999", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "No existe ninguna carta con ID 999 en la colección.",
        );
        done();
      },
    );
  });

  // Prueba para la ruta PATCH /cards
  it("Test 11 - no debería funcionar si el usuario no se da en la query string", (done) => {
    request.patch(
      { url: "http://localhost:3000/cards", json: true },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "Falta parametro de usuario en la solicitud",
        );
        done();
      },
    );
  });
  it("Test 12 - debería actualizar una carta a un usuario", (done) => {
    const cardToAdd = {
      id: 6,
      nombre: "Counterspell",
      costemana: 2,
      color: "Azul",
      lineatipo: "Instantáneo",
      rareza: "Común",
      reglas:
        "Counterspell es una carta de instantáneo azul que contrarresta cualquier hechizo lanzado por un oponente, sin condiciones adicionales.",
      valorMercado: 200,
    };

    request.patch(
      { url: "http://localhost:3000/cards?usuario=eva&id=6", json: cardToAdd },
      (error: Error, response) => {
        expect(response.body.status).to.equal("EXITO");
        expect(response.body.answer).to.equal(
          "Se actualizado correctamente en el usuario: eva con 6",
        );
        done();
      },
    );
  });
  it(" Test 13 - no debería actualizar una carta a un usuario si no existe", (done) => {
    const cardToAdd = {
      id: 99,
      name: "Qiyana",
      manaCost: 6767,
      color: "White",
      type: "Artifact",
      rarity: "Rare",
      rulesText: "Tap: ERQWQAA",
      marketValue: 999,
    };
    request.patch(
      {
        url: "http://localhost:3000/cards?usuario=eva&id=99",
        json: cardToAdd,
      },
      (error: Error, response) => {
        expect(response.body.status).to.equal("ERROR");
        expect(response.body.answer).to.equal(
          "No existe ninguna carta con ID 99 en la colección.",
        );
        done();
      },
    );
  });
});
