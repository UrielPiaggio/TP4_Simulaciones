import { Random } from "random"
import { exponencial, uniforme, normal, poisson } from "./distribuciones"

type Evento = {
  nombre: string
  horario: number
  horarioInicio?: number
}

type Resultados = {
  promediosEspera: {
    envioPaquetes: number
    ryD: number
    syS: number
    empresarial: number
    pyES: number
    nuevoServicio: number
  }
  promediosOcupacion: {
    envioPaquetes: number
    ryD: number
    syS: number
    empresarial: number
    pyES: number
    nuevoServicio: number
  }
}

const random = new Random()

function procesarColaServicio(
  cola: Evento[],
  empleadosLibres: number,
  tiempoAtencion: number,
  tiempoSimulacion: number,
  eventos: Evento[],
  nombreServicio: string
): number {
  let empleadosOcupados = 0

  while (cola.length > 0 && empleadosLibres > 0) {
    const cliente = cola.shift()!
    empleadosLibres--
    empleadosOcupados++

    const horarioFinAtencion = parseFloat(
      (tiempoSimulacion + tiempoAtencion).toFixed(4)
    )

    eventos.push({
      nombre: `Fin Atencion ${nombreServicio}`,
      horario: horarioFinAtencion,
      horarioInicio: tiempoSimulacion,
    })
  }

  return empleadosOcupados
}

export type Distribuciones = "exponencial" | "uniforme" | "normal" | "poisson"

export type TiempoLlegada = {
  distribucion: Distribuciones
  media: number
}

export function simulacionCorreo(
  tiempoMaximoSimulacion: number,
  tiemposAtencion: {
    tiempoAtencionEnvioPaquetes: number
    tiempoAtencionRyD: number
    tiempoVentaSyS: number
    tiempoAtencionEmpresarial: number
    tiempoAtencionPyES: number
  },
  tiemposLlegada: {
    tiempoLlegadaEnvioPaquetes: TiempoLlegada
    tiempoLlegadaRyD: TiempoLlegada
    tiempoLlegadaSyS: TiempoLlegada
    tiempoLlegadaEmpresarial: TiempoLlegada
    tiempoLlegadaPyES: TiempoLlegada
  },
  empleados: {
    empleadosEnvioPaquetes: number
    empleadosRyD: number
    empleadosSyS: number
    empleadosEmpresarial: number
    empleadosPyES: number
  },
  ausenciaEmpleadoEmpresarial: boolean
) {
  const {
    tiempoAtencionEnvioPaquetes,
    tiempoAtencionRyD,
    tiempoVentaSyS,
    tiempoAtencionEmpresarial,
    tiempoAtencionPyES,
  } = tiemposAtencion

  const {
    tiempoLlegadaEnvioPaquetes,
    tiempoLlegadaRyD,
    tiempoLlegadaSyS,
    tiempoLlegadaEmpresarial,
    tiempoLlegadaPyES,
  } = tiemposLlegada

  const {
    empleadosEnvioPaquetes,
    empleadosRyD,
    empleadosSyS,
    empleadosEmpresarial,
    empleadosPyES,
  } = empleados

  // Estados de empleados
  let empleadosEnvioPaquetesLibres = empleadosEnvioPaquetes
  let empleadosRyDLibres = empleadosRyD
  let empleadosSySLibres = empleadosSyS
  let empleadosEmpresarialLibres = empleadosEmpresarial
  let empleadosPyESLibres = empleadosPyES

  // Contadores de clientes atendidos
  let clientesAtendidosEnvioPaquetes = 0
  let clientesAtendidosRyD = 0
  let clientesAtendidosSyS = 0
  let clientesAtendidosEmpresarial = 0
  let clientesAtendidosPyES = 0

  // Acumuladores de tiempo de espera
  let tiempoEsperaEnvioPaquetes = 0
  let tiempoEsperaRyD = 0
  let tiempoEsperaSyS = 0
  let tiempoEsperaEmpresarial = 0
  let tiempoEsperaPyES = 0

  // Acumuladores de tiempo de ocupación
  let tiempoOcupadosEnvioPaquetes = 0
  let tiempoOcupadosRyD = 0
  let tiempoOcupadosSyS = 0
  let tiempoOcupadosEmpresarial = 0
  let tiempoOcupadosPyES = 0

  // Lista de eventos futuros
  const eventos: Evento[] = []

  // Colas de espera
  const colaEnvioPaquetes: Evento[] = []
  const colaRyD: Evento[] = []
  const colaSyS: Evento[] = []
  const colaEmpresarial: Evento[] = []
  const colaPyES: Evento[] = []

  let tiempoSimulacion = 0

  // Programar primeras llegadas
  eventos.push({
    nombre: "Llegada Cliente EnvioPaquetes",
    horario: exponencial(tiempoLlegadaEnvioPaquetes.media, random.float()),
  })
  eventos.push({
    nombre: "Llegada Cliente RyD",
    horario: exponencial(tiempoLlegadaRyD.media, random.float()),
  })
  eventos.push({
    nombre: "Llegada Cliente SyS",
    horario: exponencial(tiempoLlegadaSyS.media, random.float()),
  })
  eventos.push({
    nombre: "Llegada Cliente Empresarial",
    horario: exponencial(tiempoLlegadaEmpresarial.media, random.float()),
  })
  eventos.push({
    nombre: "Llegada Cliente PyES",
    horario: exponencial(tiempoLlegadaPyES.media, random.float()),
  })

  if (ausenciaEmpleadoEmpresarial) {
    eventos.push({
      nombre: "Ausencia Empleado Empresarial",
      horario: 1,
    })
  }

  while (tiempoSimulacion < tiempoMaximoSimulacion && eventos.length > 0) {
    // Encontrar el próximo evento
    eventos.sort((a, b) => a.horario - b.horario)
    const siguienteEvento = eventos.shift()!

    tiempoSimulacion = siguienteEvento.horario

    if (tiempoSimulacion > tiempoMaximoSimulacion) break

    const [accion, , servicio] = siguienteEvento.nombre.split(" ")

    if (accion === "Llegada") {
      // Programar próxima llegada del mismo tipo
      let proximaLlegada: number
      switch (servicio) {
        case "EnvioPaquetes":
          proximaLlegada = exponencial(
            tiempoLlegadaEnvioPaquetes.media,
            random.float()
          )
          eventos.push({
            nombre: "Llegada Cliente EnvioPaquetes",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "RyD":
          proximaLlegada = exponencial(tiempoLlegadaRyD.media, random.float())
          eventos.push({
            nombre: "Llegada Cliente RyD",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "SyS":
          proximaLlegada = exponencial(tiempoLlegadaSyS.media, random.float())
          eventos.push({
            nombre: "Llegada Cliente SyS",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "Empresarial":
          proximaLlegada = exponencial(
            tiempoLlegadaEmpresarial.media,
            random.float()
          )
          eventos.push({
            nombre: "Llegada Cliente Empresarial",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "PyES":
          proximaLlegada = exponencial(tiempoLlegadaPyES.media, random.float())
          eventos.push({
            nombre: "Llegada Cliente PyES",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
      }

      // Procesar llegada del cliente
      switch (servicio) {
        case "EnvioPaquetes":
          if (empleadosEnvioPaquetesLibres > 0) {
            empleadosEnvioPaquetesLibres--
            clientesAtendidosEnvioPaquetes++
            eventos.push({
              nombre: "Fin Atencion EnvioPaquetes",
              horario: tiempoSimulacion + tiempoAtencionEnvioPaquetes,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            colaEnvioPaquetes.push({
              ...siguienteEvento,
              horario: tiempoSimulacion,
            })
          }
          break
        case "RyD":
          if (empleadosRyDLibres > 0) {
            empleadosRyDLibres--
            clientesAtendidosRyD++
            eventos.push({
              nombre: "Fin Atencion RyD",
              horario: tiempoSimulacion + tiempoAtencionRyD,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            colaRyD.push({
              ...siguienteEvento,
              horario: tiempoSimulacion,
            })
          }
          break
        case "SyS":
          if (empleadosSySLibres > 0) {
            empleadosSySLibres--
            clientesAtendidosSyS++
            eventos.push({
              nombre: "Fin Atencion SyS",
              horario: tiempoSimulacion + tiempoVentaSyS,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            colaSyS.push({
              ...siguienteEvento,
              horario: tiempoSimulacion,
            })
          }
          break
        case "Empresarial":
          if (empleadosEmpresarialLibres > 0) {
            empleadosEmpresarialLibres--
            clientesAtendidosEmpresarial++
            eventos.push({
              nombre: "Fin Atencion Empresarial",
              horario: tiempoSimulacion + tiempoAtencionEmpresarial,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            colaEmpresarial.push({
              ...siguienteEvento,
              horario: tiempoSimulacion,
            })
          }
          break
        case "PyES":
          if (empleadosPyESLibres > 0) {
            empleadosPyESLibres--
            clientesAtendidosPyES++
            eventos.push({
              nombre: "Fin Atencion PyES",
              horario: tiempoSimulacion + tiempoAtencionPyES,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            colaPyES.push({
              ...siguienteEvento,
              horario: tiempoSimulacion,
            })
          }
          break
      }
    } else if (accion === "Fin") {
      // Procesar fin de atención
      const tiempoAtencionRealizado =
        tiempoSimulacion - siguienteEvento.horarioInicio!

      switch (servicio) {
        case "EnvioPaquetes":
          empleadosEnvioPaquetesLibres++
          tiempoOcupadosEnvioPaquetes += tiempoAtencionRealizado

          if (colaEnvioPaquetes.length > 0) {
            const clienteEnCola = colaEnvioPaquetes.shift()!
            empleadosEnvioPaquetesLibres--
            clientesAtendidosEnvioPaquetes++
            tiempoEsperaEnvioPaquetes +=
              tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion EnvioPaquetes",
              horario: tiempoSimulacion + tiempoAtencionEnvioPaquetes,
              horarioInicio: tiempoSimulacion,
            })
          }
          break
        case "RyD":
          empleadosRyDLibres++
          tiempoOcupadosRyD += tiempoAtencionRealizado

          if (colaRyD.length > 0) {
            const clienteEnCola = colaRyD.shift()!
            empleadosRyDLibres--
            clientesAtendidosRyD++
            tiempoEsperaRyD += tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion RyD",
              horario: tiempoSimulacion + tiempoAtencionRyD,
              horarioInicio: tiempoSimulacion,
            })
          }
          break
        case "SyS":
          empleadosSySLibres++
          tiempoOcupadosSyS += tiempoAtencionRealizado

          if (colaSyS.length > 0) {
            const clienteEnCola = colaSyS.shift()!
            empleadosSySLibres--
            clientesAtendidosSyS++
            tiempoEsperaSyS += tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion SyS",
              horario: tiempoSimulacion + tiempoVentaSyS,
              horarioInicio: tiempoSimulacion,
            })
          }
          break
        case "Empresarial":
          empleadosEmpresarialLibres++
          tiempoOcupadosEmpresarial += tiempoAtencionRealizado

          if (colaEmpresarial.length > 0) {
            const clienteEnCola = colaEmpresarial.shift()!
            empleadosEmpresarialLibres--
            clientesAtendidosEmpresarial++
            tiempoEsperaEmpresarial += tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion Empresarial",
              horario: tiempoSimulacion + tiempoAtencionEmpresarial,
              horarioInicio: tiempoSimulacion,
            })
          }
          break
        case "PyES":
          empleadosPyESLibres++
          tiempoOcupadosPyES += tiempoAtencionRealizado

          if (colaPyES.length > 0) {
            const clienteEnCola = colaPyES.shift()!
            empleadosPyESLibres--
            clientesAtendidosPyES++
            tiempoEsperaPyES += tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion PyES",
              horario: tiempoSimulacion + tiempoAtencionPyES,
              horarioInicio: tiempoSimulacion,
            })
          }
          break
      }
    } else if (accion === "Ausencia") {
      if (empleadosEmpresarialLibres > 0) {
        empleadosEmpresarialLibres--
        eventos.push({
          nombre: "Retorno Empleado Empresarial",
          horario: tiempoSimulacion + 0.2, // Simular retorno después de 1 unidad de tiempo
        })
      }
      eventos.push({
        nombre: "Ausencia Empleado Empresarial",
        horario: tiempoSimulacion + 1,
      })
    } else if (accion === "Retorno") {
      empleadosEmpresarialLibres++
      if (colaEmpresarial.length > 0) {
        const clienteEnCola = colaEmpresarial.shift()!
        empleadosEmpresarialLibres--
        clientesAtendidosEmpresarial++
        tiempoEsperaEmpresarial += tiempoSimulacion - clienteEnCola.horario
        eventos.push({
          nombre: "Fin Atencion Empresarial",
          horario: tiempoSimulacion + tiempoAtencionEmpresarial,
          horarioInicio: tiempoSimulacion,
        })
      }
    }
  }

  // Calcular resultados
  const resultados: Resultados = {
    promediosEspera: {
      envioPaquetes:
        clientesAtendidosEnvioPaquetes > 0
          ? parseFloat(
              (
                tiempoEsperaEnvioPaquetes / clientesAtendidosEnvioPaquetes
              ).toFixed(4)
            )
          : 0,
      ryD:
        clientesAtendidosRyD > 0
          ? parseFloat((tiempoEsperaRyD / clientesAtendidosRyD).toFixed(4))
          : 0,
      syS:
        clientesAtendidosSyS > 0
          ? parseFloat((tiempoEsperaSyS / clientesAtendidosSyS).toFixed(4))
          : 0,
      empresarial:
        clientesAtendidosEmpresarial > 0
          ? parseFloat(
              (tiempoEsperaEmpresarial / clientesAtendidosEmpresarial).toFixed(
                4
              )
            )
          : 0,
      pyES:
        clientesAtendidosPyES > 0
          ? parseFloat((tiempoEsperaPyES / clientesAtendidosPyES).toFixed(4))
          : 0,
      nuevoServicio: 0,
    },
    promediosOcupacion: {
      envioPaquetes: parseFloat(
        (
          tiempoOcupadosEnvioPaquetes /
          (tiempoSimulacion * empleadosEnvioPaquetes)
        ).toFixed(4)
      ),
      ryD: parseFloat(
        (tiempoOcupadosRyD / (tiempoSimulacion * empleadosRyD)).toFixed(4)
      ),
      syS: parseFloat(
        (tiempoOcupadosSyS / (tiempoSimulacion * empleadosSyS)).toFixed(4)
      ),
      empresarial: parseFloat(
        (
          tiempoOcupadosEmpresarial /
          (tiempoSimulacion * empleadosEmpresarial)
        ).toFixed(4)
      ),
      pyES: parseFloat(
        (tiempoOcupadosPyES / (tiempoSimulacion * empleadosPyES)).toFixed(4)
      ),
      nuevoServicio: 0,
    },
  }

  return resultados
}

// Ejemplo de uso
const resultados = simulacionCorreo(
  10000, // Tiempo máximo de simulación en lugar de número de iteraciones
  {
    tiempoAtencionEnvioPaquetes: 1 / 10,
    tiempoAtencionRyD: 1 / 7,
    tiempoVentaSyS: 1 / 18,
    tiempoAtencionEmpresarial: 1 / 5,
    tiempoAtencionPyES: 1 / 3,
  },
  {
    tiempoLlegadaEnvioPaquetes: {
      distribucion: "exponencial",
      media: 1 / 25,
    },
    tiempoLlegadaRyD: {
      distribucion: "exponencial",
      media: 1 / 15,
    },
    tiempoLlegadaSyS: {
      distribucion: "exponencial",
      media: 1 / 30,
    },
    tiempoLlegadaEmpresarial: {
      distribucion: "exponencial",
      media: 1 / 10,
    },
    tiempoLlegadaPyES: {
      distribucion: "exponencial",
      media: 1 / 8,
    },
  },
  {
    empleadosEnvioPaquetes: 3,
    empleadosRyD: 2,
    empleadosSyS: 3,
    empleadosEmpresarial: 2,
    empleadosPyES: 1,
  },
  true
)

console.log("Promedios de espera:", resultados.promediosEspera)
console.log("Promedios de ocupación:", resultados.promediosOcupacion)
