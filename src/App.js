// App.js - Ponto de entrada principal da aplicação React
// Importa o componente principal da homepage
import Homepage from './components/Homepage/Homepage';


/**
 * Componente principal da aplicação.
 * Renderiza a homepage dentro de uma div com a classe 'App'.
 */
function App() {
  return (
    <div className="App">
      {/* Componente principal da homepage */}
      <Homepage />
    </div>
  );
}

// Exporta o componente App como padrão
export default App;