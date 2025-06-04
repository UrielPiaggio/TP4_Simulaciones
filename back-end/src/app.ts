import { serve } from "bun"
import { uniforme, exponencial, normal, poisson } from "./distribuciones"
import { simulacionCorreo } from "."

const PORT = 8080

const server = serve({
  port: PORT,
  routes: {
    // Endpoint de información general
    "/api": () =>
      Response.json({
        message: "API de Distribuciones de Probabilidad",
        endpoints: {
          "GET /api/uniforme": {
            description: "Genera un número aleatorio de distribución uniforme",
            parameters: ["limiteInferior", "limiteSuperior", "numeroAleatorio"],
          },
          "GET /api/exponencial": {
            description:
              "Genera un número aleatorio de distribución exponencial",
            parameters: ["media", "numeroAleatorio"],
          },
          "GET /api/normal": {
            description: "Genera un número aleatorio de distribución normal",
            parameters: [
              "media",
              "desviacionEstandar",
              "numeroAleatorio1",
              "numeroAleatorio2",
            ],
          },
          "GET /api/poisson": {
            description:
              "Genera un número aleatorio de distribución de Poisson",
            parameters: ["media", "numeroAleatorio"],
          },
        },
      }),

    // Endpoints para cada distribución
    "/api/uniforme": async (request) => {
      try {
        const url = new URL(request.url)
        const limiteInferior = parseFloat(
          url.searchParams.get("limiteInferior") || ""
        )
        const limiteSuperior = parseFloat(
          url.searchParams.get("limiteSuperior") || ""
        )
        const numeroAleatorio = parseFloat(
          url.searchParams.get("numeroAleatorio") || ""
        )

        if (
          isNaN(limiteInferior) ||
          isNaN(limiteSuperior) ||
          isNaN(numeroAleatorio)
        ) {
          return Response.json(
            {
              error:
                "limiteInferior, limiteSuperior y numeroAleatorio deben ser números válidos",
            },
            { status: 400 }
          )
        }

        const result = uniforme(limiteInferior, limiteSuperior, numeroAleatorio)
        return Response.json({
          result,
          distribution: "uniforme",
          parameters: { limiteInferior, limiteSuperior, numeroAleatorio },
        })
      } catch (error) {
        return Response.json(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    },

    "/api/exponencial": async (request) => {
      try {
        const url = new URL(request.url)
        const media = parseFloat(url.searchParams.get("media") || "")
        const numeroAleatorio = parseFloat(
          url.searchParams.get("numeroAleatorio") || ""
        )

        if (isNaN(media) || isNaN(numeroAleatorio)) {
          return Response.json(
            { error: "media y numeroAleatorio deben ser números válidos" },
            { status: 400 }
          )
        }

        const result = exponencial(media, numeroAleatorio)
        return Response.json({
          result,
          distribution: "exponencial",
          parameters: { media, numeroAleatorio },
        })
      } catch (error) {
        return Response.json(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    },

    "/api/normal": async (request) => {
      try {
        const url = new URL(request.url)
        const media = parseFloat(url.searchParams.get("media") || "")
        const desviacionEstandar = parseFloat(
          url.searchParams.get("desviacionEstandar") || ""
        )
        const numeroAleatorio1 = parseFloat(
          url.searchParams.get("numeroAleatorio1") || ""
        )
        const numeroAleatorio2 = parseFloat(
          url.searchParams.get("numeroAleatorio2") || ""
        )

        if (
          isNaN(media) ||
          isNaN(desviacionEstandar) ||
          isNaN(numeroAleatorio1) ||
          isNaN(numeroAleatorio2)
        ) {
          return Response.json(
            {
              error:
                "media, desviacionEstandar, numeroAleatorio1 y numeroAleatorio2 deben ser números válidos",
            },
            { status: 400 }
          )
        }

        const result = normal(
          media,
          desviacionEstandar,
          numeroAleatorio1,
          numeroAleatorio2
        )
        return Response.json({
          result,
          distribution: "normal",
          parameters: {
            media,
            desviacionEstandar,
            numeroAleatorio1,
            numeroAleatorio2,
          },
        })
      } catch (error) {
        return Response.json(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    },

    "/api/poisson": async (request) => {
      try {
        const url = new URL(request.url)
        const media = parseFloat(url.searchParams.get("media") || "")
        const numeroAleatorio = parseFloat(
          url.searchParams.get("numeroAleatorio") || ""
        )

        if (isNaN(media) || isNaN(numeroAleatorio)) {
          return Response.json(
            { error: "media y numeroAleatorio deben ser números válidos" },
            { status: 400 }
          )
        }

        const result = poisson(media, numeroAleatorio)
        return Response.json({
          result,
          distribution: "poisson",
          parameters: { media, numeroAleatorio },
        })
      } catch (error) {
        return Response.json(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    },

    "/api/simulacion": async (request) => {
      POST: {
        try {
          const body = await request.json()

          // Validación básica de parámetros requeridos
          const camposRequeridos = [
            "numeroIteraciones",
            "iteracionAMostrarPrimero",
            "cantidadDeFilasAMostrar",
            "tiemposAtencion",
            "tiemposLlegada",
            "empleados",
            "ausenciaEmpleadoEmpresarial",
            "nuevoServicio",
            "prioridadEnEmpresarial",
          ]

          const camposFaltantes = camposRequeridos.filter(
            (campo) => !(campo in body)
          )
          if (camposFaltantes.length > 0) {
            return new Response(
              JSON.stringify({
                error: "Parámetros faltantes",
                camposFaltantes: camposFaltantes,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            )
          }

          // Ejecutar simulación
          const resultado = simulacionCorreo(
            body.numeroIteraciones,
            body.iteracionAMostrarPrimero,
            body.cantidadDeFilasAMostrar,
            body.tiemposAtencion,
            body.tiemposLlegada,
            body.empleados,
            body.ausenciaEmpleadoEmpresarial,
            body.nuevoServicio,
            body.prioridadEnEmpresarial
          )

          return new Response(
            JSON.stringify({
              success: true,
              resultados: resultado,
              vectorEstados: resultado.vectorEstados || [],
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        } catch (error) {
          console.error("Error en simulación:", error)
          return new Response(
            JSON.stringify({
              error: "Error interno del servidor",
              mensaje:
                error instanceof Error ? error.message : "Error desconocido",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
        }
      }
    },

    "/": () =>
      Response.json({
        message: "Servidor de Distribuciones de Probabilidad",
        apiInfo:
          "Visita /api para más información sobre los endpoints disponibles",
      }),
  },

  // Fallback para rutas no encontradas
  fetch() {
    return Response.json({ message: "Not Found" }, { status: 404 })
  },

  // Fallback para errores
  error(error) {
    console.error(error)
    return Response.json(
      { message: `Internal Error: ${error.message}` },
      { status: 500 }
    )
  },
})

console.log(`✅ Server is running on port ${PORT}`)
console.log(`📊 Endpoints disponibles:`)
console.log(`   GET  /api - Información de la API`)
console.log(`   GET  /api/uniforme - Distribución uniforme`)
console.log(`   GET  /api/exponencial - Distribución exponencial`)
console.log(`   GET  /api/normal - Distribución normal`)
console.log(`   GET  /api/poisson - Distribución de Poisson`)
