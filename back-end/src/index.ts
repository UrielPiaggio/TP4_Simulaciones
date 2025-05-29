import { Random } from "random"
import { exponencial, uniforme, normal, poisson } from "./distribuciones"

type Evento = {
  nombre: string
  horario: number
}

const random = new Random()

function encontrarClienteMasAntiguo(
  colas,
  empleadosLibres
): { evento: Evento; cola: Evento[] } {
  // Evento de referencia inicial
  let clienteMasAntiguo = {
    nombre: "MADE IN HEAVEN",
    horario: Infinity,
  }
  let colaClienteMasAntigo = null

  // Definir las colas y sus empleados correspondientes
  const configuracionColas = [
    {
      cola: colas.colaEnvioPaquetes,
      empleadosLibres: empleadosLibres.empleadosEnvioPaquetesLibres,
    },
    {
      cola: colas.colaRyD,
      empleadosLibres: empleadosLibres.empleadosRyDLibres,
    },
    {
      cola: colas.colaSyS,
      empleadosLibres: empleadosLibres.empleadosSySLibres,
    },
    {
      cola: colas.colaEmpresarial,
      empleadosLibres: empleadosLibres.empleadosEmpresarialLibres,
    },
    {
      cola: colas.colaPyES,
      empleadosLibres: empleadosLibres.empleadosPyESLibres,
    },
  ]

  // Iterar sobre cada configuración de cola
  configuracionColas.forEach(({ cola, empleadosLibres }) => {
    if (cola.length > 0 && empleadosLibres > 0) {
      const clienteMasAñejo = cola.find(
        (evento) => evento.horario < clienteMasAntiguo.horario
      )
      if (clienteMasAñejo) {
        clienteMasAntiguo = clienteMasAñejo
        colaClienteMasAntigo = cola
      }
    }
  })

  return {
    evento: clienteMasAntiguo,
    cola: colaClienteMasAntigo ? colaClienteMasAntigo : [],
  }
}

function seleccionDeEventoMasTemprano(
  evento1: Evento,
  cola1: Evento[],
  evento2: Evento,
  cola2: Evento[],
  tiempoSimulacion?: number
): Evento {
  let siguienteEvento: Evento = evento1

  if (evento1.horario <= evento2.horario) {
    siguienteEvento = evento1
    const indice = cola1.indexOf(evento1)
    if (indice !== -1) {
      cola1.splice(indice, 1)
    }
  } else {
    siguienteEvento = evento2
    const indice = cola2.indexOf(evento2)
    if (indice !== -1) {
      cola2.splice(indice, 1)
    }
  }
  return siguienteEvento
}

export function simulacionCorreo(cantidadVueltasSimulacion: number) {
  // Variables útiles para la detección del evento más cercano
  let colaSiguienteClienteEnEspera: Evento[] = []

  // Tiempos de atencion que podran ser pasados por parametro pero por pruebas estan fijos

  const tiempoAtencionEnvioPaquetes = 1 / 10
  const tiempoAtencionRyD = 1 / 7
  const tiempoVentaSyS = 1 / 18
  const tiempoAtencionEmpresarial = 1 / 5
  const tiempoAtencionPyES = 1 / 3

  // Tiempos de llegada de clientes que podrian ser pasados por parametro pero por pruebas estan fijos
  const tiempoLlegadaEnvioPaquetes = {
    distribucion: "exponencial",
    media: 1 / 25,
  }
  const tiempoLlegadaRyD = { distribucion: "exponencial", media: 1 / 15 }
  const tiempoLlegadaSyS = { distribucion: "exponencial", media: 1 / 30 }
  const tiempoLlegadaEmpresarial = {
    distribucion: "exponencial",
    media: 1 / 10,
  }
  const tiempoLlegadaPyES = { distribucion: "exponencial", media: 1 / 8 }

  // Cantidad de empleados por area que podrian ser pasados por parametro pero por pruebas estan fijos
  const empleadosEnvioPaquetes = 3
  let empleadosEnvioPaquetesLibres = 3

  const empleadosRyD = 2
  let empleadosRyDLibres = 2

  const empleadosSyS = 3
  let empleadosSySLibres = 3

  const empleadosEmpresarial = 2
  let empleadosEmpresarialLibres = 2

  const empleadosPyES = 1
  let empleadosPyESLibres = 1

  // Acumuladores de tiempo

  // Acumuladores de tiempo de espera de clientes
  let tiempoEsperaEnvioPaquetes = 0
  let tiempoEsperaRyD = 0
  let tiempoEsperaSyS = 0
  let tiempoEsperaEmpresarial = 0
  let tiempoEsperaPyES = 0

  //Acumuladores de servidores

  let tiempoOcupadosEnvioPaquetes = 0
  let tiempoOcupadosRyD = 0
  let tiempoOcupadosSyS = 0
  let tiempoOcupadosEmpresarial = 0
  let tiempoOcupadosPyES = 0

  // Horarios de clientes por llegar a cada area
  let horarioLlegadaClientesEnvioPaquetes: number = 0
  let horarioLlegadaClientesRyD: number = 0
  let horarioLlegadaClientesSyS: number = 0
  let horarioLlegadaClientesEmpresarial: number = 0
  let horarioLlegadaClientesPyES: number = 0

  // Horarios de fin de atencion de clientes de cada servicio
  let horarioFinAtencionEnvioPaquetes: number = 0
  let horarioFinAtencionRyD: number = 0
  let horarioFinAtencionSyS: number = 0
  let horarioFinAtencionEmpresarial: number = 0
  let horarioFinAtencionPyES: number = 0

  // Array de proximos eventos
  const eventos: Evento[] = []

  // Tiempo
  let tiempoSimulacion = 0

  // Colas
  const colaEnvioPaquetes: Evento[] = []
  const colaRyD: Evento[] = []
  const colaSyS: Evento[] = []
  const colaEmpresarial: Evento[] = []
  const colaPyES: Evento[] = []

  for (let i = 0; i < cantidadVueltasSimulacion; i++) {
    console.log("Iteración: ", i)
    if (i === 0) {
      // Inicializamos los horarios de llegada de clientes
      horarioLlegadaClientesEnvioPaquetes = exponencial(
        tiempoLlegadaEnvioPaquetes.media,
        random.float()
      )
      eventos.push({
        nombre: "Llegada Cliente EnvioPaquetes",
        horario: parseFloat(horarioLlegadaClientesEnvioPaquetes.toFixed(4)),
      })

      horarioLlegadaClientesRyD = exponencial(
        tiempoLlegadaRyD.media,
        random.float()
      )
      eventos.push({
        nombre: "Llegada Cliente RyD",
        horario: parseFloat(horarioLlegadaClientesRyD.toFixed(4)),
      })
      horarioLlegadaClientesSyS = exponencial(
        tiempoLlegadaSyS.media,
        random.float()
      )
      eventos.push({
        nombre: "Llegada Cliente SyS",
        horario: parseFloat(horarioLlegadaClientesSyS.toFixed(4)),
      })
      horarioLlegadaClientesEmpresarial = exponencial(
        tiempoLlegadaEmpresarial.media,
        random.float()
      )
      eventos.push({
        nombre: "Llegada Cliente Empresarial",
        horario: parseFloat(horarioLlegadaClientesEmpresarial.toFixed(4)),
      })
      horarioLlegadaClientesPyES = exponencial(
        tiempoLlegadaPyES.media,
        random.float()
      )
      eventos.push({
        nombre: "Llegada Cliente PyES",
        horario: parseFloat(horarioLlegadaClientesPyES.toFixed(4)),
      })
    } else {
      if (
        !eventos.find(
          (evento) => evento.nombre === "Llegada Cliente EnvioPaquetes"
        )
      ) {
        horarioLlegadaClientesEnvioPaquetes = exponencial(
          tiempoLlegadaEnvioPaquetes.media,
          random.float()
        )
        eventos.push({
          nombre: "Llegada Cliente EnvioPaquetes",
          horario: parseFloat(
            (tiempoSimulacion + horarioLlegadaClientesEnvioPaquetes).toFixed(4)
          ),
        })
      }

      if (!eventos.find((evento) => evento.nombre === "Llegada Cliente RyD")) {
        horarioLlegadaClientesRyD = exponencial(
          tiempoLlegadaRyD.media,
          random.float()
        )
        eventos.push({
          nombre: "Llegada Cliente RyD",
          horario: parseFloat(
            (tiempoSimulacion + horarioLlegadaClientesRyD).toFixed(4)
          ),
        })
      }
      if (!eventos.find((evento) => evento.nombre === "Llegada Cliente SyS")) {
        horarioLlegadaClientesSyS = exponencial(
          tiempoLlegadaSyS.media,
          random.float()
        )
        eventos.push({
          nombre: "Llegada Cliente SyS",
          horario: parseFloat(
            (tiempoSimulacion + horarioLlegadaClientesSyS).toFixed(4)
          ),
        })
      }
      if (
        !eventos.find(
          (evento) => evento.nombre === "Llegada Cliente Empresarial"
        )
      ) {
        horarioLlegadaClientesEmpresarial = exponencial(
          tiempoLlegadaEmpresarial.media,
          random.float()
        )
        eventos.push({
          nombre: "Llegada Cliente Empresarial",
          horario: parseFloat(
            (tiempoSimulacion + horarioLlegadaClientesEmpresarial).toFixed(4)
          ),
        })
      }
      if (!eventos.find((evento) => evento.nombre === "Llegada Cliente PyES")) {
        horarioLlegadaClientesPyES = exponencial(
          tiempoLlegadaPyES.media,
          random.float()
        )
        eventos.push({
          nombre: "Llegada Cliente PyES",
          horario: parseFloat(
            (tiempoSimulacion + horarioLlegadaClientesPyES).toFixed(4)
          ),
        })
      }
      const resultadoClienteMasAntiguo = encontrarClienteMasAntiguo(
        { colaEnvioPaquetes, colaRyD, colaSyS, colaEmpresarial, colaPyES },
        {
          empleadosEnvioPaquetesLibres,
          empleadosRyDLibres,
          empleadosSySLibres,
          empleadosEmpresarialLibres,
          empleadosPyESLibres,
        }
      )

      let posibleSiguienteEventoCola: Evento = resultadoClienteMasAntiguo.evento

      colaSiguienteClienteEnEspera = resultadoClienteMasAntiguo.cola

      // Buscamos el evento más cercano en la lista de eventos
      let posibleSiguienteEvento = eventos.find(
        (evento) =>
          evento.horario === Math.min(...eventos.map((e) => e.horario))
      )

      if (!posibleSiguienteEvento) {
        console.log("No hay más eventos por procesar.")
        break
      }

      // Comprobamos si cual de los 2 eventos más cercanos es el que se ejecuta, si el de las colas atendibles o el de la lista de eventos
      let siguienteEvento: Evento | null = seleccionDeEventoMasTemprano(
        posibleSiguienteEvento,
        eventos,
        posibleSiguienteEventoCola,
        colaSiguienteClienteEnEspera
      )

      if (siguienteEvento.horario > tiempoSimulacion) {
        tiempoSimulacion = parseFloat(siguienteEvento.horario.toFixed(4))
      }

      console.log("Tiempo de simulación: ", tiempoSimulacion)
      console.log("Siguiente evento a ocurrir: ", siguienteEvento)

      const eventoNombre = siguienteEvento.nombre.split(" ")

      switch (eventoNombre[0]) {
        case "Llegada":
          switch (eventoNombre[2]) {
            case "EnvioPaquetes":
              if (empleadosEnvioPaquetesLibres > 0) {
                empleadosEnvioPaquetesLibres--
                horarioFinAtencionEnvioPaquetes = parseFloat(
                  (tiempoSimulacion + tiempoAtencionEnvioPaquetes).toFixed(4)
                )
                tiempoOcupadosEnvioPaquetes += tiempoAtencionEnvioPaquetes
                tiempoEsperaEnvioPaquetes +=
                  tiempoSimulacion - siguienteEvento.horario
                console.log(
                  "Espera de este cliente",
                  (tiempoSimulacion - siguienteEvento.horario).toFixed(4)
                )
                eventos.push({
                  nombre: "Fin Atencion EnvioPaquetes",
                  horario: horarioFinAtencionEnvioPaquetes,
                })
              } else {
                colaEnvioPaquetes.push(siguienteEvento)
              }
              break
            case "RyD":
              if (empleadosRyDLibres > 0) {
                empleadosRyDLibres--
                horarioFinAtencionRyD = parseFloat(
                  (tiempoSimulacion + tiempoAtencionRyD).toFixed(4)
                )
                tiempoOcupadosRyD += tiempoAtencionRyD
                tiempoEsperaRyD += tiempoSimulacion - siguienteEvento.horario
                console.log(
                  "Espera de este cliente",
                  tiempoSimulacion - siguienteEvento.horario
                )

                eventos.push({
                  nombre: "Fin Atencion RyD",
                  horario: horarioFinAtencionRyD,
                })
              } else {
                colaRyD.push(siguienteEvento)
              }
              break
            case "SyS":
              if (empleadosSySLibres > 0) {
                empleadosSySLibres--
                horarioFinAtencionSyS = parseFloat(
                  (tiempoSimulacion + tiempoVentaSyS).toFixed(4)
                )
                tiempoOcupadosSyS += tiempoVentaSyS
                tiempoEsperaSyS += tiempoSimulacion - siguienteEvento.horario
                console.log(
                  "Espera de este cliente",
                  tiempoSimulacion - siguienteEvento.horario
                )

                eventos.push({
                  nombre: "Fin Atencion SyS",
                  horario: horarioFinAtencionSyS,
                })
              } else {
                colaSyS.push(siguienteEvento)
              }
              break
            case "Empresarial":
              if (empleadosEmpresarialLibres > 0) {
                empleadosEmpresarialLibres--
                horarioFinAtencionEmpresarial = parseFloat(
                  (tiempoSimulacion + tiempoAtencionEmpresarial).toFixed(4)
                )
                tiempoOcupadosEmpresarial += tiempoAtencionEmpresarial
                tiempoEsperaEmpresarial +=
                  tiempoSimulacion - siguienteEvento.horario
                console.log(
                  "Espera de este cliente",
                  tiempoSimulacion - siguienteEvento.horario
                )
                eventos.push({
                  nombre: "Fin Atencion Empresarial",
                  horario: horarioFinAtencionEmpresarial,
                })
              } else {
                colaEmpresarial.push(siguienteEvento)
              }
              break
            case "PyES":
              if (empleadosPyESLibres > 0) {
                empleadosPyESLibres--
                horarioFinAtencionPyES = parseFloat(
                  (tiempoSimulacion + tiempoAtencionPyES).toFixed(4)
                )
                tiempoOcupadosPyES += tiempoAtencionPyES
                tiempoEsperaPyES += tiempoSimulacion - siguienteEvento.horario
                console.log(
                  "Espera de este cliente",
                  tiempoSimulacion - siguienteEvento.horario
                )
                eventos.push({
                  nombre: "Fin Atencion PyES",
                  horario: horarioFinAtencionPyES,
                })
              } else {
                colaPyES.push(siguienteEvento)
              }
              break
          }
          break
        case "Fin":
          switch (eventoNombre[2]) {
            case "EnvioPaquetes":
              empleadosEnvioPaquetesLibres++
              break
            case "RyD":
              empleadosRyDLibres++
              break
            case "SyS":
              empleadosSySLibres++
              break
            case "Empresarial":
              empleadosEmpresarialLibres++
              break
            case "PyES":
              empleadosPyESLibres++
              break
          }
      }
    }
  }
  console.log(eventos)
}
simulacionCorreo(15)
