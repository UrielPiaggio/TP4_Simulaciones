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
  promedioGenteEnColaEnvioPaquetes?: number
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

export type VectorEstado = {
  numeroIteracion: number
  evento: string
  horario: number
  EnvioPaquetes: {
    LlegadaCliente: {
      RND: number
      tiempo: number
      llegada: number
    }
    FinAtencion: {
      FinAtencion1: number
      FinAtencion2: number
      FinAtencion3: number
    }
    Cola: number
    EstadoServidores: {
      Servidor1: string
      Servidor2: string
      Servidor3: string
    }
    Metricas: {
      esperaPromedio: number
      porcentajeOcupacion: number
    }
  }
  RyD: {
    LlegadaCliente: {
      RND: number
      tiempo: number
      llegada: number
    }
    FinAtencion: {
      FinAtencion1: number
      FinAtencion2: number
    }
    Cola: number
    EstadoServidores: {
      Servidor1: string
      Servidor2: string
    }
    Metricas: {
      esperaPromedio: number
      porcentajeOcupacion: number
    }
  }
  SyS: {
    LlegadaCliente: {
      RND: number
      tiempo: number
      llegada: number
    }
    FinAtencion: {
      FinAtencion1: number
      FinAtencion2: number
      FinAtencion3: number
    }
    Cola: number
    EstadoServidores: {
      Servidor1: string
      Servidor2: string
      Servidor3: string
    }
    Metricas: {
      esperaPromedio: number
      porcentajeOcupacion: number
    }
  }
  Empresarial: {
    LlegadaCliente: {
      RND: number
      tiempo: number
      llegada: number
    }
    FinAtencion: {
      FinAtencion1: number
      FinAtencion2: number
    }
    Cola?: number
    ColaAltaPrioridad?: number
    ColaBajaPrioridad?: number
    EstadoServidores: {
      Servidor1: string
      Servidor2: string
    }
    Metricas: {
      esperaPromedio: number
      porcentajeOcupacion: number
    }
  }
  PyES: {
    LlegadaCliente: {
      RND: number
      tiempo: number
      llegada: number
    }
    FinAtencion: {
      FinAtencion1: number
    }
    Cola: number
    EstadoServidores: {
      Servidor1: string
    }
    Metricas: {
      esperaPromedio: number
      porcentajeOcupacion: number
    }
  }
  ServicioEspecial?: {
    LlegadaCliente: {
      RND: number
      tiempo: number
      llegada: number
    }
    FinAtencion: {
      FinAtencion1: number
    }
    Cola: number
    EstadoServidores: {
      Servidor1: string
    }
    Metricas: {
      esperaPromedio: number
      porcentajeOcupacion: number
    }
  }
}

export type TiempoLlegada = {
  distribucion: Distribuciones
  media: number
}

export function simulacionCorreo(
  numeroIteraciones: number, // Cambio: ahora recibe número de iteraciones
  iteracionAMostrarPrimero: number,
  cantidadDeFilasAMostrar: number,
  tiemposAtencion: {
    tiempoAtencionEnvioPaquetes: number // en horas
    tiempoAtencionRyD: number // en horas
    tiempoVentaSyS: number // en horas
    tiempoAtencionEmpresarial: number // en horas
    tiempoAtencionPyES: number // en horas
  },
  tiemposLlegada: {
    tiempoLlegadaEnvioPaquetes: TiempoLlegada // media en horas
    tiempoLlegadaRyD: TiempoLlegada // media en horas
    tiempoLlegadaSyS: TiempoLlegada // media en horas
    tiempoLlegadaEmpresarial: TiempoLlegada // media en horas
    tiempoLlegadaPyES: TiempoLlegada // media en horas
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
    tiempoAtencion: number // en horas
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
  let iteracionActual = 0 // Contador de iteraciones

  let clientesPaquetesAtentidosEnMasDe15 = 0

  let tiempoUltimaActualizacionColaEnvio = 0
  let areaColaEnvioPaquetes = 0

  // Vector de estados para mostrar iteraciones específicas
  const vectorEstados: VectorEstado[] = []
  const iteracionFinal = iteracionAMostrarPrimero + cantidadDeFilasAMostrar - 1

  // Variables para tracking de RNDs y próximas llegadas
  let ultimoRNDEnvioPaquetes = 0
  let ultimoRNDRyD = 0
  let ultimoRNDSyS = 0
  let ultimoRNDEmpresarial = 0
  let ultimoRNDPyES = 0

  // Variables para tracking de próximas llegadas
  let proximaLlegadaEnvioPaquetes = 0
  let proximaLlegadaRyD = 0
  let proximaLlegadaSyS = 0
  let proximaLlegadaEmpresarial = 0
  let proximaLlegadaPyES = 0
  let proximaLlegadaNuevoServicio = 0

  // Arrays para tracking de fin de atención por servidor
  const finAtencionEnvioPaquetes: number[] = new Array(
    empleadosEnvioPaquetes
  ).fill(0)
  const finAtencionRyD: number[] = new Array(empleadosRyD).fill(0)
  const finAtencionSyS: number[] = new Array(empleadosSyS).fill(0)
  const finAtencionEmpresarial: number[] = new Array(empleadosEmpresarial).fill(
    0
  )
  const finAtencionPyES: number[] = new Array(empleadosPyES).fill(0)
  const finAtencionNuevoServicio: number[] = new Array(
    nuevoServicio.numeroEmpleados
  ).fill(0)

  // Estados de servidores (L = Libre, O = Ocupado)
  const estadoServidoresEnvioPaquetes: string[] = new Array(
    empleadosEnvioPaquetes
  ).fill("L")
  const estadoServidoresRyD: string[] = new Array(empleadosRyD).fill("L")
  const estadoServidoresSyS: string[] = new Array(empleadosSyS).fill("L")
  const estadoServidoresEmpresarial: string[] = new Array(
    empleadosEmpresarial
  ).fill("L")
  const estadoServidoresPyES: string[] = new Array(empleadosPyES).fill("L")
  const estadoServidoresNuevoServicio: string[] = new Array(
    nuevoServicio.numeroEmpleados
  ).fill("L")

  function actualizarAreaColaEnvioPaquetes(tiempoActual: number) {
    const tiempoTranscurrido = tiempoActual - tiempoUltimaActualizacionColaEnvio
    areaColaEnvioPaquetes += colaEnvioPaquetes.length * tiempoTranscurrido
    tiempoUltimaActualizacionColaEnvio = tiempoActual
  }

  function crearVectorEstado(
    iteracion: number,
    evento: string,
    horario: number
  ): VectorEstado {
    // Función para crear objeto dinámico de fin de atención
    const crearFinAtencion = (array: number[]) => {
      const obj: any = {}
      array.forEach((valor, index) => {
        obj[`FinAtencion${index + 1}`] = valor
      })
      return obj
    }

    // Función para crear objeto dinámico de estado de servidores
    const crearEstadoServidores = (array: string[]) => {
      const obj: any = {}
      array.forEach((estado, index) => {
        obj[`Servidor${index + 1}`] = estado
      })
      return obj
    }

    const vectorEstado: VectorEstado = {
      numeroIteracion: iteracion,
      evento: evento,
      horario: parseFloat(horario.toFixed(4)),
      EnvioPaquetes: {
        LlegadaCliente: {
          RND: ultimoRNDEnvioPaquetes,
          tiempo: 0, // Se actualizará según el evento
          llegada: 0, // Se actualizará según el evento
        },
        FinAtencion: crearFinAtencion(finAtencionEnvioPaquetes),
        Cola: colaEnvioPaquetes.length,
        EstadoServidores: crearEstadoServidores(estadoServidoresEnvioPaquetes),
        Metricas: {
          esperaPromedio:
            clientesAtendidosEnvioPaquetes > 0
              ? parseFloat(
                  (
                    tiempoEsperaEnvioPaquetes / clientesAtendidosEnvioPaquetes
                  ).toFixed(4)
                )
              : 0,
          porcentajeOcupacion: parseFloat(
            (
              (tiempoOcupadosEnvioPaquetes /
                (tiempoSimulacion * empleadosEnvioPaquetes)) *
              100
            ).toFixed(4)
          ),
        },
      },
      RyD: {
        LlegadaCliente: {
          RND: ultimoRNDRyD,
          tiempo: 0,
          llegada: 0,
        },
        FinAtencion: crearFinAtencion(finAtencionRyD),
        Cola: colaRyD.length,
        EstadoServidores: crearEstadoServidores(estadoServidoresRyD),
        Metricas: {
          esperaPromedio:
            clientesAtendidosRyD > 0
              ? parseFloat((tiempoEsperaRyD / clientesAtendidosRyD).toFixed(4))
              : 0,
          porcentajeOcupacion: parseFloat(
            (
              (tiempoOcupadosRyD / (tiempoSimulacion * empleadosRyD)) *
              100
            ).toFixed(4)
          ),
        },
      },
      SyS: {
        LlegadaCliente: {
          RND: ultimoRNDSyS,
          tiempo: 0,
          llegada: 0,
        },
        FinAtencion: crearFinAtencion(finAtencionSyS),
        Cola: colaSyS.length,
        EstadoServidores: crearEstadoServidores(estadoServidoresSyS),
        Metricas: {
          esperaPromedio:
            clientesAtendidosSyS > 0
              ? parseFloat((tiempoEsperaSyS / clientesAtendidosSyS).toFixed(4))
              : 0,
          porcentajeOcupacion: parseFloat(
            (
              (tiempoOcupadosSyS / (tiempoSimulacion * empleadosSyS)) *
              100
            ).toFixed(4)
          ),
        },
      },
      Empresarial: {
        LlegadaCliente: {
          RND: ultimoRNDEmpresarial,
          tiempo: 0,
          llegada: 0,
        },
        FinAtencion: crearFinAtencion(finAtencionEmpresarial),
        // Si hay prioridad empresarial, mostrar colas separadas
        ...(prioridadEnEmpresarial
          ? {
              ColaAltaPrioridad: colaEmpresarialAltaPrioridad.length,
              ColaBajaPrioridad: colaEmpresarialBajaPrioridad.length,
            }
          : {
              Cola: colaEmpresarialBajaPrioridad.length,
            }),
        EstadoServidores: crearEstadoServidores(estadoServidoresEmpresarial),
        Metricas: {
          esperaPromedio:
            clientesAtendidosEmpresarialAltaPrioridad +
              clientesAtendidosEmpresarialBajaPrioridad >
            0
              ? parseFloat(
                  (
                    (tiempoEsperaEmpresarialAltaPrioridad +
                      tiempoEsperaEmpresarialBajaPrioridad) /
                    (clientesAtendidosEmpresarialAltaPrioridad +
                      clientesAtendidosEmpresarialBajaPrioridad)
                  ).toFixed(4)
                )
              : 0,
          porcentajeOcupacion: parseFloat(
            (
              (tiempoOcupadosEmpresarial /
                (tiempoSimulacion * empleadosEmpresarial)) *
              100
            ).toFixed(4)
          ),
        },
      },
      PyES: {
        LlegadaCliente: {
          RND: ultimoRNDPyES,
          tiempo: 0,
          llegada: 0,
        },
        FinAtencion: crearFinAtencion(finAtencionPyES),
        Cola: colaPyES.length,
        EstadoServidores: crearEstadoServidores(estadoServidoresPyES),
        Metricas: {
          esperaPromedio:
            clientesAtendidosPyES > 0
              ? parseFloat(
                  (tiempoEsperaPyES / clientesAtendidosPyES).toFixed(4)
                )
              : 0,
          porcentajeOcupacion: parseFloat(
            (
              (tiempoOcupadosPyES / (tiempoSimulacion * empleadosPyES)) *
              100
            ).toFixed(4)
          ),
        },
      },
    }

    // Agregar servicio especial si está habilitado
    if (nuevoServicio.habilitado) {
      vectorEstado.ServicioEspecial = {
        LlegadaCliente: {
          RND: 0, // Se actualizará según corresponda
          tiempo: 0,
          llegada: 0,
        },
        FinAtencion: crearFinAtencion(finAtencionNuevoServicio),
        Cola: colaNuevoServicio.length,
        EstadoServidores: crearEstadoServidores(estadoServidoresNuevoServicio),
        Metricas: {
          esperaPromedio:
            clientesAtendidosNuevoServicio > 0
              ? parseFloat(
                  (
                    tiempoEsperaNuevoServicio / clientesAtendidosNuevoServicio
                  ).toFixed(4)
                )
              : 0,
          porcentajeOcupacion: parseFloat(
            (
              (tiempoOcupadoNuevoServicio /
                (tiempoSimulacion * nuevoServicio.numeroEmpleados)) *
              100
            ).toFixed(4)
          ),
        },
      }
    }

    return vectorEstado
  }

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
      horario: 1, // Primera ausencia a la hora 1
    })
  }

  // Cambio principal: usar número de iteraciones en lugar de tiempo máximo
  while (iteracionActual < numeroIteraciones && eventos.length > 0) {
    // Encontrar el próximo evento
    eventos.sort((a, b) => a.horario - b.horario)
    const siguienteEvento = eventos.shift()!

    tiempoSimulacion = siguienteEvento.horario
    iteracionActual++ // Incrementar contador de iteraciones

    const [accion, , servicio] = siguienteEvento.nombre.split(" ")

    if (accion === "Llegada") {
      // Programar próxima llegada del mismo tipo
      let proximaLlegada: number
      switch (servicio) {
        case "EnvioPaquetes":
          ultimoRNDEnvioPaquetes = random.float()
          proximaLlegada = exponencial(
            tiempoLlegadaEnvioPaquetes.media,
            ultimoRNDEnvioPaquetes
          )
          proximaLlegadaEnvioPaquetes = proximaLlegada
          eventos.push({
            nombre: "Llegada Cliente EnvioPaquetes",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "RyD":
          ultimoRNDRyD = random.float()
          proximaLlegada = exponencial(tiempoLlegadaRyD.media, ultimoRNDRyD)
          proximaLlegadaRyD = proximaLlegada
          eventos.push({
            nombre: "Llegada Cliente RyD",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "SyS":
          ultimoRNDSyS = random.float()
          proximaLlegada = exponencial(tiempoLlegadaSyS.media, ultimoRNDSyS)
          proximaLlegadaSyS = proximaLlegada
          eventos.push({
            nombre: "Llegada Cliente SyS",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
        case "Empresarial":
          ultimoRNDEmpresarial = random.float()
          proximaLlegada = exponencial(
            tiempoLlegadaEmpresarial.media,
            ultimoRNDEmpresarial
          )
          proximaLlegadaEmpresarial = proximaLlegada
          eventos.push({
            nombre: "Llegada Cliente Empresarial",
            horario: tiempoSimulacion + proximaLlegada,
            prioridad: prioridadEnEmpresarial ? random.float() < 0.2 : false,
          })
          break
        case "PyES":
          ultimoRNDPyES = random.float()
          proximaLlegada = exponencial(tiempoLlegadaPyES.media, ultimoRNDPyES)
          proximaLlegadaPyES = proximaLlegada
          eventos.push({
            nombre: "Llegada Cliente PyES",
            horario: tiempoSimulacion + proximaLlegada,
          })
          break
      }

      // Procesar llegada del cliente
      switch (servicio) {
        case "EnvioPaquetes":
          actualizarAreaColaEnvioPaquetes(tiempoSimulacion)
          if (empleadosEnvioPaquetesLibres > 0) {
            empleadosEnvioPaquetesLibres--
            clientesAtendidosEnvioPaquetes++

            const servidorIndex = estadoServidoresEnvioPaquetes.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresEnvioPaquetes[servidorIndex] = "O"
              finAtencionEnvioPaquetes[servidorIndex] =
                tiempoSimulacion + tiempoAtencionEnvioPaquetes
            }

            // Cambio: 0.25 horas = 15 minutos
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
        // ... resto de casos sin cambios ...
        case "RyD":
          if (empleadosRyDLibres > 0) {
            empleadosRyDLibres--
            clientesAtendidosRyD++

            const servidorIndex = estadoServidoresRyD.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresRyD[servidorIndex] = "O"
              finAtencionRyD[servidorIndex] =
                tiempoSimulacion + tiempoAtencionRyD
            }

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

            const servidorIndex = estadoServidoresSyS.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresSyS[servidorIndex] = "O"
              finAtencionSyS[servidorIndex] = tiempoSimulacion + tiempoVentaSyS
            }

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
            if (siguienteEvento.prioridad!) {
              clientesAtendidosEmpresarialAltaPrioridad++
            } else {
              clientesAtendidosEmpresarialBajaPrioridad++
            }

            const servidorIndex = estadoServidoresEmpresarial.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresEmpresarial[servidorIndex] = "O"
              finAtencionEmpresarial[servidorIndex] =
                tiempoSimulacion + tiempoAtencionEmpresarial
            }

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

            const servidorIndex = estadoServidoresPyES.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresPyES[servidorIndex] = "O"
              finAtencionPyES[servidorIndex] =
                tiempoSimulacion + tiempoAtencionPyES
            }

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

            clientesAtendidosNuevoServicio++

            const servidorIndex = estadoServidoresNuevoServicio.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresNuevoServicio[servidorIndex] = "O"
              finAtencionNuevoServicio[servidorIndex] =
                tiempoSimulacion + nuevoServicio.tiempoAtencion
            }

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

          const servidorLiberadoEnvio = finAtencionEnvioPaquetes.findIndex(
            (tiempo) => Math.abs(tiempo - tiempoSimulacion) < 0.0001
          )
          if (servidorLiberadoEnvio !== -1) {
            estadoServidoresEnvioPaquetes[servidorLiberadoEnvio] = "L"
            finAtencionEnvioPaquetes[servidorLiberadoEnvio] = 0
          }

          if (colaEnvioPaquetes.length > 0) {
            actualizarAreaColaEnvioPaquetes(tiempoSimulacion)
            const clienteEnCola = colaEnvioPaquetes.shift()!
            empleadosEnvioPaquetesLibres--
            clientesAtendidosEnvioPaquetes++
            const nuevoServidorIndex = estadoServidoresEnvioPaquetes.findIndex(
              (estado) => estado === "L"
            )
            if (nuevoServidorIndex !== -1) {
              estadoServidoresEnvioPaquetes[nuevoServidorIndex] = "O"
              finAtencionEnvioPaquetes[nuevoServidorIndex] =
                tiempoSimulacion + tiempoAtencionEnvioPaquetes
            }
            tiempoEsperaEnvioPaquetes +=
              tiempoSimulacion - clienteEnCola.horario

            // Cambio: 0.25 horas = 15 minutos
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
            eventos.push({
              nombre: "Llegada Servicio Nuevo",
              horario: tiempoSimulacion,
            })
          }
          break
        // ... resto de casos sin cambios significativos ...
        case "RyD":
          empleadosRyDLibres++
          tiempoOcupadosRyD += tiempoAtencionRealizado

          const servidorLiberadoRyD = finAtencionRyD.findIndex(
            (tiempo) => Math.abs(tiempo - tiempoSimulacion) < 0.0001
          )
          if (servidorLiberadoRyD !== -1) {
            estadoServidoresRyD[servidorLiberadoRyD] = "L"
            finAtencionRyD[servidorLiberadoRyD] = 0
          }

          if (colaRyD.length > 0) {
            const clienteEnCola = colaRyD.shift()!
            empleadosRyDLibres--
            clientesAtendidosRyD++
            const nuevoServidorIndex = estadoServidoresRyD.findIndex(
              (estado) => estado === "L"
            )
            if (nuevoServidorIndex !== -1) {
              estadoServidoresRyD[nuevoServidorIndex] = "O"
              finAtencionRyD[nuevoServidorIndex] =
                tiempoSimulacion + tiempoAtencionRyD
            }
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
          const servidorLiberadoSyS = finAtencionSyS.findIndex(
            (tiempo) => Math.abs(tiempo - tiempoSimulacion) < 0.0001
          )
          if (servidorLiberadoSyS !== -1) {
            estadoServidoresSyS[servidorLiberadoSyS] = "L"
            finAtencionSyS[servidorLiberadoSyS] = 0
          }

          if (colaSyS.length > 0) {
            const clienteEnCola = colaSyS.shift()!
            empleadosSySLibres--
            clientesAtendidosSyS++
            const nuevoServidorIndex = estadoServidoresSyS.findIndex(
              (estado) => estado === "L"
            )
            if (nuevoServidorIndex !== -1) {
              estadoServidoresSyS[nuevoServidorIndex] = "O"
              finAtencionSyS[nuevoServidorIndex] =
                tiempoSimulacion + tiempoVentaSyS
            }
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

          const servidorLiberadoEmpresarial = finAtencionEmpresarial.findIndex(
            (tiempo) => Math.abs(tiempo - tiempoSimulacion) < 0.0001
          )
          if (servidorLiberadoEmpresarial !== -1) {
            estadoServidoresEmpresarial[servidorLiberadoEmpresarial] = "L"
            finAtencionEmpresarial[servidorLiberadoEmpresarial] = 0
          }

          if (colaEmpresarialAltaPrioridad.length > 0) {
            const clienteEnCola = colaEmpresarialAltaPrioridad.shift()!
            empleadosEmpresarialLibres--
            clientesAtendidosEmpresarialAltaPrioridad++

            const servidorIndex = estadoServidoresEmpresarial.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresEmpresarial[servidorIndex] = "O"
              finAtencionEmpresarial[servidorIndex] =
                tiempoSimulacion + tiempoAtencionEmpresarial
            }
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

              const servidorIndex = estadoServidoresEmpresarial.findIndex(
                (estado) => estado === "L"
              )
              if (servidorIndex !== -1) {
                estadoServidoresEmpresarial[servidorIndex] = "O"
                finAtencionEmpresarial[servidorIndex] =
                  tiempoSimulacion + tiempoAtencionEmpresarial
              }

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
          const servidorLiberadoPyES = finAtencionPyES.findIndex(
            (tiempo) => Math.abs(tiempo - tiempoSimulacion) < 0.0001
          )
          if (servidorLiberadoPyES !== -1) {
            estadoServidoresPyES[servidorLiberadoPyES] = "L"
            finAtencionPyES[servidorLiberadoPyES] = 0
          }

          if (colaPyES.length > 0) {
            const clienteEnCola = colaPyES.shift()!
            empleadosPyESLibres--
            clientesAtendidosPyES++

            const servidorIndex = estadoServidoresPyES.findIndex(
              (estado) => estado === "L"
            )
            if (servidorIndex !== -1) {
              estadoServidoresPyES[servidorIndex] = "O"
              finAtencionPyES[servidorIndex] =
                tiempoSimulacion + tiempoAtencionPyES
            }

            tiempoEsperaPyES += tiempoSimulacion - clienteEnCola.horario
            eventos.push({
              nombre: "Fin Atencion PyES",
              horario: tiempoSimulacion + tiempoAtencionPyES,
              horarioInicio: tiempoSimulacion,
            })
          }
          if (random.float() > 0.49 && nuevoServicio.habilitado) {
            eventos.push({
              nombre: "Llegada Servicio Nuevo",
              horario: tiempoSimulacion,
            })
          }
          break
        case "Nuevo":
          empleadosNuevoServicioLibres++
          tiempoOcupadoNuevoServicio += tiempoAtencionRealizado
          const servidorLiberadoNuevo = finAtencionNuevoServicio.findIndex(
            (tiempo) => Math.abs(tiempo - tiempoSimulacion) < 0.0001
          )
          if (servidorLiberadoNuevo !== -1) {
            estadoServidoresNuevoServicio[servidorLiberadoNuevo] = "L"
            finAtencionNuevoServicio[servidorLiberadoNuevo] = 0
          }
          if (colaNuevoServicio.length > 0) {
            const clienteEnCola = colaNuevoServicio.shift()!
            empleadosNuevoServicioLibres--
            clientesAtendidosNuevoServicio++
            const nuevoServidorIndex = estadoServidoresNuevoServicio.findIndex(
              (estado) => estado === "L"
            )
            if (nuevoServidorIndex !== -1) {
              estadoServidoresNuevoServicio[nuevoServidorIndex] = "O"
              finAtencionNuevoServicio[nuevoServidorIndex] =
                tiempoSimulacion + nuevoServicio.tiempoAtencion
            }
            tiempoEsperaNuevoServicio +=
              tiempoSimulacion - clienteEnCola.horario
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
          horario: tiempoSimulacion + 0.2, // 0.2 horas = 12 minutos
        })
      }
      eventos.push({
        nombre: "Ausencia Empleado Empresarial",
        horario: tiempoSimulacion + 1, // Cada 1 hora
      })
    } else if (accion === "Retorno") {
      empleadosEmpresarialLibres++
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
      } else if (colaEmpresarialBajaPrioridad.length > 0) {
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
    // Al final del bucle while, ANTES del cierre del while:
    // Capturar vector de estado si está en el rango
    if (
      (iteracionActual >= iteracionAMostrarPrimero &&
        iteracionActual <= iteracionFinal) ||
      iteracionActual <= 5 ||
      iteracionActual === numeroIteraciones
    ) {
      const vectorEstado = crearVectorEstado(
        iteracionActual,
        siguienteEvento.nombre,
        tiempoSimulacion
      )

      // Actualizar datos específicos del evento actual
      const [accion, , servicio] = siguienteEvento.nombre.split(" ")

      // Actualizar datos de llegada para TODOS los servicios (no solo el del evento actual)
      vectorEstado.EnvioPaquetes.LlegadaCliente.tiempo =
        proximaLlegadaEnvioPaquetes
      vectorEstado.EnvioPaquetes.LlegadaCliente.llegada =
        eventos.find((e) => e.nombre === "Llegada Cliente EnvioPaquetes")
          ?.horario || 0

      vectorEstado.RyD.LlegadaCliente.tiempo = proximaLlegadaRyD
      vectorEstado.RyD.LlegadaCliente.llegada =
        eventos.find((e) => e.nombre === "Llegada Cliente RyD")?.horario || 0

      vectorEstado.SyS.LlegadaCliente.tiempo = proximaLlegadaSyS
      vectorEstado.SyS.LlegadaCliente.llegada =
        eventos.find((e) => e.nombre === "Llegada Cliente SyS")?.horario || 0

      vectorEstado.Empresarial.LlegadaCliente.tiempo = proximaLlegadaEmpresarial
      vectorEstado.Empresarial.LlegadaCliente.llegada =
        eventos.find((e) => e.nombre === "Llegada Cliente Empresarial")
          ?.horario || 0

      vectorEstado.PyES.LlegadaCliente.tiempo = proximaLlegadaPyES
      vectorEstado.PyES.LlegadaCliente.llegada =
        eventos.find((e) => e.nombre === "Llegada Cliente PyES")?.horario || 0

      // Para el nuevo servicio si está habilitado
      if (nuevoServicio.habilitado && vectorEstado.ServicioEspecial) {
        vectorEstado.ServicioEspecial.LlegadaCliente.tiempo =
          proximaLlegadaNuevoServicio
        vectorEstado.ServicioEspecial.LlegadaCliente.llegada =
          eventos.find((e) => e.nombre === "Llegada Servicio Nuevo")?.horario ||
          0
      }

      vectorEstados.push(vectorEstado)
    }
  } // Cierre del while
  actualizarAreaColaEnvioPaquetes(tiempoSimulacion)

  // Calcular resultados (sin cambios en la lógica de cálculo)
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
      nuevoServicio:
        nuevoServicio.habilitado && clientesAtendidosNuevoServicio > 0
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
    probabilidadClientesPaquetesAtendidosEnMasDe15: parseFloat(
      (
        (clientesPaquetesAtentidosEnMasDe15 /
          (clientesAtendidosEnvioPaquetes || 1)) *
        100
      ).toFixed(4)
    ),
    promedioGenteEnColaEnvioPaquetes: parseFloat(
      (areaColaEnvioPaquetes / tiempoSimulacion).toFixed(4)
    ),
  }

  return { resultados, vectorEstados }
}

// Ejemplo de uso
const simulacion = simulacionCorreo(
  100000, // Número de iteraciones
  100, // Iteración a mostrar primero
  2, // Cantidad de iteraciones a mostrar
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

const resultados = simulacion.resultados
const vectorEstados = simulacion.vectorEstados

console.log("Promedios de espera:", resultados.promediosEspera)
console.log("Promedios de ocupación:", resultados.promediosOcupacion)
console.log("Cantidad máxima en cola:", resultados.cantidadMaximaEnCola)
console.log(
  "Probabilidad de clientes atendidos en más de 15 minutos:",
  resultados.probabilidadClientesPaquetesAtendidosEnMasDe15
)
console.log(
  "Promedio de gente en cola Envio Paquetes:",
  resultados.promedioGenteEnColaEnvioPaquetes
)

vectorEstados.forEach((estado, index) => {
  console.log(estado.numeroIteracion)
})
