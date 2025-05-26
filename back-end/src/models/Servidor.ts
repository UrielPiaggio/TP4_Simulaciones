import { Queue } from "typescript-collections";
import { Cliente } from "../../../back-end/src/models/Cliente";

export class Servidor {
  private tiempoAtencion: number; //tiempo que tarda el servidor en atender a un cliente
  private tiempoFinAtencion: number;
  private cliente: Cliente;

  constructor(tpoAten: number) {
    this.tiempoFinAtencion = 0;
    this.tiempoAtencion = tpoAten;
  }

  public esta_libre(): boolean {
    if (this.tiempoFinAtencion == 0) {
      return true;
    }
    return false;
  }

  public libre() {
    this.tiempoFinAtencion = 0;
  }

  public getFinAtencion(): number {
    return this.tiempoFinAtencion;
  }
  public atenderCliente(cliente: Cliente, reloj: number): void {
    this.cliente = cliente;

    this.tiempoFinAtencion = reloj + this.tiempoAtencion;
    this.cliente.setFinAtencion(this.tiempoFinAtencion);
  }

  //logica de fin de atencion cliente mirar filminas

  public finAtencionCliente(cola: Queue<Cliente>, reloj: number): void {
    if (cola.isEmpty()) {
      this.tiempoFinAtencion = 0;
    } else {
      this.cliente = cola.dequeue();

      this.cliente.setFinCola(reloj);
      this.tiempoFinAtencion = reloj + this.tiempoAtencion;
    }
  }
}
