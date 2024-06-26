import chalk from "chalk";

/**
 * Enumeración de colores de las cartas.
 */
export enum Color {
  Blanco = "Blanco",
  Azul = "Azul",
  Negro = "Negro",
  Rojo = "Rojo",
  Verde = "Verde",
  Incoloro = "Incoloro",
  Multicolor = "Multicolor",
}

/**
 * Enumeración de los tipos de línea de las cartas.
 */
export enum LineaTipo {
  Tierra = "Tierra",
  Criatura = "Criatura",
  Encantamiento = "Encantamiento",
  Conjuro = "Conjuro",
  Instantaneo = "Instantaneo",
  Artefacto = "Artefacto",
  Planeswalker = "Planeswalker",
}

/**
 * Enumeración de las rarezas de las cartas.
 */
export enum Rareza {
  Comun = "Comun",
  Infrecuente = "Infrecuente",
  Rara = "Rara",
  Mitica = "Mitica",
}

/**
 * Interfaz que representa una carta.
 * @param id
 */
export interface Interfazcarta {
  id: number;
  nombre: string;
  costeMana: number;
  color: Color;
  Lineatipo: LineaTipo;
  rareza: Rareza;
  textoReglas: string;
  fuerza: number | undefined;
  resistencia: number | undefined;
  marcasLealtad: number | undefined;
  valorMercado: number;
}

export class Carta implements Interfazcarta {
  /**
   * Constructor de la clase Card.
   * @param id El ID de la carta.
   * @param nombre El nombre de la carta.
   * @param costemana El coste de mana de la carta.
   * @param color El color de la carta.
   * @param lineatipo El tipo de la carta.
   * @param rareza La rareza de la carta.
   * @param reglas Las reglas de la carta.
   * @param fuerza El poder de la carta (solo para criaturas).
   * @param resistencia La resistencia de la carta (solo para criaturas).
   * @param marcasLealtad La lealtad de la carta (solo para planeswalkers).
   * @param valorMercado El valor de la carta.
   */
  constructor(
    public id: number,
    public nombre: string,
    public costemana: number,
    public color: Color,
    public lineatipo: LineaTipo,
    public rareza: Rareza,
    public reglas: string,
    public fuerza: number | undefined,
    public resistencia: number | undefined,
    public marcasLealtad: number | undefined,
    public valorMercado: number,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.costemana = costemana;
    this.color = color;
    this.lineatipo = lineatipo;
    this.rareza = rareza;
    if (this.lineatipo === LineaTipo.Criatura) {
      if (fuerza === undefined || resistencia === undefined) {
        throw new Error(
          "Una carta del tipo CRIATURA debe de tener asociada un atributo de fuerza/resistencia.",
        );
      }
      this.fuerza = fuerza;
      this.resistencia = resistencia;
    } else if (this.lineatipo === LineaTipo.Planeswalker) {
      if (marcasLealtad === undefined) {
        throw new Error(
          "Una carta del tipo PLANESWALKER debe de tener asociada un atributo de lealtad.",
        );
      }
      this.marcasLealtad = marcasLealtad;
    }
    this.valorMercado = valorMercado;
  }
  costeMana: number;
  Lineatipo: LineaTipo;
  textoReglas: string;

}


