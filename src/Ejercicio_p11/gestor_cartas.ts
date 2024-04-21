import fs from "fs";
import { Carta } from "./cartas_magic.js";
import path from "path";

/**
 * Función para guardar una carta en la colección del usuario.
 * Primero verifica si el archivo de la carta ya existe.
 * Si el archivo ya existe, llama a la función de retorno de llamada con un mensaje de error.
 * Llama a la función de fs.mkdir para crear el directorio del usuario.
 * Llama a la función de fs.writeFile para escribir la carta en el directorio del usuario.
 * Llama a la función de retorno de llamada con un mensaje de error o éxito.
 * @param usuario Nombre del usuario.
 * @param carta Carta a guardar.
 * @param callback Función de retorno de llamada.
 * @returns void No devuelve nada, pero llama a la función de retorno de llamada con un mensaje de error o éxito
 */
export const GuardarCarta = (
  usuario: string,
  carta: Carta,
  callback: (err: string | undefined, data: string | undefined) => void,
) => {
  const directorioUsuario = `./cards/${usuario}`;
  const rutaCarta = `${directorioUsuario}/${carta.id}.json`;

  // Verificar si el archivo ya existe
  fs.access(rutaCarta, fs.constants.F_OK, (err) => {
    if (!err) {
      // Si el archivo ya existe, devolver un mensaje de error
      callback(`El archivo para la carta ${carta.nombre} ya existe`, undefined);
    } else {
      // Si el archivo no existe, escribirlo en el directorio del usuario
      fs.mkdir(directorioUsuario, { recursive: true }, (err) => {
        if (err) {
          callback(`Error al crear el directorio: ${err.message}`, undefined);
        } else {
          fs.writeFile(rutaCarta, JSON.stringify(carta), (err) => {
            if (err) {
              callback(`Error al guardar la carta: ${err.message}`, undefined);
            } else {
              callback(
                undefined,
                `Se ha guardado correctamente en el usuario: ${usuario}`,
              );
            }
          });
        }
      });
    }
  });
};

/**
 * Función para cargar las cartas de un usuario desde el sistema de archivos.
 * Primero verifica si el directorio de usuario existe.
 * Si el directorio existe, llama a la función de fs.readdir y fs.readFile y JSON.parse.
 * Llama a la función de fs.readdir para leer el directorio de usuario.
 * Llama a la función de fs.readFile para leer el archivo de cada carta.
 * Llama a la función de JSON.parse para convertir el JSON de cada carta en un objeto Carta.
 * @param usuario Nombre del usuario.
 * @param callback Función de retorno de llamada.
 * @returns void No devuelve nada, pero llama a la función de retorno de llamada con un mensaje de error o la colección de cartas
 */
export const CargarCartas = (
  usuario: string,
  callback: (
    error: string | undefined,
    coleccioncartas: Carta[] | undefined,
  ) => void,
) => {
  const directorioUsuario = `./cards/${usuario}`;

  fs.access(directorioUsuario, fs.constants.F_OK, (err) => {
    if (err) {
      callback(
        `Error al cargar las cartas del usuario: ${err.message}`,
        undefined,
      );
    } else {
      fs.readdir(directorioUsuario, (err, archivos) => {
        if (err) {
          callback(`Error al leer el directorio: ${err.message}`, undefined);
        } else {
          const cartas: Carta[] = [];
          let archivosLeidos = 0; // Variable para contar el número de archivos leídos

          archivos.forEach((archivo) => {
            const rutaCarta = path.join(directorioUsuario, archivo);
            fs.readFile(rutaCarta, "utf-8", (err, cartaJson) => {
              if (err) {
                callback(
                  `Error al leer el archivo ${archivo}: ${err.message}`,
                  undefined,
                );
              } else {
                // si se esta conviertiendo el JSON correctamente a un objeto Carta
                try {
                  const carta: Carta = JSON.parse(cartaJson);
                  cartas.push(carta);
                  archivosLeidos++; // Incrementar el contador de archivos leídos

                  // Verificar si todos los archivos han sido leídos
                  if (archivosLeidos === archivos.length) {
                    // Llamar a callback solo cuando todos los archivos hayan sido leídos y convertidos
                    callback(undefined, cartas);
                  }
                } catch (error) {
                  callback(
                    `Error al convertir el JSON del archivo ${archivo}: ${error.message}`,
                    undefined,
                  );
                }
              }
            });
          });
        }
      });
    }
  });
};

/**
 * Funcion de mostrar la carta de un usuario con el id especificado.
 * Llama a la funcion de CargarCartas para cargar las cartas del usuario.
 * Luego busca la carta con el id especificado en la coleccion de cartas.
 * Si la carta existe, llama a la funcion de retorno de llamada con la carta, si no, llama a la funcion de retorno de llamada con un mensaje de error.
 *
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a mostrar.
 * @param callback Función de retorno de llamada.
 * @returns void No devuelve nada, pero llama a la función de retorno de llamada con un mensaje de error o la carta
 */
export const MostrarCarta = (
  usuario: string,
  id: number,
  callback: (error: string | undefined, data: Carta | undefined) => void,
) => {
  CargarCartas(usuario, (error, coleccion) => {
    if (error) {
      callback(error, undefined);
    } else {
      const cartascoleccion: Carta[] = coleccion as Carta[];
      const index: number = cartascoleccion.findIndex(
        (carta) => carta.id === id,
      );
      if (index !== -1) {
        try {
          const cartaobject: Carta = cartascoleccion[index];
          //cartaJson = JSON.stringify(cartascoleccion[index]);
          callback(undefined, cartaobject);
        } catch (error) {
          callback(
            `Error(MOSTRAR Carta) no se convirtio el JSON del archivo ${id}: ${error.message}`,
            undefined,
          );
        }
      } else {
        callback(
          `No existe ninguna carta con ID ${id} en la colección.`,
          undefined,
        );
      }
    }
  });
};

/**
 * Función para eliminar una carta de la colección del usuario.
 * Si usuario y carta no existen, se elimina la carta y se envia un mensaje de exito, si no un mensaje de error.
 * Llama a la funcion de fs.unlink para eliminar el archivo de la carta.
 * Llama a la funcion de fs.readdir para leer el directorio de usuario y verificar si esta vacio.
 * Llama a la funcion de fs.rmdir para eliminar el directorio de usuario si esta vacio.
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a eliminar.
 * @param callback Función de retorno de llamada.
 * @returns void No devuelve nada, pero llama a la función de retorno de llamada con un mensaje de error o éxito
 */
export const EliminarCarta = (
  usuario: string,
  id: number,
  callback: (error: string | undefined, data: string | undefined) => void,
) => {
  CargarCartas(usuario, (err, coleccion) => {
    if (err) {
      callback(
        `Error no existe usuario registrado con nombre ${usuario}`,
        undefined,
      );
    } else {
      const coleccioncarta: Carta[] = coleccion as Carta[];

      const index = coleccioncarta.findIndex((carta) => carta.id === id);
      if (index !== -1) {
        coleccioncarta.splice(index, 1);
        const filePath = `./cards/${usuario}/${id}.json`;
        fs.unlink(filePath, (err) => {
          if (err) {
            if (err.code === "ENOENT") {
              callback(
                `Error: El archivo ${filePath} no se ha eliminado.`,
                undefined,
              );
            } else {
              callback(`Error al eliminar la carta: ${err.message}`, undefined);
            }
          } else {
            callback(
              undefined,
              `Carta con ID ${id} eliminada y archivo ${filePath} borrado con éxito.`,
            );
          }
        });
        const directorioUsuario = `./cards`;
        const userFolderPath = path.resolve(directorioUsuario, usuario);
        fs.readdir(userFolderPath, (err, filesInFolder) => {
          if (err) {
            callback(
              `Error al leer el directorio de usuario: ${err.message}`,
              undefined,
            );
          } else {
            if (filesInFolder.length === 0) {
              fs.rmdir(userFolderPath, (err) => {
                if (err) {
                  callback(
                    `Error al eliminar la carpeta de usuario: ${err.message}`,
                    undefined,
                  );
                } else {
                  callback(
                    `La carpeta de usuario '${usuario}' ha sido eliminada ya que estaba vacía.`,
                    undefined,
                  );
                }
              });
            }
          }
        });
      } else {
        callback(
          `No existe ninguna carta con ID ${id} en la colección.`,
          undefined,
        );
      }
    }
  });
};

/**
 * Función para actualizar una carta en la colección del usuario.
 * Si usuario y carta no existen, se modifica la carta y se envia un mensaje de exito, si no un mensaje de error.
 * llama a la funcion de fs.writeFile para guardar la carta modificada.
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a actualizar.
 * @param nuevosDatos Nuevos datos de la carta.
 * @param callback Función de retorno de llamada.
 * @returns void No devuelve nada, pero llama a la función de retorno de llamada con un mensaje de error o éxito
 */
export const ActualizarCarta = (
  usuario: string,
  id: number,
  nuevaCarta: Carta,
  callback: (error: string | undefined, data: string | undefined) => void,
) => {
  CargarCartas(usuario, (error, coleccion) => {
    if (error) {
      callback(`No existe este usuario ${usuario}`, undefined);
    } else {
      // Buscar la carta con el ID especificado
      const cartascoleccion: Carta[] = coleccion as Carta[];
      const index: number = cartascoleccion.findIndex(
        (carta) => carta.id === id,
      );
      if (index !== -1) {
        // Si se encontró la carta, se modifica
        cartascoleccion[index] = nuevaCarta;
        // Guardar la carta modificada
        const rutaCarta = `./cards/${usuario}/${id}.json`;
        fs.writeFile(
          rutaCarta,
          JSON.stringify(cartascoleccion[index]),
          (err) => {
            if (err) {
              callback(`Error al guardar la carta: ${err.message}`, undefined);
            } else {
              callback(
                undefined,
                `Se actualizado correctamente en el usuario: ${usuario} con ${nuevaCarta.id}`,
              );
            }
          },
        );
      } else {
        callback(
          `No existe ninguna carta con ID ${id} en la colección.`,
          undefined,
        );
      }
    }
  });
};
