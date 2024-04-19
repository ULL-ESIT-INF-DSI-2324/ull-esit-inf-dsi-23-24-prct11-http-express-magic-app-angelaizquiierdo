import express from "express";

import {
  GuardarCarta,
  CargarCartas,
  MostrarCarta,
  EliminarCarta,
} from "./gestor_cartas.js";

const app = express();

app.use(express.json());

/**
 * Retrieves information about a card from a user's collection or lists all cards in their collection.
 * In this case, the card ID will be provided, along with the user, as parameters in the query string of the request.
 * If a specific ID is not specified, it indicates that the complete collection of cards for the user is desired.
 */
app.get("/usuarios", (req, res) => {
  if (!req.query.user) {
    res.send({
      status: "Error",
      answer: "Se necesita el usuario",
    });
    return;
  }
  if (req.query.id) {
    MostrarCarta(
      req.query.user as string,
      parseInt(req.query.id as string),
      (error, result) => {
        if (error) {
          res.send(JSON.stringify({ status: "Error", answer: error }));
        } else {
          res.send(JSON.stringify({ status: "Success", answer: result }));
        }
      },
    );
  } else {
    CargarCartas(req.query.user as string, (error, result) => {
      if (error) {
        res.send(JSON.stringify({ status: "Error", answer: error }));
      } else {
        res.send(JSON.stringify({ status: "Success", answer: result }));
      }
    });
  }
});

/**
 * Adds a card to a user's collection.
 * In this case, the card to be added to the collection should be specified in JSON format in the request body.
 * The user should be indicated in the query string of the request.
 */
app.post("/cards", (req, res) => {
  if (!req.query.user) {
    res.send({
      status: "Error",
      answer: "An user has to be provided",
    });
  } else {
    GuardarCarta(req.query.user as string, req.body, (error, result) => {
      if (error) {
        res.send(JSON.stringify({ status: "Error", answer: error }));
      } else {
        res.send(JSON.stringify({ status: "Success", answer: result }));
      }
    });
  }
});

/**
 * Deletes a card from a user's collection.
 * In this case, the card ID to be deleted will be provided, along with the user, as parameters in the query string of the request.
 */
app.delete("/cards", (req, res) => {
  if (!req.query.user) {
    res.send({
      status: "Error",
      answer: "An user has to be provided",
    });
    return;
  }
  if (!req.query.id) {
    res.send({
      status: "Error",
      answer: "An id has to be provided",
    });
  } else {
    EliminarCarta(
      req.query.user as string,
      parseInt(req.query.id as string),
      (error, result) => {
        if (error) {
          res.send(JSON.stringify({ status: "Error", answer: error }));
        } else {
          res.send(JSON.stringify({ status: "Success", answer: result }));
        }
      },
    );
  }
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
