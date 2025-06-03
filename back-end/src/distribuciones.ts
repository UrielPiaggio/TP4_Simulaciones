/**
 * Genera un número aleatorio de una distribución uniforme.
 * Fórmula: X = A + R * (B - A)
 * @param limiteInferior El límite inferior de la distribución (A).
 * @param limiteSuperior El límite superior de la distribución (B).
 * @param numeroAleatorio Un número aleatorio R, se espera que esté en el intervalo [0, 1).
 * @returns Un número aleatorio X de la distribución uniforme [limiteInferior, limiteSuperior).
 */
export function uniforme(
  limiteInferior: number,
  limiteSuperior: number,
  numeroAleatorio: number
): number {
  if (limiteInferior > limiteSuperior) {
    throw new Error(
      "El límite inferior no puede ser mayor que el límite superior para la distribución uniforme."
    )
  }
  if (numeroAleatorio < 0 || numeroAleatorio >= 1) {
    throw new Error(
      "numeroAleatorio debe estar en el intervalo [0, 1). Recibido: " +
        numeroAleatorio
    )
  }
  return limiteInferior + numeroAleatorio * (limiteSuperior - limiteInferior)
}

/**
 * Genera un número aleatorio usando la fórmula especificada por el usuario: media - ln(1 - R).
 * Nota: Si R es un número aleatorio de U[0,1), entonces -ln(1-R) sigue una distribución Exponencial(1) (media 1, tasa 1).
 * Por lo tanto, esta función genera valores de una distribución Y = media + Exp(1).
 * Esta distribución tiene una media de (media + 1) y sus valores son >= media.
 * Esto es distinto del método estándar para generar un número aleatorio de una distribución exponencial
 * con una media M, que típicamente es -M * ln(1-R) o -M * ln(R).
 * @param media El parámetro 'media' como se especifica en la fórmula del usuario.
 * @param numeroAleatorio Un número aleatorio R, se espera que esté en el intervalo [0, 1).
 * @returns Un número aleatorio generado usando la fórmula media - ln(1 - numeroAleatorio).
 *          El resultado es >= media. Si numeroAleatorio es 0, el resultado es media.
 *          Si numeroAleatorio se acerca a 1, el resultado se acerca a Infinito Positivo.
 */
export function exponencial(media: number, numeroAleatorio: number): number {
  if (numeroAleatorio < 0 || numeroAleatorio >= 1) {
    throw new Error(
      "numeroAleatorio debe estar en el intervalo [0, 1). Recibido: " +
        numeroAleatorio
    )
  }

  // Fórmula: media - Math.log(1 - numeroAleatorio)
  // Si numeroAleatorio = 0, (1-numeroAleatorio)=1, Math.log(1)=0. Resultado: media.
  // Si numeroAleatorio -> 1-, (1-numeroAleatorio) -> 0+, Math.log(1-numeroAleatorio) -> -Infinito. Resultado -> +Infinito.
  return -media * Math.log(1 - numeroAleatorio)
}

/**
 * Genera un número aleatorio de una distribución normal usando la transformación Box-Muller.
 * Esta función usa una de las dos variables normales estándar generadas por la transformación.
 * Variable normal estándar: Z0 = sqrt(-2 * ln(R1)) * cos(2 * PI * R2)
 * Variable resultante: X = media + desviacionEstandar * Z0
 * @param media La media (mu) de la distribución normal deseada.
 * @param desviacionEstandar La desviación estándar (sigma) de la distribución normal deseada. Debe ser no negativa.
 * @param numeroAleatorio1 Un número aleatorio R1, debe estar en el intervalo (0, 1] (exclusivo de 0 para log, inclusivo de 1).
 * @param numeroAleatorio2 Un número aleatorio R2, debe estar en el intervalo [0, 1).
 * @returns Un número aleatorio de N(media, desviacionEstandar^2).
 */
export function normal(
  media: number,
  desviacionEstandar: number,
  numeroAleatorio1: number,
  numeroAleatorio2: number
): number {
  if (desviacionEstandar < 0) {
    throw new Error("La desviación estándar debe ser no negativa.")
  }
  if (numeroAleatorio1 <= 0 || numeroAleatorio1 > 1) {
    throw new Error(
      "numeroAleatorio1 debe estar en (0, 1]. Recibido: " + numeroAleatorio1
    )
  }
  if (numeroAleatorio2 < 0 || numeroAleatorio2 >= 1) {
    throw new Error(
      "numeroAleatorio2 debe estar en [0, 1). Recibido: " + numeroAleatorio2
    )
  }

  // Transformación Box-Muller:
  // numeroAleatorio1 corresponde a U1, usado en Math.log. Debe ser > 0.
  // Si numeroAleatorio1 es 1, Math.log(1) es 0, entonces z0 es 0. El resultado es 'media'. Esto es aceptable.
  const z0 =
    Math.sqrt(-2.0 * Math.log(numeroAleatorio1)) *
    Math.cos(2.0 * Math.PI * numeroAleatorio2)

  return media + desviacionEstandar * z0
}

/**
 * Genera un entero aleatorio de una distribución de Poisson usando muestreo de transformación inversa.
 * La función de masa de probabilidad (PMF) es P(X=k) = (lambda^k * exp(-lambda)) / k!.
 * Esta función encuentra k tal que Sum_{i=0 to k-1} P(X=i) <= R < Sum_{i=0 to k} P(X=i).
 * @param media La media (lambda) de la distribución de Poisson. Debe ser no negativa.
 * @param numeroAleatorio Un número aleatorio R, se espera que esté en el intervalo [0, 1).
 * @returns Un entero aleatorio k de Poisson(media).
 */
export function poisson(media: number, numeroAleatorio: number): number {
  if (media < 0) {
    throw new Error(
      "La media (lambda) debe ser no negativa para la distribución de Poisson."
    )
  }
  if (numeroAleatorio < 0 || numeroAleatorio >= 1) {
    throw new Error(
      "numeroAleatorio debe estar en [0, 1). Recibido: " + numeroAleatorio
    )
  }

  if (media === 0) {
    // Poisson(0) siempre produce 0.
    return 0
  }

  let k = 0
  let p_k = Math.exp(-media) // Probabilidad P(X=0)
  let cdf = p_k // Función de distribución acumulativa comenzando con P(X=0)

  // Bucle mientras el número aleatorio sea mayor o igual a la probabilidad acumulativa actual
  while (numeroAleatorio >= cdf) {
    k++
    // Fórmula iterativa para P(X=k) usando P(X=k-1): P(k) = P(k-1) * lambda / k
    p_k = (p_k * media) / k
    cdf += p_k

    // Ruptura de seguridad para escenarios donde cdf podría estancarse debido a la precisión de punto flotante,
    // especialmente si numeroAleatorio está extremadamente cerca de 1.0 o para medias muy grandes.
    // Una variable de Poisson es muy improbable que esté extremadamente lejos de su media.
    // Esta verificación ayuda a prevenir bucles excesivamente largos o infinitos en tales casos extremos.
    // El umbral (ej., k > media + 15*sqrt(media) Y k > algún_número_grande) es heurístico.
    if (cdf === 1.0 || (k > media + 15 * Math.sqrt(media) && k > 100000)) {
      break
    }
  }
  return k
}
