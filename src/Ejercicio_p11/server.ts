import express from "express";

import {
  GuardarCarta,
  CargarCartas,
  MostrarCarta,
  EliminarCarta,
  ActualizarCarta,
} from "./gestor_cartas.js";
import { Carta, ConversiorJSONaCarta, MostrarCartas } from "./cartas_magic.js";

const app = express();

app.use(express.json());

/**
 * Recupera información sobre una tarjeta de la colección de un usuario o enumera todas las tarjetas de su colección.
 * En este caso, el ID de la tarjeta se proporcionará, junto con el usuario, como parámetros en la cadena de consulta de la solicitud.
 * Si no se especifica un ID específico indica que se desea la colección completa de tarjetas para el usuario.
 */
app.get("/cartas", (req, res) => {
  if (!req.query.usuario) {
    res.send({
      status: "ERROR",
      answer: "Se necesita el usuario",
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

/**
 * Agrega una tarjeta a la colección de un usuario.
 * En este caso, la tarjeta que se agregará a la colección deberá especificarse en formato JSON en el cuerpo de la solicitud.
 * El usuario debe estar indicado en la cadena de consulta de la solicitud.
 */
app.post("/cartas", (req, res) => {
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

/**
 * Elimina una tarjeta de la colección de un usuario.
 * En este caso, el ID de la tarjeta a eliminar se proporcionará, junto con el usuario, como parámetros en la cadena de consulta de la solicitud.
 */
app.delete("/cartas", (req, res) => {
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

/**
 * Modifica la información de una tarjeta existente en la colección de un usuario.
 * En este caso, el ID de la tarjeta a modificar se proporcionará, junto con el usuario, como parámetros en la cadena de consulta de la solicitud.
 *Adicionalmente la información a modificar se especificará en formato JSON en el cuerpo de la solicitud.
 */
app.patch("/cartas", (req, res) => {
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

// // Lógica para detener el servidor
// function stopServer() {
//   server.close(() => {
//     console.log("El servidor ha sido detenido.");
//   });
// }

// // Llama a la función stopServer para detener el servidor cuando sea necesario
// // Por ejemplo, cuando recibas una señal SIGINT (Ctrl + C)
// process.on("SIGINT", () => {
//   stopServer();
// });
