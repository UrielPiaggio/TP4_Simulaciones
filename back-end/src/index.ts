import { Random } from "random"
import { exponencial, uniforme, normal, poisson } from "./distribuciones"

type Evento = {
  nombre: string
  horario: number
  horarioInicio?: number
  prioridad?: boolean
}

type Resultados = {
  promediosEspera: {
    envioPaquetes: number
    ryD: number
    syS: number
    empresarialAltaPrioridad: number
    empresarialBajaPrioridad: number
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
  cantidadMaximaEnCola: {
    envioPaquetes: number
    ryD: number
    syS: number
    empresarialAltaPrioridad: number
    empresarialBajaPrioridad: number
    pyES: number
    nuevoServicio: number
  }
  probabilidadClientesPaquetesAtendidosEnMasDe15: number
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
  ausenciaEmpleadoEmpresarial: boolean,
  nuevoServicio: {
    tiempoAtencion: number
    numeroEmpleados: number
    habilitado: boolean
  },
  prioridadEnEmpresarial: boolean
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
  let empleadosNuevoServicioLibres = nuevoServicio.habilitado
    ? nuevoServicio.numeroEmpleados
    : 0

  // Contadores de clientes atendidos
  let clientesAtendidosEnvioPaquetes = 0
  let clientesAtendidosRyD = 0
  let clientesAtendidosSyS = 0
  let clientesAtendidosEmpresarialAltaPrioridad = 0
  let clientesAtendidosEmpresarialBajaPrioridad = 0
  let clientesAtendidosPyES = 0
  let clientesAtendidosNuevoServicio = 0

  // Acumuladores de tiempo de espera
  let tiempoEsperaEnvioPaquetes = 0
  let tiempoEsperaRyD = 0
  let tiempoEsperaSyS = 0
  let tiempoEsperaEmpresarialAltaPrioridad = 0
  let tiempoEsperaEmpresarialBajaPrioridad = 0
  let tiempoEsperaPyES = 0
  let tiempoEsperaNuevoServicio = 0

  // Acumuladores de tiempo de ocupación
  let tiempoOcupadosEnvioPaquetes = 0
  let tiempoOcupadosRyD = 0
  let tiempoOcupadosSyS = 0
  let tiempoOcupadosEmpresarial = 0
  let tiempoOcupadosPyES = 0
  let tiempoOcupadoNuevoServicio = 0

  // Maxima Cantidad de clientes en cola
  let maxColaEnvioPaquetes = 0
  let maxColaRyD = 0
  let maxColaSyS = 0
  let maxColaEmpresarialAltaPrioridad = 0
  let maxColaEmpresarialBajaPrioridad = 0
  let maxColaPyES = 0
  let maxColaNuevoServicio = 0

  // Lista de eventos futuros
  const eventos: Evento[] = []

  // Colas de espera
  const colaEnvioPaquetes: Evento[] = []
  const colaRyD: Evento[] = []
  const colaSyS: Evento[] = []
  const colaEmpresarialAltaPrioridad: Evento[] = []
  const colaEmpresarialBajaPrioridad: Evento[] = []
  const colaPyES: Evento[] = []
  const colaNuevoServicio: Evento[] = []

  let tiempoSimulacion = 0

  let clientesPaquetesAtentidosEnMasDe15 = 0

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
    prioridad: prioridadEnEmpresarial ? random.float() < 0.2 : false,
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
            prioridad: prioridadEnEmpresarial ? random.float() < 0.2 : false,
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
            if (tiempoSimulacion - siguienteEvento.horario > 0.25) {
              clientesPaquetesAtentidosEnMasDe15++
            }
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
            if (colaEnvioPaquetes.length > maxColaEnvioPaquetes) {
              maxColaEnvioPaquetes = colaEnvioPaquetes.length
            }
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
            if (colaRyD.length > maxColaRyD) {
              maxColaRyD = colaRyD.length
            }
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
            if (colaSyS.length > maxColaSyS) {
              maxColaSyS = colaSyS.length
            }
          }
          break
        case "Empresarial":
          if (empleadosEmpresarialLibres > 0) {
            empleadosEmpresarialLibres--
            clientesAtendidosEmpresarialBajaPrioridad++
            eventos.push({
              nombre: "Fin Atencion Empresarial",
              horario: tiempoSimulacion + tiempoAtencionEmpresarial,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            if (siguienteEvento.prioridad!) {
              colaEmpresarialAltaPrioridad.push({
                ...siguienteEvento,
                horario: tiempoSimulacion,
              })
              if (
                colaEmpresarialAltaPrioridad.length >
                maxColaEmpresarialAltaPrioridad
              ) {
                maxColaEmpresarialAltaPrioridad =
                  colaEmpresarialAltaPrioridad.length
              }
            } else {
              colaEmpresarialBajaPrioridad.push({
                ...siguienteEvento,
                horario: tiempoSimulacion,
              })
              if (
                colaEmpresarialBajaPrioridad.length >
                maxColaEmpresarialBajaPrioridad
              ) {
                maxColaEmpresarialBajaPrioridad =
                  colaEmpresarialBajaPrioridad.length
              }
            }
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
            if (colaPyES.length > maxColaPyES) {
              maxColaPyES = colaPyES.length
            }
          }
          break
        case "Nuevo":
          if (empleadosNuevoServicioLibres > 0) {
            empleadosNuevoServicioLibres--
            eventos.push({
              nombre: "Fin Atencion Nuevo",
              horario: tiempoSimulacion + nuevoServicio.tiempoAtencion,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            colaNuevoServicio.push({
              ...siguienteEvento,
              horario: tiempoSimulacion,
            })
            if (colaNuevoServicio.length > maxColaNuevoServicio) {
              maxColaNuevoServicio = colaNuevoServicio.length
            }
          }
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

            if (tiempoSimulacion - clienteEnCola.horario > 0.25) {
              clientesPaquetesAtentidosEnMasDe15++
            }

            eventos.push({
              nombre: "Fin Atencion EnvioPaquetes",
              horario: tiempoSimulacion + tiempoAtencionEnvioPaquetes,
              horarioInicio: tiempoSimulacion,
            })
          }
          if (random.float() > 0.49 && nuevoServicio.habilitado) {
            // Simular un nuevo servicio
            eventos.push({
              nombre: "Llegada Servicio Nuevo",
              horario: tiempoSimulacion,
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

          if (colaEmpresarialAltaPrioridad.length > 0) {
            const clienteEnCola = colaEmpresarialAltaPrioridad.shift()!
            empleadosEmpresarialLibres--
            clientesAtendidosEmpresarialAltaPrioridad++
            tiempoEsperaEmpresarialAltaPrioridad +=
              tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion Empresarial",
              horario: tiempoSimulacion + tiempoAtencionEmpresarial,
              horarioInicio: tiempoSimulacion,
            })
          } else {
            if (colaEmpresarialBajaPrioridad.length > 0) {
              const clienteEnCola = colaEmpresarialBajaPrioridad.shift()!
              empleadosEmpresarialLibres--
              clientesAtendidosEmpresarialBajaPrioridad++
              tiempoEsperaEmpresarialBajaPrioridad +=
                tiempoSimulacion - clienteEnCola.horario
              eventos.push({
                nombre: "Fin Atencion Empresarial",
                horario: tiempoSimulacion + tiempoAtencionEmpresarial,
                horarioInicio: tiempoSimulacion,
              })
            }
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
          if (random.float() > 0.49 && nuevoServicio.habilitado) {
            // Simular un nuevo servicio
            eventos.push({
              nombre: "Llegada Servicio Nuevo",
              horario: tiempoSimulacion,
            })
          }
          break
        case "Nuevo":
          empleadosNuevoServicioLibres++
          tiempoOcupadoNuevoServicio += tiempoAtencionRealizado
          if (colaNuevoServicio.length > 0) {
            const clienteEnCola = colaNuevoServicio.shift()!
            empleadosNuevoServicioLibres--
            clientesAtendidosNuevoServicio++
            tiempoEsperaNuevoServicio +=
              tiempoSimulacion - clienteEnCola.horario
            // No se cuenta como cliente atendido, ya que es un nuevo servicio
            eventos.push({
              nombre: "Fin Atencion Nuevo",
              horario: tiempoSimulacion + nuevoServicio.tiempoAtencion,
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
      if (colaEmpresarialBajaPrioridad.length > 0) {
        const clienteEnCola = colaEmpresarialBajaPrioridad.shift()!
        empleadosEmpresarialLibres--
        clientesAtendidosEmpresarialBajaPrioridad++
        tiempoEsperaEmpresarialBajaPrioridad +=
          tiempoSimulacion - clienteEnCola.horario
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
      empresarialAltaPrioridad:
        clientesAtendidosEmpresarialAltaPrioridad > 0
          ? parseFloat(
              (
                tiempoEsperaEmpresarialAltaPrioridad /
                clientesAtendidosEmpresarialAltaPrioridad
              ).toFixed(4)
            )
          : 0,
      empresarialBajaPrioridad:
        clientesAtendidosEmpresarialBajaPrioridad > 0
          ? parseFloat(
              (
                tiempoEsperaEmpresarialBajaPrioridad /
                clientesAtendidosEmpresarialBajaPrioridad
              ).toFixed(4)
            )
          : 0,
      pyES:
        clientesAtendidosPyES > 0
          ? parseFloat((tiempoEsperaPyES / clientesAtendidosPyES).toFixed(4))
          : 0,
      nuevoServicio: nuevoServicio.habilitado
        ? parseFloat(
            (
              tiempoEsperaNuevoServicio / clientesAtendidosNuevoServicio
            ).toFixed(4)
          )
        : 0,
    },
    promediosOcupacion: {
      envioPaquetes: parseFloat(
        (
          (tiempoOcupadosEnvioPaquetes /
            (tiempoSimulacion * empleadosEnvioPaquetes)) *
          100
        ).toFixed(4)
      ),
      ryD: parseFloat(
        ((tiempoOcupadosRyD / (tiempoSimulacion * empleadosRyD)) * 100).toFixed(
          4
        )
      ),
      syS: parseFloat(
        ((tiempoOcupadosSyS / (tiempoSimulacion * empleadosSyS)) * 100).toFixed(
          4
        )
      ),
      empresarial: parseFloat(
        (
          (tiempoOcupadosEmpresarial /
            (tiempoSimulacion * empleadosEmpresarial)) *
          100
        ).toFixed(4)
      ),
      pyES: parseFloat(
        (
          (tiempoOcupadosPyES / (tiempoSimulacion * empleadosPyES)) *
          100
        ).toFixed(4)
      ),
      nuevoServicio: nuevoServicio.habilitado
        ? parseFloat(
            (
              (tiempoOcupadoNuevoServicio /
                (tiempoSimulacion * nuevoServicio.numeroEmpleados)) *
              100
            ).toFixed(4)
          )
        : 0,
    },
    cantidadMaximaEnCola: {
      envioPaquetes: maxColaEnvioPaquetes,
      ryD: maxColaRyD,
      syS: maxColaSyS,
      empresarialAltaPrioridad: maxColaEmpresarialAltaPrioridad,
      empresarialBajaPrioridad: maxColaEmpresarialBajaPrioridad,
      pyES: maxColaPyES,
      nuevoServicio: maxColaNuevoServicio,
    },
    probabilidadClientesPaquetesAtendidosEnMasDe15:
      parseFloat(((clientesPaquetesAtentidosEnMasDe15 /
      (clientesAtendidosEnvioPaquetes || 1))*100).toFixed(4)),
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
  true,
  { tiempoAtencion: 1 / 5, numeroEmpleados: 3, habilitado: true },
  true
)

console.log("Promedios de espera:", resultados.promediosEspera)
console.log("Promedios de ocupación:", resultados.promediosOcupacion)
console.log("Cantidad máxima en cola:", resultados.cantidadMaximaEnCola)
console.log(
  "Probabilidad de clientes atendidos en más de 15 minutos:",
  resultados.probabilidadClientesPaquetesAtendidosEnMasDe15
)
