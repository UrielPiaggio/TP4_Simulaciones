import { Queue } from "typescript-collections";
import { Servidor } from "../../../back-end/src/models/Servidor";
import { Cliente } from "../../../back-end/src/models/Cliente";

export class TipoServidor {
  private nombre: string;
  private servidores: Servidor[];
  private cola: Queue<Cliente>;
  private cliente : Cliente;
  private tasaLlegada: number;
  private proximaLlegada: number;
  private finAtencion: number;


  constructor(nombre: string, cantidad: number, tpoAten: number, tasaLlegada:number) {
    this.nombre = nombre;
    this.servidores = [];
    this.cola = new Queue<Cliente>();
    this.tasaLlegada = tasaLlegada

    for (let i = 0; i < cantidad; i++) {
      this.servidores.push(new Servidor(tpoAten));
    }
  }
  
//crear un nuevo cliente si el reloj === 0 lo guarda en uan variable para que cuadno llegue el 
//turno del evento se cambie el estado del servidor a ocupado 
  public crearCliente(reloj : number){
  }

  public llegadaCliente(reloj: number): void {
    const cliente_proximo = new Cliente(reloj, this.tasaLlegada)
    const servidorLibre = this.servidores.find(servidor => servidor.esta_libre())
    if(servidorLibre){
      servidorLibre.atenderCliente(this.cliente, reloj)
      this.finAtencion = servidorLibre.getFinAtencion()
    }else{
      this.cliente.setInicioCola(reloj)
      this.cola.enqueue(this.cliente)

    }
    this.cliente = cliente_proximo
    this.proximaLlegada = this.cliente.getHorallegada()
    }


    

        
      }


    }




    
  }

  public finAtencion(){

  }
}
