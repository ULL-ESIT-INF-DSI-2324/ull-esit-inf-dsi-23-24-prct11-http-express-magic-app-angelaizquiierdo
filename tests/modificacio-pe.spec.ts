import 'mocha';
import {expect} from 'chai';

import fs from "fs";
import { Carta, Color, LineaTipo, Rareza } from "../src/Ejercicio-PE/cartas_magic.js";
import { ActualizarCarta, Anadir } from "../src/Ejercicio-PE/gestor_carta.js";


describe('ActualizarCarta() promesas', () => {
  const Charizard = new Carta(2, 'Pokemon-Charizard', 5, Color.Rojo, LineaTipo.Criatura, Rareza.Comun, 'reglas', 1, 1, undefined, 1);
  it('Test 1 - Salida correcta', () => {
    return ActualizarCarta('eduardo', 2, Charizard ).then((data) => {
      expect(data).to.be.equal('Carta actualizada correctamente');
    });
  });



  it('Test 2 - Salida no existe el fichero', () => {
  
    return ActualizarCarta('testPrueba', 3, Charizard).catch((err) => {
      expect(err).to.be.equal('El archivo no existe');
    });
  });

  
  it('Test 3 - Salida error en la actualización', () => {
    return ActualizarCarta('eduardo', 2, Charizard).catch((err) => {
      expect(err).to.be.equal('Error no se ha actualizado la carta: request_failed');
    });
  });

  it('Test 4 - Salida error en la actualización', () => {
    return ActualizarCarta('eduardo', 2, Charizard).catch((err) => {
      expect(err).to.be.equal('Error no se ha actualizado la carta: request_failed');
    });
  });

  const Pikachu = new Carta(2, 'Pokemon-Pikachu', 5, Color.Rojo, LineaTipo.Instantaneo, Rareza.Rara, 'reglas', undefined, undefined, undefined, 1);
  it('Test 5 - Salida error en la actualización', () => {
    return ActualizarCarta('eduardo', 2, Pikachu).catch((err) => {
      expect(err).to.be.equal('Error no se ha actualizado la carta: request_failed');
    });
  });


  it('Test 6 - Salida correcta', () => {
    return ActualizarCarta('eduardo', 2, Pikachu).catch((err) => {
      expect(err).to.be.equal('Carta actualizada correctamente');
    });
  });
});



describe('Anadir() promesas', () => {
  const directorioAEliminar = './src/Ejercicio-PE/usuarios/Evano';

  // Antes de ejecutar las pruebas, verificamos si el directorio existe y lo eliminamos si es necesario
  before(async function() {
    if (fs.existsSync(directorioAEliminar)) {
      // Si el directorio existe, lo eliminamos de manera asíncrona
      await fs.promises.rm(directorioAEliminar, { recursive: true });
    }
  });
  it('Test 1 - Salida correcta sin crear directorio', () => {
    const Pikachu = new Carta(6, 'Pokemon-Pikachu', 5, Color.Rojo, LineaTipo.Instantaneo, Rareza.Rara, 'reglas', undefined, undefined, undefined, 1);
    return Anadir('eduardo', 6, Pikachu).then((data) => {
      expect(data).to.be.equal('Carta añadida a la coleccion correctamente miembro del directorio existente');
    });
  } );
  it('Test 2 - Salida correctamente creando directorio', () => {
    const Pikachu = new Carta(3, 'Pokemon-Pikachu', 5, Color.Rojo, LineaTipo.Instantaneo, Rareza.Rara, 'reglas', undefined, undefined, undefined, 1);
    return Anadir('Evano', 2, Pikachu).then((dato) => {
      expect(dato).to.be.equal('Carta añadida correctamente una vez creado el directorio');
    });
  });

  it('Test 3 - Salida error al añadir la carta', () => {
    const Pikachu = new Carta(3, 'Pokemon-Pikachu', 5, Color.Rojo, LineaTipo.Instantaneo, Rareza.Rara, 'reglas', undefined, undefined, undefined, 1);
    return Anadir('Evano', 3, Pikachu).catch((err) => {
      expect(err).to.be.equal('Error al añadir la carta: request_failed');
    });
  });

  it('Test 4 - Salida error al añadir la carta', () => {
    const Pikachu = new Carta(3, 'Pokemon-Pikachu', 5, Color.Rojo, LineaTipo.Instantaneo, Rareza.Rara, 'reglas', undefined, undefined, undefined, 1);
    return Anadir('Evano', 3, Pikachu).catch((err) => {
      expect(err).to.be.equal('Error al añadir la carta: request_failed');
    });
  });

  it('Test 5 - Salida error al añadir la carta', () => {
    const Charizard = new Carta(2, 'Pokemon-Charizard', 5, Color.Rojo, LineaTipo.Criatura, Rareza.Comun, 'reglas', 1, 1, undefined, 1);
    return Anadir('Evano', 3, Charizard).catch((err) => {
      expect(err).to.be.equal('Error al añadir la carta: request_failed');
    });
  });
});
