import { Cliente } from "../../../back-end/src/models/Cliente";
import { TipoServicio } from "../../../back-end/src/models/TipoServicio";

export class Gestor_simulacion {
  private cliente: Cliente;
  private servicios: TipoServicio[];
  private reloj: number;

  constructor(cantiad_servidores: Array<number>, tpoAten: Array<number>) {
    this.reloj = 0;
    this.servicios = [];
    this.servicios.push(
      new TipoServicio("Envio Paquetes"),
      cantiad_servidores[0],
      tpoAten[0]
    );
    this.servicios.push(
      new TipoServicio("Reclamos y devoluciones"),
      cantiad_servidores[1],
      tpoAten[1]
    );
    this.servicios.push(
      new TipoServicio("Venta de sellos y sobres"),
      cantiad_servidores[2],
      tpoAten[2]
    );
    this.servicios.push(
      new TipoServicio("Atencion Empresarial"),
      cantiad_servidores[3],
      tpoAten[3]
    );
    this.servicios.push(
      new TipoServicio("Postales y Envios Especiales"),
      cantiad_servidores[4],
      tpoAten[4]
    );

    this.eventoInicial();
  }

  public eventoInicial() {}

  /*public proximoEvento(): void {
    let tpoAten: number;
    if (this.cliente.getHorallegada() < this.servidor.getFinAtencion()) {
      if (this.servidor.esta_libre()) {
        this.servidor.ocupado(this.reloj);
      } else {
        this.servidor.agregarAcola(this.cliente);
      }
    } else {
    }
  }

  public estaServidor(): boolean {
    return this.servidor.esta_libre();
  }*/
}
