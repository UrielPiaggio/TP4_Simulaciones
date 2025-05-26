import { Estado } from "../../../back-end/src/models/Estado";
import { Servidor } from "../../../back-end/src/models/Servidor";
import random from "random";

export class Cliente {
  private horaLlegada: number;
  private tiempoInicioCola: number;
  private tiempoFinCola: number;
  private tiempo: number;
  private tiempoFinAtencion: number;

  constructor(reloj: number, media: number) {
    const tiempollegada = random.exponential(1 / media)();
    this.horaLlegada = reloj + tiempollegada;
  }

  public getHorallegada(): number {
    return this.horaLlegada;
  }

  public setInicioCola(valor: number) {
    this.tiempoInicioCola = valor;
  }

  public setFinCola(valor: number) {
    this.tiempoFinCola = valor;
  }
  public setFinAtencion(valor: number) {
    this.tiempoFinAtencion = valor;
  }
}
