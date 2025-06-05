import { useState } from "react"
import "./App.css"
import { DefVariables } from "./components/DefVariables"
import { Container } from "react-bootstrap"
import { Resultados } from "./components/Resultados"
import VecEstado from "./components/VecEstado"

function App() {
  const [formData, setFormData] = useState(null)
  const [simulationResults, setSimulationResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDataFromVariables = (data) => {
    setFormData(data)
    console.log("datos en App", data)
  }

  const handleSimulationResults = (results) => {
    setSimulationResults(results)
    setIsLoading(false)
    setError(null)
    console.log("resultados de simulación en App", results)
  }

  const handleSimulationError = (error) => {
    setError(error)
    setIsLoading(false)
    console.error("error en simulación", error)
  }

  const handleSimulationStart = () => {
    setIsLoading(true)
    setError(null)
  }

  return (
    <>
      <Container fluid className="px-3">
        {/* Header principal con diseño mejorado */}
        <div className="main-header fade-in-up">
          <h1>🏢 Empresa de Correos</h1>
          <p className="subtitle">Sistema de Simulación de Colas y Servicios</p>
        </div>
        {/* Sección de definición de variables */}
        <div className="section-card form-section fade-in-up">
          <h2 className="section-title">📋 Configuración de Servicios</h2>
          <DefVariables 
            onSendData={handleDataFromVariables}
            onSimulationResults={handleSimulationResults}
            onSimulationError={handleSimulationError}
            onSimulationStart={handleSimulationStart}
          />
        </div>{" "}
        {/* Sección del vector de estado */}
        <div className="section-card vector-table-container fade-in-up">
          <h2 className="section-title">📊 Vector de Estado</h2> 
          <VecEstado 
            simulationData={formData} 
            vectorEstados={simulationResults?.vectorEstados}
            isLoading={isLoading}
            error={error}
          />
        </div>
        {/* Sección de resultados */}
        <div className="section-card results-section fade-in-up">
          <h2 className="section-title">📈 Resultados de la Simulación</h2>
          <Resultados 
            simulationData={formData} 
            resultados={simulationResults?.resultados}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </Container>
    </>
  )
}

export default App
