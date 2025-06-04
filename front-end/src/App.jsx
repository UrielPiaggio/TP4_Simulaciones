import { useState } from "react"
import "./App.css"
import { VectorEstado } from "./components/VectorEstado"
import { DefVariables } from "./components/DefVariables"
import { Container } from "react-bootstrap"
import { Resultados } from "./components/Resultados"

function App() {
  const [formData, setFormData] = useState(null)

  const handleDataFromVariables = (data) => {
    setFormData(data)
    console.log("datos en App", data)
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
          <DefVariables onSendData={handleDataFromVariables} />
        </div>{" "}
        {/* Sección del vector de estado */}
        <div className="section-card vector-table-container fade-in-up">
          <h2 className="section-title">📊 Vector de Estado</h2>{" "}
          <VectorEstado
            cantidadFilas={formData?.CantidadFilaAMostrar || 10}
            desdeFilaNumero={formData?.DesdeFilaAMostrar || 1}
            configuracionesEspeciales={{
              AusenciaEmpleadoEmpresarial:
                formData?.AusenciaEmpleadoEmpresarial || false,
              NuevoServicioPostEntrega:
                formData?.NuevoServicioPostEntrega || false,
              ClientesEmpresarialesPrioridad:
                formData?.ClientesEmpresarialesPrioridad || false,
            }}
          />
        </div>
        {/* Sección de resultados */}
        <div className="section-card results-section fade-in-up">
          <h2 className="section-title">📈 Resultados de la Simulación</h2>
          <Resultados />
        </div>
      </Container>
    </>
  )
}

export default App
