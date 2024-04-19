import fs from "fs";
import { Carta } from "./cartas_magic.js";
import path from "path";

/**
 * Función para guardar una carta en la colección del usuario.
 * @param usuario Nombre del usuario.
 * @param carta Carta a guardar.
 * @param callback Función de retorno de llamada.
 */
export const GuardarCarta = (
  usuario: string,
  carta: Carta,
  callback: (err: string | undefined, data: string | undefined) => void,
) => {
  const directorioUsuario = `./src/EjerciciosCarta/usuarios/${usuario}`;
  const rutaCarta = `${directorioUsuario}/${carta.id}.json`;

  // Verificar si existe el directorio del usuario
  fs.access(directorioUsuario, fs.constants.F_OK, (err) => {
    if (err) {
      // Si no existe el directorio, crearlo y luego guardar la carta
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
    } else {
      // Si existe el directorio del usuario, guardar la carta
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
};

/**
 * Función para cargar las cartas de un usuario desde el sistema de archivos.
 * @param usuario Nombre del usuario.
 * @param callback Función de retorno de llamada.
 */
export const CargarCartas = (
  usuario: string,
  callback: (
    error: string | undefined,
    coleccioncartas: Carta[] | undefined,
  ) => void,
) => {
  const directorioUsuario = `./src/EjerciciosCarta/usuarios/${usuario}`;

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
 * Funcion de mostrar la carta de un usuario con un id ya dicho
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a mostrar.
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
        } catch (error){
          callback(`Error al convertir el JSON del archivo ${id}: ${error.message}`, undefined);
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
 * @param usuario Nombre del usuario.
 * @param id ID de la carta a eliminar.
 * @param callback Función de retorno de llamada.
 */
export const EliminarCarta = (
  usuario: string,
  id: number,
  callback: (error: string | undefined, data: string | undefined) => void,
) => {
  CargarCartas(usuario, (err, coleccion) => {
    if (err) {
      callback(err, undefined);
    } else {
      const coleccioncarta: Carta[] = coleccion as Carta[];
      const index = coleccioncarta.findIndex((carta) => carta.id === id);
      if (index !== -1) {
        coleccioncarta.splice(index, 1);
        const filePath = `./src/EjerciciosCarta/usuarios/${usuario}/${id}.json`;
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
              `Carta con ID ${id} eliminada y archivo ${filePath} borrado con éxito.`,
              undefined,
            );
          }
        });
        const directorioUsuario = `./src/EjerciciosCarta/usuarios`;
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
