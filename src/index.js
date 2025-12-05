// index.js - Inicialização da aplicação React
// Importa React, ReactDOM, estilos globais, componente principal e utilitário de métricas
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// Cria a raiz da aplicação e renderiza o componente principal dentro do modo estrito
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Para medir a performance da aplicação, pode-se passar uma função para reportWebVitals
// Exemplo: reportWebVitals(console.log)
reportWebVitals();
