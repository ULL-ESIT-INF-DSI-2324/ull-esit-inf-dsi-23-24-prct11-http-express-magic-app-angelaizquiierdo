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
   * Constructor de la clase nueva_carta.
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
    this.costeMana = costemana;
    this.color = color;
    this.lineatipo = lineatipo;
    this.rareza = rareza;
    this.textoReglas = reglas;
    this.valorMercado = valorMercado;
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

/**
 * Funcion que convierte un objeto JSON en un objeto de carta.
 * @param nueva_carta  El objeto JSON que contiene la información de la carta.
 * @param callback  La función de retorno que se llamará cuando se complete la conversión.
 */
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

/**
 * Muestra los detalles de una carta.
 * @param carta - La carta a mostrar.
 */
export function MostrarCartas(carta: string): void {
  if (!carta || carta.trim() === "{}") {
    console.log("No hay contenido de carta para mostrar.");
    return;
  }

  const carta_json = JSON.parse(carta); // Convertir el string a JSON

  let resultado = "";
  resultado += `Id: ${carta_json.id}\n`;
  resultado += `Nombre: ${carta_json.nombre}\n`;
  resultado += `Coste de maná: ${carta_json.coste_mana}\n`;
  resultado += `Color: ${carta_json.color}\n`;
  resultado += `Linea de tipo: ${carta_json.tipo}\n`;
  resultado += `Rareza: ${carta_json.rareza}\n`;
  resultado += `Texto de reglas: ${carta_json.texto_reglas}\n`;
  if (carta_json.tipo === "Criatura") {
    // Mostrar la fuerza y resistencia de la criatura
    resultado += `Fuerza: ${carta_json.fuerza}\n`;
    resultado += `Resistencia: ${carta_json.resistencia}\n`;
  }
  if (carta_json.tipo === "Planeswalker") {
    // Mostrar las marcas de lealtad del planeswalker
    resultado += `Marcas de lealtad: ${carta_json.marcas_lealtad}\n`;
  }
  resultado += `Valor de mercado: ${carta_json.valor_mercado}\n`;

  switch (
    carta_json.color // Mostrar el color de la carta
  ) {
    case "Blanco":
      console.log(chalk.white(resultado));
      break;
    case "Azul":
      console.log(chalk.blue(resultado));
      break;
    case "Negro":
      console.log(chalk.black(resultado));
      break;
    case "Rojo":
      console.log(chalk.red(resultado));
      break;
    case "Verde":
      console.log(chalk.green(resultado));
      break;
    case "Incoloro":
      console.log(chalk.gray(resultado));
      break;
    case "Multicolor":
      console.log(chalk.yellow(resultado));
      break;
    default:
      console.log(chalk.red("No se reconoce el color!"));
      break;
  }
}
