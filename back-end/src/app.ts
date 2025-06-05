import { serve } from "bun"
import { uniforme, exponencial, normal, poisson } from "./distribuciones"
import { simulacionCorreo } from "."

const PORT = 8080

// CORS headers helper function
const addCorsHeaders = (response: Response): Response => {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )
  response.headers.set("Access-Control-Max-Age", "86400")
  return response
}

// Helper function to create JSON response with CORS
const corsJsonResponse = (data: any, init?: ResponseInit): Response => {
  const response = Response.json(data, init)
  return addCorsHeaders(response)
}

const server = serve({
  port: PORT,

  // Handle preflight requests
  fetch(request) {
    if (request.method === "OPTIONS") {
      const response = new Response(null, { status: 200 })
      return addCorsHeaders(response)
    }

    // Handle routes
    const url = new URL(request.url)
    const pathname = url.pathname

    // Route handlers
    if (pathname === "/api") {
      return corsJsonResponse({
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
      })
    }

    if (pathname === "/api/uniforme") {
      try {
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
          return corsJsonResponse(
            {
              error:
                "limiteInferior, limiteSuperior y numeroAleatorio deben ser números válidos",
            },
            { status: 400 }
          )
        }

        const result = uniforme(limiteInferior, limiteSuperior, numeroAleatorio)
        return corsJsonResponse({
          result,
          distribution: "uniforme",
          parameters: { limiteInferior, limiteSuperior, numeroAleatorio },
        })
      } catch (error) {
        return corsJsonResponse(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    }

    if (pathname === "/api/exponencial") {
      try {
        const media = parseFloat(url.searchParams.get("media") || "")
        const numeroAleatorio = parseFloat(
          url.searchParams.get("numeroAleatorio") || ""
        )

        if (isNaN(media) || isNaN(numeroAleatorio)) {
          return corsJsonResponse(
            { error: "media y numeroAleatorio deben ser números válidos" },
            { status: 400 }
          )
        }

        const result = exponencial(media, numeroAleatorio)
        return corsJsonResponse({
          result,
          distribution: "exponencial",
          parameters: { media, numeroAleatorio },
        })
      } catch (error) {
        return corsJsonResponse(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    }

    if (pathname === "/api/normal") {
      try {
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
          return corsJsonResponse(
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
        return corsJsonResponse({
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
        return corsJsonResponse(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    }

    if (pathname === "/api/poisson") {
      try {
        const media = parseFloat(url.searchParams.get("media") || "")
        const numeroAleatorio = parseFloat(
          url.searchParams.get("numeroAleatorio") || ""
        )

        if (isNaN(media) || isNaN(numeroAleatorio)) {
          return corsJsonResponse(
            { error: "media y numeroAleatorio deben ser números válidos" },
            { status: 400 }
          )
        }

        const result = poisson(media, numeroAleatorio)
        return corsJsonResponse({
          result,
          distribution: "poisson",
          parameters: { media, numeroAleatorio },
        })
      } catch (error) {
        return corsJsonResponse(
          { error: (error as Error).message },
          { status: 400 }
        )
      }
    }

    if (pathname === "/api/simulacion" && request.method === "POST") {
      return (async () => {
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
            const response = new Response(
              JSON.stringify({
                error: "Parámetros faltantes",
                camposFaltantes: camposFaltantes,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            )
            return addCorsHeaders(response)
          }

          // Ejecutar simulación
          const { resultados, vectorEstados } = simulacionCorreo(
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

          const response = new Response(
            JSON.stringify({
              success: true,
              resultados,
              vectorEstados,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
          return addCorsHeaders(response)
        } catch (error) {
          console.error("Error en simulación:", error)
          const response = new Response(
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
          return addCorsHeaders(response)
        }
      })()
    }

    if (pathname === "/") {
      return corsJsonResponse({
        message: "Servidor de Distribuciones de Probabilidad",
        apiInfo:
          "Visita /api para más información sobre los endpoints disponibles",
      })
    }

    // Fallback for not found routes
    return corsJsonResponse({ message: "Not Found" }, { status: 404 })
  },

  // Fallback para errores
  error(error) {
    console.error(error)
    const response = Response.json(
      { message: `Internal Error: ${error.message}` },
      { status: 500 }
    )
    return addCorsHeaders(response)
  },
})

console.log(`✅ Server is running on port ${PORT}`)
console.log(`📊 Endpoints disponibles:`)
console.log(`   GET  /api - Información de la API`)
console.log(`   GET  /api/uniforme - Distribución uniforme`)
console.log(`   GET  /api/exponencial - Distribución exponencial`)
console.log(`   GET  /api/normal - Distribución normal`)
console.log(`   GET  /api/poisson - Distribución de Poisson`)
console.log(`   POST /api/simulacion - Simulación de correo`)
console.log(`🌐 CORS enabled for all origins`)
