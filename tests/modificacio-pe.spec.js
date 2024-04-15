import 'mocha';
import { expect } from 'chai';
import { Carta, Color, LineaTipo, Rareza } from "../src/Ejercicio-PE/cartas_magic.js";
import { ActualizarCarta } from "../src/Ejercicio-PE/gestor_carta.js";
describe('ActualizarCarta() promesas', () => {
    const Charizard = new Carta(2, 'Pokemon-Charizard', 5, Color.Rojo, LineaTipo.Criatura, Rareza.Comun, 'reglas', 1, 1, undefined, 1);
    it('Test 1 - Salida correcta', () => {
        return ActualizarCarta('eduardo', 2, Charizard).then((data) => {
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
