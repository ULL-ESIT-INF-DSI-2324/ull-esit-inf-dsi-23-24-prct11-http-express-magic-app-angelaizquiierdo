import fs from "fs";
import { Carta } from "./cartas_magic.js";

/**
 * Función para actualizar una carta en la colección del usuario.
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a actualizar.
 * @param nuevaCarta Nuevos datos de la carta.
 * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un error.
 */
export const ActualizarCarta = (
  usuario: string,
  id: number,
  nuevaCarta: Carta,
): Promise<string> => {
  const rutaArchivo = `./src/Ejercicio-PE/usuarios/${usuario}/${id}.json`;

  return new Promise((resolve, reject) => {
    // El archivo existe, aquí puedes realizar las operaciones de actualización
    fs.promises
      .access(rutaArchivo, fs.constants.F_OK)
      .then(() => {
        const newData = JSON.stringify(nuevaCarta, null, 1);

        fs.promises
          .readFile(rutaArchivo, "utf8")
          .then((data) => {
            // Realizar modificaciones en el archivo si existe
            return fs.promises.writeFile(rutaArchivo, newData);
          })
          .then(() => {
            resolve("Carta actualizada correctamente");
          })
          .catch((err) => {
            // En caso de error, rechazamos la promesa
            reject(`Error no se ha actualizado la carta: ${err.mensaje}`);
          });

        // Resolvemos la promesa directamente para este ejemplo
        resolve("Carta actualizada correctamente");
      })
      .catch(() => {
        // En caso que no exista el archivo, rechazamos la promesa
        reject("El archivo no existe");
      });
  });
};

/**
 * Función para añadir una nueva carta a la colección del usuario.
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a añadir.
 * @param nuevaCarta Nueva carta a añadir.
 * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un error.
 */
export const Anadir = (
  usuario: string,
  id: number,
  nuevaCarta: Carta,
): Promise<string> => {
  const rutaArchivo = `./src/Ejercicio-PE/usuarios/${usuario}/${id}.json`;
  const rutaDirectorio = `./src/Ejercicio-PE/usuarios/${usuario}`;

  return new Promise((resolve, reject) => {
    // Verificar si el directorio del usuario existe
    fs.promises
      .stat(rutaDirectorio)
      .then((stats) => {
        // Si el directorio existe, procedemos a añadir la carta
        const newData = JSON.stringify(nuevaCarta, null, 1);

        fs.promises
          .writeFile(rutaArchivo, newData)
          .then(() => {
            resolve(
              "Carta añadida a la coleccion correctamente miembro del directorio existente",
            );
          })
          .catch((err) => {
            // En caso de error al escribir el archivo, rechazamos la promesa
            reject(`Error al añadir la carta: ${err.message}`);
          });
      })
      .catch(() => {
        fs.promises.mkdir(rutaDirectorio); // Creamos el directorio si no existe
        // Si el directorio existe, procedemos a añadir la carta
        const newData = JSON.stringify(nuevaCarta, null, 1);

        fs.promises
          .writeFile(rutaArchivo, newData)
          .then(() => {
            resolve("Carta añadida correctamente una vez creado el directorio");
          })
          .catch((err) => {
            // En caso de error al escribir el archivo, rechazamos la promesa
            reject(`Error al añadir la carta: ${err.message}`);
          });
      });
  });
};
