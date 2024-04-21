import "mocha";
import { expect } from "chai";

import {
  Carta,
  Color,
  LineaTipo,
  Rareza,
  ConversiorJSONaCarta,
  MostrarCartas,
} from "../../src/Ejercicio_p11/cartas_magic.js";

describe("ConversiorJSONaCarta", () => {
  it("Test 1 - debería convertir un objeto JSON en un objeto de carta correctamente", (done) => {
    const nuevaCartaJSON = {
      id: 1,
      nombre: "Carta de Prueba",
      coste_mana: 3,
      color: "Rojo",
      lineatipo: "Conjuro",
      rareza: "Rara",
      reglas: "Reglas de Prueba",
      valorMercado: 10.5,
    };

    ConversiorJSONaCarta(nuevaCartaJSON, (error, carta) => {
      expect(error).to.be.undefined;
      expect(carta).to.exist;
      expect(carta?.id).to.equal(1);
      expect(carta?.nombre).to.equal("Carta de Prueba");
      expect(carta?.costeMana).to.equal(3);
      expect(carta?.color).to.equal(Color.Rojo);
      expect(carta?.lineatipo).to.equal(LineaTipo.Conjuro);
      expect(carta?.rareza).to.equal(Rareza.Rara);
      expect(carta?.textoReglas).to.equal("Reglas de Prueba");
      expect(carta?.fuerza).to.be.undefined;
      expect(carta?.resistencia).to.be.undefined;
      done();
    });
  });

  it("Test 2 - debería devolver un error si falta información", (done) => {
    // Simula un objeto JSON con información faltante
    const nuevaCartaJSON = {
      id: 1,
      nombre: "Carta de Prueba",
      color: "Rojo",
      lineatipo: "Tipo de Prueba",
      rareza: "Rara",
      reglas: "Reglas de Prueba",
      fuerza: 4,
      resistencia: 3,
      marcasLealtad: 2,
      valorMercado: 10.5,
    };

    ConversiorJSONaCarta(nuevaCartaJSON, (error, carta) => {
      expect(error).to.exist;
      expect(carta).to.be.undefined;
      done();
    });
  });

  it("debería devolver un error si la conversión falla", (done) => {
    // Simula un objeto JSON inválido
    const nuevaCartaJSON = {};

    ConversiorJSONaCarta(nuevaCartaJSON, (error, carta) => {
      expect(error).to.exist;
      expect(carta).to.be.undefined;
      done();
    });
  });
});

describe("MostrarCartas", () => {
  it("debería mostrar los detalles de una carta correctamente", () => {
    // Simula una carta en formato JSON
    const cartaJSON =
      '{"id":1,"nombre":"Carta de Prueba","coste_mana":3,"color":"Rojo","tipo":"Tipo de Prueba","rareza":"Rara","texto_reglas":"Reglas de Prueba","fuerza":4, "resistencia": 3,"valor_mercado":10.5}';

    // Captura la salida en la consola
    let consoleOutput = "";
    console.log = (msg) => {
      consoleOutput += msg + "\n";
    };

    // Llama a la función y verifica la salida
    MostrarCartas(cartaJSON);
    expect(consoleOutput).to.contain("Id: 1");
    expect(consoleOutput).to.contain("Nombre: Carta de Prueba");
    // Agrega más expectativas para los demás campos de la carta si es necesario
  });

  it("debería mostrar los detalles de una carta de tipo Criatura correctamente", () => {
    // Simula una carta de tipo Criatura en formato JSON
    const cartaJSON =
      '{"id":1,"nombre":"Carta de Prueba","coste_mana":3,"color":"Rojo","tipo":"Criatura","rareza":"Rara","texto_reglas":"Reglas de Prueba","fuerza":4,"resistencia":3,"valor_mercado":10.5}';

    // Captura la salida en la consola
    let consoleOutput = "";
    console.log = (msg) => {
      consoleOutput += msg + "\n";
    };

    // Llama a la función y verifica la salida
    MostrarCartas(cartaJSON);
    expect(consoleOutput).to.contain("Fuerza: 4");
    expect(consoleOutput).to.contain("Resistencia: 3");
  });

  it("debería mostrar los detalles de una carta de tipo Planeswalker correctamente", () => {
    // Simula una carta de tipo Planeswalker en formato JSON
    const cartaJSON =
      '{"id":1,"nombre":"Carta de Prueba","coste_mana":3,"color":"Rojo","tipo":"Planeswalker","rareza":"Rara","texto_reglas":"Reglas de Prueba","marcas_lealtad":2,"valor_mercado":10.5}';

    // Captura la salida en la consola
    let consoleOutput = "";
    console.log = (msg) => {
      consoleOutput += msg + "\n";
    };

    // Llama a la función y verifica la salida
    MostrarCartas(cartaJSON);
    expect(consoleOutput).to.contain("Marcas de lealtad: 2");
  });

  it("debería mostrar un mensaje de error si la carta es inválida", () => {
    // Simula una carta inválida
    const cartaJSON = "{}";

    // Captura la salida en la consola
    let consoleOutput = "";
    console.log = (msg) => {
      consoleOutput += msg + "\n";
    };

    // Llama a la función y verifica la salida
    MostrarCartas(cartaJSON);
    expect(consoleOutput).to.contain("No hay contenido de carta para mostrar.");
  });
});

describe("Crea objeto Carta", () => {
  it("debería crear una carta correctamente", () => {
    const carta = new Carta(
      1,
      "Carta de Prueba",
      3,
      Color.Rojo,
      LineaTipo.Conjuro,
      Rareza.Rara,
      "Reglas de Prueba",
      undefined,
      undefined,
      undefined,
      10.5,
    );

    expect(carta.id).to.equal(1);
    expect(carta.nombre).to.equal("Carta de Prueba");
    expect(carta.costeMana).to.equal(3);
    expect(carta.color).to.equal(Color.Rojo);
    expect(carta.lineatipo).to.equal(LineaTipo.Conjuro);
    expect(carta.rareza).to.equal(Rareza.Rara);
    expect(carta.textoReglas).to.equal("Reglas de Prueba");
    expect(carta.fuerza).to.be.undefined;
    expect(carta.resistencia).to.be.undefined;
    expect(carta.marcasLealtad).to.be.undefined;
    expect(carta.valorMercado).to.equal(10.5);
  });

  it("debería crear una carta con fuerza y resistencia correctamente", () => {
    const carta = new Carta(
      1,
      "Carta de Prueba",
      3,
      Color.Rojo,
      LineaTipo.Criatura,
      Rareza.Rara,
      "Reglas de Prueba",
      4,
      3,
      undefined,
      10.5,
    );

    expect(carta.id).to.equal(1);
    expect(carta.nombre).to.equal("Carta de Prueba");
    expect(carta.costeMana).to.equal(3);
    expect(carta.color).to.equal(Color.Rojo);
    expect(carta.lineatipo).to.equal(LineaTipo.Criatura);
    expect(carta.rareza).to.equal(Rareza.Rara);
    expect(carta.textoReglas).to.equal("Reglas de Prueba");
    expect(carta.fuerza).to.equal(4);
    expect(carta.resistencia).to.equal(3);
    expect(carta.marcasLealtad).to.be.undefined;
    expect(carta.valorMercado).to.equal(10.5);
  });

  it("debería crear una carta con marcas de lealtad correctamente", () => {
    const carta = new Carta(
      1,
      "Carta de Prueba",
      3,
      Color.Rojo,
      LineaTipo.Planeswalker,
      Rareza.Rara,
      "Reglas de Prueba",
      undefined,
      undefined,
      2,
      10.5,
    );

    expect(carta.id).to.equal(1);
    expect(carta.nombre).to.equal("Carta de Prueba");
    expect(carta.costeMana).to.equal(3);
    expect(carta.color).to.equal(Color.Rojo);
    expect(carta.lineatipo).to.equal(LineaTipo.Planeswalker);
    expect(carta.rareza).to.equal(Rareza.Rara);
    expect(carta.textoReglas).to.equal("Reglas de Prueba");
    expect(carta.fuerza).to.be.undefined;
    expect(carta.resistencia).to.be.undefined;
    expect(carta.marcasLealtad).to.equal(2);
    expect(carta.valorMercado).to.equal(10.5);
  });

  it("debería haber un error no tiene fuerza/resistencia en tipo LineaTipo ", () => {
    const crearCarta = () =>
      new Carta(
        1,
        "Carta de Prueba",
        3,
        Color.Rojo,
        LineaTipo.Criatura,
        Rareza.Rara,
        "Reglas de Prueba",
        undefined,
        undefined,
        undefined,
        10.5,
      );

    // Verifica que al intentar crear la carta se lance un error
    expect(crearCarta).to.throw(
      "Una carta del tipo CRIATURA debe de tener asociada un atributo de fuerza/resistencia.",
    );
  });

  it("Debería lanzar un error si se crea una carta de tipo Planeswalker sin especificar marcasLealtad", () => {
    const crearCarta = () =>
      new Carta(
        1,
        "Carta de ejemplo",
        3,
        Color.Azul,
        LineaTipo.Planeswalker,
        Rareza.Rara,
        "Esta es una carta de ejemplo.",
        undefined,
        undefined,
        undefined,
        10,
      );

    // Verifica que al intentar crear la carta se lance un error
    expect(crearCarta).to.throw(
      "Una carta del tipo PLANESWALKER debe de tener asociada un atributo de lealtad.",
    );
  });
});
