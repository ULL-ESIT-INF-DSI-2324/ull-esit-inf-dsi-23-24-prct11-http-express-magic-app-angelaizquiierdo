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

### Como el guión describe

> Todas las peticiones deberán llevarse a cabo a partir de la ruta `/cards` y, además, deberán utilizarse los siguientes verbos HTTP para definir la manera en la que el servidor atenderá cada petición hecha en la ruta anterior:

- get: Para obtener información sobre una carta de la colección de un usuario o para listar todas las cartas de su colección. En este caso, el ID de la carta vendrá dado, junto al usuario, como parámetros de la query string de la petición. Si no se especifica un ID concreto, se estará indicando que se desea obtener la colección completa de cartas del usuario.

- post: Para añadir una carta a la colección de un usuario. En este caso, la carta que se desea añadir a la colección deberá venir especificada en formato JSON en el cuerpo de la petición. El usuario deberá indicarse en la query string de la petición.

- delete: Para eliminar una carta de la colección de un usuario. En este caso, el ID de la carta que se desea eliminar vendrá dado, junto al usuario, como parámetros de la query string de la petición.

- patch: Para modificar la información de una carta existente en la colección de un usuario. En este caso, el ID de la carta que se desea modificar vendrá dado, junto al usuario, como parámetros de la query string de la petición. Además, la información a modificar se especificará en formato JSON en el cuerpo de la petición.

###

Dando como resultado este código:

```ts
const app = express();

app.use(express.json());

app.get("/cards", (req, res) => {
  if (!req.query.usuario) {
    res.send({
      status: "ERROR",
      answer: "Falta parametro de usuario en la solicitud",
    });
    return;
  }
  if (req.query.id) {
    MostrarCarta(
      req.query.usuario as string,
      parseInt(req.query.id as string),
      (error, result) => {
        if (error) {
          res.send(JSON.stringify({ status: "ERROR", answer: error }));
        } else {
          res.send(JSON.stringify({ status: "EXITO", answer: result }));
        }
      },
    );
  } else {
    CargarCartas(req.query.usuario as string, (error, result) => {
      if (error) {
        res.send(JSON.stringify({ status: "ERROR", answer: error }));
      } else {
        let respuesta: string = "";
        const resultado: Carta[] = result as Carta[];
        resultado.forEach((carta) => {
          respuesta += JSON.stringify(carta) + "\n";
        });
        res.send(JSON.stringify({ status: "EXITO", answer: respuesta }));
      }
    });
  }
});

app.post("/cards", (req, res) => {
  if (!req.query.usuario) {
    res.send({
      status: "ERROR",
      answer: "Falta parametro de usuario en la solicitud",
    });
  } else {
    ConversiorJSONaCarta(req.body, (errorCarta, carta) => {
      if (errorCarta) {
        res.send(JSON.stringify({ status: "ERROR", answer: errorCarta }));
      } else {
        GuardarCarta(
          req.query.usuario as string,
          carta as Carta,
          (error, result) => {
            if (error) {
              res.send(JSON.stringify({ status: "ERROR", answer: error }));
            } else {
              res.send(JSON.stringify({ status: "EXITO", answer: result }));
            }
          },
        );
      }
    });
  }
});

app.delete("/cards", (req, res) => {
  if (!req.query.usuario) {
    res.send({
      status: "ERROR",
      answer: "Falta parametro de usuario en la solicitud",
    });
    return;
  }
  if (!req.query.id) {
    res.send({
      status: "ERROR",
      answer: "Falta parametro de id en la solicitud",
    });
  } else {
    EliminarCarta(
      req.query.usuario as string,
      parseInt(req.query.id as string),
      (error, result) => {
        if (error) {
          res.send(JSON.stringify({ status: "ERROR", answer: error }));
        } else {
          res.send(JSON.stringify({ status: "EXITO", answer: result }));
        }
      },
    );
  }
});

app.patch("/cards", (req, res) => {
  if (!req.query.usuario) {
    res.send({
      status: "ERROR",
      answer: "Falta parametro de usuario en la solicitud",
    });
    return;
  }
  if (!req.query.id) {
    res.send({
      status: "ERROR",
      answer: "Falta parametro de id en la solicitud",
    });
  } else {
    // Verifica si el id en el cuerpo coincide con el id en la cadena de consulta
    if (parseInt(req.query.id as string) !== req.body.id) {
      res.send({
        status: "ERROR",
        answer:
          "La identificación en el cuerpo debe ser la misma que la de la cadena de consulta.",
      });
      return;
    }
    // Llama a la función para modificar la carta
    ConversiorJSONaCarta(req.body, (errorCarta, carta) => {
      if (errorCarta) {
        res.send(JSON.stringify({ status: "ERROR", answer: errorCarta }));
      } else {
        console.log(MostrarCartas(JSON.stringify(carta)));
        ActualizarCarta(
          req.query.usuario as string,
          parseInt(req.query.id as string),
          carta as Carta,
          (error, result) => {
            if (error) {
              res.send(JSON.stringify({ status: "ERROR", answer: error }));
            } else {
              res.send(JSON.stringify({ status: "EXITO", answer: result }));
            }
          },
        );
      }
    });
  }
});

app.listen(3000, () => {
  console.log("El servidor está activo en el puerto 3000.");
});
```

Se procede a explicar la estructura que sigo en las peticiones HTTP con Express en este caso es una estructura clara y bien organizada que sigue los principios de enrutamiento y manejo de solicitudes de Express.

En primer lugar, inicializamos una instancia de Express para crear nuestro servidor. Luego, establecemos una ruta en **./cards** para manejar diversas solicitudes HTTP.

Asociamos diferentes tipos de solicitudes con esta ruta para realizar acciones específicas. Es decir, inspeccionamos los parámetros de la **query string** para determinar qué acción tomar.

Para la solicitud GET, verificamos el número de parámetros en la query string para discernir entre realizar la acción de `MostrarCarta` o `CargarCartas`. Si se busca visualizar una carta específica, examinamos el campo **'id'** en la **query string** para identificarla.

Todas las respuestas del servidor están en formato JSON y siguen la misma estructura
`{ status, answer }`.
El campo **status**: indica si la operación fue exitosa o si ocurrió un error.
El campo **answer**: proporciona detalles adicionales o el resultado de la operación, en el caso de las solicitudes GET donde se llama a la funcion **JSON.stringify** objeto `Carta` o `Carta[]` en una cadena JSON.

He implementado una función denominada `ConversiorJSONaCarta` con el propósito de convertir objetos JSON provenientes del **body** de las solicitudes en instancias de la clase Carta. Esta abstracción resulta sumamente útil para gestionar datos en formato JSON en las solicitudes entrantes del servidor, facilitando así su manipulación como objetos dentro del código. Este enfoque, además de proporcionar una mayor robustez a la aplicación, simplifica el proceso de recepción y manipulación de datos.

```ts
export function ConversiorJSONaCarta(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nueva_carta: any,
  callback: (error: Error | undefined, carta: Carta | undefined) => void,
): void {
  console.log(`Creando carta que contiene ${nueva_carta.id}`);
  try {
    const cartas_magicas = new Carta(
      nueva_carta.id,
      nueva_carta.nombre,
      nueva_carta.coste_mana,
      nueva_carta.color,
      nueva_carta.lineatipo,
      nueva_carta.rareza,
      nueva_carta.reglas,
      nueva_carta.fuerza,
      nueva_carta.Resistencia,
      nueva_carta.loyalty,
      nueva_carta.valor_mercado,
    );

    callback(undefined, cartas_magicas);
  } catch (error) {
    callback(error, undefined);
  }
}
```

Y por ultimo se realizo las prubas unitarias de los distintas peticiones con request.

```ts
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
  ...
```

# Conclusion

En conclusion, está práctica me ha ayudado a entender la imprementación de servidor HTTP utilizando Express, asímismo he entendido el significado y la aplicación práctica de los distintos verbos HTTP(GET,POST, DELETE, PATCH), así como la importancia de emplear adecuadamente el patrón callback siendo más estructurada y facil de redirigir información de salida al cliente. 

Una de las dificultades qe me encontre durante la realización de la práctica fue la conversion formato JSON en objetos de tipo `Carta`. Inicialmente, no estaba claro por qué se requería un conversor para realizar esta tarea, y tuve dificultades ya que no se me guardaba nada solo se creaba el fichero. Y no sabia como implementarlo asi que busque recursos y supe realizar el ejercicio.

# Bibliografia 


https://mauriciogc.medium.com/express-parte-ii-peticiones-http-get-put-post-delete-bac2b9670dd

https://stackoverflow.com/questions/72723644/parsing-body-from-request-to-class-in-express

https://nodejs.org/docs/latest/api/fs.html



