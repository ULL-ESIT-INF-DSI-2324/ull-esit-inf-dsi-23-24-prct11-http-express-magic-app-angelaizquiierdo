[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/sNC2m9MU)

# Práctica 11 - Aplicación Express para coleccionistas de cartas Magic

## Indice



## Introducción
Basado en práctica 10 de servidor-cliente de API para coleccionistas de cartas Magic, usando **Express** para gestionar las carta mágicas con las funciones implementadas mediante funciones callback de forma asincrona el sistema de gestion de ficheros. Las peticiones que podrá realizar el cliente al servidor deberán permitir añadir, modificar, eliminar, listar y mostrar cartas de un usuario concreto. El servidor Express deberá almacenar la información de las cartas como ficheros JSON en el sistema de ficheros, siguiendo la misma estructura de directorios utilizada durante prácticas pasadas.

## Desarrollo de la práctica

En la práctica anterior con las funciones asincronas y empreando el patron callback las funciones que suefieron cambio fueron `GuardarCarta` y `ActualizarCarta`.

La función `GuardarCarta`, donde se había omitido la consideración de manejar la situación en la que el archivo de la carta ya existía en el directorio del usuario.

Para abordar esta omisión, implementé una verificación adicional para determinar la existencia del archivo. En caso de que el archivo ya estuviera presente, se agregó una instrucción dentro del callback para devolver un mensaje de error.

```ts
export const GuardarCarta = (
  usuario: string,
  carta: Carta,
  callback: (err: string | undefined, data: string | undefined) => void,
) => {
  const directorioUsuario = `./cartas/${usuario}`;
  const rutaCarta = `${directorioUsuario}/${carta.id}.json`;

  // Verificar si el archivo ya existe
  fs.access(rutaCarta, fs.constants.F_OK, (err) => {
    if (!err) {
      // Si el archivo ya existe, devolver un mensaje de error
      callback(`El archivo para la carta ${carta.nombre} ya existe`, undefined);
    } else {
       ...
    }
  });
};

```

En el caso de la función `ActualizarCarta`, realicé una mejora significativa al eliminar la llamada a la función `GuardarCarta`. Anteriormente, esta llamada podía crear un nuevo archivo en el directorio del usuario, lo cual era problemático ya que no se verificaba si el usuario era el propietario del archivo o si el archivo pertenecía a otro usuario. Esto podría resultar en una situación ambigua y posiblemente generar confusiones en el sistema.

```ts
export const ActualizarCarta = (
  usuario: string,
  id: number,
  nuevaCarta: Carta,
  callback: (error: string | undefined, data: string | undefined) => void,
) => {
  ...
        // Guardar la carta modificada
        const rutaCarta = `./cartas/${usuario}/${id}.json`;
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
      
...

```

Como el guión describe 

> Todas las peticiones deberán llevarse a cabo a partir de la ruta `/cards` y, además, deberán utilizarse los siguientes verbos HTTP para definir la manera en la que el servidor atenderá cada petición hecha en la ruta anterior:

get: Para obtener información sobre una carta de la colección de un usuario o para listar todas las cartas de su colección. En este caso, el ID de la carta vendrá dado, junto al usuario, como parámetros de la query string de la petición. Si no se especifica un ID concreto, se estará indicando que se desea obtener la colección completa de cartas del usuario.

post: Para añadir una carta a la colección de un usuario. En este caso, la carta que se desea añadir a la colección deberá venir especificada en formato JSON en el cuerpo de la petición. El usuario deberá indicarse en la query string de la petición.

delete: Para eliminar una carta de la colección de un usuario. En este caso, el ID de la carta que se desea eliminar vendrá dado, junto al usuario, como parámetros de la query string de la petición.

patch: Para modificar la información de una carta existente en la colección de un usuario. En este caso, el ID de la carta que se desea modificar vendrá dado, junto al usuario, como parámetros de la query string de la petición. Además, la información a modificar se especificará en formato JSON en el cuerpo de la petición.

El resto de las funciones se mantienen igual que la práctica 10. 

En cuanto a la implementacion de express

## Conclusion

## Bibliografía
